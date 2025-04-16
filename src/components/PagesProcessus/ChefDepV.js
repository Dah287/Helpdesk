import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, TextField,
    Select, MenuItem, FormControl, InputLabel, Chip,Menu,
    Typography, Box, AppBar, Toolbar, IconButton, Avatar
  } from '@mui/material';
import useAutoLogout from '../../pages/useAutoLogout';
import { useNavigate } from 'react-router-dom';
  import MenuIcon from '@mui/icons-material/Menu';
  import NotificationsIcon from '@mui/icons-material/Notifications';
import { Add, Edit, Delete ,CheckCircle} from '@mui/icons-material';
import api from '../../services/api';
import LogoutIcon from '@mui/icons-material/Logout';
const ChefDepV = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await api.getAllTicketsDepV(parseddepartment_id.id,parsedUser.id);
      console.log("date :",response.data)
      setTickets(response.data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  };

  const handleFilter = async (status) => {
    setFilter(status);
    try {
      const response = status === 'all' 
        ? await api.getAllTickets()
        : await api.getTicketsByStatus(status);
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
      (ticket.department?.name || '').toLowerCase().includes(searchTerm) ||
      (ticket.service?.name || '').toLowerCase().includes(searchTerm) ||
      (ticket.bureau?.name || '').toLowerCase().includes(searchTerm) ||
      (ticket.equipmentType || '').toLowerCase().includes(searchTerm) ||
      (ticket.serialNumber || '').toLowerCase().includes(searchTerm)
    );
  });

  const getStatusColor = (status) => {
    switch(status) {
      
      case 'EN_COURS': return 'warning';
      case 'RESOLU': return 'success';
      
      default: return 'default';
    }
  };

      const handleValidate = async (ticketId) => {
        try {
          await api.updateTicketDepV(ticketId);
          loadTickets(); // Recharger la liste
        } catch (error) {
          console.error("Error updating ticket status:", error);
        }
      };




      const [drawerOpen, setDrawerOpen] = useState(false);

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
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    localStorage.clear(); // ou uniquement les clés que tu veux
    navigate('/');
  };

  return (

    <>

<AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  <Toolbar>
    <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

      {parsedUser?.role === "CHEF_SI" && `Chef de service - ${parsedservice_id?.name}`}

    </Typography>

    <IconButton color="inherit">
      <NotificationsIcon />
    </IconButton>
    <Avatar sx={{ marginLeft: 2 }}>{displayUsername}</Avatar>
  </Toolbar>
</AppBar>

<AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  <Toolbar>
    <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

      {parsedUser?.role === "CHEF_DEP" && `Chef de département - ${parseddepartment_id?.name}`}
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
        <Typography variant="body1">{parsedUser?.username} {parsedUser?.prenom}</Typography>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
        Déconnexion
      </MenuItem>
    </Menu>
  </Toolbar>
</AppBar>


<Box sx={{ p: 3, width: 'calc(130% - 240px)', marginTop: '64px' }}>
      <Typography variant="h4" gutterBottom>
      Chef Dep  Validation
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
            <MenuItem value="OPEN">Ouvert</MenuItem>
            <MenuItem value="IN_PROGRESS">En cours</MenuItem>
            <MenuItem value="RESOLVED">Résolu</MenuItem>
            <MenuItem value="CLOSED">Clôturé</MenuItem>
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

      <TableContainer component={Paper} elevation={3} >
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
                  <TableCell>{ticket.serialNumber}</TableCell>
                  <TableCell>{ticket.bureau?.bureau || '-'}</TableCell>
                  <TableCell>{ticket.department?.name || '-'}</TableCell>
                  <TableCell>{ticket.service?.name || '-'}</TableCell>
                  <TableCell>
                    {ticket.equipmentType} {ticket.brand && `(${ticket.brand})`}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
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
                      label={ticket.status} 
                      color={getStatusColor(ticket.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                  <Button
                variant="contained"
                size="small"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleValidate(ticket.id)}
                disabled={ticket.status !== "DEPT_VALIDATED"} // 👈 condition ici
                sx={{ 
                    backgroundColor: '#4caf50',
                    '&:hover': { backgroundColor: '#388e3c' },
                    transition: 'all 0.3s ease'
                }}
                >
                Valider
                </Button>

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

export default ChefDepV;