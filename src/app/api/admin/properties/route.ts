import { NextResponse, NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Property from "@/models/Property";
import PropertyPricing from "@/models/PropertyPricing";
import PropertyLocation from "@/models/PropertyLocation";
import PropertyImage from "@/models/PropertyImage";

import { verifyAccessToken } from "@/lib/jwt";
import { checkPermission } from "@/lib/checkPermission";



export async function GET(req: NextRequest) {


try {


await connectDB();



/*
==============================
AUTH CHECK
==============================
*/


const token =
req.cookies.get(
"propvista-access-token"
)?.value;



if(!token){

return NextResponse.json(
{
success:false,
message:"Unauthenticated"
},
{
status:401
}
);

}



const payload:any =
verifyAccessToken(token);



if(!payload){

return NextResponse.json(
{
success:false,
message:"Invalid token"
},
{
status:401
}
);

}



/*
==============================
PERMISSION CHECK
==============================
*/


const hasPermission =
await checkPermission(
payload.sub,
"property.read"
);



if(!hasPermission){


return NextResponse.json(

{
success:false,
message:"You don't have permission to view properties"
},

{
status:403
}

);


}




/*
==============================
FILTERS
==============================
*/


const {searchParams} =
req.nextUrl;



const approval =
searchParams.get("approval");



const mine =
searchParams.get("mine");



const query:any = {};



if(
approval &&
approval !== "all"
){

query.approvalStatus =
approval;

}




if(mine==="true"){


query.postedBy =
payload.sub;


}



/*
==============================
FETCH PROPERTIES
==============================
*/


const properties =
await Property.find(query)
.sort({
createdAt:-1
})
.lean();





/*
==============================
MERGE EXTRA DATA
==============================
*/


const finalProperties =

await Promise.all(

properties.map(
async(property:any)=>{


const propertyId =
property.propertyId;



const [
pricing,
location,
image
]

=
await Promise.all([


PropertyPricing.findOne({
propertyId
}).lean(),



PropertyLocation.findOne({
propertyId
}).lean(),



PropertyImage.findOne({
propertyId
}).lean()


]);




return {


...property,


price:
pricing?.price || 0,



city:
location?.city || "",


state:
location?.state || "",


locality:
location?.locality || "",


houseNo:
location?.houseNo || "",


street:
location?.street || "",


landmark:
location?.landmark || "",



image:

image?.images?.[0]?.url
||
"/maha.png"



};


}

)

);




console.log(
"FINAL PROPERTIES COUNT:",
finalProperties.length
);





return NextResponse.json({

success:true,

count:
finalProperties.length,


properties:
finalProperties


});




}

catch(error:any){


console.error(
"PROPERTY API ERROR:",
error
);



return NextResponse.json(

{

success:false,

message:
error.message ||
"Internal server error"

},

{
status:500
}

);


}


}