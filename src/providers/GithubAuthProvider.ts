import { IOAuthProvider } from "../Interfaces/IOAuthProvider"

class GithubAuthProvider implements IOAuthProvider{
    async GetLoginURL(CliendId: string, serverURL: string): Promise<string> {
        return ""
    }
}