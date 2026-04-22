
import { FetchProfile } from "./APIs/API.js";
import AuthManager from "./Managers/AuthManager.js";
import Storage from "./utils/Storage.js";
import {jwtDecode} from 'jwt-decode';

class FlashAuthClient{
  private clientId : string;
  private serverURL : string ="https://jagwar-flash-auth-v2.onrender.com";
  private authManager: AuthManager;


  // INITIALIZE FLASH AUTH ------------------------------------------------
  constructor(clientId:string){
    try {
      if(!clientId){
        throw new Error("Flash Auth: Client public key is required");
      }

      this.clientId = clientId;
      this.authManager = new AuthManager(this.clientId, this.serverURL);
      this.serverURL = "https://jagwar-flash-auth-v2.onrender.com";
      this.checkTokenExpiry();
    } catch (error) {
      console.log("Flash Auth: Initialization error", error);
      throw error;
    }
  }
  //----------------------------------------------------------------------





  // SIGN IN WITH GOOGLE------------------------------------------
  async SignInWithGoogle(): Promise<string>{
    try {
      return await this.authManager.SignInWithGoogle();
    } catch (error) {
      console.log("Flash Auth: Google login error ", error);
      throw error;
    }
  }
  // SIGN IN WITH GOOGLE------------------------------------------






  // SIGN IN WITH LOCAL-------------------------------------------
  // OpenSignupPopup(){
  //   this.authManager.openLocalSignupPopup();
  // }
  // SIGN IN WITH LOCAL-------------------------------------------
  



  // FETCH USER PROFILE-----------------------------------------------------------------
  async FetchUserProfile() : Promise<any>{
    try {
      const token = Storage.Get();
      if(!token) return "Authentication token does not exist. Please sign in.";
      const res = await FetchProfile(this.serverURL, this.clientId, token);
      return res;
    } catch (error) {
      throw error;
    }
  }
  //------------------------------------------------------------------------------------



  


  // SIGN OUT AND REFRESH-----------------------------------------
  async SignOut() : Promise<any>{
    try {
      Storage.Remove();
      window.location.reload();
    } catch (error) {
      alert("Auth token doesnt exist");
    }
  }
  // SIGN OUT AND REFRESH----------------------------------------- 





  // FETCH USER PROFILE-------------------------------------------
  FetchUserToken(): any {
    return Storage.Get();
  }




  // CHECK TOKEN EXPIRY-------------------------------------------
  checkTokenExpiry(){
    const token = this.FetchUserToken();
    if(!token) return;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if(decoded.exp && decoded.exp < currentTime){
        Storage.Remove();
      }
    } catch (error) {
      console.error(error);
    }
  }

}


export default FlashAuthClient;