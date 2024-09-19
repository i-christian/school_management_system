import { Component } from "solid-js";
import { useAuth } from "../context/UserContext";
import { useNavigate } from "@solidjs/router";
// import Dashboard from "../components/dashboard/Dashboard";

const DashboardPage: Component = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    const navigate = useNavigate();
    navigate("/login");
    return null;
  }

  return (
    <>
      <p>a dashboard will be here </p>
    </>
  );
};

export default DashboardPage;
