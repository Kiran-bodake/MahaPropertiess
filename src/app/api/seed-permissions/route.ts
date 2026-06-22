import { connectDB } from "@/lib/db";
import Permission from "@/models/Permission";


export async function GET() {

  try {

    await connectDB();


    const modules = [

      "dashboard",
      "property",
      "inquiry",
      "deal",
      "analytics",
      "users",
      "roles"

    ];


    const actions = [

      "create",
      "read",
      "update",
      "delete"

    ];


    const permissions = [];


    for (const module of modules) {

      for (const action of actions) {


        permissions.push({

          key: `${module}.${action}`,

          module: module,

          action: action

        });


      }

    }



    await Promise.all(

      permissions.map((permission)=>


        Permission.updateOne(

          {
            key: permission.key
          },


          {
            $set: permission
          },


          {
            upsert:true
          }


        )


      )

    );



    return Response.json({

      success:true,

      total:permissions.length,

      message:"Permissions seeded successfully"

    });



  } catch(error){


    console.error(error);


    return Response.json(

      {

        success:false,

        message:"Permission seed failed"

      },

      {
        status:500
      }

    );


  }


}