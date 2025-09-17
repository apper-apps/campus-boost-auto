import { toast } from 'react-toastify';

const getApperClient = () => {
  return window.authenticatedApperClient || window.ApperSDK?.ApperClient;
};

export const announcementService = {
  get apperClient() {
    return getApperClient();
  },

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "course_id_c" } }
        ],
        orderBy: [
          { fieldName: "timestamp_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("announcement_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching announcements:", error?.response?.data?.message);
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
          { field: { Name: "content_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "course_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("announcement_c", id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching announcement with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async getByCategory(category) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "course_id_c" } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [category]
          }
        ],
        orderBy: [
          { fieldName: "timestamp_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("announcement_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching announcements by category:", error);
      return [];
    }
  },

  async getByPriority(priority) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "course_id_c" } }
        ],
        where: [
          {
            FieldName: "priority_c",
            Operator: "EqualTo",
            Values: [priority]
          }
        ],
        orderBy: [
          { fieldName: "timestamp_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("announcement_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching announcements by priority:", error);
      return [];
    }
  },

  async getByCourse(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "course_id_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "course_id_c",
                    operator: "EqualTo",
                    values: [parseInt(courseId)]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "course_id_c",
                    operator: "DoesNotHaveValue",
                    values: []
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "timestamp_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("announcement_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching course announcements:", error);
      return [];
    }
  },

  async getRecent(limit = 5) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "course_id_c" } }
        ],
        orderBy: [
          { fieldName: "timestamp_c", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords("announcement_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent announcements:", error);
      return [];
    }
  },

  async search(query, filters = {}) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "author_c" } },
          { field: { Name: "course_id_c" } }
        ],
        whereGroups: [],
        orderBy: [
          { fieldName: "timestamp_c", sorttype: "DESC" }
        ]
      };

      const conditions = [];

      // Apply text search
      if (query) {
        conditions.push({
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "title_c",
                  operator: "Contains",
                  values: [query]
                }
              ],
              operator: "OR"
            },
            {
              conditions: [
                {
                  fieldName: "content_c",
                  operator: "Contains",
                  values: [query]
                }
              ],
              operator: "OR"
            },
            {
              conditions: [
                {
                  fieldName: "author_c",
                  operator: "Contains",
                  values: [query]
                }
              ],
              operator: "OR"
            }
          ]
        });
      }

      // Apply filters
      if (filters.category) {
        conditions.push({
          conditions: [
            {
              fieldName: "category_c",
              operator: "EqualTo",
              values: [filters.category]
            }
          ]
        });
      }

      if (filters.priority) {
        conditions.push({
          conditions: [
            {
              fieldName: "priority_c",
              operator: "EqualTo",
              values: [filters.priority]
            }
          ]
        });
      }

      if (filters.courseId) {
        conditions.push({
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "course_id_c",
                  operator: "EqualTo",
                  values: [parseInt(filters.courseId)]
                }
              ],
              operator: "OR"
            },
            {
              conditions: [
                {
                  fieldName: "course_id_c",
                  operator: "DoesNotHaveValue",
                  values: []
                }
              ],
              operator: "OR"
            }
          ]
        });
      }

      if (conditions.length > 0) {
        params.whereGroups = conditions.length > 1 ? [{
          operator: "AND",
          subGroups: conditions
        }] : conditions;
      }

      const response = await this.apperClient.fetchRecords("announcement_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching announcements:", error);
      return [];
    }
  },

  async create(announcementData) {
    try {
      const params = {
        records: [{
          Name: announcementData.Name || announcementData.title_c || "New Announcement",
          title_c: announcementData.title_c,
          content_c: announcementData.content_c || "",
          category_c: announcementData.category_c || "academic",
          priority_c: announcementData.priority_c || "medium",
          timestamp_c: announcementData.timestamp_c || new Date().toISOString(),
          author_c: announcementData.author_c || "",
          course_id_c: announcementData.course_id_c ? parseInt(announcementData.course_id_c) : undefined
        }]
      };

      const response = await this.apperClient.createRecord("announcement_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create announcements ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating announcement:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async update(id, announcementData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields that are provided
      if (announcementData.Name !== undefined) updateData.Name = announcementData.Name;
      if (announcementData.title_c !== undefined) updateData.title_c = announcementData.title_c;
      if (announcementData.content_c !== undefined) updateData.content_c = announcementData.content_c;
      if (announcementData.category_c !== undefined) updateData.category_c = announcementData.category_c;
      if (announcementData.priority_c !== undefined) updateData.priority_c = announcementData.priority_c;
      if (announcementData.timestamp_c !== undefined) updateData.timestamp_c = announcementData.timestamp_c;
      if (announcementData.author_c !== undefined) updateData.author_c = announcementData.author_c;
      if (announcementData.course_id_c !== undefined) updateData.course_id_c = parseInt(announcementData.course_id_c);

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord("announcement_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update announcements ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating announcement:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord("announcement_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete announcements ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return response.results.length > 0 && response.results[0].success;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting announcement:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};