"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Select from "react-select";

import Greeting from "@/components/shared/Greeting";
import PageHeader from "@/components/shared/PageHeader";
import { ExtendedUserType } from "../api/auth/[...nextauth]/route";
import TodoForm from "@/components/forms/TodoForm";
import TodoInterface from "@/lib/types/todo.type";
import TodoCard from "@/components/cards/TodoCard";
import Loader from "@/components/shared/Loader";

const Library = () => {
  const { data: session } = useSession();
  const userId =
    (session?.user && (session?.user as ExtendedUserType).id) || "";
  const [todosList, setTodosList] = useState<Array<TodoInterface>>([]);
  const [categoryPicklist, setCategoryPicklist] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [filteredTodoList, setFilteredTodoList] = useState<
    Array<TodoInterface>
  >([]);
  const [filterValue, setFilterValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [todo, setTodo] = useState({
    type: "workout",
    category: "",
    name: "",
  });

  useEffect(() => {
    if (userId) {
      (async () => {
        setIsLoading(true);
        const response = await fetch(`/api/user/${userId}/todos`);

        const data = await response.json();
        if (data.length > 0) {
          const uniqueArray = Array.from(
            new Set(data.map((item: any) => item.category))
          )
            .map((category) => ({
              value: category as string,
              label: category as string,
            }))
            .sort((a, b) => (a.value > b.value ? 1 : -1));

          setCategoryPicklist(uniqueArray);
        }

        setTodosList(data);
        setIsLoading(false);
      })();
    }
  }, []);

  useEffect(() => {
    if (filterValue) {
      const list = todosList.filter((item) => item.category === filterValue);
      setFilteredTodoList(list);
    } else {
      setFilteredTodoList(todosList);
    }
  }, [todosList, filterValue]);

  if (!session?.user) return <Greeting />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const response = await fetch(`/api/user/${userId}/todos`, {
      method: "POST",
      body: JSON.stringify({
        type: todo.type,
        category: todo.category,
        name: todo.name,
        owner: userId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setTodosList([...todosList, data]);

      const doesExist = categoryPicklist.some(
        (item) => item.value === data.category
      );
      if (!doesExist) {
        const uniqueArray = [
          ...categoryPicklist,
          { value: data.category, label: data.category },
        ].sort((a, b) => (a.value > b.value ? 1 : -1));

        setCategoryPicklist(uniqueArray);
      }

      setSubmitting(false);
      setTodo({
        type: "workout",
        category: "",
        name: "",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      const response = await fetch(`/api/todo/${id}`, {
        method: "DELETE",
      });

      if (response.status === 409) {
        // Convert the response body to a string
        const errorMessage = await response.text();
        window.alert(errorMessage);
        return;
      }

      if (response.ok) {
        const updatedList = todosList.filter((item) => item._id !== id);
        setTodosList(updatedList);

        if (updatedList.length > 0) {
          const uniqueArray = Array.from(
            new Set(updatedList.map((item: any) => item.category))
          )
            .map((category) => ({
              value: category as string,
              label: category as string,
            }))
            .sort((a, b) => (a.value > b.value ? 1 : -1));

          setCategoryPicklist(uniqueArray);
        }
      }
    } else return;
  };

  return (
    <section className="page-container">
      <PageHeader label="Library" />

      <div className="flex max-sm:justify-between justify-start items-start gap-4 max-sm:flex-col max-sm:items-stretch">
        <TodoForm
          type="Create"
          todo={todo}
          setTodo={setTodo}
          picklist={categoryPicklist}
          submitting={submitting}
          handleSubmit={handleSubmit}
        />
        <div className="basis-1/3 glassmorphism max-sm:flex-1 z-10">
          <label>
            <span className="font-semibold text-base text-gray-700">
              Filter todos by category
            </span>

            <Select
              options={categoryPicklist}
              isClearable
              isSearchable
              onChange={(value) => setFilterValue(value?.value || "")}
              className="mt-2"
            />
          </label>
        </div>
      </div>

      {isLoading && <Loader type="circles" />}

      <div className="mt-6 grid grid-cols-4 gap-2 max-sm:grid-cols-2 max-xs:grid-cols-1 max-md:grid-cols-3">
        {filteredTodoList.map((todo) => (
          <TodoCard
            key={todo._id}
            category={todo.category}
            title={todo.name}
            handleDelete={() => handleDelete(todo?._id || "")}
          />
        ))}
      </div>
    </section>
  );
};

export default Library;
