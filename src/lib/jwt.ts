import crypto from "crypto";


// ✅ SAME SECRET USED EVERYWHERE
const JWT_SECRET = process.env.JWT_SECRET!;


if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is missing in environment variables"
  );
}


const ACCESS_TOKEN_EXP = 24 * 60 * 60; // 24 hours
const REFRESH_TOKEN_EXP = 7 * 24 * 60 * 60; // 7 days



function base64UrlEncode(input: string | Buffer) {

  return Buffer.from(
    input instanceof Buffer 
      ? input 
      : input.toString()
  )
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");

}



function base64UrlDecode(input: string) {

  const padded =
    input.padEnd(
      input.length + 
      (4 - (input.length % 4)) % 4,
      "="
    );


  return Buffer.from(
    padded
      .replace(/-/g, "+")
      .replace(/_/g, "/"),
    "base64"
  ).toString();

}




function hmacSha256(
  data:string,
  secret:string
){

  return crypto
    .createHmac(
      "sha256",
      secret
    )
    .update(data)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

}




export type AdminJwtPayload = {

  sub:string;

  email:string;

  role:string;

  iat:number;

  exp:number;

};





// CREATE ACCESS TOKEN

export function signAccessToken(
  sub:string,
  email:string,
  role:string
){

  const header = {

    alg:"HS256",

    typ:"JWT"

  };


  const iat =
    Math.floor(
      Date.now()/1000
    );


  const exp =
    iat + ACCESS_TOKEN_EXP;



  const payload = {

    sub,

    email,

    role,

    iat,

    exp

  };



  const unsigned =
    `${base64UrlEncode(
      JSON.stringify(header)
    )}.${base64UrlEncode(
      JSON.stringify(payload)
    )}`;



  const signature =
    hmacSha256(
      unsigned,
      JWT_SECRET
    );



  return `${unsigned}.${signature}`;

}





// VERIFY ACCESS TOKEN

export function verifyAccessToken(
  token:string
):AdminJwtPayload|null{


  try{


    const parts =
      token.split(".");


    if(parts.length !== 3){

      return null;

    }



    const [
      header,
      payload,
      signature

    ] = parts;



    const unsigned =
      `${header}.${payload}`;



    const expected =
      hmacSha256(
        unsigned,
        JWT_SECRET
      );



    if(
      expected !== signature
    ){

      console.log(
        "JWT SIGNATURE MISMATCH"
      );

      return null;

    }




    const decoded =
      JSON.parse(
        base64UrlDecode(payload)
      ) as AdminJwtPayload;




    if(
      decoded.exp <
      Math.floor(Date.now()/1000)
    ){

      console.log(
        "JWT EXPIRED"
      );

      return null;

    }



    return decoded;



  }
  catch(error){

    console.log(
      "JWT VERIFY ERROR",
      error
    );


    return null;

  }


}






// REFRESH TOKEN

export function signRefreshToken(){


  const token =
    crypto
      .randomBytes(64)
      .toString("hex");



  const expiresAt =
    Math.floor(
      Date.now()/1000
    )
    +
    REFRESH_TOKEN_EXP;



  const hash =
    hashToken(token);



  return {

    token,

    hash,

    expiresAt

  };


}






export function hashToken(
  token:string
){

  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

}






export function verifyRefreshToken(
  token:string,
  hash:string
){

  return (
    hashToken(token)
    ===
    hash
  );

}