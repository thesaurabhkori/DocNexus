import React from "react";
import { Outlet } from "react-router-dom";

// Folder structure ke hisab se exact absolute nested path:
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/Footer/Footer";


function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfe]">

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="w-full flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default MainLayout;
