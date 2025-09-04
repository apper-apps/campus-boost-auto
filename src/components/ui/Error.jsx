import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry, 
  className,
  variant = "default"
}) => {
  const variants = {
    default: "bg-white rounded-card shadow-card p-12 text-center",
    inline: "bg-red-50 border border-red-200 rounded-lg p-6 text-center",
    minimal: "p-6 text-center"
  };
  
  return (
    <div className={cn(variants[variant], className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {message}
          </p>
        </div>
        
        {onRetry && (
          <div className="flex gap-3">
            <Button onClick={onRetry} variant="primary">
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="ghost" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Error;