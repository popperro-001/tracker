import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    todo: {
      type: Schema.Types.ObjectId,
      ref: "Todo",
      required: true,
    },
    sets: [
      {
        weight: Number,
        reps: Number,
      },
    ],
    actual: Boolean,
    workout: {
      type: Schema.Types.ObjectId,
      ref: "Workout",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Task = models.Task || model("Task", TaskSchema);

export default Task;
