"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";

import { ExtendedUserType } from "@/app/api/auth/[...nextauth]/route";
import PageHeader from "@/components/shared/PageHeader";
import PlanInterface from "@/lib/types/plan.type";
import Loader from "@/components/shared/Loader";
import { getWeekdayFromDate } from "@/lib/utils";
import PlanCard from "@/components/cards/PlanCard";
import TodoInterface from "@/lib/types/todo.type";
import AddTaskCard from "@/components/cards/AddTaskCard";

const CreateWorkout = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("scheduled");
  const [planList, setPlanList] = useState<Array<PlanInterface>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [todosList, setTodosList] = useState<Array<TodoInterface>>([]);
  const [categoryPicklist, setCategoryPicklist] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [filteredTodoList, setFilteredTodoList] = useState<
    Array<TodoInterface>
  >([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("all");
  const [selectedTodos, setSelectedTodos] = useState<
    Array<{ todoId: string; sets: number }>
  >([]);
  const [submitting, setSubmitting] = useState(false);


  const currentDate = new Date();
  const formattedWeekDay = getWeekdayFromDate(currentDate.toISOString());

  useEffect(() => {
    if (session?.user) {
      (async () => {
        setIsLoading(true);
        const planResponse = await fetch(
          `/api/user/${(session?.user as ExtendedUserType).id}/plans`
        );
        const planData = await planResponse.json();

        setPlanList(planData);

        const todoResponse = await fetch(
          `/api/user/${(session.user as ExtendedUserType).id}/todos`
        );

        const todoData = await todoResponse.json();
        if (todoData.length > 0) {
          const uniqueArray = Array.from(
            new Set(todoData.map((item: any) => item.category))
          ).map((category) => ({
            value: category as string,
            label: category as string,
          }));

          setCategoryPicklist(uniqueArray);
        }

        setTodosList(todoData);
        setIsLoading(false);
      })();
    }
  }, []);

  useEffect(() => {
    let list;

    switch (selectedOption) {
      case "all":
        if (filterValue) {
          list = todosList.filter((item) => item.category === filterValue);
        } else {
          list = todosList;
        }
        break;
      case "selected":
        if (filterValue) {
          list = todosList
            .filter((item) => item.category === filterValue)
            .filter((elem) => {
              return selectedTodos.some((item) => item.todoId === elem._id);
            });
        } else {
          list = todosList.filter((elem) => {
            return selectedTodos.some((item) => item.todoId === elem._id);
          });
        }
        break;
      default:
        if (filterValue) {
          list = todosList
            .filter((item) => item.category === filterValue)
            .filter((elem) => {
              return !selectedTodos.some((item) => item.todoId === elem._id);
            });
        } else {
          list = todosList.filter((elem) => {
            return !selectedTodos.some((item) => item.todoId === elem._id);
          });
        }
    }

    setFilteredTodoList(list);
  }, [todosList, filterValue, selectedOption, selectedTodos]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleTabSwitch = (value: string) => {
    setActiveTab(value);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const response = await fetch(
      `/api/user/${(session?.user as ExtendedUserType).id}/workouts`,
      {
        method: "POST",
        body: JSON.stringify({
          type: "free",
          selectedTodos,
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      router.push(`/workout/${data._id}`);
    }
    setSubmitting(false);
  };

  return (
    <section className="page-container">
      <PageHeader label="New Workout" type="green" />
      <div>
        <ul className="max-w-xl flex-start">
          <li
            className={`${
              activeTab === "scheduled"
                ? "bg-secondary-orange"
                : "bg-white/20 text-gray-500"
            } tab border-l-2 rounded-l-md`}
          >
            <button onClick={() => handleTabSwitch("scheduled")}>
              Scheduled
            </button>
          </li>
          <li
            className={`${
              activeTab === "from_list"
                ? "bg-secondary-orange"
                : "bg-white/20 text-gray-500"
            } tab border-l-2 border-r-2`}
          >
            <button onClick={() => handleTabSwitch("from_list")}>
              From list
            </button>
          </li>
          <li
            className={`${
              activeTab === "free_training"
                ? "bg-secondary-orange"
                : "bg-white/20 text-gray-500"
            } tab border-r-2 rounded-r-md`}
          >
            <button onClick={() => handleTabSwitch("free_training")}>
              Free training
            </button>
          </li>
        </ul>
      </div>

      {isLoading && <Loader type="circles" />}

      {activeTab === "scheduled" && (
        <div className="max-w-3xl grid grid-cols-1 gap-3 mt-4">
          {planList
            .filter((plan) =>
              plan.weekdays.some((day) => day === formattedWeekDay)
            )
            .map((plan) => (
              <PlanCard
                key={plan._id}
                type="workout"
                id={plan._id || ""}
                ownerId={(session?.user as ExtendedUserType).id}
                title={plan.title}
                weekdays={plan.weekdays}
                tasks={plan.tasks}
              />
            ))}
        </div>
      )}

      {activeTab === "from_list" && (
        <div className="max-w-3xl grid grid-cols-1 gap-3 mt-4">
          {planList.map((plan) => (
            <PlanCard
              key={plan._id}
              type="workout"
              id={plan._id || ""}
              ownerId={(session?.user as ExtendedUserType).id}
              title={plan.title}
              weekdays={plan.weekdays}
              tasks={plan.tasks}
            />
          ))}
        </div>
      )}

      {activeTab === "free_training" && (
        <div className="mt-4">
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="px-5 py-1 text-sm bg-primary-orange rounded-full text-white hover:bg-white hover:text-primary-orange"
          >
            {submitting ? 'Starting...' : 'Get started!'}
          </button>

          <div className="flex max-sm:justify-between justify-start items-start gap-4 max-sm:flex-col max-sm:items-stretch mt-4">
            <div className="basis-1/3 glassmorphism max-sm:flex-1 z-10">
              <label>
                <span className="font-semibold text-base text-gray-700">
                  Filter to-dos by category
                </span>

                <Select
                  options={categoryPicklist}
                  isClearable
                  isSearchable
                  onChange={(value) => setFilterValue(value?.value || "")}
                  className="mt-2"
                />
              </label>

              <div className="flex-between max-md:flex-col max-md:items-start gap-2 mt-4 outline-0 border-2 border-gray-300 rounded bg-white p-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="all"
                    checked={selectedOption === "all"}
                    onChange={handleOptionChange}
                    className="form-radio text-indigo-600 h-4 w-4"
                  />
                  <span className="ml-2 text-sm">All</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="selected"
                    checked={selectedOption === "selected"}
                    onChange={handleOptionChange}
                    className="form-radio text-indigo-600 h-4 w-4"
                  />
                  <span className="ml-2 text-sm">Selected</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="not_selected"
                    checked={selectedOption === "not_selected"}
                    onChange={handleOptionChange}
                    className="form-radio text-indigo-600 h-4 w-4"
                  />
                  <span className="ml-2 text-sm">Not selected</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 max-sm:grid-cols-2 max-xs:grid-cols-1">
            {filteredTodoList.map((todo) => (
              <AddTaskCard
                key={todo._id}
                id={todo?._id || ""}
                category={todo.category}
                title={todo.name}
                selectedTodos={selectedTodos}
                setSelectedTodos={setSelectedTodos}
                isAdded={selectedTodos.some((item) => item.todoId === todo._id)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CreateWorkout;
