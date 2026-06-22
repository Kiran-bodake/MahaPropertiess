import mongoose, { Schema, Document, Model } from "mongoose";

// IMPORTANT: register Permission model before populate
import "./Permission";


export interface IRole extends Document {

  name: string;

  permissions: mongoose.Types.ObjectId[];

  createdAt: Date;

  updatedAt: Date;

}



const RoleSchema = new Schema<IRole>(

{
  
  name: {

    type: String,

    required: true,

    unique: true,

    trim: true,

  },


  permissions: [

    {

      type: Schema.Types.ObjectId,

      ref: "Permission",

      default: [],

    }

  ]


},


{

  timestamps: true,

  versionKey: false,

}

);





/*

Next.js hot reload protection

Prevents:

OverwriteModelError:
Cannot overwrite Role model once compiled

*/

const Role: Model<IRole> =

  mongoose.models.Role as Model<IRole> ||

  mongoose.model<IRole>(
    "Role",
    RoleSchema
  );



export default Role;