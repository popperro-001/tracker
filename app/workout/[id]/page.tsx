"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import TaskCard from "@/components/cards/TaskCard";
import WorkoutForm from "@/components/forms/WorkoutForm";
import Loader from "@/components/shared/Loader";
import PageHeader from "@/components/shared/PageHeader";

const EditWorkout = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [workout, setWorkout] = useState<{ date: string; bodyweight: number }>({
    date: "",
    bodyweight: 0,
  });
  const [taskList, setTaskList] = useState<
    Array<{
      _id: string;
      todo: { name: string };
      actual: boolean;
      sets: Array<{ reps: number; weight: number; _id: string }>;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user) {
      (async () => {
        setIsLoading(true);

        const workoutResponse = await fetch(`/api/workout/${params.id}`);
        const workoutData = await workoutResponse.json();
        setWorkout({
          date: workoutData.date,
          bodyweight: workoutData.bodyweight,
        });
        setTaskList(workoutData.tasks);

        // console.log(workoutData);
        setIsLoading(false);
      })();
    }
  }, []);

  const handleWorkoutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    await fetch(`/api/workout/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        date: workout.date,
        bodyweight: workout.bodyweight,
      }),
    });

    setSubmitting(false);
  };

  const handleWorkoutDelete = async () => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      setSubmitting(true);

      const response = await fetch(`/api/workout/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/workout");
      }
    } else {
      setSubmitting(false);
      return;
    }
  };

  const handleTaskSubmit = async (id: string) => {
    const updatedTask = taskList.find((task) => task._id === id);
    if (updatedTask) {
      const response = await fetch(`/api/task/${updatedTask._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          sets: updatedTask.sets,
        }),
      });

      if (response.ok) {
        const taskData = await response.json();
        const updatedTaskList = taskList.map((task) => {
          if (task._id === taskData._id) {
            return taskData;
          } else {
            return task;
          }
        });

        setTaskList(updatedTaskList);
      }
    }
  };

  return (
    <section className="page-container">
      <PageHeader label="Edit Workout" type="green" />

      <div>
        <WorkoutForm
          workout={workout}
          setWorkout={setWorkout}
          submitting={submitting}
          handleSubmit={handleWorkoutSubmit}
          handleDelete={handleWorkoutDelete}
        />
      </div>

      {isLoading && <Loader type="circles" />}

      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-2 mt-8">
        {taskList.length > 0 &&
          taskList.map((task) => (
            <TaskCard
              key={task._id}
              id={task._id}
              label={task.todo.name}
              actual={task.actual}
              sets={JSON.parse(JSON.stringify(task.sets))}
              handleSubmit={() => handleTaskSubmit(task._id)}
              taskList={taskList}
              setTaskList={setTaskList}
            />
          ))}
      </div>
    </section>
  );
};

export default EditWorkout;
