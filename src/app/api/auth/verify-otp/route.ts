import { connectDB } from "@/lib/db";

import Otp from "@/models/Otp";

import User from "@/models/user";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";



export async function POST(req: Request) {

  try {

    /* GET BODY */
    const {

      phone,

      otp

    } = await req.json();



    /* VALIDATION */
    if (

      !phone ||

      !otp

    ) {

      return Response.json(

        {

          success: false,

          error:
            "Phone and OTP required"

        },

        {

          status: 400

        }

      );

    }



    /* CONNECT DATABASE */
    await connectDB();



    /* FIND OTP RECORD */
    const record =

      await Otp.findOne({

        phone

      });



    /* OTP NOT FOUND */
    if (!record) {

      return Response.json(

        {

          success: false,

          error:
            "OTP not found"

        },

        {

          status: 400

        }

      );

    }



    /* OTP EXPIRED */
    if (

      record.expiresAt <

      new Date()

    ) {

      await Otp.deleteOne({

        phone

      });

      return Response.json(

        {

          success: false,

          error:
            "OTP expired"

        },

        {

          status: 400

        }

      );

    }



    /* TOO MANY ATTEMPTS */
    if (

      record.attempts >= 5

    ) {

      return Response.json(

        {

          success: false,

          error:
            "Too many attempts. Try again later."

        },

        {

          status: 429

        }

      );

    }



    /* VERIFY OTP */
    const isMatch =

      await bcrypt.compare(

        otp,

        record.otp

      );



    /* INVALID OTP */
    if (!isMatch) {

      record.attempts += 1;

      await record.save();

      return Response.json(

        {

          success: false,

          error:
            "Invalid OTP"

        },

        {

          status: 400

        }

      );

    }



    /* FIND USER */
    let user =

      await User.findOne({

        phone

      });



    /* CREATE NEW USER */
    if (!user) {

      user =

        await User.create({

          name: "User",

          phone,

          email: "",

          role: "user",

          isVerified: true,

          loginCount: 1,

          lastLoginAt:
            new Date()

        });

    }

    /* UPDATE EXISTING USER */
    else {

      user.isVerified = true;

      user.lastLoginAt =
        new Date();

      user.loginCount =

        (user.loginCount || 0) + 1;

      await user.save();

    }



    /* DELETE OTP */
    await Otp.deleteOne({

      phone

    });



    /* GENERATE JWT */
    const token = jwt.sign(

      {

        userId:
          user._id

      },

      process.env.JWT_SECRET as string,

      {

        expiresIn: "7d"

      }

    );



    console.log(

      "[LOGIN_USER]",

      user

    );



    /* SUCCESS RESPONSE */
    return new Response(

      JSON.stringify({

        success: true,

        message:
          "Login successful",

        user: {

          _id:
            user._id,

          name:
            user.name || "User",

          phone:
            user.phone,

          email:
            user.email || "",

          role:
            user.role || "user"

        }

      }),

      {

        status: 200,

        headers: {

          "Set-Cookie":

            `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`,

          "Content-Type":
            "application/json"

        }

      }

    );

  }

  catch (err) {

    console.error(

      "[VERIFY_OTP_ERROR]",

      err

    );

    return Response.json(

      {

        success: false,

        error:
          "Server error"

      },

      {

        status: 500

      }

    );

  }

}