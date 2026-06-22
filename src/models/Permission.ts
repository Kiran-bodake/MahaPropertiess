import mongoose, { Schema, Model, Document } from "mongoose";


export interface IPermission extends Document {

  key: string;

  module: string;

  action: string;

  description?: string;

  createdAt: Date;

  updatedAt: Date;
}



const PermissionSchema = new Schema<IPermission>(

{
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },


  module: {
    type: String,
    required: true,
    trim: true,
  },


  action: {
    type: String,
    required: true,
    trim: true,
  },


  description: {
    type: String,
    default: "",
  }

},


{
  timestamps:true
}

);



// prevent model overwrite error in Next.js

const Permission: Model<IPermission> =

mongoose.models.Permission ||

mongoose.model<IPermission>(
  "Permission",
  PermissionSchema
);



export default Permission;