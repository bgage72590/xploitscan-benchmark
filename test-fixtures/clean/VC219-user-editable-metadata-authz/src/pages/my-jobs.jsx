import { useUser } from "@clerk/clerk-react";
import Applications from "../components/Applications";
import CreatedJobs from "../components/CreatedJobs";

// The user picks "candidate" or "recruiter" during onboarding; either view is
// open to anyone who picks it, so nothing is escalated by changing it.
export default function MyJobs() {
  const { user } = useUser();
  return user?.unsafeMetadata?.role === "candidate" ? <Applications /> : <CreatedJobs />;
}
