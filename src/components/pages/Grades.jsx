import React, { useState, useEffect } from "react";
import GradeRow from "@/components/molecules/GradeRow";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/atoms/ProgressRing";
import { gradeService } from "@/services/api/gradeService";
import { courseService } from "@/services/api/courseService";
import { format } from "date-fns";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [gradesData, coursesData, gpaData] = await Promise.all([
        gradeService.getAll(),
        courseService.getEnrolledCourses(),
        gradeService.calculateGPA()
      ]);

      setGrades(gradesData);
      setCourses(coursesData);
      setGpa(gpaData);
    } catch (err) {
      setError("Failed to load grades. Please try again.");
      console.error("Grades loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  const getFilteredGrades = () => {
    let filtered = [...grades];
    
    if (selectedCourse) {
      filtered = filtered.filter(grade => grade.courseId === parseInt(selectedCourse));
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.gradedDate) - new Date(a.gradedDate);
        case "course":
          const courseA = getCourseById(a.courseId);
          const courseB = getCourseById(b.courseId);
          return courseA?.code.localeCompare(courseB?.code) || 0;
        case "score":
          return (b.score / b.maxScore) - (a.score / a.maxScore);
        case "assignment":
          return a.assignmentName.localeCompare(b.assignmentName);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const getCourseGPA = (courseId) => {
    const courseGrades = grades.filter(grade => grade.courseId === courseId);
    if (courseGrades.length === 0) return 0;
    
    let weightedScore = 0;
    let totalWeight = 0;
    
    courseGrades.forEach(grade => {
      const percentage = (grade.score / grade.maxScore) * 100;
      weightedScore += percentage * grade.weight;
      totalWeight += grade.weight;
    });
    
    const coursePercentage = totalWeight > 0 ? weightedScore / totalWeight : 0;
    return gradeService.percentageToGPA(coursePercentage);
  };

  const getGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    grades.forEach(grade => {
      const percentage = (grade.score / grade.maxScore) * 100;
      if (percentage >= 90) distribution.A++;
      else if (percentage >= 80) distribution.B++;
      else if (percentage >= 70) distribution.C++;
      else if (percentage >= 60) distribution.D++;
      else distribution.F++;
    });
    
    return distribution;
  };

  const getRecentGrades = (limit = 3) => {
    return grades
      .sort((a, b) => new Date(b.gradedDate) - new Date(a.gradedDate))
      .slice(0, limit);
  };

  const filteredGrades = getFilteredGrades();
  const gradeDistribution = getGradeDistribution();
  const recentGrades = getRecentGrades();
  const totalGrades = grades.length;
  const averageScore = grades.length > 0 
    ? grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / grades.length
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-500 via-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 font-display">Academic Performance</h1>
            <p className="text-accent-100 text-lg">
              Track your grades and monitor academic progress
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{gpa.toFixed(2)}</div>
              <div className="text-sm text-accent-100">Current GPA</div>
            </div>
            <ProgressRing value={gpa * 25} size={80} strokeWidth={8} color="accent" />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Current GPA"
          value={gpa.toFixed(2)}
          change={gpa >= 3.5 ? "Excellent" : gpa >= 3.0 ? "Good" : "Needs Improvement"}
          changeType={gpa >= 3.5 ? "positive" : gpa >= 3.0 ? "neutral" : "negative"}
          icon="Award"
          color="primary"
        />
        <StatCard
          title="Total Assignments"
          value={totalGrades}
          icon="BookOpen"
          color="secondary"
        />
        <StatCard
          title="Average Score"
          value={`${averageScore.toFixed(1)}%`}
          change={averageScore >= 90 ? "Outstanding" : averageScore >= 80 ? "Good" : "Fair"}
          changeType={averageScore >= 90 ? "positive" : averageScore >= 80 ? "neutral" : "negative"}
          icon="TrendingUp"
          color="accent"
        />
        <StatCard
          title="A Grades"
          value={gradeDistribution.A}
          icon="Star"
          color="success"
        />
      </div>

      {/* Grade Distribution and Recent Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grade Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
            Grade Distribution
          </h2>
          
          <div className="space-y-4">
            {Object.entries(gradeDistribution).map(([grade, count]) => {
              const percentage = totalGrades > 0 ? (count / totalGrades) * 100 : 0;
              const gradeColors = {
                A: "bg-green-500",
                B: "bg-blue-500", 
                C: "bg-yellow-500",
                D: "bg-orange-500",
                F: "bg-red-500"
              };
              
              return (
                <div key={grade} className="flex items-center gap-4">
                  <div className="w-8 text-center">
                    <Badge variant={grade === 'A' ? 'success' : grade === 'F' ? 'error' : 'default'}>
                      {grade}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{count} assignments</span>
                      <span className="text-gray-500">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${gradeColors[grade]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Grades */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
            Recent Grades
          </h2>
          
          {recentGrades.length === 0 ? (
            <Empty 
              title="No recent grades"
              message="No recent graded assignments to display."
              icon="BookOpen"
            />
          ) : (
            <div className="space-y-4">
              {recentGrades.map((grade) => {
                const course = getCourseById(grade.courseId);
                const percentage = (grade.score / grade.maxScore) * 100;
                const gradeInfo = percentage >= 90 ? { color: 'success', letter: 'A' } :
                               percentage >= 80 ? { color: 'primary', letter: 'B' } :
                               percentage >= 70 ? { color: 'warning', letter: 'C' } :
                               percentage >= 60 ? { color: 'accent', letter: 'D' } :
                               { color: 'error', letter: 'F' };
                
                return (
                  <div key={grade.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {grade.assignmentName}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {course?.code} - {format(new Date(grade.gradedDate), "MMM d")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {grade.score}/{grade.maxScore}
                      </div>
                      <Badge variant={gradeInfo.color} className="text-xs">
                        {gradeInfo.letter} ({percentage.toFixed(0)}%)
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-6">
            <Button variant="outline" size="small" className="w-full">
              <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
              View All Grades
            </Button>
          </div>
        </Card>
      </div>

      {/* Course Performance */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
          Course Performance
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const courseGrades = grades.filter(grade => grade.courseId === course.Id);
            const courseGPA = getCourseGPA(course.Id);
            const gradeCount = courseGrades.length;
            
            return (
              <Card key={course.Id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {course.code}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {course.name}
                    </p>
                  </div>
                  <ProgressRing 
                    value={courseGPA * 25} 
                    size={50}
                    strokeWidth={4}
                    color="primary"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {courseGPA.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Course GPA</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {gradeCount}
                    </div>
                    <div className="text-xs text-gray-500">Assignments</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Grades Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-900 font-display">
              All Grades ({filteredGrades.length})
            </h2>
            
            <div className="flex gap-3">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course.Id} value={course.Id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <option value="recent">Most Recent</option>
                <option value="course">By Course</option>
                <option value="score">By Score</option>
                <option value="assignment">By Assignment</option>
              </select>
            </div>
          </div>
        </div>
        
        {filteredGrades.length === 0 ? (
          <div className="p-8">
            <Empty 
              title="No grades found"
              message="No grades match your current filters."
              icon="BookOpen"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map((grade) => {
                  const course = getCourseById(grade.courseId);
                  return (
                    <GradeRow
                      key={grade.Id}
                      assignment={grade.assignmentName}
                      course={course?.code || "Unknown"}
                      score={grade.score}
                      maxScore={grade.maxScore}
                      weight={grade.weight}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Grades;