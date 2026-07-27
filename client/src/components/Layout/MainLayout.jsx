import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";


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
