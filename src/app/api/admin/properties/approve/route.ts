import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Property from "@/models/Property";

import { getCurrentUserId } from "@/lib/getCurrentUser";

import { checkPermission } from "@/lib/checkPermission";


export async function POST(req: Request) {


try{


await connectDB();



/*
GET CURRENT LOGIN USER
*/

const userId =
await getCurrentUserId();



if(!userId){

return NextResponse.json(

{
success:false,
message:"Unauthorized"
},

{
status:401
}

);

}



/*
CHECK PERMISSION
*/

const allowed =

await checkPermission(

userId,

"property.update"

);



if(!allowed){


return NextResponse.json(

{

success:false,

message:"You don't have permission"

},

{
status:403
}

);


}




const {id}=await req.json();



if(!id){

return NextResponse.json(

{
success:false,
message:"Property id required"
},

{
status:400
}

);

}





const property =

await Property.findByIdAndUpdate(

id,

{

approvalStatus:"approved"

},

{

new:true

}

);





if(!property){


return NextResponse.json(

{
success:false,
message:"Property not found"
},

{
status:404
}

);


}





return NextResponse.json(

{

success:true,

message:"Property approved successfully",

property

}

);





}

catch(error){


console.error(
"Approve property error:",
error
);



return NextResponse.json(

{

success:false,

message:"Server error"

},

{
status:500
}

);


}


}