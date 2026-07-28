import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../../../dist/assets/logo/logo.png";

function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src={logo}
            alt="DocNexus"
            className="w-10 h-10 md:w-11 md:h-11 object-contain"
          />

          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="text-violet-600">Doc</span>
            <span className="text-blue-600">Nexus</span>
          </h1>
        </div>

        {/* Desktop Navigation */}

        <nav className="hidden lg:flex items-center gap-10">

          <a
            href="/"
            className="font-medium hover:text-violet-600 duration-300"
          >
            Home
          </a>

          <button className="flex items-center gap-1 font-medium hover:text-violet-600 duration-300">
            Compress PDF
            <ChevronDown size={18} />
          </button>

          <button className="flex items-center gap-1 font-medium hover:text-violet-600 duration-300">
            Convert PDF
            <ChevronDown size={18} />
          </button>

          <button className="flex items-center gap-1 font-medium hover:text-violet-600 duration-300">
            All Tools
            <ChevronDown size={18} />
          </button>

        </nav>

        {/* Desktop Buttons */}

        <div className="hidden lg:flex items-center gap-4">

          <button className="font-medium hover:text-violet-600 duration-300">
            Login
          </button>

          <button className="px-4 py-1 rounded-md bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium shadow-lg hover:scale-105 duration-300">
            Sign Up
          </button>

        </div>

        {/* Mobile Menu Button */}

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden p-2"
        >
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}

      {mobileMenu && (

        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">

          <nav className="flex flex-col px-6 py-6 gap-5">

            <a
              href="/"
              className="font-medium hover:text-violet-600"
            >
              Home
            </a>

            <button className="flex items-center justify-between font-medium hover:text-violet-600">
              Compress PDF
              <ChevronDown size={18} />
            </button>

            <button className="flex items-center justify-between font-medium hover:text-violet-600">
              Convert PDF
              <ChevronDown size={18} />
            </button>

            <button className="flex items-center justify-between font-medium hover:text-violet-600">
              All Tools
              <ChevronDown size={18} />
            </button>

            <hr />

            <button className="text-left font-medium hover:text-violet-600">
              Login
            </button>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium shadow-lg">
              Sign Up
            </button>

          </nav>

        </div>

      )}

    </header>
  );
}

export default Navbar;