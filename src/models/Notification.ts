import mongoose from "mongoose";

const NotificationSchema =
  new mongoose.Schema(
    {

      userId: {

        type: String,

        required: true

      },

      type: {
        type: String
      },

      title: {
        type: String
      },

      message: {
        type: String
      },

      referenceId: {
        type: String
      },

      isRead: {
        type: Boolean,
        default: false
      }

    },
    {
      timestamps: true
    }
  );

export default
  mongoose.models.Notification ||

  mongoose.model(
    "Notification",
    NotificationSchema
  );