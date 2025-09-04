import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;

export const gradeService = {
  apperClient: new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  }),

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "graded_date_c" } },
          { field: { Name: "feedback_c" } }
        ],
        orderBy: [
          { fieldName: "graded_date_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("grade_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching grades:", error?.response?.data?.message);
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
          { field: { Name: "course_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "graded_date_c" } },
          { field: { Name: "feedback_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("grade_c", id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async getByCourse(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "assignment_id_c" } },
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "graded_date_c" } },
          { field: { Name: "feedback_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [
          { fieldName: "graded_date_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("grade_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching course grades:", error);
      return [];
    }
  },

  async getByStudent(studentId = 1) {
    // For now, return all grades as student-specific logic isn't defined in schema
    return await this.getAll();
  },

  async calculateGPA() {
    try {
      const grades = await this.getAll();
      
      if (!grades || grades.length === 0) {
        return 0;
      }

      // Group grades by course
      const courseGrades = grades.reduce((acc, grade) => {
        const courseId = grade.course_id_c?.Id || grade.course_id_c;
        if (!acc[courseId]) {
          acc[courseId] = [];
        }
        acc[courseId].push(grade);
        return acc;
      }, {});

      let totalPoints = 0;
      let totalCredits = 0;
      const defaultCredits = 3; // Default credits per course

      // Calculate weighted average for each course
      Object.keys(courseGrades).forEach(courseId => {
        const courseGradesList = courseGrades[courseId];
        let courseWeightedScore = 0;
        let totalWeight = 0;

        courseGradesList.forEach(grade => {
          const percentage = (grade.score_c / grade.max_score_c) * 100;
          courseWeightedScore += percentage * grade.weight_c;
          totalWeight += grade.weight_c;
        });

        if (totalWeight > 0) {
          const coursePercentage = courseWeightedScore / totalWeight;
          const gradePoints = this.percentageToGPA(coursePercentage);
          const credits = defaultCredits;
          
          totalPoints += gradePoints * credits;
          totalCredits += credits;
        }
      });

      const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
      return Math.round(gpa * 100) / 100;
    } catch (error) {
      console.error("Error calculating GPA:", error);
      return 0;
    }
  },

  percentageToGPA(percentage) {
    if (percentage >= 97) return 4.0;
    if (percentage >= 93) return 3.7;
    if (percentage >= 90) return 3.3;
    if (percentage >= 87) return 3.0;
    if (percentage >= 83) return 2.7;
    if (percentage >= 80) return 2.3;
    if (percentage >= 77) return 2.0;
    if (percentage >= 73) return 1.7;
    if (percentage >= 70) return 1.3;
    if (percentage >= 67) return 1.0;
    if (percentage >= 60) return 0.7;
    return 0.0;
  },

  async create(gradeData) {
    try {
      const params = {
        records: [{
          Name: gradeData.Name || `Grade - ${gradeData.assignment_name_c || 'Assignment'}`,
          course_id_c: parseInt(gradeData.course_id_c),
          assignment_id_c: gradeData.assignment_id_c ? parseInt(gradeData.assignment_id_c) : undefined,
          assignment_name_c: gradeData.assignment_name_c,
          score_c: gradeData.score_c,
          max_score_c: gradeData.max_score_c,
          weight_c: gradeData.weight_c || 1.0,
          graded_date_c: gradeData.graded_date_c || new Date().toISOString(),
          feedback_c: gradeData.feedback_c || ""
        }]
      };

      const response = await this.apperClient.createRecord("grade_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create grades ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating grade:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async update(id, gradeData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are provided
      if (gradeData.Name !== undefined) updateData.Name = gradeData.Name;
      if (gradeData.course_id_c !== undefined) updateData.course_id_c = parseInt(gradeData.course_id_c);
      if (gradeData.assignment_id_c !== undefined) updateData.assignment_id_c = parseInt(gradeData.assignment_id_c);
      if (gradeData.assignment_name_c !== undefined) updateData.assignment_name_c = gradeData.assignment_name_c;
      if (gradeData.score_c !== undefined) updateData.score_c = gradeData.score_c;
      if (gradeData.max_score_c !== undefined) updateData.max_score_c = gradeData.max_score_c;
      if (gradeData.weight_c !== undefined) updateData.weight_c = gradeData.weight_c;
      if (gradeData.graded_date_c !== undefined) updateData.graded_date_c = gradeData.graded_date_c;
      if (gradeData.feedback_c !== undefined) updateData.feedback_c = gradeData.feedback_c;

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord("grade_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update grades ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating grade:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord("grade_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete grades ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return response.results.length > 0 && response.results[0].success;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  },

  // Alias methods for backward compatibility
  async postGrade(gradeData) {
    return await this.create(gradeData);
  },

  async updateGrade(id, gradeData) {
    return await this.update(id, gradeData);
  },

  async deleteGrade(id) {
    return await this.delete(id);
  },

  async getStudentGrades(studentId, courseId) {
    if (courseId) {
      return await this.getByCourse(courseId);
    } else {
      return await this.getAll();
    }
  }
};