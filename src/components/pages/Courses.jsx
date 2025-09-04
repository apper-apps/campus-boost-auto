import React, { useEffect, useState } from "react";
import CourseModal from "@/components/organisms/CourseModal";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { attendanceService } from "@/services/api/attendanceService";
import ApperIcon from "@/components/ApperIcon";
import CourseCard from "@/components/organisms/CourseCard";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
const Courses = () => {
const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showModal, setShowModal] = useState(false);

  const handleCreateCourse = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleCourseSuccess = () => {
    loadData();
  };
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [coursesData, assignmentsData, attendanceData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        attendanceService.getCourseAttendanceStats()
      ]);

      setCourses(coursesData);
      setAssignments(assignmentsData);
      setAttendanceStats(attendanceData);
      setFilteredCourses(coursesData);
    } catch (err) {
      setError("Failed to load courses. Please try again.");
      console.error("Courses loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...courses];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.professor.toLowerCase().includes(query)
      );
    }

    // Apply department filter
    if (selectedDepartment) {
      filtered = filtered.filter(course => 
        course.department === selectedDepartment
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "code":
          return a.code.localeCompare(b.code);
        case "professor":
          return a.professor.localeCompare(b.professor);
        case "credits":
          return b.credits - a.credits;
        default:
          return 0;
      }
    });

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedDepartment, sortBy]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const getCourseAttendance = (courseId) => {
    const stat = attendanceStats.find(s => s.courseId === parseInt(courseId));
    return stat ? stat.attendanceRate : 85;
  };

  const getCourseUpcomingAssignments = (courseId) => {
    return assignments.filter(assignment => 
      assignment.courseId === parseInt(courseId) && 
      !assignment.submitted &&
      new Date(assignment.dueDate) > new Date()
    );
  };

  const getNextClass = (schedule) => {
    return "Next: " + schedule[0];
  };

  const departments = [...new Set(courses.map(course => course.department))];
  const enrolledCount = courses.filter(c => c.enrollmentStatus === "enrolled").length;
  const waitlistedCount = courses.filter(c => c.enrollmentStatus === "waitlisted").length;

  const searchFilters = [
    { value: "all", label: "All Courses" },
    { value: "enrolled", label: "Enrolled" },
    { value: "waitlisted", label: "Waitlisted" }
  ];

  const handleSearch = (query, filter) => {
    setSearchQuery(query);
    
    if (filter === "enrolled") {
      setFilteredCourses(courses.filter(c => c.enrollmentStatus === "enrolled"));
    } else if (filter === "waitlisted") {
      setFilteredCourses(courses.filter(c => c.enrollmentStatus === "waitlisted"));
    } else {
      // Will be handled by useEffect
    }
  };

  return (
<div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-600 via-primary-600 to-accent-500 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 font-display">Course Management</h1>
            <p className="text-secondary-100 text-lg">
              Manage your teaching courses and student enrollments for Fall 2024
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-2xl font-bold">{enrolledCount}</div>
              <div className="text-sm text-secondary-100">Teaching</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{waitlistedCount}</div>
              <div className="text-sm text-secondary-100">Preparing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 max-w-md">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search courses, professors..."
              filters={searchFilters}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <option value="name">Sort by Name</option>
              <option value="code">Sort by Code</option>
              <option value="professor">Sort by Professor</option>
              <option value="credits">Sort by Credits</option>
            </select>
            
<Button variant="primary" size="small" onClick={handleCreateCourse}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create New Course
            </Button>
          </div>
        </div>
      </div>

      {/* Course Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-semibold text-lg">{enrolledCount}</p>
              <p className="text-green-600 text-sm">Enrolled Courses</p>
            </div>
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-semibold text-lg">{waitlistedCount}</p>
              <p className="text-yellow-600 text-sm">Waitlisted</p>
            </div>
            <ApperIcon name="Clock" className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-semibold text-lg">
                {courses.reduce((sum, course) => sum + course.credits, 0)}
              </p>
              <p className="text-blue-600 text-sm">Total Credits</p>
            </div>
            <ApperIcon name="Award" className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 font-display">
            All Courses ({filteredCourses.length})
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="small">
              <ApperIcon name="Grid3x3" className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="small">
              <ApperIcon name="List" className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <Empty 
            title={searchQuery ? "No courses found" : "No courses available"}
            message={searchQuery ? "Try adjusting your search or filters." : "You haven't enrolled in any courses yet."}
            action="Browse Catalog"
            icon="BookOpen"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.Id} className="relative">
                <CourseCard
                  course={course}
                  attendance={getCourseAttendance(course.Id)}
                  nextClass={getNextClass(course.schedule)}
                  upcomingAssignments={getCourseUpcomingAssignments(course.Id)}
                />
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={course.enrollmentStatus === "enrolled" ? "success" : "warning"}
                    className="text-xs capitalize"
                  >
                    {course.enrollmentStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
)}
      </div>

      <CourseModal
        isOpen={showModal}
        onClose={handleModalClose}
        mode="create"
        onSuccess={handleCourseSuccess}
      />
    </div>
  );
};

export default Courses;