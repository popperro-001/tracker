"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";

import { ExtendedUserType } from "@/app/api/auth/[...nextauth]/route";
import Greeting from "@/components/shared/Greeting";
import PageHeader from "@/components/shared/PageHeader";
import TodoInterface from "@/lib/types/todo.type";
import AddTaskCard from "@/components/cards/AddTaskCard";
import PlanForm from "@/components/forms/PlanForm";
import Loader from "@/components/shared/Loader";

const CreatePlan = () => {
  const router = useRouter();
  const { data: session } = useSession();
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
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<{ title: string; weekdays: Array<string> }>({
    title: "",
    weekdays: [],
  });

  useEffect(() => {
    if (session?.user) {
      (async () => {
        setIsLoading(true);
        const response = await fetch(
          `/api/user/${(session.user as ExtendedUserType).id}/todos`
        );

        const data = await response.json();
        if (data.length > 0) {
          const uniqueArray = Array.from(
            new Set(data.map((item: any) => item.category))
          ).map((category) => ({
            value: category as string,
            label: category as string,
          }));

          setCategoryPicklist(uniqueArray);
        }

        setTodosList(data);
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
          list = todosList.filter((item) => item.category === filterValue).filter((elem) => {
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

  if (!session?.user) return <Greeting />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const response = await fetch(
      `/api/user/${(session.user as ExtendedUserType).id}/plans`,
      {
        method: "POST",
        body: JSON.stringify({
          title: plan.title,
          weekdays: plan.weekdays,
          owner: (session.user as ExtendedUserType).id,
          selectedTodos: selectedTodos,
        }),
      }
    );

    if (response.ok) {
      router.push("/plan");
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <section className="page-container">
      <PageHeader label="New Workout Plan" type="green" />

      <div className="flex max-sm:justify-between justify-start items-start gap-4 max-sm:flex-col max-sm:items-stretch">
        <PlanForm
          type="Create"
          plan={plan}
          setPlan={setPlan}
          submitting={submitting}
          handleSubmit={handleSubmit}
        />

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

      {isLoading && <Loader type="circles" />}

      <div className="mt-6 grid grid-cols-3 gap-2 max-sm:grid-cols-2 max-xs:grid-cols-1">
        {filteredTodoList.map((todo) => (
          <AddTaskCard
            key={todo._id}
            id={todo?._id || ""}
            category={todo.category}
            title={todo.name}
            selectedTodos={selectedTodos}
            setSelectedTodos={setSelectedTodos}
            isAdded={selectedTodos.some(item => item.todoId === todo._id)}
          />
        ))}
      </div>
    </section>
  );
};

export default CreatePlan;
