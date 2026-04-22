



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
    console.log(data.data.url);
    return data.data.url;
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
      name, email, password, authType: 'local'
    }
    const url = `${serverURL}/api/flashauth/local/signup`;
    const res = await fetch(url, {
      method: 'POST',
      headers : {
        'Content-Type' : 'application/json',
        'X-Client-Id'  : clientId
      },
      body : JSON.stringify(payload)
    });

    const data = await res.json();
    return data;
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
      const url = `${serverURL}/api/flashauth/fetch/profile`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
          'X-Client-Id'  : clientId,
          'Authorization': `Bearer:${token}`
        }
      });
      const data = await res.json();
      return data.data;
    } catch (error) {
        throw new Error("There is an error with Fetching user profile");
    }
}
//--------------------------------------------------------------------------------------------------------------------------------------------