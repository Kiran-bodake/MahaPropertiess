import User from "@/models/user";
import "@/models/Role";
import "@/models/Permission";


export async function checkPermission(
  userId:string,
  permissionKey:string
){

try{


console.log("CHECK USER ID:", userId);


const user = await User.findById(userId)
.populate({
 path:"role",
 populate:{
   path:"permissions"
 }
});


console.log("USER:",user);


if(!user){

console.log("USER NOT FOUND");

return false;

}



console.log(
"ROLE:",
user.role
);



const role:any = user.role;


if(!role){

console.log("ROLE MISSING");

return false;

}



console.log(
"ROLE NAME:",
role.name
);



console.log(
"ROLE PERMISSIONS:",
role.permissions.map(
(p:any)=>p.key
)
);



const allowed =
role.permissions.some(
(p:any)=>
p.key === permissionKey
);



console.log(
"REQUESTED:",
permissionKey
);



console.log(
"ALLOWED:",
allowed
);



return allowed;



}catch(error){

console.log(
"PERMISSION ERROR:",
error
);

return false;

}


}