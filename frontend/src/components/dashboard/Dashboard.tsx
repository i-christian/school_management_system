import { Component } from "solid-js";

const Dashboard: Component = () => {
  return (
    <main class="flex h-screen bg-inherit">
      {/* Main Content */}
      <div class="flex-1 p-6">
        <header class="flex justify-between items-center mb-6 dark:border-b dark:border-slate-400 border-b border-slate-900">
          <input
            type="text"
            class="bg-gray-200 text-slate-800 p-2 rounded-lg dark:border dark:border-slate-400 border border-slate-900"
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
        </header>

        {/* Dashboard Cards */}
        <div class="grid grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-lg shadow dark:border dark:border-slate-400 border border-slate-900">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl text-slate-900 font-semibold">Teachers</span>
              <span class="material-icons">🏫</span>
            </div>
            <div class="text-2xl text-slate-900 font-bold">
              F: 10 M: 20 T: 30
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow dark:border dark:border-slate-400 border border-slate-900">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl text-slate-900 font-semibold">Students</span>
              <span class="material-icons">👩‍🎓</span>
            </div>
            <div class="text-1xl text-slate-900 font-bold">
              R: 200 U: 100 T: 300
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow dark:border dark:border-slate-400 border border-slate-900">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl text-slate-900 font-semibold">
                Time Table
              </span>
              <span class="material-icons">⏲️</span>
            </div>
            <div class="text-2xl text-slate-900 font-bold">Teaching Dining</div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow dark:border dark:border-slate-400 border border-slate-900">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl text-slate-900 font-semibold">
                Notifications
              </span>
              <span class="material-icons">🔔</span>
            </div>
            <div class="text-3xl text-slate-900 font-bold">Meeting at 2</div>
          </div>
        </div>

        {/* Graph Section */}
        <div class="grid grid-cols-3 gap-6 mt-6">
          <div class="col-span-2 bg-white p-6 rounded-lg shadow dark:border dark:border-slate-400 border border-slate-900">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl text-slate-900 font-semibold">
                Results Summary
              </span>
            </div>
            {/* Placeholder for a graph */}
            <div class="bg-gray-100 h-40 rounded-lg"></div>
          </div>
          <div class="bg-white p-6 rounded-lg shadow dark:border dark:border-slate-400 border border-slate-900">
            <div class="flex justify-between items-center mb-4">
              <span class="text-xl text-slate-900 font-semibold">
                Calendar of Events
              </span>
            </div>
            {/* Placeholder for a log */}
            <div class="bg-gray-100 h-40 rounded-lg"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
