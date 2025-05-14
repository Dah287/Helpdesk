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

  // Récupérer l'élément 'user' du localStorage
const userData = localStorage.getItem('user');


const bureau_id = localStorage.getItem('bureau_id');
const service_id = localStorage.getItem('service_id');
const department_id = localStorage.getItem('department_id');
const parseddepartment_id = department_id ? JSON.parse(department_id) : null;
const parsedbureau_id = bureau_id ? JSON.parse(bureau_id) : null;
const parsedservice_id = service_id ? JSON.parse(service_id) : null;


// Si l'élément existe, on le parse (car il a été stringify)
if (userData) {
  const parsedUser = JSON.parse(userData);
  console.log(parsedUser); // Vous pouvez maintenant accéder aux données de l'utilisateur
} else {
  console.log('Aucune donnée utilisateur trouvée');
}
const parsedUser = userData ? JSON.parse(userData) : null;

  // Si parsedUser existe, afficher uniquement la première lettre du username en majuscule
  const displayUsername = parsedUser 
    ? parsedUser.username.charAt(0).toUpperCase()
    : 'A'; // Valeur par défaut si parsedUser est null


  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      console.log("username :", parsedUser.username);
      const response = await api.getByUserName(parsedUser.username);
      console.log("date :", response.data);
      setTickets(response.data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  };

  const handleFilter = async (status) => {
    setFilter(status);
    try {
      const response = status === 'all' 
        ? await api.getByUserName(parsedUser.username)
        : await api.getTicketsByStatus(status,parsedUser.username);
      setTickets(response.data);
     } catch (error) {
      console.error("Error filtering tickets:", error);
    }
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
      (ticket.serialNumber || '').toLowerCase().includes(searchTerm)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'EN_COURS': return 'warning';
      case 'RESOLU': return 'success';
      case 'TRANS_SM': return 'primary';
      case 'SERVICE_VALIDATED': return 'info';
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
    localStorage.clear(); // ou uniquement les clés que tu veux
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
          {parsedUser.role === "CHEF_BUR" && `Chef de bureau - ${parsedbureau_id.bureau}`}
          {parsedUser.role === "CHEF_SI" && `Chef de service - ${parsedservice_id.name}`}
          {parsedUser.role === "CHEF_DEP" && `Chef de département - ${parseddepartment_id.name}`}
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
      <Box sx={{ p: 3, width: 'calc(180% - 240px)', marginTop: '64px' }}>
        <Typography variant="h4" gutterBottom>
          Gestion des Tickets
        </Typography>
        
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
                    <TableCell>{ticket.bureau?.bureau || '-'}</TableCell>
                    <TableCell>{ticket.department?.name || '-'}</TableCell>
                    <TableCell>{ticket.service?.name || '-'}</TableCell>
                    <TableCell>{ticket.equipmentType|| '-'} {ticket.brand && `(${ticket.brand})`}</TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
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
    ticket.status === 'SERVICE_VALIDATED' ? 'En cours de validation de service' : // Ajout pour 'SERVICE_VALIDATED'
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
