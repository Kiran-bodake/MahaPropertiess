import Activity from "@/models/Activity";

export async function createActivity({
  inquiryId,
  dealId,
  action,
  description,
  createdBy = "System",
}: any) {
  try {
    await Activity.create({
      inquiryId,
      dealId,
      action,
      description,
      createdBy,
    });
  } catch (error) {
    console.error("Activity Error:", error);
  }
}