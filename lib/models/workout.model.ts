import { Schema, model, models } from "mongoose";

const WorkoutSchema = new Schema(
  {
    actual: Boolean,
    bodyweight: Number,
    date: Date,
    title: String,
    weekdays: {
      type: [String],
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Workout = models.Workout || model("Workout", WorkoutSchema);

export default Workout;
