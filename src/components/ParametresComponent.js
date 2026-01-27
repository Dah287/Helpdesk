import { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  List as MuiList,
  ListItemText as MuiListItemText,
  Chip,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  MenuItem,
  Menu,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  SupportAgent as SupportAgentIcon,
  Logout as LogoutIcon,
  BarChart as BarChartIcon,
  ListAlt as TicketsIcon,
  People as UsersIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Add, Delete, Save, Restore, Edit } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const ParametresComponent = () => {
  // === États de navigation (menu utilisateur + drawer) ===
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Données utilisateur
  const userData = sessionStorage.getItem('user');
  const parsedUser = userData ? JSON.parse(userData) : null;
  const displayUsername = parsedUser
    ? parsedUser.username.charAt(0).toUpperCase()
    : 'A';

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;

  // === Gestion du menu utilisateur ===
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  // === États des paramètres ===
  const [demandTypes, setDemandTypes] = useState([]);
  const [newDemandType, setNewDemandType] = useState('');
  const [solutions, setSolutions] = useState([]);
  const [newSolution, setNewSolution] = useState('');
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(true);
  const [helpUrl, setHelpUrl] = useState(
    'https://drive.google.com/drive/folders/1POWOkSsoqXDKTLHVIzFmqEOyZ5nG65fu'
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // === Chargement initial ===
useEffect(() => {
  const fetchConfig = async () => {
    try {
      // Chargement en parallèle de la config globale et des solutions
      const [configRes, solutionsRes] = await Promise.all([
        api.getSystemConfig().catch(() => ({ data: {} })), // Fallback si pas encore créé
        api.getSolutions()
      ]);

      const config = configRes.data || {};
      setDemandTypes(config.demandTypes || []);
      setAutoLogoutEnabled(config.autoLogoutEnabled ?? true);
      setHelpUrl(config.helpUrl || helpUrl);

      // Mise à jour de l'état des solutions avec le retour du nouveau controller
      setSolutions(solutionsRes.data || []); 
    } catch (error) {
      console.error('Erreur chargement config:', error);
      showSnackbar('Impossible de charger les paramètres.', 'error');
    }
  };
  fetchConfig();
}, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // === Fonctions métier ===
  const handleAddDemandType = async () => {
    const trimmed = newDemandType.trim();
    if (!trimmed) return;
    try {
      const res = await api.addDemandType(trimmed);
      setDemandTypes(res.data.demandTypes || [...demandTypes, trimmed]);
      setNewDemandType('');
      showSnackbar('Type ajouté.');
    } catch (err) {
      showSnackbar("Échec de l'ajout.", 'error');
    }
  };

  const handleDeleteDemandType = async (type) => {
    if (!window.confirm(`Supprimer "${type}" ?`)) return;
    try {
      const res = await api.deleteDemandType(type);
      setDemandTypes(res.data.demandTypes || demandTypes.filter(t => t !== type));
      showSnackbar('Type supprimé.');
    } catch (err) {
      showSnackbar("Échec de la suppression.", 'error');
    }
  };

const handleAddSolution = async () => {
  const trimmed = newSolution.trim();
  if (!trimmed) return;
console.log('Adding solution with text:', trimmed);
  try {
    const res = await api.addSolution({
      text: trimmed, // OK : correspond à payload.get("text") en Java
    });

    // Le backend renvoie List<String>, on met à jour l'état directement
    setSolutions(res.data || []);
    setNewSolution('');
    showSnackbar('Solution ajoutée.');
  } catch (err) {
    console.error(err);
    showSnackbar("Échec de l'ajout (vérifiez si elle n'existe pas déjà).", 'error');
  }
};


const handleDeleteSolution = async (solLibelle) => {
  if (!window.confirm(`Supprimer la solution "${solLibelle}" ?`)) return;
  try {
    // Appel au nouveau endpoint DELETE /api/admin/config/solutions/{libelle}
    const res = await api.deleteSolution(solLibelle);
    
    // Votre controller retourne la liste mise à jour (findAllActiveLabels)
    setSolutions(res.data || []); 
    showSnackbar('Solution désactivée avec succès.');
  } catch (err) {
    console.error(err);
    showSnackbar("Échec de la suppression.", 'error');
  }
};

  const handleSaveGlobal = async () => {
    try {
      await api.updateSystemConfig({ autoLogoutEnabled, helpUrl });
      showSnackbar('Paramètres enregistrés.');
    } catch (err) {
      showSnackbar('Échec de la sauvegarde.', 'error');
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Réinitialiser tous les paramètres ?')) return;
    try {
      const res = await api.resetSystemConfig();
      const config = res.data || {};
      setDemandTypes(config.demandTypes || []);
      setSolutions(config.solutions || []);
      setAutoLogoutEnabled(config.autoLogoutEnabled ?? true);
      setHelpUrl(config.helpUrl || helpUrl);
      showSnackbar('Paramètres réinitialisés.');
    } catch (err) {
      showSnackbar('Échec de la réinitialisation.', 'error');
    }
  };

  // === Rendu ===
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Paramètres Système (en cours de développement ...)
          </Typography>

          <Tooltip title="Aide & Support">
            <IconButton
              color="inherit"
              onClick={() =>
                window.open(
                  'https://drive.google.com/drive/folders/1POWOkSsoqXDKTLHVIzFmqEOyZ5nG65fu?usp=sharing',
                  '_blank'
                )
              }
            >
              <SupportAgentIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          <IconButton onClick={handleAvatarClick} color="inherit">
            <Avatar sx={{ ml: 2 }}>{displayUsername}</Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>
              <Typography variant="body1">
                {parsedUser?.nom} {parsedUser?.prenom}
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                navigate('/change-password');
              }}
            >
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

      {/* Drawer */}
<Drawer
  variant="persistent"
  open={drawerOpen}
  sx={{
    width: 0,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: { width: 180, boxSizing: 'border-box' },
  }}
>
        <Toolbar />
        <Box
          sx={{
            px: 2,
            py: 1.5,
            backgroundColor: '#1976d2',
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
              component="a"
              href="/admin/parametres"
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                backgroundColor: isActive('/admin/parametres') ? '#1976d2' : 'transparent',
                color: isActive('/admin/parametres') ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: isActive('/admin/parametres') ? '#1565c0' : '#eeeeee',
                },
              }}
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
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 ,marginLeft: '80px',position:'absolute',width:'90%' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
          Paramètres Système
        </Typography>

        {/* Types de demande */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Types de Demande</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nouveau type"
                  value={newDemandType}
                  onChange={(e) => setNewDemandType(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddDemandType}
                  disabled={!newDemandType.trim()}
                >
                  Ajouter
                </Button>
              </Grid>
            </Grid>
            <MuiList dense sx={{ mt: 2 }}>
              {demandTypes.map((type, i) => (
                <ListItem
                  key={i}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleDeleteDemandType(type)} color="error">
                      <Delete />
                    </IconButton>
                  }
                >
                  <MuiListItemText primary={type} />
                </ListItem>
              ))}
              {demandTypes.length === 0 && (
                <Typography color="text.secondary" sx={{ ml: 2 }}>Aucun type défini.</Typography>
              )}
            </MuiList>
          </CardContent>
        </Card>

        {/* Solutions */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Solutions Techniques</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  label="Nouvelle solution"
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddSolution}
                  disabled={!newSolution.trim()}
                >
                  Ajouter
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {solutions.map((sol, i) => (
                <Chip
                  key={i}
                  label={sol}
                  onDelete={() => handleDeleteSolution(sol)}
                  deleteIcon={<Delete />}
                />
              ))}
              {solutions.length === 0 && (
                <Typography color="text.secondary">Aucune solution définie.</Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Paramètres globaux */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Paramètres Globaux</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={autoLogoutEnabled}
                  onChange={(e) => setAutoLogoutEnabled(e.target.checked)}
                />
              }
              label="Déconnexion automatique après 30 min"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="URL du dossier d’aide"
              value={helpUrl}
              onChange={(e) => setHelpUrl(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" startIcon={<Save />} onClick={handleSaveGlobal}>
                Enregistrer
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Restore />}
                onClick={handleResetDefaults}
              >
                Réinitialiser
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParametresComponent;