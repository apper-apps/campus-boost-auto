import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Courses from "@/components/pages/Courses";
import Attendance from "@/components/pages/Attendance";
import Grades from "@/components/pages/Grades";
import Announcements from "@/components/pages/Announcements";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSearch = (query, filter) => {
    // Global search handler - can be implemented to search across all content
    console.log("Global search:", query, filter);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
          
          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuClick={handleMenuClick} onSearch={handleSearch} />
            
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/grades" element={<Grades />} />
                  <Route path="/announcements" element={<Announcements />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="font-body"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;