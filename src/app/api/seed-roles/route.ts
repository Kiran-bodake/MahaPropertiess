import { connectDB } from "@/lib/db";
import Role from "@/models/Role";
import Permission from "@/models/Permission";


export async function GET(){

try{


await connectDB();



const permissions = await Permission.find();



async function createRole(
name:string,
permissionKeys:string[]
){


const rolePermissions = permissions

.filter((p)=>permissionKeys.includes(p.key))

.map((p)=>p._id);



await Role.updateOne(

{
name
},


{

name,

permissions:rolePermissions

},


{
upsert:true
}

);


}



/*
SUPER ADMIN
ALL ACCESS
*/

await createRole(

"Super Admin",

permissions.map(p=>p.key)

);



/*
ADMIN
MOST ACCESS
*/

await createRole(

"Admin",

[

"dashboard.read",

"property.create",
"property.read",
"property.update",
"property.delete",


"inquiry.create",
"inquiry.read",
"inquiry.update",
"inquiry.delete",


"deals.create",
"deals.read",
"deals.update",
"deals.delete",


"analytics.read",


"users.create",
"users.read",
"users.update",
"users.delete"


]

);



/*
SALES MANAGER
*/

await createRole(

"Sales Manager",

[

"dashboard.read",


"property.read",


"inquiry.read",
"inquiry.update",


"deals.create",
"deals.read",
"deals.update",


"analytics.read"

]

);



/*
FIELD MANAGER
*/

await createRole(

"Field Manager",

[

"dashboard.read",

"property.read",

"inquiry.read",
"inquiry.update"

]

);



/*
CONTACT PERSON
*/

await createRole(

"Contact Person",

[

"dashboard.read",

"inquiry.read"

]

);



return Response.json({

success:true,

message:"Roles created successfully"

});


}

catch(error){


console.log(error);


return Response.json({

success:false,

message:"Role creation failed"

},

{
status:500
}

);


}

}