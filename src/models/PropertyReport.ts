import mongoose
from "mongoose";


const PropertyReportSchema =

  new mongoose.Schema(

    {

      // REAL PROPERTY DATABASE ID
      propertyMongoId:{

        type:String,

        required:true

      },


      // PROPERTY SLUG / DISPLAY ID
      propertyId:{

        type:String,

        default:""

      },


      // PROPERTY TITLE
      propertyTitle:{

        type:String,

        default:""

      },


      // REPORTED USER INFO
      reportedByUserId:{

        type:String,

        default:""

      },

      reportedByName:{

        type:String,

        default:""

      },

      reportedByPhone:{

        type:String,

        default:""

      },


      // REPORT REASON
      reason:{

        type:String,

        required:true

      },


      // REPORT STATUS
      status:{

        type:String,

        enum:[

          "Pending",

          "Resolved"

        ],

        default:"Pending"

      },


      // RESOLVED DATE
      resolvedAt:{

        type:Date

      }

    },

    {

      timestamps:true

    }

  );


export default

  mongoose.models.PropertyReport ||

  mongoose.model(

    "PropertyReport",

    PropertyReportSchema

  );