import mongoose
from "mongoose";

const PropertyReportSchema =

  new mongoose.Schema(

    {

      propertyId:{
        type:String,
        required:true
      },

      propertyTitle:{
        type:String,
        default:""
      },
status:{
  type:String,
  default:"Pending"
},

resolvedAt:{
  type:Date
},
      reason:{
        type:String,
        required:true
      },

      createdAt:{
        type:Date,
        default:Date.now
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