import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;

export const attendanceService = {
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
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "remarks_c" } }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("attendance_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching attendance records:", error?.response?.data?.message);
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
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "remarks_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById("attendance_c", id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching attendance record with ID ${id}:`, error?.response?.data?.message);
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
          { field: { Name: "date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "remarks_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords("attendance_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching course attendance:", error);
      return [];
    }
  },

  async getAttendanceStats(courseId = null) {
    try {
      const params = {
        fields: [
          { field: { Name: "status_c" } }
        ]
      };

      if (courseId) {
        params.where = [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ];
      }

      const response = await this.apperClient.fetchRecords("attendance_c", params);

      if (!response.success) {
        return { total: 0, present: 0, absent: 0, holidays: 0, attendanceRate: 0 };
      }

      const records = response.data || [];
      const stats = records.reduce((acc, record) => {
        acc.total++;
        if (record.status_c === "present") acc.present++;
        if (record.status_c === "absent") acc.absent++;
        if (record.status_c === "holiday") acc.holidays++;
        return acc;
      }, { total: 0, present: 0, absent: 0, holidays: 0 });

      const attendanceRate = stats.total > 0 
        ? ((stats.present / (stats.total - stats.holidays)) * 100).toFixed(1)
        : 0;

      return {
        ...stats,
        attendanceRate: parseFloat(attendanceRate)
      };
    } catch (error) {
      console.error("Error calculating attendance stats:", error);
      return { total: 0, present: 0, absent: 0, holidays: 0, attendanceRate: 0 };
    }
  },

  async getCourseAttendanceStats() {
    try {
      const params = {
        fields: [
          { field: { Name: "course_id_c" } },
          { field: { Name: "status_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords("attendance_c", params);

      if (!response.success) {
        return [];
      }

      const records = response.data || [];
      const courseStats = {};

      records.forEach(record => {
        const courseId = record.course_id_c?.Id || record.course_id_c;
        if (!courseStats[courseId]) {
          courseStats[courseId] = {
            courseId: courseId,
            total: 0,
            present: 0,
            absent: 0,
            holidays: 0
          };
        }
        
        const stats = courseStats[courseId];
        stats.total++;
        if (record.status_c === "present") stats.present++;
        if (record.status_c === "absent") stats.absent++;
        if (record.status_c === "holiday") stats.holidays++;
      });

      // Calculate attendance rates
      Object.keys(courseStats).forEach(courseId => {
        const stats = courseStats[courseId];
        const classesHeld = stats.total - stats.holidays;
        stats.attendanceRate = classesHeld > 0 
          ? Math.round((stats.present / classesHeld) * 100)
          : 0;
      });

      return Object.values(courseStats);
    } catch (error) {
      console.error("Error fetching course attendance stats:", error);
      return [];
    }
  },

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          Name: attendanceData.Name || `Attendance - ${new Date().toLocaleDateString()}`,
          course_id_c: parseInt(attendanceData.course_id_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          remarks_c: attendanceData.remarks_c || ""
        }]
      };

      const response = await this.apperClient.createRecord("attendance_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create attendance ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating attendance record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async update(id, attendanceData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: attendanceData.Name,
          course_id_c: attendanceData.course_id_c ? parseInt(attendanceData.course_id_c) : undefined,
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          remarks_c: attendanceData.remarks_c
        }]
      };

      const response = await this.apperClient.updateRecord("attendance_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update attendance ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating attendance record:", error?.response?.data?.message);
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

      const response = await this.apperClient.deleteRecord("attendance_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete attendance ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return response.results.length > 0 && response.results[0].success;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance record:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};