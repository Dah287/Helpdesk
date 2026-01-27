import { useState, useEffect } from 'react';
import {
  Box, CssBaseline, Avatar,AppBar,Menu, Toolbar, Typography, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Paper, TableContainer, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, IconButton, Tooltip, Pagination,
  Select, MenuItem, FormControl, InputLabel, TextField, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
    Dashboard as DashboardIcon,
  ListAlt as TicketsIcon,
  People as UsersIcon,
  BarChart as BarChartIcon,
   Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
  FilterAlt as FilterIcon,
  Logout as LogoutIcon,
  Visibility as ViewIcon,
   Notifications as NotificationsIcon,
    Settings as SettingsIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; 
import { Add, Edit, Delete ,CheckCircle} from '@mui/icons-material';
import { useNavigate ,useLocation} from 'react-router-dom';
import api from '../services/api';
import useAutoLogout from '../pages/useAutoLogout';

const SuperAdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [drawerOpen, setDrawerOpen] = useState(true);
  // Détails du ticket
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Suppression
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const navigate = useNavigate();
  useAutoLogout();


    const handleClosee = () => {
      setAnchorEl(null);
    };

const location = useLocation();
const currentPath = location.pathname;
const isActive = (path) => currentPath === path;
  const userData = sessionStorage.getItem('user');
  const bureau_id = sessionStorage.getItem('bureau_id');
  const service_id = sessionStorage.getItem('service_id');
  const department_id = sessionStorage.getItem('department_id');
  
  const parsedUser = userData ? JSON.parse(userData) : null;

  const displayUsername = parsedUser 
    ? parsedUser.username.charAt(0).toUpperCase()
    : 'A';


  useAutoLogout();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
    const handleAvatarClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    


  const loadTickets = async () => {
    try {
      const response = await api.getAllTicketsAdminSuper();
      const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTickets(sorted);
      setFilteredTickets(sorted);
    } catch (error) {
      console.error("Erreur lors du chargement des tickets :", error);
    }
  };

  useEffect(() => {
    let result = tickets;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.id.toString().includes(term) ||
        t.problemDescription?.toLowerCase().includes(term) ||
        t.createdBy?.nom?.toLowerCase().includes(term) ||
        t.createdBy?.prenom?.toLowerCase().includes(term) ||
        t.serialNumber?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    setFilteredTickets(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, tickets]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await api.updateTicketStatusSuper(ticketId, newStatus);
      if (newStatus === 'RESOLU') {
        await api.validateSI(ticketId);
      }
      loadTickets();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      alert("Échec de la mise à jour du statut.");
    }
  };

  // 🔍 Voir détails
  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  // 🗑️ Supprimer
  const handleDeleteClick = (ticket) => {
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.deleteTicket(ticketToDelete.id);
      loadTickets();
      setDeleteDialogOpen(false);
      alert("Ticket supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Impossible de supprimer le ticket.");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Super Admin — Tous les Tickets
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

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 ,marginLeft: '80px',position:'absolute',width:'90%' }}>
        {/* Barre de recherche et filtres */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Recherche"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Statut</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Statut">
              <MenuItem value="all">Tous les statuts</MenuItem>
              <MenuItem value="SI_SERVICE">Reçu par SI</MenuItem>
              <MenuItem value="BUREAU_VALIDATED">Validé par Bureau</MenuItem>
              <MenuItem value="SERVICE_VALIDATED">Validé par Service</MenuItem>
              <MenuItem value="DEPT_VALIDATED">Validé par Département</MenuItem>
              <MenuItem value="SI_DEPT_VALIDATED">Validé SI + Dépt</MenuItem>
              <MenuItem value="EN_COURS">En cours</MenuItem>
              <MenuItem value="RESOLU">Résolu</MenuItem>
              <MenuItem value="TRANS_SM">Transmis à la SM</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadTickets}>
            Actualiser
          </Button>
          <Button
            variant="text"
            startIcon={<FilterIcon />}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
          >
            Réinitialiser
          </Button>
        </Box>

        {/* Tableau */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Problème</TableCell>
                <TableCell>Créé par</TableCell>
                <TableCell>Bureau / Service / Dépt</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Changer statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTickets.map((ticket) => (
                <TableRow key={ticket.id} hover>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.problemDescription?.substring(0, 50)}...</TableCell>
                  <TableCell>{ticket.createdBy?.nom} {ticket.createdBy?.prenom}</TableCell>
                  <TableCell>
                    {ticket.createdBy?.bureau?.bureau || '-'} / {ticket.createdBy?.service?.name || '-'} / {ticket.createdBy?.department?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        ticket.status === 'SI_SERVICE' ? 'Reçu SI' :
                        ticket.status === 'BUREAU_VALIDATED' ? 'Bureau validé' :
                        ticket.status === 'SERVICE_VALIDATED' ? 'Service validé' :
                        ticket.status === 'DEPT_VALIDATED' ? 'Dépt validé' :
                        ticket.status === 'SI_DEPT_VALIDATED' ? 'SI + Dépt' :
                        ticket.status === 'EN_COURS' ? 'En cours' :
                        ticket.status === 'RESOLU' ? 'Résolu' :
                        ticket.status === 'TRANS_SM' ? 'Transmis SM' :
                        ticket.status
                      }
                      size="small"
                      color={
                        ticket.status === 'RESOLU' ? 'success' :
                        ['EN_COURS', 'SI_SERVICE'].includes(ticket.status) ? 'warning' :
                        ['TRANS_SM'].includes(ticket.status) ? 'info' :
                        'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <Select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        variant="outlined"
                      >
                        <MenuItem value="SI_SERVICE">Reçu par SI</MenuItem>
                        <MenuItem value="BUREAU_VALIDATED">Validé par Bureau</MenuItem>
                        <MenuItem value="SERVICE_VALIDATED">Validé par Service</MenuItem>
                        <MenuItem value="DEPT_VALIDATED">Validé par Dépt</MenuItem>
                        <MenuItem value="SI_DEPT_VALIDATED">Validé SI + Dépt</MenuItem>
                        <MenuItem value="EN_COURS">En cours</MenuItem>
                        <MenuItem value="RESOLU">Résolu</MenuItem>
                        <MenuItem value="TRANS_SM">Transmis à la SM</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Voir détails">
                      <IconButton size="small" onClick={() => handleViewDetails(ticket)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(ticket)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          />
        )}
      </Box>

      {/* 💬 Détails du ticket */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Détails du Ticket #{selectedTicket?.id}</DialogTitle>
        <DialogContent dividers>
          {selectedTicket && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography><strong>Description :</strong> {selectedTicket.problemDescription}</Typography>
              <Typography><strong>Type de demande :</strong> {selectedTicket.typeDemande}</Typography>
              <Typography><strong>Numéro de série :</strong> {selectedTicket.serialNumber || '-'}</Typography>
              <Typography><strong>Équipement :</strong> {selectedTicket.equipmentType} {selectedTicket.brand && `(${selectedTicket.brand})`}</Typography>
              <Typography><strong>Priorité :</strong> {selectedTicket.priority}</Typography>
              <Typography><strong>Statut :</strong> {selectedTicket.status}</Typography>
              <Typography><strong>Créé par :</strong> {selectedTicket.createdBy?.nom} {selectedTicket.createdBy?.prenom}</Typography>
              <Typography><strong>Bureau :</strong> {selectedTicket.createdBy?.bureau?.bureau || '-'}</Typography>
              <Typography><strong>Service :</strong> {selectedTicket.createdBy?.service?.name || '-'}</Typography>
              <Typography><strong>Département :</strong> {selectedTicket.createdBy?.department?.name || '-'}</Typography>
              <Typography><strong>Date de création :</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</Typography>
              <Typography><strong>Dernière mise à jour :</strong> {new Date(selectedTicket.updatedAt || selectedTicket.createdAt).toLocaleString()}</Typography>

              {/* Problème trouvé & Solution appliquée */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Diagnostic technique</Typography>
              <Typography><strong>Problème trouvé :</strong> {selectedTicket.foundProblem || "Non renseigné"}</Typography>
              <Typography><strong>Solution appliquée :</strong> {selectedTicket.appliedSolution || "Non renseignée"}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* ❌ Confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer le ticket <strong>#{ticketToDelete?.id}</strong> ?
          Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminTickets;