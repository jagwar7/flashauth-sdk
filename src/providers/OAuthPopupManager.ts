import { IOAuthPopupManager , } from "../Interfaces/IOAuthPopupManager";

export default class OAuthPopupManager implements IOAuthPopupManager{
    
    openPopupURL(url: string, name: "Flash Auth", width: 500, height: 600): Window | null {
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        return window.open(url, name, `width=${width},height=${height},left=${left},top=${top}`);
    }

    async handleAuthResponse(popup: Window, serverURL: string): Promise<string> {
         return await new Promise((resolve, reject) => {
            const popupEventResponse = (event: MessageEvent) => {
            if (event.origin !== serverURL.replace(/\/$/, "")) return;

            const data = event.data;
            if (data.type === "FLASHAUTH_TOKEN" && data.token) {
                window.removeEventListener("message", popupEventResponse);
                // popup.close();
                resolve(data.token);
            } else if (data.type === "FLASHAUTH_ERROR") {
                window.removeEventListener("message", popupEventResponse);
                // popup.close();
                reject(new Error(data.error || "Authentication Failed"));
            }
            };


            // CALL WINDOW EVENT LISTNER, 
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
    }
}