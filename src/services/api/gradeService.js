import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const gradeService = {
  async getAll() {
    await delay();
    return grades.map(grade => ({ ...grade }));
  },

  async getById(id) {
    await delay();
    const grade = grades.find(g => g.Id === parseInt(id));
    return grade ? { ...grade } : null;
  },

  async getByCourse(courseId) {
    await delay();
    return grades
      .filter(grade => grade.courseId === parseInt(courseId))
      .map(grade => ({ ...grade }));
  },

  async getByStudent(studentId = 1) {
    await delay();
    return grades.map(grade => ({ ...grade }));
  },

  async calculateGPA() {
    await delay();
    
    // Group grades by course
    const courseGrades = grades.reduce((acc, grade) => {
      if (!acc[grade.courseId]) {
        acc[grade.courseId] = [];
      }
      acc[grade.courseId].push(grade);
      return acc;
    }, {});

    let totalPoints = 0;
    let totalCredits = 0;
    const courseCredits = { 1: 3, 2: 4, 3: 3, 4: 4, 5: 3 }; // Mock credits per course

    // Calculate weighted average for each course
    Object.keys(courseGrades).forEach(courseId => {
      const courseGradesList = courseGrades[courseId];
      let courseWeightedScore = 0;
      let totalWeight = 0;

      courseGradesList.forEach(grade => {
        const percentage = (grade.score / grade.maxScore) * 100;
        courseWeightedScore += percentage * grade.weight;
        totalWeight += grade.weight;
      });

      if (totalWeight > 0) {
        const coursePercentage = courseWeightedScore / totalWeight;
        const gradePoints = this.percentageToGPA(coursePercentage);
        const credits = courseCredits[courseId] || 3;
        
        totalPoints += gradePoints * credits;
        totalCredits += credits;
      }
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    return Math.round(gpa * 100) / 100;
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
    await delay();
    const newGrade = {
      Id: Math.max(...grades.map(g => g.Id), 0) + 1,
      ...gradeData,
      gradedDate: new Date().toISOString()
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay();
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      grades[index] = { ...grades[index], ...gradeData };
      return { ...grades[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      const deleted = grades.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};