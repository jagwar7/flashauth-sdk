import { UserProfile } from "../Interfaces/ProviderIN";
import axios, {AxiosResponse} from "axios";





//---------------------------------------------------------------------------------------------------------------------------------------------
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
    console.log(data.url);
    return data.url;
  } catch (err) {
    throw err;
  }
}
//---------------------------------------------------------------------------------------------------------------------------------------------







//  FETCH USER'S PROFILE----------------------------------------------------------------------------------------------------------------------
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
//---------------------------------------------------------------------------------------------------------------------------------------------






// SIGN UP WITH JWT API------------------------------------------------------------------------------------------------------------------------
export async function SignupWithJWT(serverURL: string, clientId: string, name: string, email: string, password: string): Promise<string>{
  if(!serverURL || !clientId || !name || !email || !password){
    throw new Error("All the fields are required");
  }

  try {
    const payload = {
      name, email, password
    }
    const res: AxiosResponse<string> = await axios.post(`${serverURL}/api/flashauth/local`, payload, {
      headers: {
        'Content-Type' : 'application/json',
        'X-Client-Id' : clientId
      }
    });

    return res.data;
  } catch (error) {
    throw new Error("There is an error with sign up");
  }
}
//--------------------------------------------------------------------------------------------------------------------------------------------
