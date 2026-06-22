import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";


export async function getCurrentUserId() {

  try {

    const cookieStore = await cookies();

    const token =
      cookieStore.get(
        "propvista-access-token"
      )?.value;


    if(!token){

      console.log("NO TOKEN");

      return null;
    }



    const decoded =
      verifyAccessToken(token);



    if(!decoded){

      console.log("INVALID TOKEN");

      return null;
    }



    console.log(
      "USER ID FROM JWT:",
      decoded.sub
    );


    return decoded.sub;



  } catch(error:any){

    console.log(
      "AUTH ERROR:",
      error.message
    );


    return null;

  }

}