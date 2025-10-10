
const Storage = {
    Set(token: string) {
        try {
            const providerKey = `flashauth_token`;
            localStorage.setItem(providerKey, token);
        }
        catch (err) {
            console.error("FlashAuth Storage Error:", err);
        }
    },


    Get(): string | null {
        try {
            const providerKey = `flashauth_token`;
            return localStorage.getItem(providerKey);
        }
        catch (err) {
            console.error("FlashAuth Storage Error:", err);
            return null;
        }
    },


    Remove() {
        try {
            const providerKey = `flashauth_token`;
            localStorage.removeItem(providerKey);
        }
        catch (err) {
            console.error("FlashAuth Storage Error:", err);
        }
    }
};
export default Storage;
