import { GetGoogleLoginURL } from "../APIs/API";
import { IOAuthProvider } from "../Interfaces/IOAuthProvider";


export default class GoogleAuthProvider implements IOAuthProvider{
    async GetLoginURL(CliendId: string, serverURL: string): Promise<string> {
        try {
            return await GetGoogleLoginURL(serverURL, CliendId);
        } catch (error) {
            console.log("failed to get google login url", error);
            throw error;
        }
    }
}



