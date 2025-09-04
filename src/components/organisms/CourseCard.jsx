import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/atoms/ProgressRing";
import { cn } from "@/utils/cn";

const CourseCard = ({ course, attendance, nextClass, upcomingAssignments, className }) => {
  const departmentColors = {
    "CS": "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100",
    "MATH": "border-green-500 bg-gradient-to-br from-green-50 to-green-100",
    "ENG": "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100",
    "HIST": "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100",
    "PHYS": "border-red-500 bg-gradient-to-br from-red-50 to-red-100",
    "CHEM": "border-indigo-500 bg-gradient-to-br from-indigo-50 to-indigo-100",
    "BIO": "border-teal-500 bg-gradient-to-br from-teal-50 to-teal-100"
  };
  
  const deptCode = course.code.split("-")[0];
  const cardStyle = departmentColors[deptCode] || "border-gray-500 bg-gradient-to-br from-gray-50 to-gray-100";
  
  return (
    <div className={cn("course-card", cardStyle, className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="default" className="text-xs">
              {course.code}
            </Badge>
            <Badge variant="primary" className="text-xs">
              {course.credits} Credits
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 font-display">
            {course.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Prof. {course.professor}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <ApperIcon name="Clock" className="w-4 h-4" />
            {course.schedule.join(", ")}
          </div>
        </div>
        <ProgressRing 
          value={attendance} 
          size={50} 
          strokeWidth={4}
          color={attendance >= 80 ? "success" : attendance >= 70 ? "warning" : "error"}
          className="ml-4"
        />
      </div>
      
      <div className="space-y-3">
        {nextClass && (
          <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
            <ApperIcon name="Calendar" className="w-4 h-4 text-primary-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Next Class</p>
              <p className="text-xs text-gray-600">{nextClass}</p>
            </div>
          </div>
        )}
        
        {upcomingAssignments && upcomingAssignments.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg">
            <ApperIcon name="BookOpen" className="w-4 h-4 text-accent-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {upcomingAssignments.length} Assignment{upcomingAssignments.length > 1 ? "s" : ""} Due
              </p>
              <p className="text-xs text-gray-600">
                Next: {upcomingAssignments[0]?.title}
              </p>
            </div>
          </div>
        )}
      </div>
      
<div className="flex gap-2 mt-4">
        <Button variant="primary" size="small" className="flex-1">
          <ApperIcon name="Settings" className="w-4 h-4 mr-1" />
          Manage Course
        </Button>
        <Button variant="outline" size="small">
          <ApperIcon name="GraduationCap" className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;