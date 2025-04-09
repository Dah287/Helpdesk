import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, Chip,
  Typography, Box,IconButton,Tooltip,
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
import { Add, Edit, Delete ,CheckCircle} from '@mui/icons-material';
import api from '../../services/api';

const ChefDepSI = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await api.getAllTicketsAdmin();
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

  // Dans votre composant
const shouldShowValidateButton = (ticket) => {
    // Exemple basique - adapter selon vos règles métier
    return ticket.status === 'CREATED'; 
  };
  


    const handleValidate = async (ticketId) => {
      try {
        await api.updateTicketDepSI(ticketId);
        loadTickets(); // Recharger la liste
      } catch (error) {
        console.error("Error updating ticket status:", error);
      }
    };

        // Nouvelle fonction pour ouvrir les détails
        const handleViewDetails = (ticket) => {
            setSelectedTicket(ticket);
            setOpenDialog(true);
          };

  return (
    <Box sx={{ p: 3 ,width: 'calc(120%)'}}>
      <Typography variant="h4" gutterBottom>
        Chef Dep SI Validation
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
                   
                <Tooltip title="Voir détails">
                  <IconButton onClick={() => handleViewDetails(ticket)}>
                    <ViewIcon color="primary" />
                  </IconButton>
                </Tooltip>
                    
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
  );
};

export default ChefDepSI;