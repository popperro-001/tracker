import { NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoose";
import Workout from "@/lib/models/workout.model";
import Task from "@/lib/models/task.model";
import User from "@/lib/models/user.model";

interface Params {
  params: { id: string };
}

export const GET = async (req: Request, { params }: Params) => {
  try {
    await connectToDB();

    const plan = await Workout.findById(params.id).populate({
      path: "tasks",
      select: "_id sets todo actual",
      populate: { path: "todo", select: "category name" },
    });
    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch plans", { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: Params) => {
  const { date, bodyweight } = await req.json();
  try {
    await connectToDB();

    //get existing workout
    const workout = await Workout.findById(params.id);

    if (!workout) return new Response("Workout not found", { status: 404 });

    workout.date = date;
    workout.bodyweight = bodyweight;

    await workout.save();

    return NextResponse.json(workout, { status: 200 });
  } catch (error) {
    return new Response("Failed to update plan", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: Params) => {
  try {
    await connectToDB();

    //get existing workout
    const workout = await Workout.findById(params.id);

    if (!workout) return new Response("Workout not found", { status: 404 });

    // Extract the task IDs to remove
    const taskIdsToRemove = workout.tasks.map((task: any) => task._id);

    // Update the user record
    await User.findByIdAndUpdate(workout.owner._id, {
      $pull: { tasks: { $in: taskIdsToRemove }, workouts: workout._id },
    });

    //delete unused tasks
    await Task.deleteMany({ _id: { $in: taskIdsToRemove } });

    //delete workout
    await Workout.findByIdAndRemove(params.id);

    return NextResponse.json("Workout deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete workout", { status: 500 });
  }
};