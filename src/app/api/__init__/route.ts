import { initFollowUpSystem } from "@/server/followup-runner";

export async function GET() {
  initFollowUpSystem();

  return Response.json({
    success: true,
  });
}