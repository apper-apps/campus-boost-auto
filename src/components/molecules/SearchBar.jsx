import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ onSearch, placeholder = "Search...", filters = [], className }) => {
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    onSearch(searchQuery, selectedFilter);
  };
  
  return (
    <div className={cn("relative flex items-center gap-3", className)}>
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {filters.length > 0 && (
        <select
          value={selectedFilter}
          onChange={(e) => {
            setSelectedFilter(e.target.value);
            onSearch(query, e.target.value);
          }}
          className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
        >
          <option value="">All</option>
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SearchBar;