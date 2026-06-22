import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import PropertyInquiry from "@/models/PropertyInquiry";
import Notification from "@/models/Notification";
import Property from "@/models/Property";

import { sendInquiryEmails } from "@/services/emailService";

import { getCurrentUserId } from "@/lib/getCurrentUser";
import { checkPermission } from "@/lib/checkPermission";



// Generate slug
const generatePropertySlug = (title:string)=>{

if(!title) return "";

return title
.toLowerCase()
.replace(/[^a-z0-9]+/g,"-")
.replace(/^-|-$/g,"");

};





// ==========================
// CREATE INQUIRY
// ==========================

export async function POST(req:NextRequest){

try{


await connectDB();



const userId =
await getCurrentUserId();



if(!userId){

return NextResponse.json(
{
message:"Unauthorized"
},
{
status:401
}
);

}



const allowed =
await checkPermission(
userId,
"inquiry.create"
);



if(!allowed){

return NextResponse.json(
{
message:"You don't have permission to create inquiry"
},
{
status:403
}
);

}




const body =
await req.json();



const {

propertyId,

propertyTitle,

customerName,

name,

email,

phone,

message,

category,

...rest


}=body;



let propertyData=null;



if(propertyId){

propertyData =
await Property.findById(propertyId);

}





const propertySlug =
generatePropertySlug(
propertyData?.title ||
propertyTitle
);



const inquiryData:any={


propertyId,

propertyTitle:
propertyData?.title ||
propertyTitle,


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

isRead:false,


...rest


};





const inquiry =
await PropertyInquiry.create(
inquiryData
);






// notification

await Notification.create({

userId:"admin",

type:"lead",

title:"New Inquiry Received",

message:
`${inquiry.customerName} sent inquiry`,


referenceId:
inquiry._id.toString(),


metadata:{

propertyId,

propertySlug,

category

}


});





return NextResponse.json({

success:true,

inquiry,

message:"Inquiry created successfully"

});




}catch(error:any){


console.log(error);


return NextResponse.json({

success:false,

message:error.message

},
{
status:500
}
);


}

}








// ==========================
// GET INQUIRIES
// ==========================


export async function GET(req:NextRequest){

try{


await connectDB();



const userId =
await getCurrentUserId();



if(!userId){

return NextResponse.json(
{
message:"Unauthorized"
},
{
status:401
}
);

}



const allowed =
await checkPermission(
userId,
"inquiry.read"
);



if(!allowed){

return NextResponse.json(
{
message:"You don't have permission to view inquiries"
},
{
status:403
}
);

}





const inquiries =
await PropertyInquiry
.find()
.sort({
createdAt:-1
});





return NextResponse.json({

success:true,

inquiries

});



}catch(error){


return NextResponse.json({

success:false,

message:"Failed to fetch inquiries"

},
{
status:500
}
);


}

}







// ==========================
// UPDATE INQUIRY
// ==========================


export async function PUT(req:NextRequest){


try{


await connectDB();



const userId =
await getCurrentUserId();



const allowed =
await checkPermission(
userId!,
"inquiry.update"
);



if(!allowed){

return NextResponse.json(
{
message:"No permission"
},
{
status:403
}
);

}



const {id}= 
await req.json();



const body =
await req.json();



const updated =
await PropertyInquiry.findByIdAndUpdate(

id,

body,

{
new:true
}

);




return NextResponse.json({

success:true,

inquiry:updated

});



}catch(error){


return NextResponse.json({

success:false

},
{
status:500
}
);


}


}









// ==========================
// DELETE INQUIRY
// ==========================


export async function DELETE(req:NextRequest){


try{


await connectDB();



const userId =
await getCurrentUserId();



const allowed =
await checkPermission(
userId!,
"inquiry.delete"
);



if(!allowed){

return NextResponse.json(
{
message:"No permission"
},
{
status:403
}
);

}




const {id} =
await req.json();




await PropertyInquiry.findByIdAndDelete(
id
);



return NextResponse.json({

success:true,

message:"Inquiry deleted"

});



}catch(error){


return NextResponse.json({

success:false

},
{
status:500
}
);


}


}