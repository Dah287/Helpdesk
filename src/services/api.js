import axios from 'axios';

const API_URL = 'http://192.168.1.89:8082/api/tickets';

const api = {
  // CRUD Operations
  getAllTickets: () => axios.get(API_URL),
  getAllTicketsAdmin: () => axios.get(`${API_URL}/by-status`),
  // getTicketsByStatus: () => axios.get(`${API_URL}/by-status`),
  getByUserName: (username) => axios.get(`${API_URL}/assigned-to/${username}`),
  getTicket: (id) => axios.get(`${API_URL}/${id}`),
  createTicket: (ticket) => axios.post(API_URL, ticket),
  updateTicket: (id, ticket) => axios.put(`${API_URL}/${id}`, ticket),
  deleteTicket: (id) => axios.delete(`${API_URL}/${id}`),
  updateTicketStatus: (id, newStatus) => axios.put(`${API_URL}/updateTicketStatus/${id}`, { status: newStatus }),
//
getAllTicketsService: (id,userId) => axios.get(`${API_URL}/tickets-chef-service-validation/${id}/${userId}`),
getAllTicketsDepV: (id,userId) => axios.get(`${API_URL}/tickets-chef-Dep-validation/${id}/${userId}`),
getAllTicketsDepSI: () => axios.get(`${API_URL}/tickets-chef-Dep-SI`),
//
getAllTicketsService2: (id,serviceId) => axios.get(`${API_URL}/tickets-chef-service-validation2/${id}/${serviceId}`),
getAllTicketsDepV2: (id) => axios.get(`${API_URL}/tickets-chef-Dep-validation2/${id}`),

//
updateTicketService: (id) => axios.put(`${API_URL}/${id}/v-service`),
validateService: (id) => axios.put(`${API_URL}/${id}/date-validate-service`),
validateDep: (id) => axios.put(`${API_URL}/${id}/date-validate-dep`),
validateSI: (id) => axios.put(`${API_URL}/${id}/date-validate-si`),
updateTicketDepV: (id) => axios.put(`${API_URL}/${id}/v-dep`),
updateTicketDepSI: (id) => axios.put(`${API_URL}/${id}/v-si-dep`),

  //
  updateTicketFields: (id, ticket) => axios.put(`${API_URL}/updateTicketFields/${id}`, ticket),
  //
  
  // Filter Operations
  filterByStatus: (status) => axios.get(`${API_URL}/status/${status}`),
  filterByDepartment: (department) => axios.get(`${API_URL}/department/${department}`)
};

export default api;