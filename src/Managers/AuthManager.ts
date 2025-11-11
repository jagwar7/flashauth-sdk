import { IOAuthPopupManager } from "../Interfaces/IOAuthPopupManager";
import GoogleAuthProvider from "../providers/GoogleAuthProvider";
import OAuthPopupManager from "../providers/OAuthPopupManager";
import { ILocalPopupManager } from "../Interfaces/ILocalPopupManager";
import Storage from "../utils/Storage";
import LocalAuthPopupManager from "../providers/LocalAuthPopupManager";


export default class AuthManager{
    private ClientId: string;
    private ServerURL: string;
    private OAuthPopupManager : IOAuthPopupManager;
    private LocalAuthPopupManager : ILocalPopupManager;

    constructor(clientId: string, serverURL:string){
        try {
            if(!clientId) throw new Error("Missing client public key");
            this.ClientId = clientId;
            this.ServerURL = serverURL;
            this.OAuthPopupManager = new OAuthPopupManager();
            this.LocalAuthPopupManager = new LocalAuthPopupManager();
        } catch (error) {
            console.log("AuthManager intialization error", error);
            throw error;
        }
    }


    async SignInWithGoogle(): Promise<string>{
        try {
            const googleProvider = new GoogleAuthProvider();
            const url = await googleProvider.GetLoginURL(this.ClientId, this.ServerURL);
            
            const popup = this.OAuthPopupManager.openPopupURL(url, "GoogleAuth", 500, 600);
            if(!popup) throw new Error("FlashAuth: Popup blocked by browser");

            const token = await this.OAuthPopupManager.handleAuthResponse(popup, this.ServerURL);
            Storage.Set(token);
            return token;
        } catch (error) {
            console.log("AuthManager: Google login error");
            throw error;
        }
    }


    // openLocalSignupPopup(){
    //     const singupPopupManager = new LocalAuthPopupManager();
    //     const popupWindow = singupPopupManager.openLocalPopupWindow("signupPath", "Local Auth", 500, 600);
    //     if(!popupWindow) throw new Error("FlashAuth: Popup blocked by browser");
    // }
}