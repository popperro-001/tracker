'use client'
import { useSession } from "next-auth/react";

import Greeting from "@/components/shared/Greeting";

export default function Home() {
  const {data: session} = useSession();

  if(!session?.user) return <Greeting />;

  return (
    <section>
      <h1>Hello World</h1>
    </section>
  );
}
