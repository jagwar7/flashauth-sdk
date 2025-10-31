import axios, {AxiosResponse} from "axios";

interface UserData{
  success: boolean,
  message: string, 
  data: any;
}



//=============================================================================================================================================
//                                                       GOOGLE AUTH APIs
//=============================================================================================================================================

export async function GetGoogleLoginURL(serverURL: string, clientId: string): Promise<string> {
  if(!clientId || !serverURL){
    throw new Error("Missing client ID or server url");
  }
  try {

    const url = `${serverURL}/api/flashauth/google/url`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json',
        'X-Client-Id' : clientId
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Failed to get provider login URL: ${errorData.error || res.statusText}`);
    }

    const data = await res.json();
    if(data.success == false){
      throw new Error('Failed to get login URL, Contact Admin');
    }
    return data.url;
  } catch (err) {
    throw err;
  }
}

//=============================================================================================================================================
//                                                       GOOGLE AUTH APIs
//=============================================================================================================================================







//=============================================================================================================================================
//                                                       JWT AUTH APIs
//=============================================================================================================================================

export async function SignUpWithJWT(serverURL: string, clientId: string, name: string, email: string, password: string): Promise<string>{
  if(!serverURL || !clientId || !name || !email || !password){
    throw new Error("All the fields are required");
  }

  try {
    const payload = {
      name, email, password
    }
    const res: AxiosResponse<string> = await axios.post(`${serverURL}/api/flashauth/local/signup`, payload, {
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




export async function SingInWithJWT(serverURL: string, clientId: string, email:string, password:string){
  const proivder = 'local';
  if(!serverURL || !clientId ||  !email || !password){
    throw new Error("All the fields are required");
  }

  try {
    const payload = {
      email, password, authType : proivder
    }
    const url = `${serverURL}/api/flashauth/local/signin`;
    const signInResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'X-Client-Id' : clientId,
      },
      body: JSON.stringify(payload)
    });

    const res = signInResponse.json();
    return res;
  } catch (error) {
    throw new Error("There is a problem while signing in");
  }
}
//=============================================================================================================================================
//                                                       JWT AUTH APIs
//=============================================================================================================================================






//  FETCH PROFILE API-------------------------------------------------------------------------------------------------------------------------
export async function FetchProfile(serverURL: string, clientId: string, token: string) {
    if(!serverURL || !clientId || !token){
      throw new Error("All the fields are required");
    }

    try {
      const userResponse: AxiosResponse<UserData> = await axios.get(`${serverURL}/api/flashauth/fetch/profile`, {
        headers: {
          'Content-Type' : 'application/json',
          'X-Client-Id' : clientId,
          Authorization: `Bearer:${token}`
        }
      });

      if(userResponse.data.success == false){
        return userResponse.data.message;
      }

      return userResponse.data;
    } catch (error) {
        throw new Error("There is an error with Fetching user profile");
    }
}
//--------------------------------------------------------------------------------------------------------------------------------------------