import axios from 'axios';

// Configuration de base
const API_BASE_URL = 'http://192.168.1.14:8083/api'; // URL de base

// ➕ Création d'une instance Axios personnalisée
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// ➕ Intercepteur pour ajouter le token à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    //g("Token utilisé :", token); // 👈 Ajout du log
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      //g("Token utilisé2 :", config.headers.Authorization); // 👈 Ajout du log
    }
      //  console.log("URL complète utilisée par Axios:", config.baseURL + config.url); // 👈 Log
    return config;
  },
  (error) => Promise.reject(error)
);


// ➕ Intercepteur pour gérer les erreurs globales
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Gérer la déconnexion si le token est invalide
      sessionStorage.removeItem('token');
      window.location.href = '/login'; // Rediriger vers la page de login
    }
    return Promise.reject(error);
  }
);

const api = {
  // CRUD Operations
  getAllTickets: () => axiosInstance.get('/tickets'),
  getAllTicketsAdmin: () => axiosInstance.get('/tickets/by-status'),
  getAllTicketsAdminSuper: () => axiosInstance.get('/tickets/by-status-super'),
  getByUserName: (username) => axiosInstance.get(`/tickets/assigned-to/${username}`),
  getTicket: (id) => axiosInstance.get(`/tickets/${id}`),
  createTicket: (ticket) => axiosInstance.post('/tickets', ticket),
  updateTicket: (id, ticket) => axiosInstance.put(`/tickets/${id}`, ticket),
  deleteTicket: (id) => axiosInstance.delete(`/tickets/${id}`),
  updateTicketStatus: (id, newStatus) => axiosInstance.put(`/tickets/updateTicketStatus/${id}`, { status: newStatus }),
  updateTicketStatusSuper: (id, newStatus) => axiosInstance.put(`/tickets/updateTicketStatusSuper/${id}`, { status: newStatus }),

  // Tickets par service/département
  getAllTicketsService: (id, userId) => axiosInstance.get(`/tickets/tickets-chef-service-validation/${id}/${userId}`),
  getAllTicketsDepV: (id, userId) => axiosInstance.get(`/tickets/tickets-chef-Dep-validation/${id}/${userId}`),
  getAllTicketsDepSI: () => axiosInstance.get('/tickets/tickets-chef-Dep-SI'),
  getAllTicketsService2: (id, serviceId) => axiosInstance.get(`/tickets/tickets-chef-service-validation2/${id}/${serviceId}`),
  getAllTicketsBureau2: (id, bureauId) => axiosInstance.get(`/tickets/tickets-chef-bureau-validation2/${id}/${bureauId}`),
  getAllTicketsDepV2: (id) => axiosInstance.get(`/tickets/tickets-chef-Dep-validation2/${id}`),

  // Validations
  updateTicketService: (id) => axiosInstance.put(`/tickets/${id}/v-service`),
  updateTicketBureau: (id) => axiosInstance.put(`/tickets/${id}/v-bureau`),
  validateService: (id) => axiosInstance.put(`/tickets/${id}/date-validate-service`),
  validateBureau: (id) => axiosInstance.put(`/tickets/${id}/date-validate-bureau`),
  validateDep: (id) => axiosInstance.put(`/tickets/${id}/date-validate-dep`),
  validateSI: (id) => axiosInstance.put(`/tickets/${id}/date-validate-si`),
  updateTicketDepV: (id) => axiosInstance.put(`/tickets/${id}/v-dep`),
  updateTicketDepSI: (id) => axiosInstance.put(`/tickets/${id}/v-si-dep`),

  // Autres opérations
  updateTicketFields: (id, ticket) => axiosInstance.put(`/tickets/updateTicketFields/${id}`, ticket),
  filterByStatus: (status) => axiosInstance.get(`/tickets/status/${status}`),
  filterByDepartment: (department) => axiosInstance.get(`/tickets/department/${department}`),
// filtre status et username
getTicketsByStatus: (status,username) => axiosInstance.get(`/tickets/status/${status}/${username}`),
  // Utilisateurs
  getAllUsers: () => axiosInstance.get('/utilisateurs'),
  createUser: (userData) => axiosInstance.post('/utilisateurs', userData),
  updateUser: (id, userData) => axiosInstance.put(`/utilisateurs/${id}`, userData),
  deleteUser: (id) => axiosInstance.delete(`/utilisateurs/${id}`),

  // Bureaux, Services et Départements
  getAllBureaux: () => axiosInstance.get('/utilisateurs/bureaux'),
  getAllServices: () => axiosInstance.get('/utilisateurs/services'),
  getAllDepartments: () => axiosInstance.get('/utilisateurs/departments'),

  // api.js
 // getSystemConfig: () => axios.get('/api/admin/config'),
 updateSystemConfig : (data) => axios.put('/api/admin/config', data),
 resetSystemConfig : () => axios.post('/api/admin/config/reset'),
deleteDemandType : (name) => axios.delete(`/admin/config/demand-types/${encodeURIComponent(name)}`),


 addDemandType : (name) => axios.post('/api/admin/config/demand-types', { name }),
 // addSolution: (payload) => axios.post('/api/admin/config/add-solutions', payload),
 //deleteSolution : (text) => axios.delete(`/api/admin/config/solutions/${encodeURIComponent(text)}`),

 //

// Récupérer la liste des libellés des solutions actives
  getSolutions: () => axiosInstance.get('/admin/config/solutions'),

  // Ajouter une nouvelle solution
  // Le payload doit être { text: "ma solution" }
  addSolution: (payload) => axiosInstance.post('/admin/config/add-solutions', payload),

  // Désactiver une solution par son libellé
  deleteSolution: (libelle) => axiosInstance.delete(`/admin/config/solutions/${libelle}`),

  // Récupérer la config globale (Types de demande, aide, etc.)
  // Note : Assurez-vous que ce endpoint existe dans votre Controller Java
  getSystemConfig: () => axiosInstance.get('/admin/config/system'),
  
  // Mettre à jour la config globale
  //updateSystemConfig: (config) => axiosInstance.put('/admin/config/system', config),
};

export default api;