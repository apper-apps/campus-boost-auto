import announcementsData from "@/services/mockData/announcements.json";

let announcements = [...announcementsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const announcementService = {
  async getAll() {
    await delay();
    return announcements
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(announcement => ({ ...announcement }));
  },

  async getById(id) {
    await delay();
    const announcement = announcements.find(a => a.Id === parseInt(id));
    return announcement ? { ...announcement } : null;
  },

  async getByCategory(category) {
    await delay();
    return announcements
      .filter(announcement => announcement.category === category)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(announcement => ({ ...announcement }));
  },

  async getByPriority(priority) {
    await delay();
    return announcements
      .filter(announcement => announcement.priority === priority)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(announcement => ({ ...announcement }));
  },

  async getByCourse(courseId) {
    await delay();
    return announcements
      .filter(announcement => 
        announcement.courseId === parseInt(courseId) || 
        announcement.courseId === null
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(announcement => ({ ...announcement }));
  },

  async getRecent(limit = 5) {
    await delay();
    return announcements
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
      .map(announcement => ({ ...announcement }));
  },

  async search(query, filters = {}) {
    await delay();
    let filtered = announcements;

    // Apply text search
    if (query) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchQuery) ||
        announcement.content.toLowerCase().includes(searchQuery) ||
        announcement.author.toLowerCase().includes(searchQuery)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(announcement => 
        announcement.category === filters.category
      );
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(announcement => 
        announcement.priority === filters.priority
      );
    }

    // Apply course filter
    if (filters.courseId) {
      filtered = filtered.filter(announcement => 
        announcement.courseId === parseInt(filters.courseId) ||
        announcement.courseId === null
      );
    }

    return filtered
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(announcement => ({ ...announcement }));
  },

  async create(announcementData) {
    await delay();
    const newAnnouncement = {
      Id: Math.max(...announcements.map(a => a.Id), 0) + 1,
      ...announcementData,
      timestamp: new Date().toISOString()
    };
    announcements.push(newAnnouncement);
    return { ...newAnnouncement };
  },

  async update(id, announcementData) {
    await delay();
    const index = announcements.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      announcements[index] = { ...announcements[index], ...announcementData };
      return { ...announcements[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = announcements.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      const deleted = announcements.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};