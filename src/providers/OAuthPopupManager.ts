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
        /*
        // CLEANUP INTERVAL
        const cleanup = () => {
            clearInterval(checkPopup);
            window.removeEventListener("message", popupEventResponse);
        };
        */


        const popupEventResponse = (event: MessageEvent) => {
            console.log("ENTERED EVENT BLOCK: ");
            console.log("Event Origin: ", event.origin);
            console.log("Event Data: ", event.data);


            const data = event.data;

            console.log("DATA TYPE: ",data.type);
            console.log("DATA TOKEN",data.token);

            // CHECK HIT ORIGIN 
            if (event.origin !== serverURL.replace(/\/$/, "")) return;



            if (data.type === "FLASHAUTH_TOKEN" && data.token) {
              //  cleanup(); // Stop the timer immediately!
                resolve(data.token);
            } else if (data.type === "FLASHAUTH_ERROR") {
                //cleanup(); // Stop the timer immediately!
                reject(new Error(data.error || "Authentication Failed"));
            }
        };

        window.addEventListener("message", popupEventResponse);
        const startTime = Date.now();
       
        // checkPopup = setInterval(() => {
        //     try{
        //         if(Date.now()- startTime < 4000){
        //             console.log("closed under 4 Sec");
        //             return;
        //         }
        //         if (popup.closed) {
        //             //cleanup();
        //             reject(new Error("FlashAuth: Popup closed by user #1"));
        //         }
        //     }catch(e){
        //         console.warn("Popup status temporarily unreachable due to cross-origin redirect.");
        //     }
        // }, 500)
    });

}


    
}
