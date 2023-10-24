"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import PageHeader from "@/components/shared/PageHeader";
import { ExtendedUserType } from "../api/auth/[...nextauth]/route";
import PlanInterface from "@/lib/types/plan.type";
import PlanCard from "@/components/cards/PlanCard";
import Loader from "@/components/shared/Loader";
import Greeting from "@/components/shared/Greeting";

const Plan = () => {
  const { data: session } = useSession();
  const [planList, setPlanList] = useState<Array<PlanInterface>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      (async () => {
        setIsLoading(true);
        const response = await fetch(
          `/api/user/${(session?.user as ExtendedUserType).id}/plans`
        );
        const data = await response.json();

        setPlanList(data);
        setIsLoading(false);
      })();
    }
  }, []);

  if (!session?.user) return <Greeting />;

  return (
    <section className="page-container">
      <PageHeader label="Workout Plan" />

      <Link
        href="/plan/new"
        className="px-5 py-2 text-sm bg-primary-orange rounded-full text-white hover:bg-white hover:text-primary-orange"
      >
        Add New
      </Link>

      {isLoading && <Loader type="circles" />}

      <div className="columns-3 max-[1440px]:columns-2 max-sm:columns-1 gap-4 space-y-4 mt-8">
        {planList.length > 0 &&
          planList.map((plan) => (
            <PlanCard
              key={plan._id}
              type="plan"
              id={plan._id || ""}
              ownerId={(session?.user as ExtendedUserType).id}
              title={plan.title}
              weekdays={plan.weekdays}
              tasks={plan.tasks}
            />
          ))}
      </div>
    </section>
  );
};

export default Plan;
