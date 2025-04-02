import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tickets';

const api = {
  // CRUD Operations
  getAllTickets: () => axios.get(API_URL),
  getTicket: (id) => axios.get(`${API_URL}/${id}`),
  createTicket: (ticket) => axios.post(API_URL, ticket),
  updateTicket: (id, ticket) => axios.put(`${API_URL}/${id}`, ticket),
  deleteTicket: (id) => axios.delete(`${API_URL}/${id}`),
  
  // Filter Operations
  filterByStatus: (status) => axios.get(`${API_URL}/status/${status}`),
  filterByDepartment: (department) => axios.get(`${API_URL}/department/${department}`)
};

export default api;