import { ILocalPopupManager } from "../Interfaces/ILocalPopupManager";



export default class LocalAuthPopupManager implements ILocalPopupManager{
    openLocalPopupWindow(page: string, name: string, width: number, height: number): Window | null {
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        return window.open(page, name, `width=${width},height=${height},left=${left},top=${top}`);
    }
}