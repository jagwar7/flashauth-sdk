import { FetchProfile, GetGoogleLoginURL, SingInWithJWT } from "./APIs/API";

import Storage from "./utils/Storage";


class FlashAuthClient {
  private clientId: string = "62670"; 
  private serverURL: string = "http://localhost:5900";

  constructor(clientId: string) {
    this.clientId = clientId;

    if (!this.clientId) {
      throw new Error("FlashAuth: clientId is required");
    }
  }


  // POP INFO-------------------------------------------------------------------------------------
  #openPopup(url: string, name = "FlashAuth", width = 500, height = 600) {
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    return window.open(url, name, `width=${width},height=${height},left=${left},top=${top}`);
  }
  //----------------------------------------------------------------------------------------------


  
  async SignInWithProvider(provider:string): Promise<any> {
    try {
      let url;  
      switch (provider.toLowerCase()) {
        case "google":
          url = await GetGoogleLoginURL(this.serverURL, this.clientId);
          break;
        case "github":
          throw new Error("GitHub login not implemented yet");
        case "local":

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


        // CALL WINDOW EVENT LISTNER
        window.addEventListener("message", popupEventResponse);

        // CHECK IF POPUP CLOSED AFTER 500ms INTERVAL
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

  async FetchUserProfile(token:string, provider:string){
    await FetchProfile(this.serverURL, this.clientId, provider, token);
  }


  async SignUpWithJWT(name: string, email: string, password: string) {
  //  return this.SignInWithProvider("local");
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