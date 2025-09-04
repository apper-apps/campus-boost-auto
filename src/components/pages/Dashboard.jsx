import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import CourseCard from "@/components/organisms/CourseCard";
import AnnouncementCard from "@/components/organisms/AnnouncementCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";
import { announcementService } from "@/services/api/announcementService";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [
        coursesData,
        upcomingAssignments,
        gpaData,
        attendanceData,
        recentAnnouncements
      ] = await Promise.all([
        courseService.getEnrolledCourses(),
        assignmentService.getUpcoming(),
        gradeService.calculateGPA(),
        attendanceService.getCourseAttendanceStats(),
        announcementService.getRecent(4)
      ]);

      setCourses(coursesData);
      setAssignments(upcomingAssignments);
      setGpa(gpaData);
      setAttendanceStats(attendanceData);
      setAnnouncements(recentAnnouncements);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const getOverallAttendance = () => {
    if (!attendanceStats.length) return 0;
    const totalPresent = attendanceStats.reduce((sum, stat) => sum + stat.present, 0);
    const totalClasses = attendanceStats.reduce((sum, stat) => sum + (stat.total - stat.holidays), 0);
    return totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
  };

  const getCourseAttendance = (courseId) => {
    const stat = attendanceStats.find(s => s.courseId === parseInt(courseId));
    return stat ? stat.attendanceRate : 85;
  };

  const getCourseUpcomingAssignments = (courseId) => {
    return assignments.filter(assignment => assignment.courseId === parseInt(courseId));
  };

  const getNextClass = (schedule) => {
    // Mock next class calculation
    return "Tomorrow at " + schedule[0];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-2 font-display">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-primary-100 text-lg">
            Here's what's happening with your courses today.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall GPA"
          value={gpa.toFixed(2)}
          change="+0.1 from last semester"
          changeType="positive"
          icon="Award"
          color="primary"
        />
        <StatCard
          title="Courses Enrolled"
          value={courses.length}
          icon="BookOpen"
          color="secondary"
        />
        <StatCard
          title="Pending Assignments"
          value={assignments.length}
          change={assignments.length > 5 ? "High workload" : "Manageable"}
          changeType={assignments.length > 5 ? "negative" : "positive"}
          icon="CheckSquare"
          color="accent"
        />
        <StatCard
          title="Attendance Rate"
          value={`${getOverallAttendance()}%`}
          change={getOverallAttendance() >= 80 ? "Good standing" : "Needs improvement"}
          changeType={getOverallAttendance() >= 80 ? "positive" : "negative"}
          icon="Calendar"
          color={getOverallAttendance() >= 80 ? "success" : "warning"}
        />
      </div>

      {/* My Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-display">My Courses</h2>
          <p className="text-gray-600">Fall 2024 Semester</p>
        </div>
        
        {courses.length === 0 ? (
          <Empty 
            title="No courses enrolled"
            message="You haven't enrolled in any courses for this semester yet."
            icon="BookOpen"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.Id}
                course={course}
                attendance={getCourseAttendance(course.Id)}
                nextClass={getNextClass(course.schedule)}
                upcomingAssignments={getCourseUpcomingAssignments(course.Id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Announcements */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-display">Recent Announcements</h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
            View All
          </button>
        </div>
        
        {announcements.length === 0 ? (
          <Empty 
            title="No announcements"
            message="There are no recent announcements to display."
            icon="Bell"
          />
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.Id}
                announcement={announcement}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;