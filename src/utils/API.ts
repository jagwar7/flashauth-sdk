import { UserProfile } from "../Interfaces/ProviderIN";

export async function GetGoogleLoginURL(serverURL: string, clientId: string): Promise<string> {
  try {
    const url = `${serverURL}/api/flashauth/google/url?clientId=${encodeURIComponent(clientId)}&provider=google`;
    const res = await fetch(url);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Failed to get provider login URL: ${errorData.error || res.statusText}`);
    }

    const data = await res.json();
    if (!data.url) throw new Error("Invalid response: URL not provided");
    return data.url;
  } catch (err) {
    throw err;
  }
}

export async function FetchUserProfile(serverURL: string, token: string): Promise<UserProfile> {
  try {
    const res = await fetch(`${serverURL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json();
  } catch (err) {
    console.error("FlashAuth API Error:", err);
    throw err;
  }
}