import { Link, useNavigate } from "react-router-dom";
import { Package, LogOut, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {  useAppDispatch } from "@/hooks/redux";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const getDashboardRoute = () => {
  
  };

  return (
    <header className="bg-white shadow-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">ParcelStride</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/track" className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-1">
              <Search className="w-4 h-4" />
              <span>Track</span>
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;