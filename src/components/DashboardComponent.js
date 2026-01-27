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
 BarChart as BarChartIcon,
   Receipt as ReceiptIcon,
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
import { useNavigate,useLocation } from 'react-router-dom';
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // ✅ Nouvelle icône d’aide
import { Add, Edit, Delete ,CheckCircle} from '@mui/icons-material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // 🔽 icône de téléchargement
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
const DashboardComponent = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [period, setPeriod] = useState('6'); // '6' | '12' | 'all'


  const [searchTerm, setSearchTerm] = useState('');
const [serialNumberSearch, setSerialNumberSearch] = useState('');
const [bureauSearch, setBureauSearch] = useState('');
const [serviceSearch, setServiceSearch] = useState('');

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);


const location = useLocation();
const currentPath = location.pathname;
const isActive = (path) => currentPath === path;



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
const ALLOWED_STATUSES = ["SI_SERVICE", "EN_COURS", "TRANS_SM", "RESOLU"];

// Fonction pour générer les données du graphique
const generateChartData = (tickets, period) => {

  // ✅ 1. Filtrer les tickets par statut
  const filteredTickets = tickets.filter(ticket =>
    ALLOWED_STATUSES.includes(ticket.status)
  );

  const monthlyData = {};

  filteredTickets.forEach(ticket => {
    const date = new Date(ticket.createdAt.replace(' ', 'T'));
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    monthlyData[key] = (monthlyData[key] || 0) + 1;
  });

  const monthsNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  let monthsToShow = [];

  if (period === 'all') {
    monthsToShow = Object.keys(monthlyData)
      .sort()
      .map(key => {
        const [year, month] = key.split('-');
        return new Date(year, month);
      });
  } else {
    const count = parseInt(period);
    let startYear = 2025;
    let startMonth = 11; // Décembre

    for (let i = 0; i < count; i++) {
      let month = startMonth + i;
      let year = startYear;

      while (month > 11) {
        month -= 12;
        year += 1;
      }

      monthsToShow.push(new Date(year, month));
    }
  }

  return monthsToShow.map(d => {
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    return {
      name: `${monthsNames[d.getMonth()]} ${d.getFullYear()}`,
      tickets: monthlyData[key] || 0
    };
  });
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
    { title: 'Tickets En Attente d\'Action', value: 0, icon: '🕒', color: 'info' }, // 👈 ajout ici
    { title: 'En Cours', value: 0, icon: '⏳', color: 'warning' },
    { title: 'Société de Maintenance', value: 0, icon: '🚚', color: 'primary' }, // Ajout ici
    { title: 'Résolus', value: 0, icon: '✅', color: 'success' },

   ]);

  useEffect(() => {
    loadTickets();


  }, []);

  useEffect(() => {
  if (tickets.length > 0) {
    setChartData(generateChartData(tickets, period));
  }
}, [period, tickets]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token'); // 👈 récupération du token
        if (!token) {
          console.error("Token manquant !");
          return;
        }
  
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        const [ticketsRes, usersRes] = await Promise.all([
          fetch('http://192.168.1.14:8083/api/tickets', { headers }),
          fetch('http://192.168.1.14:8083/api/utilisateurs', { headers }),
        ]);
  
        //g("ticketsRes :", ticketsRes);
        //g("usersRes :", usersRes);
  
        const tickets = await ticketsRes.json();
        const users = await usersRes.json();
  
        const total = tickets.length;
        const tickATTAction = tickets.filter(t =>
            ['SI_SERVICE', 'EN_COURS', 'RESOLU', 'TRANS_SM'].includes(t.status)
          ).length;
          
        const ouverts = tickets.filter(t => t.status === 'SI_SERVICE').length;
        const encours = tickets.filter(t => t.status === 'EN_COURS').length;
        const resolus = tickets.filter(t => t.status === 'RESOLU').length;
        const transm = tickets.filter(t => t.status === 'TRANS_SM').length;
  
        setStats([
          { title: 'Tickets Ouverts', value: tickATTAction, icon: '📋', color: 'primary' },
          { title: 'Tickets En Attente d\'Action', value: ouverts, icon: '🕒', color: 'info' }, // 👈 ajout ici
          { title: 'En Cours', value: encours, icon: '⏳', color: 'warning' },
          { title: 'Société de Maintenance', value: transm, icon: '🚚', color: 'primary' },
          { title: 'Résolus', value: resolus, icon: '✅', color: 'success' },
     
        ]);
  
    setChartData(generateChartData(tickets, period));

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


  const userData = sessionStorage.getItem('user');
  const bureau_id = sessionStorage.getItem('bureau_id');
  const service_id = sessionStorage.getItem('service_id');
  const department_id = sessionStorage.getItem('department_id');
  
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
      sessionStorage.clear(); // ou uniquement les clés que tu veux
      navigate('/');
    };

    const handleDownloadReport = async (ticketId) => {
      try {
        const token = sessionStorage.getItem('token'); // Assure-toi que le token est bien récupéré
        const response = await fetch(`http://192.168.1.14:8083/api/tickets/${ticketId}/rapport`, {
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
    <Box sx={{ display: 'flex',width: 'calc(130% - 10px)' ,marginLeft : '100px' }}>
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
{/* 🆘 Aide & Support */}
<Tooltip title="Aide & Support">
  <IconButton
    color="inherit"
    onClick={() =>
      window.open(
        "https://drive.google.com/drive/folders/1POWOkSsoqXDKTLHVIzFmqEOyZ5nG65fu?usp=sharing",
        "_blank"
      )
    }
  >
    <SupportAgentIcon />
  </IconButton>
</Tooltip>


{/* 🔔 Notifications */}
<Tooltip title="Notifications">
  <IconButton color="inherit">
    <NotificationsIcon />
  </IconButton>
</Tooltip>
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
    {/* ✅ Nouveau MenuItem pour changer le mot de passe */}
  <MenuItem onClick={() => {
      handleClosee();               // fermer le menu
      navigate('/change-password'); // rediriger vers la page changement de mot de passe
  }}>
    <Edit fontSize="small" sx={{ mr: 1 }} />
    Changer mot de passe
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
    [`& .MuiDrawer-paper`]: { width: 180, boxSizing: 'border-box' },
  }}
>
  <Toolbar /> {/* Espace pour la barre d'appbar */}
  
  {/* 🔹 Nom de l'application + version */}
  <Box
    sx={{
      px: 2,
      py: 1.5,
      backgroundColor: '#1976d2', // bleu primaire (selon votre thème)
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      borderBottom: '1px solid rgba(255,255,255,0.2)',
    }}
  >
    <Typography variant="body2" noWrap>
      IT GTickets
    </Typography>
    <Typography variant="caption" sx={{ opacity: 0.9 }}>
      v2.1.7
    </Typography>
  </Box>
        <Box sx={{ overflow: 'auto' }}>
<List>
  <ListItem
    button
    component="a"
    href="/admin/Dashboard"
    sx={{
      color: 'inherit',
      textDecoration: 'none',
      backgroundColor: isActive('/admin/Dashboard') ? '#1976d2' : 'transparent',
      color: isActive('/admin/Dashboard') ? 'white' : 'inherit',
      '&:hover': {
        backgroundColor: isActive('/admin/Dashboard') ? '#1565c0' : '#eeeeee',
      },
    }}
  >
    <ListItemIcon>
      <BarChartIcon sx={{ color: isActive('/admin/Dashboard') ? 'white' : 'inherit' }} />
    </ListItemIcon>
    <ListItemText primary="Dashboard" />
  </ListItem>

  <ListItem
    button
    component="a"
    href="/admin/Tickets"
    sx={{
      color: 'inherit',
      textDecoration: 'none',
      backgroundColor: isActive('/admin/Tickets') ? '#1976d2' : 'transparent',
      color: isActive('/admin/Tickets') ? 'white' : 'inherit',
      '&:hover': {
        backgroundColor: isActive('/admin/Tickets') ? '#1565c0' : '#eeeeee',
      },
    }}
  >
    <ListItemIcon>
      <TicketsIcon sx={{ color: isActive('/admin/Tickets') ? 'white' : 'inherit' }} />
    </ListItemIcon>
    <ListItemText primary="Tickets" />
  </ListItem>

  <ListItem
    button
    component="a"
    href="/admin/user"
    sx={{
      color: 'inherit',
      textDecoration: 'none',
      backgroundColor: isActive('/admin/user') ? '#1976d2' : 'transparent',
      color: isActive('/admin/user') ? 'white' : 'inherit',
      '&:hover': {
        backgroundColor: isActive('/admin/user') ? '#1565c0' : '#eeeeee',
      },
    }}
  >
    <ListItemIcon>
      <UsersIcon sx={{ color: isActive('/admin/user') ? 'white' : 'inherit' }} />
    </ListItemIcon>
    <ListItemText primary="Utilisateurs" />
  </ListItem>

  <ListItem
    button
    component="a"
    href="/admin/vision-globale"
    sx={{
      color: 'inherit',
      textDecoration: 'none',
      backgroundColor: isActive('/admin/vision-globale') ? '#1976d2' : 'transparent',
      color: isActive('/admin/vision-globale') ? 'white' : 'inherit',
      '&:hover': {
        backgroundColor: isActive('/admin/vision-globale') ? '#1565c0' : '#eeeeee',
      },
    }}
  >
    <ListItemIcon>
      <ReceiptIcon sx={{ color: isActive('/admin/vision-globale') ? 'white' : 'inherit' }} />
    </ListItemIcon>
    <ListItemText primary="Vision globale" />
  </ListItem>

  <ListItem
    button
    sx={{
      color: 'inherit',
      textDecoration: 'none',
      backgroundColor: isActive('/admin/parametres') ? '#1976d2' : 'transparent',
      color: isActive('/admin/parametres') ? 'white' : 'inherit',
      '&:hover': {
        backgroundColor: isActive('/admin/parametres') ? '#1565c0' : '#eeeeee',
      },
    }}
    onClick={() => navigate('/admin/parametres')}
  >
    <ListItemIcon>
      <SettingsIcon sx={{ color: isActive('/admin/parametres') ? 'white' : 'inherit' }} />
    </ListItemIcon>
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
    <Grid item xs={12} sm={6} md={2.4} key={index}> {/* Modification de md à 2.4 */}
      <Card sx={{ backgroundColor: `${stat.color}.light` }}>
        <CardContent>
          <Typography variant="h7" component="div">
            {stat.icon} {stat.title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ mt: 2 }}>
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

<FormControl size="small" sx={{ mb: 2, minWidth: 200 }}>
  <InputLabel>Période</InputLabel>
  <Select
    value={period}
    label="Période"
    onChange={(e) => setPeriod(e.target.value)}
  >
    <MenuItem value="6">6 derniers mois</MenuItem>
    {/* <MenuItem value="12">12 derniers mois</MenuItem> */}
    <MenuItem value="all">Tous les mois</MenuItem>
  </Select>
</FormControl>


                <ResponsiveContainer width="100%" height={500}>
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
                  {tickets.slice(0, 7).map(ticket => (
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


      </Box>
    </Box>
  );
};

export default DashboardComponent;