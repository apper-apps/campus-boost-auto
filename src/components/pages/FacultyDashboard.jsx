import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StatCard from "@/components/molecules/StatCard";
import CourseCard from "@/components/organisms/CourseCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const FacultyDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [
        coursesData,
        gradesData
      ] = await Promise.all([
        courseService.getByInstructor(1),
        gradeService.getAll()
      ]);

      setCourses(coursesData);
      setGrades(gradesData);
      setRecentGrades(gradesData.slice(0, 5));
    } catch (err) {
      setError("Failed to load faculty dashboard data. Please try again.");
      console.error("Faculty dashboard data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePostGrade = async () => {
    try {
      const newGrade = {
        courseId: 1,
        studentId: 1,
        assignmentName: "New Assignment",
        score: 85,
        maxScore: 100,
        weight: 0.1
      };
      
      await gradeService.postGrade(newGrade);
      toast.success("Grade posted successfully!");
      loadData();
    } catch (err) {
      toast.error("Failed to post grade. Please try again.");
    }
  };

  const handleCreateCourse = async () => {
    try {
      const newCourse = {
        code: "CS-501",
        name: "Advanced Data Structures",
        professor: "Dr. Sarah Chen",
        credits: 3,
        department: "Computer Science",
        semester: "Spring 2025"
      };
      
      await courseService.create(newCourse);
      toast.success("Course created successfully!");
      loadData();
    } catch (err) {
      toast.error("Failed to create course. Please try again.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const totalStudents = 128;
  const avgGrade = grades.length > 0 ? 
    grades.reduce((sum, g) => sum + (g.score / g.maxScore * 100), 0) / grades.length : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 font-display">
              Faculty Dashboard
            </h1>
            <p className="text-primary-100 text-lg">
              Comprehensive course management and student grade tracking
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Button variant="secondary" size="small" onClick={handleCreateCourse}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create Course
            </Button>
            <Button variant="secondary" size="small" onClick={handlePostGrade}>
              <ApperIcon name="GraduationCap" className="w-4 h-4 mr-2" />
              Post Grade
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          change="+12 from last semester"
          changeType="positive"
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Teaching Courses"
          value={courses.length}
          icon="BookOpen"
          color="secondary"
        />
        <StatCard
          title="Grades Posted"
          value={grades.length}
          change="Recent activity"
          changeType="positive"
          icon="Award"
          color="accent"
        />
        <StatCard
          title="Class Average"
          value={`${avgGrade.toFixed(1)}%`}
          change={avgGrade >= 85 ? "Excellent" : avgGrade >= 75 ? "Good" : "Needs attention"}
          changeType={avgGrade >= 85 ? "positive" : avgGrade >= 75 ? "neutral" : "negative"}
          icon="TrendingUp"
          color="success"
        />
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="flex-col h-20" onClick={handlePostGrade}>
            <ApperIcon name="Plus" className="w-6 h-6 mb-2" />
            <span className="text-sm">Post Grade</span>
          </Button>
          <Button variant="outline" className="flex-col h-20" onClick={handleCreateCourse}>
            <ApperIcon name="BookOpen" className="w-6 h-6 mb-2" />
            <span className="text-sm">New Course</span>
          </Button>
          <Button variant="outline" className="flex-col h-20">
            <ApperIcon name="Users" className="w-6 h-6 mb-2" />
            <span className="text-sm">View Students</span>
          </Button>
          <Button variant="outline" className="flex-col h-20">
            <ApperIcon name="Calendar" className="w-6 h-6 mb-2" />
            <span className="text-sm">Schedule</span>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
            Recent Grades Posted
          </h2>
          
          {recentGrades.length === 0 ? (
            <Empty 
              title="No recent grades"
              message="No grades posted recently."
              icon="Award"
            />
          ) : (
            <div className="space-y-4">
              {recentGrades.map((grade) => (
                <div key={grade.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {grade.assignmentName}
                    </h3>
                    <p className="text-xs text-gray-600">
                      Course ID: {grade.courseId}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {grade.score}/{grade.maxScore}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((grade.score / grade.maxScore) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
            Course Overview
          </h2>
          
          {courses.length === 0 ? (
            <Empty 
              title="No courses"
              message="You're not currently teaching any courses."
              icon="BookOpen"
            />
          ) : (
            <div className="space-y-4">
              {courses.slice(0, 3).map((course) => (
                <div key={course.Id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{course.code}</h3>
                    <span className="text-xs text-gray-500">{course.credits} credits</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{course.name}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{course.department}</span>
                    <span>32 students</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;