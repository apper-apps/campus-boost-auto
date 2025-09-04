import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;

export const assignmentService = {
  apperClient: new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  }),

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "points_c" } },
          { field: { Name: "submitted_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "course_id_c" } }
        ],
        orderBy: [
          { fieldName: "due_date_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("assignment_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "points_c" } },
          { field: { Name: "submitted_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "course_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("assignment_c", id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "points_c" } },
          { field: { Name: "submitted_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "course_id_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [
          { fieldName: "due_date_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("assignment_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching course assignments:", error);
      return [];
    }
  },

  async getUpcoming() {
    try {
      const now = new Date().toISOString();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "points_c" } },
          { field: { Name: "submitted_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "course_id_c" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "due_date_c",
                    operator: "GreaterThan",
                    values: [now]
                  }
                ],
                operator: "AND"
              },
              {
                conditions: [
                  {
                    fieldName: "submitted_c",
                    operator: "EqualTo",
                    values: [false]
                  }
                ],
                operator: "AND"
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "due_date_c", sorttype: "ASC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("assignment_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming assignments:", error);
      return [];
    }
  },

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          Name: assignmentData.Name || assignmentData.title_c || "New Assignment",
          title_c: assignmentData.title_c,
          description_c: assignmentData.description_c || "",
          due_date_c: assignmentData.due_date_c,
          points_c: assignmentData.points_c || 100,
          submitted_c: false,
          type_c: assignmentData.type_c || "assignment",
          status_c: assignmentData.status_c || "pending",
          course_id_c: parseInt(assignmentData.course_id_c)
        }]
      };

      const response = await this.apperClient.createRecord("assignment_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create assignments ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async update(id, assignmentData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are provided
      if (assignmentData.Name !== undefined) updateData.Name = assignmentData.Name;
      if (assignmentData.title_c !== undefined) updateData.title_c = assignmentData.title_c;
      if (assignmentData.description_c !== undefined) updateData.description_c = assignmentData.description_c;
      if (assignmentData.due_date_c !== undefined) updateData.due_date_c = assignmentData.due_date_c;
      if (assignmentData.points_c !== undefined) updateData.points_c = assignmentData.points_c;
      if (assignmentData.submitted_c !== undefined) updateData.submitted_c = assignmentData.submitted_c;
      if (assignmentData.type_c !== undefined) updateData.type_c = assignmentData.type_c;
      if (assignmentData.status_c !== undefined) updateData.status_c = assignmentData.status_c;
      if (assignmentData.course_id_c !== undefined) updateData.course_id_c = parseInt(assignmentData.course_id_c);

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord("assignment_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update assignments ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating assignment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async submit(id) {
    return await this.update(id, {
      submitted_c: true,
      status_c: "submitted"
    });
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord("assignment_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete assignments ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return response.results.length > 0 && response.results[0].success;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};