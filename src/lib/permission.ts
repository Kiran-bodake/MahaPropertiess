import User from "@/models/user";
import Role from "@/models/Role";
import Permission from "@/models/Permission";
import { connectDB } from "@/lib/db";


export async function hasPermission(
 userId:string,
 permissionKey:string
){

 await connectDB();


 const user = await User.findById(userId)
 .populate({
    path:"role",
    populate:{
      path:"permissions",
      model:"Permission"
    }
 });


 if(!user) return false;


 const role:any = user.role;


 if(!role) return false;



 const permissions =
 role.permissions.map(
    (p:any)=>p.key
 );


 return permissions.includes(permissionKey);

}