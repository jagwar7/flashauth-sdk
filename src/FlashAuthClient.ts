import { GetGoogleLoginURL, FetchUserProfile } from "./utils/API";
import {} from "../src/utils/Storage"


class FlashAuthClient {
  private clientId: string = "62670"; // Matches usercredentials clientPublicKey
  private serverURL: string = "http://localhost:5900";

  constructor(clientId?: string) {
    if (clientId) {
      this.clientId = clientId;
      console.log(`FlashAuthClient: Overriding clientId to ${this.clientId}`);
    } else {
      console.log(`FlashAuthClient: Using default clientId ${this.clientId}`);
    }
    if (!this.clientId) {
      throw new Error("FlashAuth: clientId is required");
    }
    console.log(`FlashAuthClient initialized with clientId: ${this.clientId}`);
  }

  #openPopup(url: string, name = "FlashAuth", width = 500, height = 600) {
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    return window.open(url, name, `width=${width},height=${height},left=${left},top=${top}`);
  }

  async SignInWithProvider(provider: string = "google"): Promise<any> {
    try {
      console.log(`FlashAuthClient: Signing in with provider ${provider}, clientId: ${this.clientId}`);
      let url;
      switch (provider.toLowerCase()) {
        case "google":
          url = await GetGoogleLoginURL(this.serverURL, this.clientId);
          break;
        case "github":
          throw new Error("GitHub login not implemented yet");
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      const popup = this.#openPopup(url);
      if (!popup) throw new Error("FlashAuth: Popup blocked by browser");

      return await new Promise((resolve, reject) => {
        const popupEventResponse = (event: MessageEvent) => {
          if (event.origin !== this.serverURL.replace(/\/$/, "")) return;

          const data = event.data;
          if (data.type === "FLASHAUTH_TOKEN" && data.token) {

            window.removeEventListener("message", popupEventResponse);
            popup.close();
            resolve(data.token);
          } else if (data.type === "FLASHAUTH_ERROR") {
            window.removeEventListener("message", popupEventResponse);
            popup.close();
            reject(new Error(data.error || "Authentication Failed"));
          }
        };

        window.addEventListener("message", popupEventResponse);

        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            window.removeEventListener("message", popupEventResponse);
            reject(new Error("FlashAuth: Popup closed by user"));
          }
        }, 500);
      });
    } catch (err) {
      console.error("FlashAuth Login Error:", err);
      throw err;
    }
  }

  async LoginWithGoogle() {
    return this.SignInWithProvider("google");
  }

  async LoginWithGithub() {
    return this.SignInWithProvider("github");
  }

  async SignUpWithJWT(name: string, email: string, password: string) {
    throw new Error("SignUpWithJWT not implemented yet");
  }

  async LoginWithJWT(email: string, password: string) {
    throw new Error("LoginWithJWT not implemented yet");
  }

  async GetProfile(token: string) {
    throw new Error("GetProfile not implemented yet");
  }

  Logout() {
    // Storage.Remove("flashauth_token");
  }
}

export default FlashAuthClient;