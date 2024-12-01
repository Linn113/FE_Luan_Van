"use client";

import React, { useEffect, useState } from "react";
import {
  FaChartBar,
  FaBell,
  FaTasks,
  FaSearch,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import axiosClient from "@/lib/axios-client";
import { formatVietnamCurrency } from "@/components/ProductCard";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pieChartData, setPieChartData] = useState<any>();
  const [lineChartData, setLineChartData] = useState<any>();
  const [notifications, setNotifications] = useState<any>();
  const [selling, setSelling] = useState<any>();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    (async () => {
      let res:any;
      if (date?.from && date?.to) {
        res = await axiosClient.get(`/order/static?from=${date?.from}&to=${date?.to}`);
      } else {
        res = await axiosClient.get("/order/static");
      }

      if (res) {
        setPieChartData(res.pie);
        setNotifications(res.notification);
        setLineChartData(res.line);
        setSelling(res.topSelling);
      }
    })();
  }, [date]);

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Analytics Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Phân tích đơn hàng:</h2>
          <div className="mb-4">
            {lineChartData && (
              <Line data={lineChartData} options={{ responsive: true }} />
            )}
          </div>
          <div>
            {pieChartData && (
              <Pie data={pieChartData} options={{ responsive: true }} />
            )}
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Đơn hàng cần xử lý:</h2>
          <div className="space-y-4">
            {notifications &&
              notifications.length > 0 &&
              notifications.map((notification: any) => (
                <div
                  key={notification?.id}
                  className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
                >
                  <span className="font-medium">
                    ID đơn hàng:{" "}
                    <span className="font-normal">{notification?.id}</span>
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {notification?.status?.status}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Tasks Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div>
            <p className="font-bold text-xl mb-2"> Thống kê doanh thu theo:</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-auto px-2 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <p className="font-bold text-xl my-4">
            Danh thu: {formatVietnamCurrency(selling)}
          </p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
