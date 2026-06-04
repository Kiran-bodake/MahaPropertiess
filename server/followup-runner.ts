import { startFollowUpChecker } from "@/lib/followup-checker";

let started = false;

export const initFollowUpSystem = () => {
  if (started) return;
  started = true;

  startFollowUpChecker();
  console.log("Follow-up system started");
};