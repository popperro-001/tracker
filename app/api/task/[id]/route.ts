import { connectToDB } from "@/lib/mongoose";

import Task from "@/lib/models/task.model";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export const PATCH = async (req: Request, { params }: Params) => {
  try {
    const { sets } = await req.json();
    await connectToDB();

    //get existing task
    const task = await Task.findById(params.id).populate({
      path: "todo",
      select: "category name",
    });
    if (!task) return new Response("Todo not found", { status: 404 });

    task.sets = sets;
    task.actual = true;

    await task.save();

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return new Response("Failed to update task", { status: 500 });
  }
};
