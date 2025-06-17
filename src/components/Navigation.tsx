
import { Link, useLocation } from "react-router-dom";
import { Search, Terminal } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Terminal className="h-6 w-6" />
              <span className="text-xl font-mono font-bold">apity</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/explore"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/explore"
                    ? "text-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Explore
              </Link>
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/admin"
                    ? "text-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Admin
              </Link>
              <a
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Docs
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Pricing
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-black transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
