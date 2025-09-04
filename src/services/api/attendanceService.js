import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const attendanceService = {
  async getAll() {
    await delay();
    return attendance.map(record => ({ ...record }));
  },

  async getById(id) {
    await delay();
    const record = attendance.find(a => a.Id === parseInt(id));
    return record ? { ...record } : null;
  },

  async getByCourse(courseId) {
    await delay();
    return attendance
      .filter(record => record.courseId === parseInt(courseId))
      .map(record => ({ ...record }));
  },

  async getByDateRange(startDate, endDate, courseId = null) {
    await delay();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let filtered = attendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= end;
    });

    if (courseId) {
      filtered = filtered.filter(record => record.courseId === parseInt(courseId));
    }

    return filtered.map(record => ({ ...record }));
  },

  async getAttendanceStats(courseId = null) {
    await delay();
    
    let records = attendance;
    if (courseId) {
      records = attendance.filter(record => record.courseId === parseInt(courseId));
    }

    const stats = records.reduce((acc, record) => {
      acc.total++;
      if (record.status === "present") acc.present++;
      if (record.status === "absent") acc.absent++;
      if (record.status === "holiday") acc.holidays++;
      return acc;
    }, { total: 0, present: 0, absent: 0, holidays: 0 });

    const attendanceRate = stats.total > 0 
      ? ((stats.present / (stats.total - stats.holidays)) * 100).toFixed(1)
      : 0;

    return {
      ...stats,
      attendanceRate: parseFloat(attendanceRate)
    };
  },

  async getCourseAttendanceStats() {
    await delay();
    
    const courseStats = {};
    attendance.forEach(record => {
      if (!courseStats[record.courseId]) {
        courseStats[record.courseId] = {
          courseId: record.courseId,
          total: 0,
          present: 0,
          absent: 0,
          holidays: 0
        };
      }
      
      const stats = courseStats[record.courseId];
      stats.total++;
      if (record.status === "present") stats.present++;
      if (record.status === "absent") stats.absent++;
      if (record.status === "holiday") stats.holidays++;
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
  },

  async create(attendanceData) {
    await delay();
    const newRecord = {
      Id: Math.max(...attendance.map(a => a.Id), 0) + 1,
      ...attendanceData
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, attendanceData) {
    await delay();
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      attendance[index] = { ...attendance[index], ...attendanceData };
      return { ...attendance[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = attendance.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};