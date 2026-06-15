import dns from "dns";
import mongoose from "mongoose";

import { ENV } from "./env.js";

// Corporate/campus networks may block Node.js DNS (querySrv ECONNREFUSED).
// Only override locally; production hosts use their own DNS and don't need this.
if (ENV.NODE_ENV === "development") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB_URL is not defined in environment variables");
    }
    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB:");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB", error);
    process.exit(1); // 0 means success, 1 means failure
  }
};
