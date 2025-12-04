import { useState, useEffect } from 'react';
import { 
  Box, CssBaseline, AppBar, Toolbar, Typography, 
  Avatar, Drawer, List, ListItem, ListItemIcon, 
  ListItemText, Grid, Card, CardContent, TextField,
  Button, TableContainer, Table, TableHead, TableRow, 
  TableCell, TableBody, Chip, IconButton, Tooltip, 
  Paper, Menu, Dialog, DialogTitle, DialogContent, 
  DialogActions, FormControl, InputLabel, Select, MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ListAlt as TicketsIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { Pagination } from '@mui/material';
import api from '../services/api';
import LogoutIcon from '@mui/icons-material/Logout';
import useAutoLogout from '../pages/useAutoLogout';
import { useNavigate } from 'react-router-dom';
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // ✅ Nouvelle icône d’aide
import { Add, Edit, Delete ,CheckCircle} from '@mui/icons-material';

const UserManagement = () => {
  // État initial pour selectedUser avec toutes les propriétés nécessaires
  const emptyUser = {
    matricule: '',
    nom: '',
    prenom: '',
    username: '',
    // email: '',
    role: 'CHEF_BUR',
    service: { id: '' },
    bureau: { id: '' },
    department: { id: '' },
    password: ''
  };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedUser, setSelectedUser] = useState(emptyUser);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


  //
  const [bureaux, setBureaux] = useState([]);
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);


//

// Chargement des bureaux
const loadBureaux = async () => {
    try {
      const response = await api.getAllBureaux();
      setBureaux(response.data);
    } catch (error) {
      console.error("Error loading bureaux:", error);
    }
  };
  
  // Chargement des services
  const loadServices = async () => {
    try {
      const response = await api.getAllServices();
      setServices(response.data);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };
  
  // Chargement des départements
  const loadDepartments = async () => {
    try {
      const response = await api.getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

//
useEffect(() => {
    loadUsers();
    loadBureaux();
    loadServices();
    loadDepartments();
  }, []);

  // Stats pour les cartes
  const [stats, setStats] = useState([
    { title: 'Total Utilisateurs', value: 0, icon: '👥', color: 'info' },
    { title: 'Chef de Bureaux', value: 0, icon: '👤', color: 'primary' },
    { title: 'Chef de Services', value: 0, icon: '👤', color: 'warning' },
    { title: 'Chef de Département', value: 0, icon: '👤', color: 'success' },
    
  ]);

  // Charger les utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getAllUsers();
      setUsers(response.data);
      
      // Mettre à jour les stats
      const total = response.data.length;
      const admins = response.data.filter(u => u.role === 'ADMIN').length;
      const techs = response.data.filter(u => u.role === 'CHEF_SI').length;
      const standards = response.data.filter(u => u.role === 'CHEF_BUR').length;
      const nbrchefdep = response.data.filter(u => u.role === 'CHEF_DEP' || u.role === 'CHEF_DEP_SI').length;      
      
      setStats([


        { title: 'Total Utilisateurs', value: total, icon: '👥', color: 'info' },
        { title: 'Chef de Bureaux', value: standards, icon: '👤', color: 'primary' },
        { title: 'Chef de Services', value: techs, icon: '👤', color: 'warning' },
        { title: 'Chef de Département', value: nbrchefdep, icon: '👤', color: 'success' },
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Gestion de la pagination et filtres
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = searchTerm === '' || 
        `${user.username}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Gestion des utilisateurs
  const handleCreateUser = async () => {
    try {
      if (!selectedUser.username || !selectedUser.matricule) {
        alert('Le nom d\'utilisateur et l\'email sont obligatoires');
        return;
      }
      //g('selectedUser :',selectedUser)
      await api.createUser(selectedUser);
     
      loadUsers();
      setOpenDialog(false);
      setSelectedUser(emptyUser);
      alert('Utilisateur créé avec succès !');
    } catch (error) {
      console.error("Error creating user:", error);
      alert('Erreur lors de la création');
    }
  };

  const handleUpdateUser = async () => {
    try {
      if (!selectedUser.id) {
        console.error("ID utilisateur manquant");
        return;
      }
      
      await api.updateUser(selectedUser.id, selectedUser);
      loadUsers();
      setOpenDialog(false);
      setSelectedUser(emptyUser);
      alert('Utilisateur mis à jour avec succès !');
    } catch (error) {
      console.error("Error updating user:", error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await api.deleteUser(id);
        loadUsers();
        alert('Utilisateur supprimé avec succès !');
      } catch (error) {
        console.error("Error deleting user:", error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  // Gestion de la navigation et du logout
  const userData = sessionStorage.getItem('user');
  const parsedUser = userData ? JSON.parse(userData) : null;
  const displayUsername = parsedUser ? parsedUser.username.charAt(0).toUpperCase() : 'A';

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
    sessionStorage.clear();
    navigate('/');
  };

  // Fonction pour ouvrir le dialogue
  const handleOpenDialog = (user = null, isEdit = false) => {
    setSelectedUser(user || emptyUser);
    setEditMode(isEdit);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      
      {/* Barre de navigation */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestion des Utilisateurs
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
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 190, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
        <List>

<ListItem button component="a" href="/admin/Dashboard" sx={{ color: 'inherit', textDecoration: 'none' }}>
<ListItemIcon><UsersIcon /></ListItemIcon>
<ListItemText primary="Dashboard" />
</ListItem>
<ListItem button component="a" href="/admin/Tickets" sx={{ color: 'inherit', textDecoration: 'none' }}>
  <ListItemIcon><TicketsIcon /></ListItemIcon>
  <ListItemText primary="Tickets" />
</ListItem>
<ListItem button component="a" href="/admin/user" sx={{ color: 'inherit', textDecoration: 'none' }}>
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
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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

        {/* Section Tableau des Utilisateurs */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">Liste des Utilisateurs</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<RefreshIcon />}
                  onClick={loadUsers}
                >
                  Actualiser
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog(null, true)}
                >
                  Nouvel Utilisateur
                </Button>
              </Box>
            </Box>

            {/* Filtres */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="Rechercher utilisateur"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              
              <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Rôle"
                >
                  <MenuItem value="all">Tous les rôles</MenuItem>
                  <MenuItem value="ADMIN">Administrateur</MenuItem>
                  <MenuItem value="CHEF_DEP">Chef de Département</MenuItem>
                  <MenuItem value="CHEF_SI">Chef de Service</MenuItem>
                  <MenuItem value="CHEF_BUR">Chef de Bureau</MenuItem>
                  <MenuItem value="Secretaire">Secrétaire</MenuItem>
                  <MenuItem value="NORMALE">Agent</MenuItem>
                </Select>

              </FormControl>
            </Box>

            {/* Tableau */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell>Nom d'utilisateur</TableCell>
                    {/* <TableCell>Email</TableCell> */}
                    <TableCell>Matricule</TableCell>
                    <TableCell>Rôle</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Bureau</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>{user.id|| '-'}</TableCell>
                        <TableCell>{user.nom|| '-'}</TableCell>
                        <TableCell>{user.prenom|| '-'}</TableCell>
                        <TableCell>{user.username|| '-'}</TableCell>
                        <TableCell>{user.matricule|| '-'}</TableCell>
                        {/* <TableCell>{user.email|| '-'}</TableCell> */}
                        <TableCell>
                        <Chip
                          label={
                            user.role === 'ADMIN' ? 'Administrateur' :
                            (user.role === 'CHEF_DEP'|| user.role === 'CHEF_DEP_SI' )? 'Chef de Département' :
                            user.role === 'CHEF_SI' ? 'Chef de Service' :
                            user.role === 'CHEF_BUR' ? 'Chef de Bureau' :
                            user.role === 'Secretaire' ? 'Secrétaire' :
                            (user.role === 'NORMALE' || user.role === 'NORMALE_ALL') ? 'Agent' :
                            'Rôle inconnu'
                          }

                          color={
                            user.role === 'ADMIN' ? 'primary' :
                            (user.role === 'CHEF_DEP'|| user.role === 'CHEF_DEP_SI' ) ? 'secondary' :
                            user.role === 'CHEF_SI' ? 'info' :
                            user.role === 'CHEF_BUR' ? 'success' :
                            user.role === 'Secretaire' ? 'warning' :
                            (user.role === 'NORMALE' || user.role === 'NORMALE_ALL') ? 'default' :
                            'default'
                          }

                          size="small"
                        />

                        </TableCell>
                        <TableCell>{user.department?.name || '-'}</TableCell>
                        <TableCell>{user.service?.name || '-'}</TableCell>
                        <TableCell>{user.bureau?.bureau || '-'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Voir détails">
                              <IconButton onClick={() => handleOpenDialog(user, false)}>
                                <ViewIcon color="primary" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Modifier">
                              <IconButton onClick={() => handleOpenDialog(user, true)}>
                                <EditIcon color="secondary" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Supprimer">
                              <IconButton onClick={() => handleDeleteUser(user.id)}>
                                <DeleteIcon color="error" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        Aucun utilisateur trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
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

      {/* Dialogue pour voir/éditer/créer un utilisateur */}
      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          setSelectedUser(emptyUser);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Modifier Utilisateur' : selectedUser.id ? 'Détails Utilisateur' : 'Nouvel Utilisateur'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom"
                  fullWidth
                  value={selectedUser.nom || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, nom: e.target.value})}
                  disabled={!editMode && !!selectedUser.id}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Prénom"
                  fullWidth
                  value={selectedUser.prenom || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, prenom: e.target.value})}
                  disabled={!editMode && !!selectedUser.id}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom d'utilisateur"
                  fullWidth
                  value={selectedUser.username || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                  disabled={!editMode && !!selectedUser.id}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                    label="Matricule"
                    fullWidth
                    value={selectedUser.matricule || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, matricule: e.target.value})}
                    disabled={!editMode && !!selectedUser.id}
                />
                </Grid>
                            {/* <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  value={selectedUser.email || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  disabled={!editMode && !!selectedUser.id}
                />
              </Grid> */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Rôle</InputLabel>
                  <Select
                    value={selectedUser.role || 'USER'}
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                    label="Rôle"
                    disabled={!editMode && !!selectedUser.id}
                  >
                  <MenuItem value="ADMIN">Administrateur</MenuItem>
                  <MenuItem value="CHEF_DEP">Chef de département</MenuItem>
                  <MenuItem value="CHEF_SI">Chef de Service</MenuItem>
                  <MenuItem value="CHEF_BUR">Chef de Bureau</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Département</InputLabel>
                    <Select
                    value={selectedUser.department?.id || ''}
                    onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        department: { id: e.target.value }
                    })}
                    label="Département"
                    disabled={!editMode && !!selectedUser.id}
                    >
                    <MenuItem value="">Sélectionnez un département</MenuItem>
                    {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Service</InputLabel>
                    <Select
                    value={selectedUser.service?.id || ''}
                    onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        service: { id: e.target.value }
                    })}
                    label="Service"
                    disabled={!editMode && !!selectedUser.id}
                    >
                    <MenuItem value="">Sélectionnez un service</MenuItem>
                    {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                        {service.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Bureau</InputLabel>
                    <Select
                    value={selectedUser.bureau?.id || ''}
                    onChange={(e) => setSelectedUser({
                        ...selectedUser,
                        bureau: { id: e.target.value }
                    })}
                    label="Bureau"
                    disabled={!editMode && !!selectedUser.id}
                    >
                    <MenuItem value="">Sélectionnez un bureau</MenuItem>
                    {bureaux.map((bureau) => (
                        <MenuItem key={bureau.id} value={bureau.id}>
                        {bureau.bureau}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Grid>
              {!selectedUser.id && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mot de passe"
                    fullWidth
                    type="password"
                    value={selectedUser.password || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, password: e.target.value})}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            setSelectedUser(emptyUser);
          }} color="primary">
            Annuler
          </Button>
          {(editMode || !selectedUser.id) ? (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                if (selectedUser.id) {
                  handleUpdateUser();
                } else {
                  handleCreateUser();
                }
              }}
              disabled={!selectedUser.username || !selectedUser.matricule}
            >
              {selectedUser.id ? 'Mettre à jour' : 'Créer'}
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setEditMode(true)}
            >
              Modifier
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;