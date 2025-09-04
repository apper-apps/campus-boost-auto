import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, onSearch }) => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  const searchFilters = [
    { value: "courses", label: "Courses" },
    { value: "professors", label: "Professors" },
    { value: "announcements", label: "Announcements" }
  ];
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="small"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </Button>
          
          {/* Search */}
          <div className="flex-1 max-w-lg mx-4">
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search courses, professors, announcements..."
              filters={searchFilters}
            />
          </div>
          
          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Semester Selector */}
            <select className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200">
              <option>Fall 2024</option>
              <option>Spring 2024</option>
              <option>Summer 2024</option>
            </select>
            
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="small">
                <ApperIcon name="Bell" className="h-5 w-5" />
              </Button>
              <Badge variant="error" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                3
              </Badge>
            </div>
            
            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
<div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.emailAddress}</p>
              </div>
              <Button 
                variant="ghost" 
                size="small"
                onClick={logout}
                className="ml-2"
              >
                <ApperIcon name="LogOut" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;