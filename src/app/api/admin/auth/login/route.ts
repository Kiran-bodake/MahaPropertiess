import { NextRequest, NextResponse } from "next/server";

import { setupDatabase } from "@/lib/db-init";

import User from "@/models/user";
import Role from "@/models/Role";

import {
  hashPassword,
  verifyPassword
} from "@/lib/auth";

import {
  signAccessToken,
  signRefreshToken
} from "@/lib/jwt";



// ===============================
// CREATE DEFAULT ADMINS
// ===============================

async function initializeAdminUsers(){


if(
!process.env.ADMIN_SUPER_EMAIL ||
!process.env.ADMIN_SUPER_PASSWORD
){
return;
}



const superEmail =
process.env.ADMIN_SUPER_EMAIL
.toLowerCase();



const subEmail =
process.env.ADMIN_SUB_EMAIL
?.toLowerCase();



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
"Admin roles missing. Seed roles first."
);

}




// SUPER ADMIN

const existingSuper =
await User.findOne({
email:superEmail
});



if(!existingSuper){


await User.create({

name:"Super Admin",

email:superEmail,

phone:"8855445788",

role:superRole._id,

passwordHash:
await hashPassword(
process.env.ADMIN_SUPER_PASSWORD
),

isVerified:true

});


}




// SUB ADMIN

if(
subEmail &&
process.env.ADMIN_SUB_PASSWORD
){


const existingSub =
await User.findOne({
email:subEmail
});



if(!existingSub){


await User.create({

name:"Sub Admin",

email:subEmail,

phone:"8855445588",

role:adminRole._id,


passwordHash:
await hashPassword(
process.env.ADMIN_SUB_PASSWORD
),


isVerified:true

});


}


}



}





// ===============================
// LOGIN
// ===============================


export async function POST(
req:NextRequest
){


try{


const body =
await req.json();



const email =
String(body.email ?? "")
.toLowerCase()
.trim();



const password =
body.password;



const securityCode =
body.securityCode;




if(
!email ||
!password ||
!securityCode
){

return NextResponse.json(

{
message:
"Email password security code required"
},

{
status:400
}

);

}





// security check

const validCode =

securityCode ===
process.env.ADMIN_SECURITY_CODE

||

securityCode ===
process.env.ADMIN_SUB_SECURITY_CODE;



if(!validCode){


return NextResponse.json(

{
message:"Invalid security code"
},

{
status:401
}

);

}





await setupDatabase();



await initializeAdminUsers();






// GET USER WITH ROLE + PERMISSIONS

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





if(!user){


return NextResponse.json(

{
message:"User not found"
},

{
status:401
}

);

}






const passwordValid =

await verifyPassword(

password,

user.passwordHash

);






if(!passwordValid){


return NextResponse.json(

{
message:"Invalid password"
},

{
status:401
}

);


}






const role:any = user.role;



const permissions =

role?.permissions?.map(
(p:any)=>p.key
) || [];







// CREATE ACCESS TOKEN

const accessToken =

signAccessToken(

user._id.toString(),

user.email,

role.name

);






// CREATE REFRESH TOKEN

const refresh =

signRefreshToken();



user.refreshTokenHash =
refresh.hash;



await user.save();







const response =

NextResponse.json({


success:true,


user:{


id:user._id,


name:user.name,


email:user.email,


role:role.name,


permissions


}


});







response.cookies.set(

"propvista-access-token",

accessToken,

{


httpOnly:true,


secure:
process.env.NODE_ENV==="production",


sameSite:"lax",


path:"/",


maxAge:
15*60


}

);








response.cookies.set(

"propvista-refresh-token",

refresh.token,

{


httpOnly:true,


secure:
process.env.NODE_ENV==="production",


sameSite:"lax",


path:"/",


maxAge:
7*24*60*60


}

);







return response;




}
catch(error:any){


console.error(
"ADMIN LOGIN ERROR:",
error
);



return NextResponse.json(

{
message:error.message ||
"Login failed"
},

{
status:500
}

);


}


}