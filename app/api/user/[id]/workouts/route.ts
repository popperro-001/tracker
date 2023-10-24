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
      $and: [{ owner: params.id }, { actual: true }],
    })
      .sort({ date: -1 })
      .populate({
        path: "tasks",
        select: "_id sets todo actual",
        populate: { path: "todo", select: "category name" },
      });
    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch plans", { status: 500 });
  }
};

export const POST = async (req: Request, { params }: Params) => {
  try {
    const { type, planId, selectedTodos } = await req.json();
    const currentDate = new Date();

    await connectToDB();

    if (type === "plan") {
      //get existing plan
      const plan = await Workout.findById(planId);

      if (!plan) return new Response("Plan not found", { status: 404 });

      //get tasks from plan
      const tasksFromPlan = await Task.find({ _id: { $in: plan.tasks } });

      //create workout
      const workout = await Workout.create({
        actual: true,
        owner: params.id,
        date: currentDate,
        bodyweight: 0,
      });

      //create tasks
      const formatedTodoList = tasksFromPlan.map((item: any) => {
        const sets = [];

        for (let i = 0; i < item.sets.length; i++) {
          sets.push({ weight: 0, reps: 0 });
        }

        return {
          todo: item.todo,
          sets,
          workout: workout._id,
          actual: false,
          owner: params.id,
        };
      });

      const tasks = await Task.insertMany(formatedTodoList);

      // Extract the task IDs
      const taskIds = tasks.map((task) => task._id);

      // Update the user record to include the task IDs
      await User.findByIdAndUpdate(params.id, {
        $push: { tasks: { $each: taskIds }, workouts: workout._id },
      });

      // Update the workout record to include the task IDs
      await Workout.findByIdAndUpdate(workout._id, {
        $push: { tasks: { $each: taskIds } },
      });

      return NextResponse.json(workout, { status: 201 });
    } else {
      //create workout
      const workout = await Workout.create({
        actual: true,
        owner: params.id,
        date: currentDate,
        bodyweight: 0,
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
          owner: params.id,
        };
      });
      const tasks = await Task.insertMany(formatedTodoList);

      // Extract the task IDs
      const taskIds = tasks.map((task) => task._id);

      // Update the user record to include the task IDs
      await User.findByIdAndUpdate(params.id, {
        $push: { tasks: { $each: taskIds }, workouts: workout._id },
      });

      // Update the workout record to include the task IDs
      await Workout.findByIdAndUpdate(workout._id, {
        $push: { tasks: { $each: taskIds } },
      });

      return NextResponse.json(workout, { status: 201 });
    }
  } catch (error) {
    return new Response("Failed to create plan", { status: 500 });
  }
};
