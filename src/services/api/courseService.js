import { toast } from 'react-toastify';

const getApperClient = () => {
  return window.authenticatedApperClient || window.ApperSDK?.ApperClient;
};

export const courseService = {
  get apperClient() {
    return getApperClient();
  },

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "enrollment_status_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "semester_c" } }
        ],
        orderBy: [
          { fieldName: "code_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("course_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "enrollment_status_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "semester_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("course_c", id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async getByStudent(studentId) {
    // Return enrolled courses for the student
    return await this.getEnrolledCourses();
  },

  async getEnrolledCourses() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "enrollment_status_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "semester_c" } }
        ],
        where: [
          {
            FieldName: "enrollment_status_c",
            Operator: "EqualTo",
            Values: ["enrolled"]
          }
        ],
        orderBy: [
          { fieldName: "code_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("course_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      return [];
    }
  },

  async getByInstructor(instructorId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "professor_c" } },
          { field: { Name: "schedule_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "enrollment_status_c" } },
          { field: { Name: "department_c" } },
          { field: { Name: "semester_c" } }
        ],
        where: [
          {
            FieldName: "professor_c",
            Operator: "Contains",
            Values: ["Dr. Sarah Chen"]
          }
        ],
        orderBy: [
          { fieldName: "code_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("course_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      return [];
    }
  },

  async create(courseData) {
    try {
      const params = {
records: [{
          Name: courseData.Name || courseData.name || courseData.code || "New Course",
          code_c: courseData.code_c || courseData.code,
          professor_c: courseData.professor_c || courseData.professor || courseData.instructor,
          schedule_c: courseData.schedule_c || (typeof courseData.schedule === 'object' ? JSON.stringify(courseData.schedule) : courseData.schedule) || "",
          credits_c: parseInt(courseData.credits_c || courseData.credits),
          enrollment_status_c: courseData.enrollment_status_c || "enrolled",
          department_c: courseData.department_c || courseData.department,
          semester_c: courseData.semester_c || courseData.semester || "Spring 2024"
        }]
      };

      const response = await this.apperClient.createRecord("course_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create courses ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async update(id, courseData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are provided
      if (courseData.Name !== undefined) updateData.Name = courseData.Name;
      if (courseData.code_c !== undefined) updateData.code_c = courseData.code_c;
      if (courseData.professor_c !== undefined) updateData.professor_c = courseData.professor_c;
      if (courseData.schedule_c !== undefined) {
        updateData.schedule_c = Array.isArray(courseData.schedule_c) 
          ? courseData.schedule_c.join(", ") 
          : courseData.schedule_c;
      }
      if (courseData.credits_c !== undefined) updateData.credits_c = courseData.credits_c;
      if (courseData.enrollment_status_c !== undefined) updateData.enrollment_status_c = courseData.enrollment_status_c;
      if (courseData.department_c !== undefined) updateData.department_c = courseData.department_c;
      if (courseData.semester_c !== undefined) updateData.semester_c = courseData.semester_c;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord("course_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update courses ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("course_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete courses ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return response.results.length > 0 && response.results[0].success;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  },

  // Alias methods for backward compatibility
  async updateCourse(id, courseData) {
    return await this.update(id, courseData);
  },

  async deleteCourse(id) {
    return await this.delete(id);
  }
};