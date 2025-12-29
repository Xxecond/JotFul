// Run this once to clean up your database
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function cleanupUsers() {
  await connectDB();
  
  // Remove the typo email
  await User.deleteOne({ email: "andrewsampdu9@gmail.com" });
  
  // Clear any stuck magic tokens
  await User.updateMany(
    { magicToken: { $exists: true } },
    { $unset: { magicToken: "", magicTokenExpiry: "" } }
  );
  
  console.log("Database cleaned up");
}