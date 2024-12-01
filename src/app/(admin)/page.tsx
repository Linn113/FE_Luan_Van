import React, { useState } from "react";
import {
  FaBars,
  FaBell,
  FaSearch,
  FaUser,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChartLine,
  FaClipboardList,
  FaTasks,
} from "react-icons/fa";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("analytics");
  const [lineChart, setLineChart] = useState<any>([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };

  const notifications = [
    { id: 1, message: "New user registered", read: false },
    { id: 2, message: "New order received", read: false },
    { id: 3, message: "Server update completed", read: true },
  ];

  const tasks = [
    { id: 1, title: "Review new applicants", priority: "high" },
    { id: 2, title: "Update product descriptions", priority: "medium" },
    { id: 3, title: "Prepare monthly report", priority: "low" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <nav>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md md:hidden"
            >
              <FaBars />
            </button>
          </div>
          <div className="mt-8">
            <div className="flex items-center px-4 py-2 mt-5 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">
              <FaSearch className="mr-3" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent focus:outline-none"
              />
            </div>
            <a
              href="#"
              className="flex items-center px-4 py-2 mt-5 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            >
              <FaChartLine className="mr-3" />
              <span>Analytics</span>
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 mt-5 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            >
              <FaBell className="mr-3" />
              <span>Thông báo</span>
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 mt-5 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            >
              <FaTasks className="mr-3" />
              <span>Tasks</span>
            </a>
          </div>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Menu */}
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-indigo-600">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none lg:hidden"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center">
            <button className="flex mx-4 text-gray-600 focus:outline-none">
              <FaBell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-3 w-3 mt-1 mr-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button className="relative z-10 block h-8 w-8 rounded-full overflow-hidden focus:outline-none">
                <img
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Your avatar"
                />
              </button>

              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                >
                  <FaUser className="inline-block mr-2" /> Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                >
                  <FaCog className="inline-block mr-2" /> Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                >
                  <FaQuestionCircle className="inline-block mr-2" /> Help
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white"
                >
                  <FaSignOutAlt className="inline-block mr-2" /> Sign out
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>

            <div className="mt-8">
              <div className="flex flex-wrap -mx-6">
                {/* Analytics Panel */}
                <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                  <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                    <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                      <FaChartLine className="h-8 w-8 text-white" />
                    </div>

                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700">
                        8,282
                      </h4>
                      <div className="text-gray-500">New Visits</div>
                    </div>
                  </div>
                </div>

                {/* Notifications Panel */}
                <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                  <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                    <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                      <FaBell className="h-8 w-8 text-white" />
                    </div>

                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700">
                        {notifications.filter((n) => !n.read).length}
                      </h4>
                      <div className="text-gray-500">New Notifications</div>
                    </div>
                  </div>
                </div>

                {/* Quick Tasks Panel */}
                <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
                  <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                    <div className="p-3 rounded-full bg-pink-600 bg-opacity-75">
                      <FaClipboardList className="h-8 w-8 text-white" />
                    </div>

                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700">
                        {tasks.length}
                      </h4>
                      <div className="text-gray-500">Pending Tasks</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {/* Detailed Panels */}
              <div className="flex flex-col mt-8">
                <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                  <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                    {activePanel === "analytics" && (
                      <div className="bg-white p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Analytics Overview
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                              Sales Trend
                            </h3>
                            <Line data={lineChartData} />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                              Product Popularity
                            </h3>
                            <Bar data={barChartData} />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                              Revenue Distribution
                            </h3>
                            <Pie data={pieChartData} />
                          </div>
                        </div>
                      </div>
                    )}

                    {activePanel === "notifications" && (
                      <div className="bg-white p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Thông báo
                        </h2>
                        <ul className="divide-y divide-gray-200">
                          {notifications.map((notification) => (
                            <li
                              key={notification.id}
                              className="py-4 flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <span
                                  className={`h-2 w-2 rounded-full mr-2 ${
                                    notification.read
                                      ? "bg-gray-300"
                                      : "bg-blue-500"
                                  }`}
                                ></span>
                                <p
                                  className={`${
                                    notification.read
                                      ? "text-gray-500"
                                      : "text-gray-700 font-medium"
                                  }`}
                                >
                                  {notification.message}
                                </p>
                              </div>
                              <button className="text-sm text-indigo-600 hover:text-indigo-900">
                                Mark as read
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activePanel === "tasks" && (
                      <div className="bg-white p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                          Quick Tasks
                        </h2>
                        <ul className="divide-y divide-gray-200">
                          {tasks.map((task) => (
                            <li
                              key={task.id}
                              className="py-4 flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    task.priority === "high"
                                      ? "bg-red-100 text-red-800"
                                      : task.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {task.priority}
                                </span>
                                <p className="ml-3 text-sm font-medium text-gray-900">
                                  {task.title}
                                </p>
                              </div>
                              <button className="ml-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Complete
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
