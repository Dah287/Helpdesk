import { useState, useEffect } from 'react';
import { 
  Box, CssBaseline, AppBar, Toolbar, Typography, 
  Avatar, Drawer, List, ListItem, ListItemIcon, 
  ListItemText, Grid, Card, CardContent, TextField,
  Button, Select, MenuItem, FormControl, InputLabel,
  TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, IconButton, Tooltip, Paper,Menu,
  Dialog, DialogTitle, DialogContent, DialogActions // Nouveaux imports
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ListAlt as TicketsIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  FilterAlt as FilterIcon,
  Assignment as AssignmentIcon,
  CheckCircle as ResolveIcon,
  Close as CloseIcon,
  Visibility as ViewIcon // Nouvel import
} from '@mui/icons-material';
import { Pagination } from '@mui/material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import ConstructionIcon from '@mui/icons-material/Construction';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import LogoutIcon from '@mui/icons-material/Logout';
import useAutoLogout from '../pages/useAutoLogout';
import { useNavigate } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // 🔽 icône de téléchargement
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  

  const [searchTerm, setSearchTerm] = useState('');
const [serialNumberSearch, setSerialNumberSearch] = useState('');
const [bureauSearch, setBureauSearch] = useState('');
const [serviceSearch, setServiceSearch] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);







  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [ticketToResolve, setTicketToResolve] = useState(null);

  const handleResolveClick = (ticket) => {
    setTicketToResolve(ticket);
    setSelectedTicket(ticket);
    setResolveDialogOpen(true);
  };


  const handleConfirmResolve = async () => {
    try {
      // D'abord, mettre à jour les champs foundProblem et appliedSolution
      await api.updateTicketFields(ticketToResolve.id, {
        foundProblem: selectedTicket.foundProblem,
        appliedSolution: selectedTicket.appliedSolution,
      });
      
      // Ensuite, changer le statut
      await api.updateTicketStatus(ticketToResolve.id, 'RESOLU');
      await api.validateSI(ticketToResolve.id);
      
      loadTickets();
      setResolveDialogOpen(false);
      alert('Ticket résolu avec succès !');
    } catch (error) {
      console.error('Erreur lors de la résolution :', error);
      alert('Une erreur est survenue.');
    }
  };

    // Nouvelle fonction pour ouvrir les détails
    const handleViewDetails = (ticket) => {
      setSelectedTicket(ticket);
      setOpenDialog(true);
    };
// implémenter le chartData à partir des données de l'API
const [chartData, setChartData] = useState([]);
const [loadingChart, setLoadingChart] = useState(true);

// Fonction pour générer les données du graphique
const generateChartData = (tickets) => {
  // Grouper les tickets par mois
  const monthlyData = tickets.reduce((acc, ticket) => {
    const date = new Date(ticket.createdAt);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }
    acc[monthYear]++;
    
    return acc;
  }, {});

  // Convertir en format adapté pour Recharts
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const currentYear = new Date().getFullYear();
  const last6Months = [];
  
  // Créer les 6 derniers mois
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month + 1}`;
    
    last6Months.push({
      name: `${months[month]} ${year === currentYear ? '' : year}`,
      tickets: monthlyData[key] || 0
    });
  }

  return last6Months;
};



//
  // Données pour le graphique
  // const chartData = [
  //   { name: 'Jan', tickets: 40 },
  //   { name: 'Feb', tickets: 30 },
  //   { name: 'Mar', tickets: 20 },
  //   { name: 'Apr', tickets: 27 },
  //   { name: 'May', tickets: 18 },
  //   { name: 'Jun', tickets: 23 },
  // ];

  // Statistiques
  const [stats, setStats] = useState([
    { title: 'Tickets Ouverts', value: 0, icon: '📋', color: 'primary' },
    { title: 'En Cours', value: 0, icon: '⏳', color: 'warning' },
    { title: 'Transmettre à la société de maintenance', value: 0, icon: '🚚', color: 'primary' }, // Ajout ici
    { title: 'Résolus', value: 0, icon: '✅', color: 'success' },

   ]);

  useEffect(() => {
    loadTickets();


  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // 👈 récupération du token
        if (!token) {
          console.error("Token manquant !");
          return;
        }
  
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        const [ticketsRes, usersRes] = await Promise.all([
          fetch('http://192.168.1.42:8082/api/tickets', { headers }),
          fetch('http://192.168.1.42:8082/api/utilisateurs', { headers }),
        ]);
  
        //g("ticketsRes :", ticketsRes);
        //g("usersRes :", usersRes);
  
        const tickets = await ticketsRes.json();
        const users = await usersRes.json();
  
        const total = tickets.length;
        const ouverts = tickets.filter(t => t.status === 'SI_SERVICE').length;
        const encours = tickets.filter(t => t.status === 'EN_COURS').length;
        const resolus = tickets.filter(t => t.status === 'RESOLU').length;
        const transm = tickets.filter(t => t.status === 'TRANS_SM').length;
  
        setStats([
          { title: 'Tickets Ouverts', value: ouverts, icon: '📋', color: 'primary' },
          { title: 'En Cours', value: encours, icon: '⏳', color: 'warning' },
          { title: 'Transmettre à la société de maintenance', value: transm, icon: '🚚', color: 'primary' },
          { title: 'Résolus', value: resolus, icon: '✅', color: 'success' },
     
        ]);
  
        setChartData(generateChartData(tickets));
        setLoadingChart(false);
  
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques :', error);
      }
    };
  
    fetchData();
  }, []);
  


  const handleInputChange = async () => {
    try {
      const response = await api.updateTicketFields(selectedTicket.id, {
        foundProblem: selectedTicket.foundProblem,
        appliedSolution: selectedTicket.appliedSolution,
      });
      alert('Ticket mis à jour avec succès !');
      loadTickets();
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      alert('Une erreur est survenue.');
    }
  };
  
  
  

  const loadTickets = async () => {
    try {
      const response = await api.getAllTicketsAdmin();
      // Trier les tickets par date de création (du plus récent au plus ancien)
      const sortedTickets = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTickets(sortedTickets);
      //g("data:", sortedTickets);
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  };

  const handleAssign = async (ticketId) => {
    try {
      await api.assignTicket(ticketId, 1); // ID de l'admin
      loadTickets();
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  const handleResolve = async (ticketId) => {
    try {
      await api.resolveTicket(ticketId);
      loadTickets();
    } catch (error) {
      console.error("Error resolving ticket:", error);
    }
  };
  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await api.updateTicketStatus(ticketId, newStatus);
      if(newStatus ==="RESOLU")
      {
        await api.validateSI(ticketId);
      }
      loadTickets(); // Recharger la liste

    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };
  const handleClose = async (ticketId) => {
    try {
      await api.closeTicket(ticketId);
      loadTickets();
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  };

  const filteredTickets = tickets
  .filter(ticket => {
    const matchesSearch = 
      (searchTerm === '' || 
       ticket.problemDescription.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (serialNumberSearch === '' || 
       (ticket.serialNumber && ticket.serialNumber.toLowerCase().includes(serialNumberSearch.toLowerCase()))) &&
      (bureauSearch === '' || 
       (ticket.bureau && ticket.bureau.bureau.toLowerCase().includes(bureauSearch.toLowerCase()))) &&
      (serviceSearch === '' || 
       (ticket.service && ticket.service.name.toLowerCase().includes(serviceSearch.toLowerCase())));
    
    const matchesFilter = filter === 'all' || ticket.status === filter;
    
    return matchesSearch && matchesFilter;
  })
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Tri supplémentaire pour les tickets filtrés




  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10); // 10 éléments par page


// Calcul des tickets pour la page courante
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);


  const userData = localStorage.getItem('user');
  const bureau_id = localStorage.getItem('bureau_id');
  const service_id = localStorage.getItem('service_id');
  const department_id = localStorage.getItem('department_id');
  
  const parsedUser = userData ? JSON.parse(userData) : null;
  const parsedbureau_id = bureau_id ? JSON.parse(bureau_id) : null;
  const parsedservice_id = service_id ? JSON.parse(service_id) : null;
  const parseddepartment_id = department_id ? JSON.parse(department_id) : null;
  
  const displayUsername = parsedUser 
    ? parsedUser.username.charAt(0).toUpperCase()
    : 'A';


  useAutoLogout();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const navigate = useNavigate();
    const handleAvatarClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleClosee = () => {
      setAnchorEl(null);
    };
    
    const handleLogout = () => {
      localStorage.clear(); // ou uniquement les clés que tu veux
      navigate('/');
    };

    const handleDownloadReport = async (ticketId) => {
      try {
        const token = localStorage.getItem('token'); // Assure-toi que le token est bien récupéré
        const response = await fetch(`http://192.168.1.42:8082/api/tickets/${ticketId}/rapport`, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf',
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (!response.ok) {
          throw new Error("Erreur lors du téléchargement");
        }
    
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `rapport_ticket_${ticketId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } catch (error) {
        console.error("Erreur de téléchargement :", error);
        alert("Impossible de télécharger le rapport.");
      }
    };





  return (
    <Box sx={{ display: 'flex',width: 'calc(130% - 10px)' }}>
      <CssBaseline />
      
      {/* Barre de navigation */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tableau de Bord Admin
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton onClick={handleAvatarClick} color="inherit">
  <Avatar sx={{ marginLeft: 2 }}>{displayUsername}</Avatar>
</IconButton>
<Menu
  anchorEl={anchorEl}
  open={open}
  onClose={handleClosee}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
>
  <MenuItem disabled>
    <Typography variant="body1">{parsedUser?.nom} {parsedUser?.prenom}</Typography>
  </MenuItem>
  <MenuItem onClick={handleLogout}>
    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
    Déconnexion
  </MenuItem>
</Menu>
        </Toolbar>
      </AppBar>
      
      {/* Menu latéral */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: 0,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* Espace pour la barre d'appbar */}
        <Box sx={{ overflow: 'auto' }}>
          <List>

            <ListItem button component="a" href="/admin" sx={{ color: 'inherit', textDecoration: 'none' }}>
            <ListItemIcon><UsersIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
            <ListItem button>
              <ListItemIcon><TicketsIcon /></ListItemIcon>
              <ListItemText primary="Tickets" />
            </ListItem>
            <ListItem button component="a" href="/user" sx={{ color: 'inherit', textDecoration: 'none' }}>
            <ListItemIcon><UsersIcon /></ListItemIcon>
            <ListItemText primary="Utilisateurs" />
          </ListItem>

            <ListItem button>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Paramètres" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Contenu principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
        {/* Section Statistiques */}
{/* Section Statistiques */}
<Grid container spacing={3} sx={{ mb: 3 }}>
  {stats.map((stat, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}> {/* Modification de md à 2.4 */}
      <Card sx={{ backgroundColor: `${stat.color}.light` }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {stat.icon} {stat.title}
          </Typography>
          <Typography variant="h3" component="div" sx={{ mt: 2 }}>
            {stat.value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
 </Grid>

        {/* Section Graphique */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tickets par mois
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                {loadingChart ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                  </Box>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="tickets" fill="#8884d8" name="Nombre de tickets" />
                  </BarChart>
                )}
              </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tickets Récemment Créés
                </Typography>
                <List>
                  {tickets.slice(0, 3).map(ticket => (
                    <ListItem key={ticket.id}>
                      <ListItemText
                        primary={`#${ticket.id} - ${ticket.problemDescription.substring(0, 30)}...`}
                        secondary={`Par ${ticket.createdBy?.username}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Section Tableau des Tickets */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">Gestion des Tickets</Typography>
              <Button 
                variant="contained" 
                startIcon={<RefreshIcon />}
                onClick={loadTickets}
              >
                Actualiser
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
  {/* Recherche générale */}
  <TextField
    label="Recherche générale"
    variant="outlined"
    size="small"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    sx={{ flexGrow: 1, minWidth: 200 }}
  />
  
  {/* Numéro de série */}
  <TextField
    label="Numéro de série"
    variant="outlined"
    size="small"
    value={serialNumberSearch}
    onChange={(e) => setSerialNumberSearch(e.target.value)}
    sx={{ minWidth: 180 }}
  />
  
  {/* Bureau */}
  <TextField
    label="Bureau"
    variant="outlined"
    size="small"
    value={bureauSearch}
    onChange={(e) => setBureauSearch(e.target.value)}
    sx={{ minWidth: 180 }}
  />
  
  {/* Service */}
  <TextField
    label="Service"
    variant="outlined"
    size="small"
    value={serviceSearch}
    onChange={(e) => setServiceSearch(e.target.value)}
    sx={{ minWidth: 180 }}
  />
  
  {/* Filtre par statut */}
  <FormControl sx={{ minWidth: 180 }} size="small">
    <InputLabel>Statut</InputLabel>
    <Select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      label="Statut"
    >
      <MenuItem value="all">Tous</MenuItem>
      <MenuItem value="SI_SERVICE">Reçu</MenuItem>
      <MenuItem value="EN_COURS">En cours</MenuItem>
      <MenuItem value="RESOLU">Résolu</MenuItem>
      <MenuItem value="TRANS_SM">Société maintenance</MenuItem>
    </Select>
  </FormControl>
  
  <Button 
    variant="outlined" 
    startIcon={<FilterIcon />}
    onClick={() => {
      setSearchTerm('');
      setSerialNumberSearch('');
      setBureauSearch('');
      setServiceSearch('');
      setFilter('all');
    }}
  >
    Réinitialiser
  </Button>
</Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Numéro Série</TableCell>
                    <TableCell>Créé par</TableCell>
                    <TableCell>Bureau</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Département</TableCell>
                    <TableCell>Type Demande</TableCell>
                    <TableCell>Problème</TableCell>
                    <TableCell>Priorité</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Créé le
                    <ArrowDownwardIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
        {currentTickets.map((ticket) => (
          <TableRow key={ticket.id} hover>
            <TableCell>{ticket.id}</TableCell>
            <TableCell>
              <Typography noWrap>
              {ticket.serialNumber|| '-'}
              </Typography>
              </TableCell>
              <TableCell>{ticket.createdBy?.nom} {ticket.createdBy?.prenom}</TableCell>
            <TableCell>{ticket.bureau?.bureau || '-'}</TableCell>
            <TableCell>{ticket.service?.name || '-'}</TableCell>
            <TableCell>{ticket.department?.name}</TableCell>
            <TableCell>{ticket.typeDemande}</TableCell>
            <TableCell sx={{ maxWidth: 200 }}>
              <Typography noWrap>
                {ticket.problemDescription}
              </Typography>
            </TableCell>
            <TableCell>
              <Chip 
                label={ticket.priority} 
                color={
                  ticket.priority === 'HAUTE' ? 'error' : 
                  ticket.priority === 'MOYENNE' ? 'warning' : 'default'
                }
                size="small"
              />
            </TableCell>
            <TableCell>
  <Chip
   label={
    ticket.status === 'EN_COURS' ? 'En cours' :
    ticket.status === 'TRANS_SM' ? 'S. maintenance' :
    ticket.status === 'SI_SERVICE' ? 'Reçu par SI' :
    ticket.status === 'RESOLU' ? 'Résolu' : // Ajout pour 'RESOLU'
    ticket.status // Si aucune des conditions n'est remplie, affiche la valeur brute
   }
   color={
    ticket.status === 'OPEN' ? 'primary' :
    ticket.status === 'SI_SERVICE' ? 'secondary' :
    ticket.status === 'TRANS_SM' ? 'primary' :
    ticket.status === 'EN_COURS' ? 'warning' :
    ticket.status === 'RESOLU' ? 'success' : // Couleur pour 'RESOLU'
    'default' // Couleur par défaut si aucune condition n'est remplie
   }
   size="small"
  />
 </TableCell >
            <TableCell>
              {new Date(ticket.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell >
            <Box sx={{ display: 'flex', gap: 1 }}>
  <Tooltip title="Voir détails">
    <IconButton onClick={() => handleViewDetails(ticket)}>
      <ViewIcon color="primary" />
    </IconButton>
  </Tooltip>

  <Tooltip title="Mettre en cours">
    <IconButton onClick={() => handleUpdateStatus(ticket.id, 'EN_COURS')} color="warning">
      <HourglassTopIcon />
    </IconButton>
  </Tooltip>

      {/* Nouveau bouton pour transmettre à la société de maintenance */}
      <Tooltip title="Transmettre à la société de maintenance">
      <IconButton 
        onClick={() => handleUpdateStatus(ticket.id,'TRANS_SM')}
        color="info"

      >
        <ConstructionIcon color="primary"/>
      </IconButton>
    </Tooltip>

    <Tooltip title="Résoudre">
      <IconButton onClick={() => handleResolveClick(ticket)}>
        <ResolveIcon color="success" />
      </IconButton>
    </Tooltip>

  {/* ✅ Bouton de téléchargement */}
  <Tooltip title="Télécharger le rapport">
    <IconButton onClick={() => handleDownloadReport(ticket.id)}>
      <FileDownloadIcon color="secondary" />
    </IconButton>
  </Tooltip>
</Box>
            </TableCell>
          </TableRow>
        ))}
                </TableBody>
                 {/* Ajoutez ce dialogue à la fin de votre composant view */}
                 <Dialog 
  open={openDialog} 
  onClose={() => setOpenDialog(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Détails du Ticket #{selectedTicket?.id}</DialogTitle>
  <DialogContent dividers>
    {selectedTicket && (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Description complète
          </Typography>
          <Typography paragraph sx={{ whiteSpace: 'pre-line' }}>
            {selectedTicket.problemDescription}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Type de demande
          </Typography>
          <Typography paragraph sx={{ whiteSpace: 'pre-line' }}>
            {selectedTicket.typeDemande}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Section 1: Informations de base */}
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2">Numéro de série</Typography>
            <Typography>{selectedTicket.serialNumber || '-'}</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2">Bureau</Typography>
            <Typography>{selectedTicket.bureau?.bureau || '-'}</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2">Département</Typography>
            <Typography>{selectedTicket.department?.name || '-'}</Typography>
          </Grid>
          
          {/* Section 2: Informations supplémentaires */}
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2">Service</Typography>
            <Typography>{selectedTicket.service?.name || '-'}</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2">Type d'équipement</Typography>
            <Typography>
              {selectedTicket.equipmentType} 
              {selectedTicket.brand && ` (${selectedTicket.brand})`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2">Priorité</Typography>
            <Chip 
              label={selectedTicket.priority} 
              color={
                selectedTicket.priority === 'HIGH' ? 'error' : 
                selectedTicket.priority === 'MEDIUM' ? 'warning' : 'default'
              }
            />
          </Grid>
          
          {/* Section 3: Dates et statut */}
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2">Statut</Typography>
            <Chip 
              label={selectedTicket.status} 
              color={
                selectedTicket.status === 'OPEN' ? 'primary' : 
                selectedTicket.status === 'IN_PROGRESS' ? 'warning' : 'success'
              }
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2">Créé par</Typography>
            <Typography>{selectedTicket.createdBy?.username || 'Non spécifié'}</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2">Date de création</Typography>
            <Typography>
              {new Date(selectedTicket.createdAt).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2">Dernière mise à jour</Typography>
            <Typography>
              {new Date(selectedTicket.updatedAt || selectedTicket.createdAt).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>

{/* Section pour d'autres détails si nécessaire */}
<Box>
  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
    Autres informations
  </Typography>

  <Box sx={{ mt: 2 }}>
    <Typography variant="subtitle2">Problème trouvé</Typography>
    <TextField
      multiline
      fullWidth
      rows={3}
      variant="outlined"
      value={selectedTicket.foundProblem || ''}
      onChange={(e) =>
        setSelectedTicket((prev) => ({
          ...prev,
          foundProblem: e.target.value,
        }))
      }
    />
  </Box>

  <Box sx={{ mt: 2 }}>
    <Typography variant="subtitle2">Solution effectuée</Typography>
    <TextField
      multiline
      fullWidth
      rows={3}
      variant="outlined"
      value={selectedTicket.appliedSolution || ''}
      onChange={(e) =>
        setSelectedTicket((prev) => ({
          ...prev,
          appliedSolution: e.target.value,
        }))
      }
    />
  </Box>

  {/* ✅ Bouton pour valider */}
  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
    <Button variant="contained" color="primary" onClick={handleInputChange}>
      Valider les modifications
    </Button>
  </Box>
</Box>

      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)} color="primary">
      Fermer
    </Button>
  </DialogActions>
</Dialog>

{/* Ajoutez ce dialogue à la fin de votre composant Problème trouvé avant le resolution */}
{/* Dialogue pour la résolution */}
<Dialog 
  open={resolveDialogOpen} 
  onClose={() => setResolveDialogOpen(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Résoudre le Ticket #{ticketToResolve?.id}</DialogTitle>
  <DialogContent dividers>
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
        Informations de résolution
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Problème trouvé</Typography>
        <TextField
          multiline
          fullWidth
          rows={3}
          variant="outlined"
          value={selectedTicket?.foundProblem || ''}
          onChange={(e) =>
            setSelectedTicket((prev) => ({
              ...prev,
              foundProblem: e.target.value,
            }))
          }
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Solution effectuée</Typography>
        <TextField
          multiline
          fullWidth
          rows={3}
          variant="outlined"
          value={selectedTicket?.appliedSolution || ''}
          onChange={(e) =>
            setSelectedTicket((prev) => ({
              ...prev,
              appliedSolution: e.target.value,
            }))
          }
        />
      </Box>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setResolveDialogOpen(false)} color="primary">
      Annuler
    </Button>
    <Button 
      variant="contained" 
      color="success" 
      onClick={handleConfirmResolve}
    >
      Confirmer la résolution
    </Button>
  </DialogActions>
</Dialog>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Pagination
  count={totalPages}
  page={currentPage}
  onChange={(event, page) => setCurrentPage(page)}
  color="primary"
  sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
/>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard;