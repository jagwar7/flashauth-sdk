import { IOAuthPopupManager , } from "../Interfaces/IOAuthPopupManager";

export default class OAuthPopupManager implements IOAuthPopupManager{
    
    openPopupURL(url: string, name: "Flash Auth", width: 500, height: 600): Window | null {
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        return window.open(url, name, `width=${width},height=${height},left=${left},top=${top}`);
    }




    async handleAuthResponse(popup: Window, serverURL: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let checkPopup: ReturnType<typeof setInterval>;

        // CLEANUP INTERVAL
        const cleanup = () => {
            clearInterval(checkPopup);
            window.removeEventListener("message", popupEventResponse);
        };


        const popupEventResponse = (event: MessageEvent) => {
            // CHECK HIT ORIGIN 
            if (event.origin !== serverURL.replace(/\/$/, "")) return;

            const data = event.data;
            if(data.type) console.log("DATA TYPE: ",data.type);
            if(data.token) console.log("DATA TOKEN",data.token);

            if (data.type === "FLASHAUTH_TOKEN" && data.token) {
                cleanup(); // Stop the timer immediately!
                resolve(data.token);
            } else if (data.type === "FLASHAUTH_ERROR") {
                cleanup(); // Stop the timer immediately!
                reject(new Error(data.error || "Authentication Failed"));
            }
        };

        window.addEventListener("message", popupEventResponse);

        checkPopup = setInterval(() => {
            if (popup.closed) {
                cleanup();
                reject(new Error("FlashAuth: Popup closed by user"));
            }
        }, 500);
    });
}


    
}
