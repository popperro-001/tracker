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
      select: "_id sets todo",
      populate: { path: "todo", select: "category name" },
    });
    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch plans", { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: Params) => {
  const { title, weekdays, selectedTodos } = await req.json();
  try {
    await connectToDB();

    //get existing plan
    const workout = await Workout.findById(params.id);

    if (!workout) return new Response("Plan not found", { status: 404 });

    //create tasks
    const formatedTodoList = selectedTodos.map((item: any) => {
      const sets = [];

      for (let i = 0; i < item.sets; i++) {
        sets.push({ weight: 0, reps: 0 });
      }

      return {
        todo: item.todoId,
        sets,
        workout: workout._id,
        actual: false,
        owner: workout.owner._id,
      };
    });
    const tasks = await Task.insertMany(formatedTodoList);

    // Extract the task IDs to insert
    const taskIdsToInsert = tasks.map((task) => task._id);
    // Extract the task IDs to remove
    const taskIdsToRemove = workout.tasks.map((task: any) => task._id);

    // Update the user record
    await User.findByIdAndUpdate(workout.owner._id, {
      $pull: { tasks: { $in: taskIdsToRemove } },
    });
    await User.findByIdAndUpdate(workout.owner._id, {
      $push: { tasks: { $each: taskIdsToInsert } },
    });

    // Update the workout record to include the task IDs
    await Workout.findByIdAndUpdate(workout._id, {
      $pull: { tasks: { $in: taskIdsToRemove } },
    });
    await Workout.findByIdAndUpdate(workout._id, {
      $push: { tasks: { $each: taskIdsToInsert } },
      title: title,
      weekdays: weekdays,
    });

    //delete unused tasks
    await Task.deleteMany({ _id: { $in: taskIdsToRemove } });

    return NextResponse.json(workout, { status: 200 });
  } catch (error) {
    return new Response("Failed to update plan", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: Params) => {
  try {
    await connectToDB();

    //get existing plan
    const workout = await Workout.findById(params.id);

    if (!workout) return new Response("Plan not found", { status: 404 });

    // Extract the task IDs to remove
    const taskIdsToRemove = workout.tasks.map((task: any) => task._id);

    // Update the user record
    await User.findByIdAndUpdate(workout.owner._id, {
      $pull: { tasks: { $in: taskIdsToRemove }, workouts: workout._id },
    });

    //delete unused tasks
    await Task.deleteMany({ _id: { $in: taskIdsToRemove } });

    //delete plan
    await Workout.findByIdAndRemove(params.id);

    return NextResponse.json("Plan deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete plan", { status: 500 });
  }
};
