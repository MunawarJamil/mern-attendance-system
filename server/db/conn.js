import mongoose from "mongoose";

export const db_connection = async () => {
  try {
    await mongoose.connect(
      `${process.env.DB_CONNECTION_STRING}/attendance_managment`
    );
    console.log("database connected successfully...");
  } catch (error) {
    console.log("connection failed...", error);
  }
};
