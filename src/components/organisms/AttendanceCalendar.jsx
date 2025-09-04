import React, { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay } from "date-fns";

const AttendanceCalendar = ({ attendanceData, selectedCourse, onCourseChange, courses }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getAttendanceForDate = (date) => {
    if (!attendanceData || !selectedCourse) return null;
    return attendanceData.find(record => 
      record.courseId === selectedCourse && 
      isSameDay(new Date(record.date), date)
    );
  };
  
  const getDayStyle = (date, attendance) => {
    const baseStyle = "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200";
    
    if (!isSameMonth(date, currentDate)) {
      return `${baseStyle} text-gray-300`;
    }
    
    if (!attendance) {
      return `${baseStyle} text-gray-700 hover:bg-gray-100`;
    }
    
    switch (attendance.status) {
      case "present":
        return `${baseStyle} bg-green-100 text-green-800 hover:bg-green-200`;
      case "absent":
        return `${baseStyle} bg-red-100 text-red-800 hover:bg-red-200`;
      case "holiday":
        return `${baseStyle} bg-blue-100 text-blue-800 hover:bg-blue-200`;
      default:
        return `${baseStyle} text-gray-700 hover:bg-gray-100`;
    }
  };
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };
  
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 font-display">Attendance Calendar</h2>
        
        <select
          value={selectedCourse}
          onChange={(e) => onCourseChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.Id} value={course.Id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={previousMonth} size="small">
          <ApperIcon name="ChevronLeft" className="w-4 h-4" />
        </Button>
        
        <h3 className="text-lg font-semibold text-gray-900 font-display">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        
        <Button variant="ghost" onClick={nextMonth} size="small">
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-6">
        {Array.from({ length: getDay(monthStart) }).map((_, index) => (
          <div key={`empty-${index}`} className="w-8 h-8" />
        ))}
        
        {monthDays.map(date => {
          const attendance = getAttendanceForDate(date);
          return (
            <div
              key={date.toString()}
              className={getDayStyle(date, attendance)}
              title={attendance ? `${attendance.status} - ${attendance.remarks || ""}` : ""}
            >
              {format(date, "d")}
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Badge variant="present">Present</Badge>
          <Badge variant="absent">Absent</Badge>
          <Badge variant="holiday">Holiday</Badge>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceCalendar;