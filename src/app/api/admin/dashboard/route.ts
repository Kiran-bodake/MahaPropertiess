import { NextRequest, NextResponse } from "next/server";

import { connectDB }
from "@/lib/mongodb";

import { requireAdminUser }
from "@/lib/admin-auth";

import Lead
from "@/models/Lead";

import Deal
from "@/models/Deal";

import Task
from "@/models/Task";

import Property
from "@/models/Property";

import PropertyInquiry
from "@/models/PropertyInquiry";



export async function GET(
  req: NextRequest
) {

  try {

    /* ADMIN AUTH */
    const auth =
      await requireAdminUser(req);

    if (
      auth instanceof NextResponse
    ) {

      return auth;

    }



    /* CONNECT DATABASE */
    await connectDB();



    /* ================================
       BASIC COUNTS
    ================================ */
const [

  leadsCount,

  dealsCount,

  tasksCount,

  propertiesCount,

  activeProperties,

  featuredProperties,

  verifiedProperties,

  saleProperties,

] = await Promise.all([

  Lead.countDocuments(),

  Deal.countDocuments(),

  Task.countDocuments(),

  Property.countDocuments(),

  Property.countDocuments({
    listingStatus: "ACTIVE",
  }),

  Property.countDocuments({
    featured: true,
  }),

  Property.countDocuments({
    verified: true,
  }),

  Property.countDocuments({
    listingType: "SALE",
  }),

]);


    /* ================================
       MONTHLY CHART DATA
    ================================ */

    const months = [

      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",

    ];



    const monthlyData = [];



    for(let i = 0; i < 12; i++) {

      const startDate =

        new Date(

          new Date().getFullYear(),

          i,

          1

        );



      const endDate =

        new Date(

          new Date().getFullYear(),

          i + 1,

          1

        );



      /* MONTHLY PROPERTIES */

      const properties =

        await Property.countDocuments({

          createdAt:{

            $gte:startDate,

            $lt:endDate

          }

        });



      /* MONTHLY INQUIRIES */

      const leads =

        await PropertyInquiry.countDocuments({

          createdAt:{

            $gte:startDate,

            $lt:endDate

          }

        });



      /* MONTHLY DEALS */

      const deals =

        Math.floor(

          leads * 0.3

        );



      monthlyData.push({

        month:months[i],

        properties,

        leads,

        deals,

      });

    }



    /* ================================
       PROPERTY TYPE DISTRIBUTION
    ================================ */

    const [

      plotsCount,

      flatsCount,

      villasCount,

      commercialCount,

    ] = await Promise.all([

   Property.countDocuments({
  propertyType: "NA Plot",
}),

      Property.countDocuments({

        propertyType:"Flat"

      }),

      Property.countDocuments({

        propertyType:"Villa"

      }),

      Property.countDocuments({

        propertyType:"Commercial"

      }),

    ]);



    const propertyTypeData = [

      {

        name:"Plots",

        value:plotsCount,

      },

      {

        name:"Flats",

        value:flatsCount,

      },

      {

        name:"Villas",

        value:villasCount,

      },

      {

        name:"Commercial",

        value:commercialCount,

      },

    ];



    /* ================================
       CONVERSION RATE
    ================================ */

    const conversionRate =

      leadsCount > 0

        ?

        Math.round(

          (dealsCount / leadsCount) * 100

        )

        :

        0;



    /* ================================
       TOTAL REVENUE
    ================================ */

    const totalRevenue =

      dealsCount * 50000;



    /* ================================
       API RESPONSE
    ================================ */

    return NextResponse.json({

      success:true,



      /* KPI COUNTS */

      propertiesCount,

      leadsCount,

      dealsCount,

      tasksCount,



     /* PROPERTY STATUS */

activeProperties,

featuredProperties,

verifiedProperties,

saleProperties,



      /* ANALYTICS */

      conversionRate,

      totalRevenue,



      /* CHART DATA */

      chartData:
        monthlyData,



      /* PIE CHART */

      propertyTypeData,



      /* FEATURE CARDS */

      featureCards:[

        {

          title:
            "Automated pipeline",

          desc:
            "Drag & drop stages with smart transitions",

        },

        {

          title:
            "AI-powered insights",

          desc:
            "AI suggestions and source attribution",

        },

        {

          title:
            "Custom columns",

          desc:
            "Save column views, show/hide, reorder",

        },

        {

          title:
            "Google integration",

          desc:
            "Analytics + email + meetings sync",

        },

      ],

    });

  }

  catch(error){

    console.log(

      "DASHBOARD API ERROR:",

      error

    );



    return NextResponse.json(

      {

        success:false,

        message:
          "Failed to load dashboard data",

      },

      {

        status:500

      }

    );

  }

}