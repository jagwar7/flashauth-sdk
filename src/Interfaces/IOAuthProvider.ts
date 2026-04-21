export interface IOAuthProvider{
    GetLoginURL(CliendId:string, serverURL:string) : Promise<string>;
}