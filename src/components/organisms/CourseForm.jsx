import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const CourseForm = ({ course = null, onSuccess, onCancel, mode = "create" }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    department: "",
    credits: "",
    instructor: "",
    schedule: {
      days: [],
      time: "",
      room: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (course && mode === "edit") {
      setFormData({
        name: course.name || "",
        code: course.code || "",
        description: course.description || "",
        department: course.department || "",
        credits: course.credits?.toString() || "",
        instructor: course.instructor || "",
        schedule: {
          days: course.schedule?.days || [],
          time: course.schedule?.time || "",
          room: course.schedule?.room || ""
        }
      });
    }
  }, [course, mode]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
    }
    
    if (!formData.code.trim()) {
      newErrors.code = "Course code is required";
    }
    
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }
    
    if (!formData.credits || formData.credits < 1 || formData.credits > 6) {
      newErrors.credits = "Credits must be between 1 and 6";
    }
    
    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    
    try {
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits),
        enrolledStudents: course?.enrolledStudents || 0,
        totalStudents: course?.totalStudents || 30
      };

      if (mode === "create") {
        await courseService.create(courseData);
        toast.success("Course created successfully!");
      } else {
        await courseService.update(course.Id, courseData);
        toast.success("Course updated successfully!");
      }
      
      onSuccess?.();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(`Failed to ${mode} course. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleScheduleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value
      }
    }));
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        days: prev.schedule.days.includes(day)
          ? prev.schedule.days.filter(d => d !== day)
          : [...prev.schedule.days, day]
      }
    }));
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const departments = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Engineering"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Name *
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter course name"
            error={errors.name}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Code *
          </label>
          <Input
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="e.g., CS101"
            error={errors.code}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department *
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="">Select department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">{errors.department}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credits *
          </label>
          <Input
            name="credits"
            type="number"
            min="1"
            max="6"
            value={formData.credits}
            onChange={handleInputChange}
            placeholder="Enter credits"
            error={errors.credits}
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructor *
          </label>
          <Input
            name="instructor"
            value={formData.instructor}
            onChange={handleInputChange}
            placeholder="Enter instructor name"
            error={errors.instructor}
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            placeholder="Enter course description"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule
          </label>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Days
              </label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      formData.schedule.days.includes(day)
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    disabled={loading}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Time
                </label>
                <Input
                  type="time"
                  value={formData.schedule.time}
                  onChange={(e) => handleScheduleChange("time", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Room
                </label>
                <Input
                  value={formData.schedule.room}
                  onChange={(e) => handleScheduleChange("room", e.target.value)}
                  placeholder="e.g., Room 101"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : (
            <>
              <ApperIcon name={mode === "create" ? "Plus" : "Save"} className="w-4 h-4 mr-2" />
              {mode === "create" ? "Create Course" : "Update Course"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;