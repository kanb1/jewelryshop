// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import bcrypt from "bcrypt";
// import User from "./models/User";

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI as string;

// const createAdminUser = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("Connected to MongoDB");

//     const adminExists = await User.findOne({ email: "admin@example.com" });
//     if (adminExists) {
//       console.log("Admin user already exists");
//       return;
//     }

//     const hashedPassword = await bcrypt.hash("xx", 10);
//     const adminUser = new User({
//       username: "admin",
//       email: "admin@example.com",
//       password: hashedPassword,
//       name: "Admin",
//       surname: "User",
//       role: "admin",
//     });

//     await adminUser.save();
//     console.log("Admin user created");
//   } catch (error) {
//     console.error("Error creating admin user:", error);
//   } finally {
//     await mongoose.disconnect();
//     console.log("Disconnected from MongoDB");
//   }
// };

// createAdminUser();
