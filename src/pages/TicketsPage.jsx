import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, Chip,Menu,
  Typography, Box, AppBar, Toolbar, IconButton, Avatar
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Add, Edit, Delete } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import api from '../services/api';
import useAutoLogout from './useAutoLogout';

import { useNavigate } from 'react-router-dom';
const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Récupérer l'élément 'user' du sessionStorage
const userData = sessionStorage.getItem('user');
const [allTickets, setAllTickets] = useState([]);  // référence complète

const bureau_id = sessionStorage.getItem('bureau_id');
const service_id = sessionStorage.getItem('service_id');
const department_id = sessionStorage.getItem('department_id');
const parseddepartment_id = department_id ? JSON.parse(department_id) : null;
const parsedbureau_id = bureau_id ? JSON.parse(bureau_id) : null;
const parsedservice_id = service_id ? JSON.parse(service_id) : null;


// Si l'élément existe, on le parse (car il a été stringify)
if (userData) {
  const parsedUser = JSON.parse(userData);
  //g(parsedUser); // Vous pouvez maintenant accéder aux données de l'utilisateur
} else {
  //g('Aucune donnée utilisateur trouvée');
}
const parsedUser = userData ? JSON.parse(userData) : null;

  // Si parsedUser existe, afficher uniquement la première lettre du username en majuscule
  const displayUsername = parsedUser 
    ? parsedUser.username.charAt(0).toUpperCase()
    : 'A'; // Valeur par défaut si parsedUser est null


  useEffect(() => {
    loadTickets();
  }, []);

// ---- chargement initial -------------------------------------------------
const loadTickets = async () => {
  try {
    //g('username :', parsedUser.username);
    const res = await api.getByUserName(parsedUser.username);

    //g('data :', res.data);
    setAllTickets(res.data);   // garde tout
    setTickets(res.data);      // montre tout
  } catch (err) {
    console.error('Error loading tickets:', err);
  }
};

// ---- filtre local -------------------------------------------------------
const handleFilter = (status) => {
  setFilter(status);
  setTickets(
    status === 'all'
      ? allTickets
      : allTickets.filter(t => t.status === status)
  );
};

  const handleDelete = async (id) => {
    try {
      await api.deleteTicket(id);
      setTickets(tickets.filter(ticket => ticket.id !== id));
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const searchTerm = search.toLowerCase();
    return (
      // (ticket.department?.name || '').toLowerCase().includes(searchTerm) ||
      // (ticket.service?.name || '').toLowerCase().includes(searchTerm) ||
      // (ticket.bureau?.name || '').toLowerCase().includes(searchTerm) ||
      // (ticket.equipmentType || '').toLowerCase().includes(searchTerm) ||
      (ticket.problemDescription || '').toLowerCase().includes(searchTerm)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_COURS': return 'warning';
      case 'RESOLU': return 'success';
      case 'TRANS_SM': return 'primary';
      case 'BUREAU_VALIDATED': return 'info';
      case 'SI_SERVICE': return 'secondary';
      default: return 'default';
    }
  };

  useAutoLogout();
const [anchorEl, setAnchorEl] = useState(null);
const open = Boolean(anchorEl);

const navigate = useNavigate();
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    sessionStorage.clear(); // ou uniquement les clés que tu veux
    navigate('/');
  };
  return (
    <>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* {parsedUser.role === "NORMALE" && `Agent - ${parsedbureau_id.bureau}`} */}
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
            onClose={handleClose}
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

      {/* Main content */}
      <Box sx={{ p: 3, width: 'calc(160% - 240px)', marginTop: '64px' }}>
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mt: 3, // marge au-dessus
    mb: 4, // ✅ marge en dessous pour séparer du tableau
  }}
>
  <Box
    sx={{
      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      color: "white",
      px: 4,
      py: 2,
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      textAlign: "center",
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
       Espace de création de ticket
    </Typography>
  </Box>
</Box>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => window.location.href = '/new-ticket'}
            sx={{ minWidth: 180 }}
          >
            Nouveau Ticket
          </Button>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Statut</InputLabel>
            <Select
              value={filter}
              onChange={(e) => handleFilter(e.target.value)}
              label="Statut"
            >
              <MenuItem value="all">Tous</MenuItem>    
              <MenuItem value="SI_SERVICE">Reçu Par SI</MenuItem>
              <MenuItem value="EN_COURS">En cours</MenuItem>
              <MenuItem value="RESOLU">Résolu</MenuItem>
              <MenuItem value="TRANS_SM">Société de maintenance</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Rechercher"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
        </Box>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Numéro Série</TableCell>
                <TableCell>Créé par</TableCell>
                <TableCell>Bureau</TableCell>
                <TableCell>Département</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Équipement</TableCell>
                <TableCell>Problème</TableCell>
                <TableCell>Priorité</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.serialNumber|| '-'}</TableCell>
                    <TableCell>{ticket.createdBy?.nom} {ticket.createdBy?.prenom}</TableCell>
                    <TableCell>{ticket.bureau?.bureau || '-'}</TableCell>
                    <TableCell>{ticket.department?.name || '-'}</TableCell>
                    <TableCell>{ticket.service?.name || '-'}</TableCell>
                    <TableCell>{ticket.equipmentType|| '-'} {ticket.brand && `(${ticket.brand})`}</TableCell>
                    <TableCell sx={{ maxWidth: 250 }}>
                      <Typography noWrap>{ticket.problemDescription}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={ticket.priority} 
                        color={ticket.priority === 'HAUTE' ? 'error' : 
                          ticket.priority === 'MOYENNE' ? 'warning' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
   label={
    ticket.status === 'EN_COURS' ? 'En cours' :
    ticket.status === 'TRANS_SM' ? 'Société de maintenance' :
    ticket.status === 'SI_SERVICE' ? 'Reçu par SI' :
    ticket.status === 'RESOLU' ? 'Résolu' :
    ticket.status === 'BUREAU_VALIDATED' ? 'En cours de validation CHEF BUREAU ' : // Ajout pour 'SERVICE_VALIDATED'
    ticket.status // Si aucune des conditions n'est remplie, affiche la valeur brute
   }
                        color={getStatusColor(ticket.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => window.location.href = `/tickets/${ticket.id}/edit`}
                        >
                          Modifier
                        </Button>
                        <Button 
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(ticket.id)}
                          disabled
                        >
                          Supprimer
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    Aucun ticket trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default TicketsPage;
