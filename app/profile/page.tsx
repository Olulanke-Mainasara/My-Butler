"use client";

import { useUserProfile } from "@/components/Providers/AllProviders";
import { Calendar, Factory, Link2, Map, PenBox, User } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React from "react";
import Select from "./select";
import { format } from "date-fns";

const Profile = () => {
  const userProfile = useUserProfile();

  return (
    <div className="pt-16 md:pt-14 xl:flex h-screen overflow-scroll xl:px-4 gap-4">
      <div className="basis-1/5 border hidden xl:block"></div>
      <div className="basis-3/5">
        <div className="h-44 lg:h-56 bg-darkBackground dark:bg-lightBackground relative w-full">
          {userProfile?.profile_picture ? (
            <Image
              src={userProfile?.profile_picture}
              alt="profile picture"
              className="w-32 h-32 lg:w-32 lg:h-32 rounded-full absolute left-1/2 md:left-4 bottom-0 translate-y-1/2 -translate-x-1/2 md:-translate-x-0"
              width={40}
              height={40}
            />
          ) : (
            <div>
              <User />
            </div>
          )}
          <Link
            href={"/settings"}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white bg-lightBackground text-black dark:bg-darkBackground dark:text-white hover:bg-transparent hover:text-white absolute top-4 right-4"
          >
            <PenBox className="size-5" />
          </Link>
        </div>
        <div className="p-3 pt-20">
          <div className="space-y-3">
            <h1 className="text-3xl text-center md:text-left">
              {userProfile?.display_name}
            </h1>
            {userProfile?.bio && (
              <p className="text-center md:text-left max-w-lg">
                {userProfile?.bio}
              </p>
            )}

            <div className="grid grid-cols-2 lg:flex justify-between gap-3 gap-x-0 lg:gap-x-3">
              {userProfile?.category && (
                <p className="flex items-center gap-2 justify-center md:justify-start">
                  <Factory className="size-5 lg:size-6" />{" "}
                  {userProfile?.category}
                </p>
              )}

              {userProfile?.location && (
                <p className="flex items-center gap-2 justify-center md:justify-start">
                  <Map className="size-5 lg:size-6" />
                  {userProfile?.location}
                </p>
              )}

              {userProfile?.url && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Link2 className="size-5 lg:size-6" />
                  <Link href={`${userProfile?.url}`} className="w-3/4 truncate">
                    {userProfile?.url}
                  </Link>
                </div>
              )}

              {userProfile?.date_of_birth && (
                <div>
                  <p className="flex items-center gap-2 justify-center md:justify-start">
                    <Calendar className="size-5 lg:size-6" />
                    {format(userProfile.date_of_birth, "MMMM dd, yyyy")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <Select />
      </div>
      <div className="basis-1/5 border hidden xl:block"></div>
    </div>
  );
};

export default Profile;
