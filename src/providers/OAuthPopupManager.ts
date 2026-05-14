import { IOAuthPopupManager , } from "../Interfaces/IOAuthPopupManager";

export default class OAuthPopupManager implements IOAuthPopupManager{
    
    openPopupURL(url: string, name: "Flash Auth", width: 500, height: 600): Window | null {
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top}`;
        return window.open(url, name, windowFeatures);
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
            const data = event.data;

            // CHECK HIT ORIGIN 
            if (event.origin !== serverURL.replace(/\/$/, "")) return;

            if (data.type === "FLASHAUTH_TOKEN" && data.token) {
                cleanup(); 
                resolve(data.token);
            } else if (data.type === "FLASHAUTH_ERROR") {
                cleanup(); 
                reject(new Error(data.error || "Authentication Failed"));
            }
        };

        window.addEventListener("message", popupEventResponse);
        // const startTime = Date.now();
       
        checkPopup = setInterval(() => {
            try{
                // if(Date.now()- startTime < 4000){
                //     console.log("closed under 4 Sec");
                //     return;
                // }
                if (popup.closed) {
                    cleanup();
                    reject(new Error("FlashAuth: Popup closed by user #1"));
                }
            }catch(e){
                console.warn("Popup status temporarily unreachable due to cross-origin redirect.");
            }
        }, 500)
    });

}


    
}
