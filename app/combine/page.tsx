import { Button } from "@/components/Shad-UI/button";
import { Brain, User } from "lucide-react";
import { Link } from "next-view-transitions";
import React from "react";

const page = () => {
  return (
    <main className="flex flex-col xl:flex-row h-screen bg-background">
      <section className="xl:w-1/2 h-full flex items-center justify-center bg-white dark:bg-background xl:bg-background xl:dark:bg-white text-black dark:text-white xl:text-white xl:dark:text-black p-8 xl:opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-full max-w-xl space-y-4 flex flex-col items-start">
          <User size={80} />
          <p className="text-2xl md:text-4xl font-bold">
            Use our default 3d model
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem,
            corrupti, quia omnis nam possimus quas quisquam asperiores dolorum
            vitae fuga quos eos? Enim blanditiis non autem a ratione asperiores
            vitae.
          </p>
          <Button
            variant={"secondary"}
            asChild
            className="bg-background dark:bg-white text-white dark:text-black hover:bg-background/50 dark:hover:bg-white/50 xl:invert xl:dark:invert"
          >
            <Link href={"#"}>Use this</Link>
          </Button>
        </div>
      </section>
      <section className="xl:w-1/2 h-full flex items-center justify-center p-8 bg-background dark:bg-white xl:bg-white xl:dark:bg-background text-white dark:text-black xl:text-black xl:dark:text-white xl:opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-full max-w-xl text-right space-y-4 flex flex-col items-end">
          <Brain size={80} />
          <p className="text-2xl md:text-4xl font-bold">
            Use your personal 3d model
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem,
            corrupti, quia omnis nam possimus quas quisquam asperiores dolorum
            vitae fuga quos eos? Enim blanditiis non autem a ratione asperiores
            vitae.
          </p>
          <Button
            asChild
            className="bg-white dark:bg-background text-black dark:text-white hover:bg-white/50 dark:hover:bg-neutral-900/50 xl:invert xl:dark:invert"
          >
            <Link href={"#"}>Use this</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default page;
