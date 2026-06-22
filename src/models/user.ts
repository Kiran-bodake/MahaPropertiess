import mongoose, { Schema, models, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  phone?: string;
  email: string;
  passwordHash: string;

  role: mongoose.Types.ObjectId;

  refreshTokenHash: string | null;
  avatar: string;

  savedProperties: mongoose.Types.ObjectId[];

  isVerified: boolean;
  loginCount: number;
  lastLoginAt: Date;

  createdAt: Date;
  updatedAt: Date;

  getPublicProfile(): object;
}


const UserSchema = new Schema<IUser>(
  {

    name:{
      type:String,
      required:true,
      trim:true
    },


    phone:{
      type:String,
      unique:true,
      sparse:true,
      trim:true
    },


    email:{
      type:String,
      required:true,
      lowercase:true,
      trim:true
    },


    passwordHash:{
      type:String,
      required:true
    },


    // 🔥 RBAC ROLE
    role:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Role",
      required:true,
      index:true
    },


    refreshTokenHash:{
      type:String,
      default:null
    },


    avatar:{
      type:String,
      default:""
    },


    savedProperties:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Property"
      }
    ],


    isVerified:{
      type:Boolean,
      default:false
    },


    loginCount:{
      type:Number,
      default:0
    },


    lastLoginAt:{
      type:Date,
      default:null
    }

  },

  {
    timestamps:true,
    versionKey:false
  }

);



// faster user role lookup
UserSchema.index({
  role:1
});



// PUBLIC RESPONSE
UserSchema.methods.getPublicProfile=function(){

return {

 id:this._id,

 name:this.name,

 email:this.email,

 phone:this.phone,

 avatar:this.avatar,

 role:this.role,

 isVerified:this.isVerified

};

};




// prevent hot reload error
const User:Model<IUser> =
(models.User as Model<IUser>) ||
mongoose.model<IUser>(
"User",
UserSchema
);


export default User;