import React from "react";

const Notifications = () => {
  return (
    <div className="pt-16 md:pt-12 flex flex-col h-full">
      <h1 className="px-3 text-4xl">Notifications</h1>

      <hr className="mx-4 xl:mx-3 mt-8" />

      <section className="px-4 xl:px-3 h-full">
        {Array.from({ length: 15 }).map((_, index) => (
          <div key={index} className="border-b p-8"></div>
        ))}
      </section>
    </div>
  );
};

export default Notifications;
