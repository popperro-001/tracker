"use server";

import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export const fetchUser = async (email: string) => {
  try {
    await connectToDB();

    return await User.findOne({ email: email });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};
