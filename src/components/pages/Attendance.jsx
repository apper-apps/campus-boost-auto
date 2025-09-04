import React, { useState, useEffect } from "react";
import AttendanceCalendar from "@/components/organisms/AttendanceCalendar";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/atoms/ProgressRing";
import { attendanceService } from "@/services/api/attendanceService";
import { courseService } from "@/services/api/courseService";
import { format } from "date-fns";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [overallStats, setOverallStats] = useState({});
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [attendanceData, coursesData, courseStatsData, overallStatsData] = await Promise.all([
        attendanceService.getAll(),
        courseService.getEnrolledCourses(),
        attendanceService.getCourseAttendanceStats(),
        attendanceService.getAttendanceStats()
      ]);

      setAttendance(attendanceData);
      setCourses(coursesData);
      setCourseStats(courseStatsData);
      setOverallStats(overallStatsData);
    } catch (err) {
      setError("Failed to load attendance data. Please try again.");
      console.error("Attendance loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  const getAttendanceStatus = (rate) => {
    if (rate >= 90) return { color: "success", status: "Excellent" };
    if (rate >= 80) return { color: "primary", status: "Good" };
    if (rate >= 70) return { color: "warning", status: "Average" };
    return { color: "error", status: "Poor" };
  };

  const getRecentAttendance = () => {
    return attendance
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 font-display">Attendance Tracking</h1>
            <p className="text-primary-100 text-lg">
              Monitor your class attendance and maintain good academic standing
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-3xl font-bold">{overallStats.attendanceRate || 0}%</div>
              <div className="text-sm text-primary-100">Overall Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Attendance"
          value={`${overallStats.attendanceRate || 0}%`}
          change={overallStats.attendanceRate >= 80 ? "Good standing" : "Needs improvement"}
          changeType={overallStats.attendanceRate >= 80 ? "positive" : "negative"}
          icon="Calendar"
          color={overallStats.attendanceRate >= 80 ? "success" : "warning"}
        />
        <StatCard
          title="Classes Attended"
          value={overallStats.present || 0}
          icon="CheckCircle"
          color="success"
        />
        <StatCard
          title="Classes Missed"
          value={overallStats.absent || 0}
          change={overallStats.absent > 5 ? "High absences" : "Good record"}
          changeType={overallStats.absent > 5 ? "negative" : "positive"}
          icon="XCircle"
          color="error"
        />
        <StatCard
          title="Total Classes"
          value={overallStats.total - (overallStats.holidays || 0) || 0}
          icon="BookOpen"
          color="primary"
        />
      </div>

      {/* Course-wise Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Attendance Stats */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
            Course-wise Attendance
          </h2>
          
          {courseStats.length === 0 ? (
            <Empty 
              title="No attendance records"
              message="No attendance data available for your courses."
              icon="Calendar"
            />
          ) : (
            <div className="space-y-4">
              {courseStats.map((stat) => {
                const course = getCourseById(stat.courseId);
                const attendanceInfo = getAttendanceStatus(stat.attendanceRate);
                
                if (!course) return null;
                
                return (
                  <Card key={stat.courseId} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {course.code} - {course.name}
                        </h3>
                        <p className="text-sm text-gray-600">Prof. {course.professor}</p>
                      </div>
                      <ProgressRing 
                        value={stat.attendanceRate} 
                        size={60}
                        color={attendanceInfo.color}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-3 gap-4 text-center flex-1">
                        <div>
                          <div className="text-lg font-semibold text-green-600">
                            {stat.present}
                          </div>
                          <div className="text-xs text-gray-500">Present</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-red-600">
                            {stat.absent}
                          </div>
                          <div className="text-xs text-gray-500">Absent</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-blue-600">
                            {stat.total - stat.holidays}
                          </div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </div>
                      <Badge variant={attendanceInfo.color} className="ml-4">
                        {attendanceInfo.status}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
            Recent Attendance
          </h2>
          
          {attendance.length === 0 ? (
            <Empty 
              title="No recent activity"
              message="No recent attendance records to display."
              icon="Clock"
            />
          ) : (
            <Card className="p-6">
              <div className="space-y-4">
                {getRecentAttendance().map((record) => {
                  const course = getCourseById(record.courseId);
                  if (!course) return null;
                  
                  return (
                    <div key={record.Id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          record.status === "present" ? "bg-green-500" :
                          record.status === "absent" ? "bg-red-500" : "bg-blue-500"
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {course.code} - {course.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {format(new Date(record.date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <Badge variant={record.status}>
                        {record.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Button variant="outline" size="small" className="w-full">
                  <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
                  View All Records
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Calendar View */}
      <AttendanceCalendar
        attendanceData={attendance}
        selectedCourse={selectedCourse}
        onCourseChange={setSelectedCourse}
        courses={courses}
      />
    </div>
  );
};

export default Attendance;