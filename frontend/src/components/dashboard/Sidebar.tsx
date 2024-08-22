import type { Component } from "solid-js";

const Sidebar: Component<{}> = () => {
  return (
    <div class="w-64 bg-blue-900 text-white p-6">
      <div class="flex items-center mb-6">
        <span class="text-2xl font-bold">Dashboard</span>
      </div>
      <nav>
        <ul>
          <li class="mb-4">
            <a href="#" class="flex items-center p-2 rounded hover:bg-blue-700">
              <span class="material-icons">home</span>
              <span class="ml-2">Dashboard</span>
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center p-2 rounded hover:bg-blue-700">
              <span class="material-icons">person</span>
              <span class="ml-2">Students</span>
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center p-2 rounded hover:bg-blue-700">
              <span class="material-icons">school</span>
              <span class="ml-2">Teachers</span>
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center p-2 rounded hover:bg-blue-700">
              <span class="material-icons">report</span>
              <span class="ml-2">Reports</span>
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center p-2 rounded hover:bg-blue-700">
              <span class="material-icons">settings</span>
              <span class="ml-2">Settings</span>
            </a>
          </li>
          <li class="mb-4">
            <a href="#" class="flex items-center p-2 rounded hover:bg-blue-700">
              <span class="material-icons">logout</span>
              <span class="ml-2">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
