import React from "react";

const Greeting = () => {
  return (
    <section className="w-full flex-center flex-col py-20 px-10 max-xs:p-2">
      <h1 className="text-center text-7xl font-bold leading-[6rem] max-xs:text-5xl">
        Set Goals & Complete with
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center">
          {" "}
          Laziness-Powered Application
        </span>
      </h1>
      <br />
      <p className="text-center text-xl font-semibold px-36 leading-[3rem] max-xs:p-2">
        <span className="text-2xl font-bold blue_gradient">PlanItTrack</span> is a to-do setting and tracking tool for the modern world, designed to help you plan, monitor, and analyze your daily routine. Get started by signing in...
      </p>
    </section>
  );
};

export default Greeting;
