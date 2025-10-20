
// export interface OAuthResponse{
//     token: string,
// }

export interface AuthMessage{
    type: "FLASHAUTH_TOKEN" | "FLASHAUTH_ERROR";
    token?: string;
    error?: string;
}

export interface IOAuthPopupManager{
    openPopupURL(url: string, name:string, width:number, height:number) : Window | null;
    handleAuthResponse(popup:Window, serverURL:string) : Promise<string>;
}