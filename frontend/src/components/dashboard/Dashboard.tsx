import { Component } from "solid-js";
import Sidebar from "./Sidebar";

const Dashboard: Component = () => {
  return (
    <div class="flex h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <div class="flex-1 p-6">
        {/* Header */}
        <div class="flex justify-between items-center mb-6">
          <input
            type="text"
            class="bg-gray-200 p-2 rounded-lg"
            placeholder="Search..."
          />
          <div class="flex items-center space-x-4">
            <span class="material-icons">notifications</span>
            <img
              src="https://via.placeholder.com/40"
              alt="User avatar"
              class="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        {/* Dashboard Cards */}
        <div class="grid grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl font-semibold">Dashboard</span>
              <span class="material-icons">star</span>
            </div>
            <div class="text-3xl font-bold">$12,94</div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl font-semibold">Tesiciter</span>
              <span class="material-icons">star</span>
            </div>
            <div class="text-3xl font-bold">$259</div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl font-semibold">Logicale</span>
              <span class="material-icons">more_vert</span>
            </div>
            <div class="text-3xl font-bold">3084</div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl font-semibold">Notifications</span>
              <span class="material-icons">notifications</span>
            </div>
            <div class="text-3xl font-bold">MC</div>
          </div>
        </div>

        {/* Graph Section */}
        <div class="grid grid-cols-3 gap-6 mt-6">
          <div class="col-span-2 bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl font-semibold">Graph</span>
            </div>
            {/* Placeholder for a graph */}
            <div class="bg-gray-100 h-40 rounded-lg"></div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl font-semibold">Log</span>
            </div>
            {/* Placeholder for a log */}
            <div class="bg-gray-100 h-40 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
