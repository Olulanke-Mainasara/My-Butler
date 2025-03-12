import { useUserProfile } from "@/components/Providers/AllProviders";
import React from "react";

const Select = () => {
  const userProfile = useUserProfile();
  const [section, setSection] = React.useState(
    userProfile?.role_id === 2 ? "saved" : "products"
  );

  const options = [
    userProfile?.role_id === 2
      ? { label: "Saved", link: "/saved" }
      : { label: "Products", link: "/products" },
    { label: "Following", link: "/following" },
    userProfile?.role_id === 2
      ? {
          label: "Orders",
          link: "/orders",
        }
      : { label: "Followers", link: "/followers" },
  ];

  return (
    <>
      <div className="overflow-x-hidden flex justify-between px-4">
        {options.map((option) => (
          <button
            key={option.label}
            onClick={() => setSection(option.link)}
            className={`px-4 py-4 ${
              section === option.link
                ? "border-b border-b-black dark:border-b-white"
                : ""
            } w-full`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {section === "saved" ? (
        <div className="min-h-screen bg-darkBackground dark:bg-lightBackground"></div>
      ) : (
        <div className="min-h-screen bg-darkBackground dark:bg-lightBackground"></div>
      )}
    </>
  );
};

export default Select;
