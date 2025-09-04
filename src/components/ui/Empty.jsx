import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No data found",
  message = "There's nothing to show here yet.",
  action,
  onAction,
  icon = "Inbox",
  className 
}) => {
  return (
    <div className={cn("bg-white rounded-card shadow-card p-12 text-center", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            {title}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {message}
          </p>
        </div>
        
        {action && onAction && (
          <Button onClick={onAction} variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {action}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;