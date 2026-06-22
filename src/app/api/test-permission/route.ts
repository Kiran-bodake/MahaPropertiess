import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { checkPermission } from "@/lib/checkPermission";


export async function GET(){

 try {


  const userId =
    await getCurrentUserId();



  const result =
    await checkPermission(
      userId,
      "property.delete"
    );



  return NextResponse.json({

    userId,

    permission:
      "property.delete",

    allowed:result

  });



 }
 catch(error){


  return NextResponse.json({

    error:"failed"

  },
  {
    status:500
  });


 }

}