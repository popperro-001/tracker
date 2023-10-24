import { NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoose";
import Todo from "@/lib/models/todo.model";
import User from "@/lib/models/user.model";

interface Params {
  params: { id: string };
}

export const GET = async (req: Request, { params }: Params) => {
  try {
    await connectToDB();

    const todos = await Todo.find({ owner: params.id });

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch todos", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  const { type, category, name, owner } = await req.json();
  try {
    await connectToDB();

    const createdTodo = await Todo.create({
      type,
      category,
      name,
      owner,
    });

    await User.findByIdAndUpdate(owner, {
      $push: { todos: createdTodo._id },
    });

    return NextResponse.json(createdTodo, { status: 201 });
  } catch (error) {
    return new Response("Failed to create todo", { status: 500 });
  }
};
