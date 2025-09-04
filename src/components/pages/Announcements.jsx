import React, { useState, useEffect } from "react";
import AnnouncementCard from "@/components/organisms/AnnouncementCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { announcementService } from "@/services/api/announcementService";
import { courseService } from "@/services/api/courseService";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [announcementsData, coursesData] = await Promise.all([
        announcementService.getAll(),
        courseService.getEnrolledCourses()
      ]);

      setAnnouncements(announcementsData);
      setCourses(coursesData);
      setFilteredAnnouncements(announcementsData);
    } catch (err) {
      setError("Failed to load announcements. Please try again.");
      console.error("Announcements loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...announcements];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(announcement => 
        announcement.category === selectedCategory
      );
    }

    // Apply priority filter
    if (selectedPriority) {
      filtered = filtered.filter(announcement => 
        announcement.priority === selectedPriority
      );
    }

    // Apply course filter
    if (selectedCourse) {
      if (selectedCourse === "general") {
        filtered = filtered.filter(announcement => !announcement.courseId);
      } else {
        filtered = filtered.filter(announcement => 
          announcement.courseId === parseInt(selectedCourse)
        );
      }
    }

    setFilteredAnnouncements(filtered);
  }, [announcements, selectedCategory, selectedPriority, selectedCourse]);

  const handleSearch = async (query, filter) => {
    try {
      setLoading(true);
      
      const filters = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (selectedPriority) filters.priority = selectedPriority;
      if (selectedCourse && selectedCourse !== "general") {
        filters.courseId = selectedCourse;
      }
      
      const results = await announcementService.search(query, filters);
      setFilteredAnnouncements(results);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  const getAnnouncementCounts = () => {
    const counts = {
      total: announcements.length,
      high: announcements.filter(a => a.priority === "high").length,
      academic: announcements.filter(a => a.category === "academic").length,
      recent: announcements.filter(a => {
        const daysDiff = (new Date() - new Date(a.timestamp)) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      }).length
    };
    return counts;
  };

  const counts = getAnnouncementCounts();
  
  const searchFilters = [
    { value: "all", label: "All Types" },
    { value: "academic", label: "Academic" },
    { value: "event", label: "Events" },
    { value: "administrative", label: "Administrative" },
    { value: "emergency", label: "Emergency" }
  ];

  const categories = [
    { value: "", label: "All Categories" },
    { value: "academic", label: "Academic" },
    { value: "event", label: "Events" },
    { value: "administrative", label: "Administrative" },
    { value: "emergency", label: "Emergency" }
  ];

  const priorities = [
    { value: "", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  const courseOptions = [
    { value: "", label: "All Sources" },
    { value: "general", label: "General Announcements" },
    ...courses.map(course => ({
      value: course.Id.toString(),
      label: `${course.code} - ${course.name}`
    }))
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-600 via-primary-600 to-accent-500 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 font-display">Campus Announcements</h1>
            <p className="text-secondary-100 text-lg">
              Stay updated with important notices and campus news
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{counts.recent}</div>
              <div className="text-sm text-secondary-100">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{counts.high}</div>
              <div className="text-sm text-secondary-100">High Priority</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-primary-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-800 font-semibold text-lg">{counts.total}</p>
              <p className="text-primary-600 text-sm">Total Announcements</p>
            </div>
            <ApperIcon name="Bell" className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-800 font-semibold text-lg">{counts.high}</p>
              <p className="text-red-600 text-sm">High Priority</p>
            </div>
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-800 font-semibold text-lg">{counts.academic}</p>
              <p className="text-green-600 text-sm">Academic</p>
            </div>
            <ApperIcon name="BookOpen" className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-semibold text-lg">{counts.recent}</p>
              <p className="text-yellow-600 text-sm">Recent</p>
            </div>
            <ApperIcon name="Clock" className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="space-y-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search announcements, authors..."
            filters={searchFilters}
          />
          
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
            >
              {courseOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              size="small"
              onClick={() => {
                setSelectedCategory("");
                setSelectedPriority("");
                setSelectedCourse("");
                setFilteredAnnouncements(announcements);
              }}
            >
              <ApperIcon name="X" className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {(selectedCategory || selectedPriority || selectedCourse) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {selectedCategory && (
            <Badge variant="primary" className="cursor-pointer" onClick={() => setSelectedCategory("")}>
              Category: {selectedCategory} ×
            </Badge>
          )}
          {selectedPriority && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedPriority("")}>
              Priority: {selectedPriority} ×
            </Badge>
          )}
          {selectedCourse && (
            <Badge variant="accent" className="cursor-pointer" onClick={() => setSelectedCourse("")}>
              Course: {selectedCourse === "general" ? "General" : getCourseById(parseInt(selectedCourse))?.code} ×
            </Badge>
          )}
        </div>
      )}

      {/* Announcements List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 font-display">
            Announcements ({filteredAnnouncements.length})
          </h2>
          <Button variant="primary" size="small">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>

        {filteredAnnouncements.length === 0 ? (
          <Empty 
            title="No announcements found"
            message="No announcements match your current filters. Try adjusting your search criteria."
            icon="Bell"
            action="Clear Filters"
            onAction={() => {
              setSelectedCategory("");
              setSelectedPriority("");
              setSelectedCourse("");
              setFilteredAnnouncements(announcements);
            }}
          />
        ) : (
          <div className="space-y-6">
            {filteredAnnouncements.map((announcement) => (
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

export default Announcements;