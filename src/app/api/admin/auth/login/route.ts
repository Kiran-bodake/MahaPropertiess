import { NextRequest, NextResponse } from "next/server";
import { setupDatabase } from "@/lib/db-init";

import User from "@/models/user";
import Role from "@/models/Role";

import { hashPassword, verifyPassword } from "@/lib/auth";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";


// Create default admins if not exist
async function initializeAdminUsers() {

  if (
    !process.env.ADMIN_SUPER_EMAIL ||
    !process.env.ADMIN_SUPER_PASSWORD
  ) {
    return;
  }


  const superEmail =
    process.env.ADMIN_SUPER_EMAIL.toLowerCase();


  const subEmail =
    process.env.ADMIN_SUB_EMAIL?.toLowerCase();



  // get roles from database

  const superRole =
    await Role.findOne({
      name:"super-admin"
    });


  const adminRole =
    await Role.findOne({
      name:"admin"
    });



  if(!superRole || !adminRole){
    throw new Error(
      "Roles not found. Run role seed first."
    );
  }



  const superAdmin =
    await User.findOne({
      email:superEmail
    });



  if(!superAdmin){

    await User.create({

      name:"Super Admin",

      email:superEmail,

      phone:"8855445788",

      role:superRole._id,

      passwordHash:
        hashPassword(
          process.env.ADMIN_SUPER_PASSWORD
        ),

      isVerified:true
    });

  }



  if(
    subEmail &&
    process.env.ADMIN_SUB_PASSWORD
  ){


    const subAdmin =
      await User.findOne({
        email:subEmail
      });



    if(!subAdmin){

      await User.create({

        name:"Sub Admin",

        email:subEmail,

        phone:"8855445588",

        role:adminRole._id,


        passwordHash:
          hashPassword(
            process.env.ADMIN_SUB_PASSWORD
          ),


        isVerified:true

      });

    }

  }

}




export async function POST(
 req:NextRequest
){


try{


const {
 email:e,
 password,
 securityCode

}=await req.json();



const email =
String(e ?? "")
.toLowerCase()
.trim();



if(
 !email ||
 !password ||
 !securityCode
){

return NextResponse.json(
{
message:
"Email password and security code required"
},
{
status:400
}
);

}




await setupDatabase();



await initializeAdminUsers();





// IMPORTANT RBAC POPULATE

const user =
await User.findOne({
 email

})
.populate({

path:"role",

populate:{
path:"permissions"
}

});





if(
 !user ||
 !user.passwordHash
){

return NextResponse.json(
{
message:"Invalid credentials"
},
{
status:401
}
);

}





const validPassword =
verifyPassword(
 password,
 user.passwordHash
);



if(!validPassword){

return NextResponse.json(
{
message:"Invalid credentials"
},
{
status:401
}
);

}





const validCode =

securityCode ===
process.env.ADMIN_SECURITY_CODE

||

securityCode ===
process.env.ADMIN_SUB_SECURITY_CODE;



if(!validCode){

return NextResponse.json(
{
message:"Security code invalid"
},
{
status:401
}
);

}





// permissions array

const permissions =

(user.role as any)
.permissions
.map(
(p:any)=>p.key
);






const accessToken =

signAccessToken(

user._id.toString(),

user.email,


(user.role as any)
.name

);






const {
token:refreshToken,

hash:refreshHash

}

=
signRefreshToken();





user.refreshTokenHash =
refreshHash;



await user.save();







const response = NextResponse.json({

success:true,


user:{


id:user._id,


name:user.name,


email:user.email,


role:
(user.role as any).name,


permissions

}



});





response.cookies.set({

name:
"propvista-access-token",

value:accessToken,


httpOnly:true,


secure:
process.env.NODE_ENV==="production",


sameSite:"lax",


path:"/",


maxAge:
15*60

});





response.cookies.set({

name:
"propvista-refresh-token",

value:refreshToken,


httpOnly:true,


secure:
process.env.NODE_ENV==="production",


sameSite:"lax",


path:"/",


maxAge:
7*24*60*60

});





return response;



}

catch(error){


console.error(
"Login error:",
error
);



return NextResponse.json(

{

message:
error instanceof Error
?
error.message
:
"Internal server error"

},

{
status:500
}

);


}


}