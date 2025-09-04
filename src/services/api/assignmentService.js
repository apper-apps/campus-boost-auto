import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const assignmentService = {
  async getAll() {
    await delay();
    return assignments.map(assignment => ({ ...assignment }));
  },

  async getById(id) {
    await delay();
    const assignment = assignments.find(a => a.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  },

  async getByCourse(courseId) {
    await delay();
    return assignments
      .filter(assignment => assignment.courseId === parseInt(courseId))
      .map(assignment => ({ ...assignment }));
  },

  async getUpcoming() {
    await delay();
    const now = new Date();
    const upcoming = assignments
      .filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        return dueDate > now && !assignment.submitted;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    return upcoming.map(assignment => ({ ...assignment }));
  },

  async create(assignmentData) {
    await delay();
    const newAssignment = {
      Id: Math.max(...assignments.map(a => a.Id), 0) + 1,
      ...assignmentData,
      submitted: false,
      status: "pending"
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay();
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...assignmentData };
      return { ...assignments[index] };
    }
    return null;
  },

  async submit(id) {
    await delay();
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index].submitted = true;
      assignments[index].status = "submitted";
      return { ...assignments[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = assignments.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};