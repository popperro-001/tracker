import { NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoose";
import Todo from "@/lib/models/todo.model";
import User from "@/lib/models/user.model";
import Task from "@/lib/models/task.model";

interface Params {
  params: { id: string };
}

export const DELETE = async (req: Request, { params }: Params) => {
  try {
    await connectToDB();

    const todoToDelete = await Todo.findById(params.id);

    if (!todoToDelete) return new Response("Todo not found", { status: 404 });

    const relatedTask = await Task.findOne({todo: todoToDelete._id});

    if(relatedTask) return new Response("Can not delete todo. Todo has related tasks", {status: 409});

    await User.findByIdAndUpdate(todoToDelete.owner, {
      $pull: { todos: params.id },
    });

    await Todo.findByIdAndRemove(params.id);

    return NextResponse.json("Todo deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete todo", { status: 500 });
  }
};