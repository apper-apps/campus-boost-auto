import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AnnouncementCard = ({ announcement, className }) => {
  const priorityVariants = {
    high: "error",
    medium: "warning", 
    low: "default"
  };
  
  const categoryVariants = {
    academic: "primary",
    event: "secondary",
    administrative: "accent",
    emergency: "error"
  };
  
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": return "AlertTriangle";
      case "medium": return "Info";
      default: return "Bell";
    }
  };
  
  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg bg-${announcement.priority === 'high' ? 'red' : announcement.priority === 'medium' ? 'yellow' : 'gray'}-100`}>
          <ApperIcon 
            name={getPriorityIcon(announcement.priority)} 
            className={`w-5 h-5 text-${announcement.priority === 'high' ? 'red' : announcement.priority === 'medium' ? 'yellow' : 'gray'}-600`}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={priorityVariants[announcement.priority]}>
              {announcement.priority.toUpperCase()}
            </Badge>
            <Badge variant={categoryVariants[announcement.category]}>
              {announcement.category.toUpperCase()}
            </Badge>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">
            {announcement.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {announcement.content.length > 150 
              ? `${announcement.content.substring(0, 150)}...` 
              : announcement.content
            }
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <ApperIcon name="User" className="w-3 h-3" />
                {announcement.author}
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Clock" className="w-3 h-3" />
                {format(new Date(announcement.timestamp), "MMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
            
            <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
              Read More
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnnouncementCard;