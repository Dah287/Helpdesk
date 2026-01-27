import { useState, useEffect } from 'react';
import { 
  Box, CssBaseline, AppBar, Toolbar, Typography, Checkbox,FormControlLabel,
  Avatar, Drawer, List, ListItem, ListItemIcon, 
  ListItemText, Grid, Card, CardContent, TextField,
  Button, Select, MenuItem, FormControl, InputLabel,
  TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, IconButton, Tooltip, Paper,Menu,Divider,
  Dialog, DialogTitle, DialogContent, DialogActions // Nouveaux imports
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ListAlt as TicketsIcon,
  People as UsersIcon,
  BarChart as BarChartIcon,
   Receipt as ReceiptIcon,
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
import { useNavigate,useLocation } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // 🔽 icône de téléchargement
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { CircularProgress } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // ✅ Nouvelle icône d’aide
import { Add, Edit, Delete ,CheckCircle} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
const TicketsComponent = () => {
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

const [selectedSolutions, setSelectedSolutions] = useState([]);

useEffect(() => {
  if (selectedTicket) { // Vérifiez qu'un ticket est sélectionné
    const formatted = formatAppliedSolution();
    setSelectedTicket(prev => ({
      ...prev,
      appliedSolution: formatted
    }));
  }
}, [selectedSolutions]);
// const solutions = [
//   "Fourniture et remplacement de Carte mère (PC Fixe)",
//   "Fourniture et remplacement de Carte mère (PC Portable)",
//   "Fourniture et remplacement de Ventilateur du CPU",
//   "Fourniture et remplacement de RAM 8Go (PC Fixe)",
//   "Fourniture et remplacement de RAM 8Go (PC Portable)",
//   "Fourniture et remplacement de Disque dur",
//   "Fourniture et remplacement de Bloc d'alimentation",
//   "Fourniture et remplacement de Ventilateur UC (PC Fixe)",
//   "Fourniture et remplacement de Clavier (PC Portable)",
//   "Fourniture et remplacement de Souris (PC Portable)",
//   "Fourniture et remplacement de l'Ecran",
//   "Installation complète du Système : Windows, Office, ...",
//   "Fourniture et remplacement de la carte mère",
//   "Fourniture et remplacement de Bloc d'alimentation",
//   "Fourniture et remplacement de l'acteur papier",
//   "Fourniture et remplacement de Roller d'entraînement papier",
//   "Fourniture et remplacement d'Eprouvette papier",
//   "Fourniture et remplacement de Kit de fusion (laser)",
//   "Fourniture et remplacement de Kit de fusion (Couleur)",
//   "Fourniture et remplacement de Kit de transfert",
//   "Fourniture et remplacement de Four (Couleur)",
//   "Fourniture et remplacement de Carte d'alimentation",
//   "Fourniture et remplacement de Ram",
//   "Fourniture et remplacement de Carte d'interface",
//   "Fourniture et remplacement de Roller d'entraînement papier",
//   "Fourniture et remplacement de Détecteur de papier",
//   "Problème de l’onduleur",
//   "Autres problèmes techniques"
// ];

const [solutions, setSolutions] = useState([]);
const [loadingSolutions, setLoadingSolutions] = useState(false);

const [searchTermSolution, setSearchTermSolution] = useState(''); // Pour filtrer la liste

useEffect(() => {
  const fetchSolutions = async () => {
    try {
      setLoadingSolutions(true);
      const token = sessionStorage.getItem('token');
      const res = await fetch('http://192.168.1.14:8083/api/admin/config/solutions', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      
      // Nettoyage : Suppression des doublons et tri par ordre alphabétique
      const uniqueSorted = [...new Set(data)].sort((a, b) => a.localeCompare(b));
      setSolutions(uniqueSorted);
    } catch (error) {
      console.error("Erreur chargement solutions :", error);
    } finally {
      setLoadingSolutions(false);
    }
  };
  fetchSolutions();
}, []);

// Filtrage dynamique de la liste affichée
const filteredSolutions = solutions.filter(s => 
  s.toLowerCase().includes(searchTermSolution.toLowerCase())
);
const location = useLocation();
const currentPath = location.pathname;
const isActive = (path) => currentPath === path;
const toggleSolution = (solution) => {
  setSelectedSolutions((prev) =>
    prev.includes(solution)
      ? prev.filter((s) => s !== solution)
      : [...prev, solution]
  );
};

const formatAppliedSolution = () => {
  if (selectedSolutions.length === 0) return '';
  return selectedSolutions.map(s => `- ${s}`).join('\n');
};

  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [ticketToResolve, setTicketToResolve] = useState(null);

const handleResolveClick = (ticket) => {
  setTicketToResolve(ticket);
  setSelectedTicket(ticket);

  // --- AJOUTEZ CECI ---
  // On récupère la chaîne "appliedSolution" (ex: "- Solution A\n- Solution B")
  // On la nettoie pour recréer le tableau de solutions sélectionnées
  if (ticket.appliedSolution) {
    const existingSolutions = ticket.appliedSolution
      .split('\n')
      .map(line => line.replace(/^- /, '').trim()) // Enlève le tiret et les espaces
      .filter(line => line !== ""); // Enlève les lignes vides
    
    setSelectedSolutions(existingSolutions);
  } else {
    setSelectedSolutions([]); // Vide si aucune solution n'existe
  }
  // --------------------

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
    const sortedTickets = response.data.sort((a, b) => {
      const aIsSI = a.status === 'SI_SERVICE';
      const bIsSI = b.status === 'SI_SERVICE';
      if (aIsSI && !bIsSI) return -1;
      if (!aIsSI && bIsSI) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    setTickets(sortedTickets);
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
  .sort((a, b) => {
    const aIsSI = a.status === 'SI_SERVICE';
    const bIsSI = b.status === 'SI_SERVICE';
    if (aIsSI && !bIsSI) return -1;
    if (!aIsSI && bIsSI) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });


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

    const handleDeleteTicket = async (ticketId) => {
  const confirm = window.confirm("Voulez-vous vraiment supprimer ce ticket ?");
  if (!confirm) return;

  try {
    await api.deleteTicket(ticketId);
    loadTickets();
    alert("Ticket supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    alert("Erreur lors de la suppression du ticket");
  }
};






  return (
<Box sx={{ display: 'flex', flexGrow: 1 ,marginLeft : '50px'}}>

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


        {/* Section Graphique */}


        {/* Section Tableau des Tickets */}
        <Card>
          <CardContent>
           <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
    color: "white",
    px: 4,
    py: 2,
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    mb: 3, // ✅ espace sous le cadre
  }}
>
  <Typography variant="h5" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
    Gestion des Tickets
  </Typography>

  <Button
    variant="contained"
    onClick={loadTickets}
    startIcon={<RefreshIcon />}
    sx={{
      backgroundColor: "white",
      color: "#1976d2",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "#e3f2fd",
      },
      borderRadius: "10px",
      textTransform: "none",
    }}
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

            <TableContainer component={Paper}sx={{ width: '100%', overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Numéro Série</TableCell>
                    <TableCell>Créé par</TableCell>
                    <TableCell>Bureau</TableCell>
                    <TableCell>Département</TableCell>
                    <TableCell >Service</TableCell>
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
            <TableCell sx={{ maxWidth: 160 }}>
              <Typography noWrap>
              {ticket.serialNumber|| '-'}
              </Typography>
              </TableCell>
              <TableCell  sx={{ maxWidth: 166 }}>{ticket.createdBy?.nom} {ticket.createdBy?.prenom}</TableCell>
<TableCell sx={{ maxWidth: 140 }}>
  {(!ticket.createdBy.bureau?.bureau || ticket.createdBy.bureau?.bureau === "NAN") 
    ? "Aucun" 
    : ticket.createdBy.bureau.bureau}
</TableCell>

<TableCell>
  {(!ticket.createdBy.department?.name || ticket.createdBy.department?.name === "NAN") 
    ? "Aucun" 
    : ticket.createdBy.department.name}
</TableCell>

<TableCell sx={{ maxWidth: 150 }}>
  {(!ticket.createdBy.service?.name || ticket.createdBy.service?.name === "NAN") 
    ? "Aucun" 
    : ticket.createdBy.service.name}
</TableCell>
            <TableCell>{ticket.typeDemande}</TableCell>
            <TableCell sx={{ maxWidth: 190 }}>
              <Typography noWrap>
                {ticket.problemDescription}
              </Typography>
            </TableCell>
            <TableCell sx={{ maxWidth: 120 }}>
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
<TableCell sx={{ width: '10px', whiteSpace: 'nowrap' }}>
  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-start' }}>


    {/* 🔴 Supprimer Ticket */}
    <Tooltip title="Supprimer">
      <IconButton
      size="small"
        onClick={() => handleDeleteTicket(ticket.id)}
        color="error"
      >
        <Delete />
      </IconButton>
    </Tooltip>


    <Tooltip title="Voir détails">
      <IconButton 
      size="small"
      onClick={() => handleViewDetails(ticket)}>
        <ViewIcon color="primary" />
      </IconButton>
    </Tooltip>

    {/* Bouton Mettre en cours - Désactivé si résolu */}
    <Tooltip title="Mettre en cours">
      <span> {/* Ajout d'un wrapper span pour le tooltip sur élément désactivé */}
        <IconButton 
        size="small"
          onClick={() => handleUpdateStatus(ticket.id, 'EN_COURS')} 
          color="warning"
          disabled={ticket.status === "RESOLU"} // Adaptez la valeur selon votre enum
        >
          <HourglassTopIcon />
        </IconButton>
      </span>
    </Tooltip>

    {/* Bouton Transmettre - Désactivé si résolu */}
    <Tooltip title="Transmettre à la société de maintenance">
      <span>
        <IconButton 
        size="small"
          onClick={() => handleUpdateStatus(ticket.id, 'TRANS_SM')}
          color="info"
          disabled={ticket.status === "RESOLU"} // Adaptez la valeur selon votre enum
        >
          <ConstructionIcon color="primary"/>
        </IconButton>
      </span>
    </Tooltip>

    {/* Bouton Résoudre */}
    <Tooltip title="Résoudre">
      <IconButton 
      size="small"
      onClick={() => handleResolveClick(ticket)}>
        <ResolveIcon color="success" />
      </IconButton>
    </Tooltip>

    <Tooltip title="Télécharger le rapport">
      <IconButton 
      size="small"
      onClick={() => handleDownloadReport(ticket.id)}
        disabled={ticket.status !== "RESOLU"}>
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
  PaperProps={{
    sx: {
      borderRadius: 3,
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      background: "linear-gradient(180deg, #ffffff, #f5f7fa)",
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: "bold",
      color: "#1565c0",
      fontSize: "1.5rem",
      textAlign: "center",
      borderBottom: "2px solid #e0e0e0",
      pb: 1,
    }}
  >
    🎫 Détails du Ticket #{selectedTicket?.id}
  </DialogTitle>

  <DialogContent dividers sx={{ p: 4 }}>
    {selectedTicket && (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* 🧾 Description */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              mb: 1,
            }}
          >
            Description complète
          </Typography>
          <Typography
            paragraph
            sx={{
              whiteSpace: "pre-line",
              color: "#424242",
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              p: 2,
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {selectedTicket.problemDescription}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              mt: 2,
              mb: 1,
            }}
          >
            Type de demande
          </Typography>
          <Typography
            paragraph
            sx={{
              whiteSpace: "pre-line",
              color: "#424242",
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              p: 2,
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {selectedTicket.typeDemande}
          </Typography>
        </Box>

        {/* 📋 Informations principales */}
        <Grid container spacing={2}>
          {[
            { label: "Numéro de série", value: selectedTicket.serialNumber },
  { label: "Bureau", value: selectedTicket?.createdBy?.bureau?.bureau || '-' },
  { label: "Département", value: selectedTicket?.createdBy?.department?.name || '-' },
  { label: "Service", value: selectedTicket?.createdBy?.service?.name || '-' },
            {
              label: "Type d'équipement",
              value: `${selectedTicket.equipmentType || ""}${
                selectedTicket.brand ? ` (${selectedTicket.brand})` : ""
              }`,
            },
          ].map((item, index) => (
            <Grid item xs={6} sm={4} key={index}>
              <Typography variant="subtitle2" sx={{ color: "#1976d2" }}>
                {item.label}
              </Typography>
              <Typography color="text.secondary">
                {item.value || "-"}
              </Typography>
            </Grid>
          ))}

          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" sx={{ color: "#1976d2" }}>
              Priorité
            </Typography>
            <Chip
              label={selectedTicket.priority}
              color={
                selectedTicket.priority === "HIGH"
                  ? "error"
                  : selectedTicket.priority === "MEDIUM"
                  ? "warning"
                  : "default"
              }
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" sx={{ color: "#1976d2" }}>
              Statut
            </Typography>
            <Chip
              label={selectedTicket.status}
              color={
                selectedTicket.status === "OPEN"
                  ? "primary"
                  : selectedTicket.status === "IN_PROGRESS"
                  ? "warning"
                  : "success"
              }
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" sx={{ color: "#1976d2" }}>
              Créé par
            </Typography>
            <Typography color="text.secondary">
              {selectedTicket.createdBy?.username || "Non spécifié"}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" sx={{ color: "#1976d2" }}>
              Date de création
            </Typography>
            <Typography color="text.secondary">
              {new Date(selectedTicket.createdAt).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" sx={{ color: "#1976d2" }}>
              Dernière mise à jour
            </Typography>
            <Typography color="text.secondary">
              {new Date(
                selectedTicket.updatedAt || selectedTicket.createdAt
              ).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>

        {/* 💡 Section Lecture Seule : Problème + Solution */}
        <Box
          sx={{
            mt: 3,
            p: 3,
            border: "1px solid #e0e0e0",
            borderRadius: 3,
            background: "#fdfdfd",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#1565c0",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            🔍 Diagnostic technique
          </Typography>

          {/* Problème trouvé */}
          <Box
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              p: 2,
              mb: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "#1976d2", mb: 1, fontWeight: "500" }}
            >
              Problème trouvé
            </Typography>
            <Typography
              sx={{
                whiteSpace: "pre-line",
                color: "#333",
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              {selectedTicket.foundProblem || "Aucun problème renseigné"}
            </Typography>
          </Box>

          {/* Solution effectuée */}
          <Box
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              p: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "#1976d2", mb: 1, fontWeight: "500" }}
            >
              Solution effectuée
            </Typography>
            <Typography
              sx={{
                whiteSpace: "pre-line",
                color: "#333",
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              {selectedTicket.appliedSolution || "Aucune solution renseignée"}
            </Typography>
          </Box>
        </Box>
      </Box>
    )}
  </DialogContent>

  <DialogActions sx={{ p: 2.5, justifyContent: "center" }}>
    <Button
      onClick={() => setOpenDialog(false)}
      variant="contained"
      sx={{
        px: 4,
        py: 1,
        borderRadius: 2,
        backgroundColor: "#1976d2",
        "&:hover": {
          backgroundColor: "#115293",
        },
      }}
    >
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
  PaperProps={{
    sx: { borderRadius: 4, p: 1, bgcolor: '#fefefe' }
  }}
>
  <DialogTitle sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    Résolution du Ticket #{ticketToResolve?.id}
    <IconButton onClick={() => setResolveDialogOpen(false)}><CloseIcon /></IconButton>
  </DialogTitle>

  <DialogContent dividers sx={{ px: 3 }}>
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1, fontWeight: 700 }}>
        <ReportProblemOutlinedIcon sx={{ mr: 1, color: 'warning.main' }} />
        Problème trouvé
      </Typography>
      <TextField
        required multiline fullWidth rows={2}
        variant="outlined"
        placeholder="Décrivez le problème réel identifié..."
        value={selectedTicket?.foundProblem || ''}
        onChange={(e) => setSelectedTicket(prev => ({ ...prev, foundProblem: e.target.value }))}
        error={!selectedTicket?.foundProblem}
      />
    </Box>

    <Box>
      <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 1, fontWeight: 700 }}>
        <CheckCircleOutlineIcon sx={{ mr: 1, color: 'success.main' }} />
        Sélectionner la/les solution(s) effectuée(s)
      </Typography>

      {/* Barre de recherche interne pour les solutions */}
      <TextField
        fullWidth
        size="small"
        placeholder="Rechercher une solution (ex: Carte mère, Windows...)"
        sx={{ mb: 1 }}
        value={searchTermSolution}
        onChange={(e) => setSearchTermSolution(e.target.value)}
      />

      <Box sx={{ 
        maxHeight: 250, 
        overflowY: 'auto', 
        border: '1px solid #e0e0e0', 
        borderRadius: 2, 
        p: 2,
        bgcolor: '#f9f9f9'
      }}>
        {loadingSolutions ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={30} /></Box>
        ) : (
          <Grid container spacing={1}>
            {filteredSolutions.map((solution) => (
              <Grid item xs={12} sm={6} key={solution}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedSolutions.includes(solution)} // <--- TRÈS IMPORTANT
                      onChange={() => toggleSolution(solution)}
                    />
                  }
                  label={<Typography variant="body2">{solution}</Typography>}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Aperçu du résultat final */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="textSecondary">Aperçu du rapport :</Typography>
        <TextField
          fullWidth multiline rows={3} disabled
          variant="filled"
          value={formatAppliedSolution()}
          InputProps={{ sx: { fontSize: 13, lineHeight: 1.4, bgcolor: '#f0f0f0' } }}
          helperText={!selectedSolutions.length ? "Veuillez cocher au moins une solution." : ""}
          error={!selectedSolutions.length}
        />
      </Box>
    </Box>
  </DialogContent>

  <DialogActions sx={{ px: 3, py: 2 }}>
    <Button onClick={() => setResolveDialogOpen(false)} color="inherit">Annuler</Button>
    <Button
      variant="contained"
      color="success"
      disabled={!selectedTicket?.foundProblem || selectedSolutions.length === 0}
      onClick={handleConfirmResolve}
      sx={{ borderRadius: 2, px: 4 }}
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

export default TicketsComponent;