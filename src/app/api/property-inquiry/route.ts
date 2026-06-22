import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import PropertyInquiry from "@/models/PropertyInquiry";
import Notification from "@/models/Notification";
import Property from "@/models/Property";

import { getCurrentUserId } from "@/lib/getCurrentUser";
import { checkPermission } from "@/lib/checkPermission";




// ===============================
// CREATE PUBLIC INQUIRY
// NO JWT REQUIRED
// ===============================

export async function POST(req:NextRequest){

try{

await connectDB();


const body = await req.json();


const {

propertyId,
propertyTitle,
customerName,
name,
email,
phone,
message,
category


}=body;



let property=null;


if(propertyId){

property =
await Property.findById(propertyId);

}




const inquiry = await PropertyInquiry.create({

propertyId,


propertyTitle:
property?.title ||
propertyTitle ||
"Unknown Property",


customerName:
customerName ||
name ||
"Unknown",


name:
customerName ||
name ||
"Unknown",


email,

phone,

message,


category:
category ||
"real-estate",


status:"new",

priority:"warm",

isRead:false


});





// create admin notification

await Notification.create({

userId:"admin",

type:"lead",

title:"New Property Inquiry",

message:
`${inquiry.customerName} sent inquiry`,


referenceId:
inquiry._id.toString(),


metadata:{

propertyId,

category

}

});






return NextResponse.json({

success:true,

message:"Inquiry submitted successfully",

inquiry


});


}

catch(error:any){


console.log(
"INQUIRY CREATE ERROR",
error
);


return NextResponse.json({

success:false,

message:error.message

},
{
status:500
});


}


}









// ===============================
// ADMIN GET INQUIRIES
// JWT REQUIRED
// ===============================


export async function GET(req:NextRequest){


try{


await connectDB();



const userId =
await getCurrentUserId();



if(!userId){

return NextResponse.json({

message:"Unauthorized"

},
{
status:401
});

}




const permission =
await checkPermission(

userId,

"inquiry.read"

);




if(!permission){


return NextResponse.json({

message:"Permission denied"

},
{
status:403
});


}





const inquiries =

await PropertyInquiry.find()

.sort({

createdAt:-1

});






return NextResponse.json({

success:true,

inquiries


});




}

catch(error:any){


return NextResponse.json({

success:false,

message:error.message

},
{
status:500
});

}


}









// ===============================
// ADMIN UPDATE
// ===============================


export async function PUT(req:NextRequest){


try{


await connectDB();



const userId =
await getCurrentUserId();



if(!userId){

return NextResponse.json({

message:"Unauthorized"

},
{
status:401
});

}





const allowed =

await checkPermission(

userId,

"inquiry.update"

);



if(!allowed){

return NextResponse.json({

message:"Permission denied"

},
{
status:403
});


}




const body =
await req.json();


const {

id,

...updateData

}=body;





const updated =

await PropertyInquiry.findByIdAndUpdate(

id,

updateData,

{
new:true
}

);





return NextResponse.json({

success:true,

inquiry:updated


});




}

catch(error:any){


return NextResponse.json({

success:false,

message:error.message

},
{
status:500
});


}


}









// ===============================
// ADMIN DELETE
// ===============================


export async function DELETE(req:NextRequest){


try{


await connectDB();


    console.log("JWT SECRET:", process.env.JWT_SECRET);
const userId =
await getCurrentUserId();




if(!userId){

return NextResponse.json({

message:"Unauthorized"

},
{
status:401
});

}




const allowed =

await checkPermission(

userId,

"inquiry.delete"

);




if(!allowed){

return NextResponse.json({

message:"Permission denied"

},
{
status:403
});

}




const {id}=

await req.json();




await PropertyInquiry.findByIdAndDelete(id);





return NextResponse.json({

success:true,

message:"Inquiry deleted"


});




}


catch(error:any){


return NextResponse.json({

success:false,

message:error.message

},
{
status:500
});


}


}