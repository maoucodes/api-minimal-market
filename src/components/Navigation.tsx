
import { Link, useLocation } from "react-router-dom";
import { Search, Terminal, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
              {user && (
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/dashboard"
                      ? "text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Dashboard
                </Link>
              )}
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
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-black transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                      <AvatarFallback>
                        {profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
