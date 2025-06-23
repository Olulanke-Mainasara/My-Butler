import React from "react";
import DashboardPage from "./dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Butler | Dashboard",
  description: "Example dashboard app built using the components.",
};

const Dashboard = () => {
  return <DashboardPage />;
};

export default Dashboard;
