import PropertyInquiry from "@/models/PropertyInquiry";
import Notification from "@/models/Notification";
import { connectDB } from "@/lib/mongodb";

export const startFollowUpChecker = () => {
  setInterval(async () => {
    try {
      await connectDB();

      const now = new Date();

      const leads = await PropertyInquiry.find({
        nextFollowUp: { $lte: now },
        status: { $ne: "closed" },
      });

      for (const lead of leads) {
        const exists = await Notification.findOne({
          referenceId: lead._id,
          type: "followup",
        });

        if (exists) continue;

        await Notification.create({
          userId: "admin",
          type: "followup",
          referenceId: lead._id,
          title: "Follow-up Reminder",
          message: `Follow up with ${lead.customerName || lead.name}`,
          followUpDate: lead.nextFollowUp,
          isRead: false,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, 60 * 1000); // every 1 min
};