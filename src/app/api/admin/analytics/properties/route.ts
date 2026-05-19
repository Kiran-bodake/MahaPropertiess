import { NextResponse }
from "next/server";

import { connectDB }
from "@/lib/mongodb";

import Property
from "@/models/Property";

export async function GET(){

  try{

    await connectDB();

    const totalProperties =
      await Property.countDocuments();

    const pendingProperties =
      await Property.countDocuments({

        approvalStatus:
          "pending"

      });

    const approvedProperties =
      await Property.countDocuments({

        approvalStatus:
          "approved"

      });

    const rejectedProperties =
      await Property.countDocuments({

        approvalStatus:
          "rejected"

      });
      const premiumProperties =

  await Property.countDocuments({

    isPremium:true

  });

const featuredProperties =

  await Property.countDocuments({

    isFeatured:true

  });

const activeCities =

  await Property.distinct(
    "city"
  );

    return NextResponse.json({

      totalProperties,

      pendingProperties,

      approvedProperties,

      rejectedProperties

    });

  }

  catch(error){

    console.error(error);

    const activeCities =

  await Property.distinct(
    "city"
  );

    return NextResponse.json({

      totalProperties:0,

      pendingProperties:0,

      approvedProperties:0,

      rejectedProperties:0,

        premiumProperties :0,

  featuredProperties : 0,

  activeCities:

    activeCities.length


    });

  }

}