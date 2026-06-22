import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


export async function getCurrentUserId(): Promise<string | null> {

  try {


    const cookieStore =
      await cookies();



    const token =
      cookieStore.get(
        "propvista-access-token"
      )?.value;



    if (!token) {

      return null;

    }




    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as {
        sub?: string;
        userId?: string;
        id?: string;
      };





    const userId =
      decoded.userId ||
      decoded.sub ||
      decoded.id;





    if (!userId) {


      console.log(
        "JWT payload missing user id",
        decoded
      );


      return null;

    }



    return userId;



  } catch(error:any) {


    if(error.name === "TokenExpiredError"){

      console.log(
        "JWT expired"
      );

    }
    else{

      console.log(
        "JWT ERROR",
        error
      );

    }



    return null;


  }

}