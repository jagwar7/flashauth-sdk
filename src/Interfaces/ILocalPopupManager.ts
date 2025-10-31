

export interface ILocalPopupManager{
    openLocalPopupWindow(url: string, name:string, width:number, height:number) : Window | null;
}