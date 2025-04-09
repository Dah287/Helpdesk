import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tickets';

const api = {
  // CRUD Operations
  getAllTickets: () => axios.get(API_URL),
  getAllTicketsAdmin: () => axios.get(`${API_URL}/by-status`),
  getByUserName: (username) => axios.get(`${API_URL}/assigned-to/${username}`),
  getTicket: (id) => axios.get(`${API_URL}/${id}`),
  createTicket: (ticket) => axios.post(API_URL, ticket),
  updateTicket: (id, ticket) => axios.put(`${API_URL}/${id}`, ticket),
  deleteTicket: (id) => axios.delete(`${API_URL}/${id}`),
  updateTicketStatus: (id, newStatus) => axios.put(`${API_URL}/updateTicketStatus/${id}`, { status: newStatus }),
//
getAllTicketsService: (id) => axios.get(`${API_URL}/tickets-chef-service-validation/${id}`),
getAllTicketsDepV: (id) => axios.get(`${API_URL}/tickets-chef-Dep-validation/${id}`),
getAllTicketsDepSI: () => axios.get(`${API_URL}/tickets-chef-Dep-SI`),


//
updateTicketService: (id) => axios.put(`${API_URL}/${id}/v-service`),
updateTicketDepV: (id) => axios.put(`${API_URL}/${id}/v-dep`),
updateTicketDepSI: (id) => axios.put(`${API_URL}/${id}/v-si-dep`),

  
  
  // Filter Operations
  filterByStatus: (status) => axios.get(`${API_URL}/status/${status}`),
  filterByDepartment: (department) => axios.get(`${API_URL}/department/${department}`)
};

export default api;