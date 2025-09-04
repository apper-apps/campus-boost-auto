import coursesData from "@/services/mockData/courses.json";

let courses = [...coursesData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const courseService = {
  async getAll() {
    await delay();
    return courses.map(course => ({ ...course }));
  },

  async getById(id) {
    await delay();
    const course = courses.find(c => c.Id === parseInt(id));
    return course ? { ...course } : null;
  },

  async getByStudent(studentId) {
    await delay();
    // Return enrolled courses for the student
    return courses
      .filter(course => course.enrollmentStatus === "enrolled")
      .map(course => ({ ...course }));
  },

  async create(courseData) {
    await delay();
    const newCourse = {
      Id: Math.max(...courses.map(c => c.Id), 0) + 1,
      ...courseData,
      enrollmentStatus: "enrolled"
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await delay();
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      courses[index] = { ...courses[index], ...courseData };
      return { ...courses[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = courses.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      const deleted = courses.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  },

  async getEnrolledCourses() {
    await delay();
    return courses
      .filter(course => course.enrollmentStatus === "enrolled")
      .map(course => ({ ...course }));
  }
};