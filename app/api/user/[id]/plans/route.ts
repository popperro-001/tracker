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

    const plans = await Workout.find({
      $and: [{ owner: params.id }, { actual: false }],
    }).populate({
      path: "tasks",
      select: "_id sets todo",
      populate: { path: "todo", select: "category name" },
    });
    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch plans", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  const { title, weekdays, owner, selectedTodos } = await req.json();
  try {
    await connectToDB();

    //create workout
    const workout = await Workout.create({
      actual: false,
      title: title,
      owner: owner,
      weekdays: weekdays,
    });

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
        owner: owner,
      };
    });
    const tasks = await Task.insertMany(formatedTodoList);

    // Extract the task IDs
    const taskIds = tasks.map((task) => task._id);

    // Update the user record to include the task IDs
    await User.findByIdAndUpdate(owner, {
      $push: { tasks: { $each: taskIds }, workouts: workout._id },
    });

    // Update the workout record to include the task IDs
    await Workout.findByIdAndUpdate(workout._id, {
      $push: { tasks: { $each: taskIds } },
    });

    return NextResponse.json(workout, { status: 201 });
  } catch (error) {
    return new Response("Failed to create plan", { status: 500 });
  }
};
