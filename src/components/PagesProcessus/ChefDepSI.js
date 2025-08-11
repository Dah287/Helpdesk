import React, { useState, useEffect } from 'react';
import { 
    Box, CssBaseline, AppBar, Toolbar, Typography, 
    Avatar, Drawer, List, ListItem, ListItemIcon, 
    ListItemText, Grid, Card, CardContent, TextField,
    Button, Select, MenuItem, FormControl, InputLabel,
    TableContainer, Table, TableHead, TableRow, TableCell,Menu,
    TableBody, Chip, IconButton, Tooltip, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions // Nouveaux imports
  } from '@mui/material';
 
  import LogoutIcon from '@mui/icons-material/Logout';
  import useAutoLogout from '../../pages/useAutoLogout';
import { useNavigate } from 'react-router-dom';
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

  const [allTickets, setAllTickets] = useState([]);  // liste complète
  useEffect(() => {
    loadTickets();
  }, []);

// ─────────── Chargement initial ───────────
const loadTickets = async () => {
  try {
    const res = await api.getAllTicketsAdmin();
    //g('data :', res.data);
    setAllTickets(res.data);   // référence complète
    setTickets(res.data);      // affichage initial
  } catch (err) {
    console.error('Error loading tickets:', err);
  }
};



// ─────────── Filtre local ───────────
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

    {/* {parsedUser?.role === "CHEF_BUR" && `Chef de bureau - ${parsedbureau_id?.bureau}`}
      {parsedUser?.role === "CHEF_SI" && `Chef de service - ${parsedservice_id?.name}`}
      {parsedUser?.role === "CHEF_DEP" && `Chef de département - ${parseddepartment_id?.name}`}
      {parsedUser?.role === "CHEF_DEP_SI" && `Chef de département - ${parseddepartment_id?.name}`} */}
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

<Box sx={{ p: 3, width: 'calc(170%  - 240px)', marginTop: '64px' }}>
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

      <TableContainer component={Paper} elevation={3} >
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
                  <TableCell>{ticket.serialNumber || '-'}</TableCell>
                  <TableCell>{ticket.createdBy?.nom} {ticket.createdBy?.prenom}</TableCell>
                  <TableCell>{ticket.bureau?.bureau || '-'}</TableCell>
                  <TableCell>{ticket.department?.name || '-'}</TableCell>
                  <TableCell>{ticket.service?.name || '-'}</TableCell>
                  <TableCell>
                    {ticket.equipmentType || '-'} {ticket.brand && `(${ticket.brand})`}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>
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
                  <TableCell align="center">
  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
    <Tooltip title="Voir détails">
      <IconButton 
        onClick={() => handleViewDetails(ticket)} 
        size="small" 
        sx={{ color: 'primary.main' }}
      >
        <ViewIcon />
      </IconButton>
    </Tooltip>

    <Button 
      variant="outlined"
      size="small"
      startIcon={<Edit />}
      onClick={() => window.location.href = `/tickets/${ticket.id}/edit`}
      disabled={String(ticket.createdBy?.id) !== String(parsedUser.id)}
    >
      Modifier
    </Button>

    <Button 
      variant="outlined"
      size="small"
      color="error"
      startIcon={<Delete />}
      onClick={() => handleDelete(ticket.id)}
      disabled={String(ticket.createdBy?.id) !== String(parsedUser.id)}
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

          {/* Dialog Détails du Ticket */}
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

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
            Autres informations
          </Typography>
          {/* Ajoutez ici d'autres champs si nécessaire */}
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
        </Table>
      </TableContainer>
    </Box>
    </>
  );
};

export default ChefDepSI;