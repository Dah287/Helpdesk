import { useState } from 'react';
import { 
  Box, CssBaseline, Avatar, Typography,   Paper,
  TextField, Button, Grid, Card, CardContent,
  Link, Container, Alert, CircularProgress , InputAdornment, IconButton, 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {

      const response = await axios.post('http://192.168.1.42:8082/api/auth/login', {
        matricule,
        password
      });
      //g(response.data.user.role);  // Affiche la réponse complète
      // Stockage du token et des infos utilisateur
     // localStorage.setItem('token', response.data.user.token);
     localStorage.setItem('token', response.data.token);
     //g('token :',response.data.token);
      localStorage.setItem('user_id', JSON.stringify(response.data.user.id));
      localStorage.setItem('department_id', JSON.stringify(response.data.user.department));
      localStorage.setItem('service_id', JSON.stringify(response.data.user.service));
      localStorage.setItem('bureau_id', JSON.stringify(response.data.user.bureau));
      localStorage.setItem('user', JSON.stringify(response.data.user));


      // 

      
      
      //g("dep :",response.data.user.department.id)
      // Redirection basée sur le rôle
      switch(response.data.user.role) {
        case 'ADMIN':
          navigate('/admin/Dashboard');
          break;
        case 'CHEF_BUR':
          navigate('/c-b-v');
          break;
          case 'CHEF_SI':
            navigate('/c-s-v');
            break;
            case 'CHEF_DEP':
                navigate('/c-d-v');
                break;
                case 'NORMALE':
                  navigate('/ticketsPage');
                  break;
                case 'CHEF_DEP_SI':
                    navigate('/c-d-si');
                    break;
                    case 'NORMALE_ALL':
                      navigate('/ticketsPage');
                      break;
                      case 'Secretaire':
                        navigate('/ticketsPage');
                        break;
        default:
          navigate('/');
      }
      
    }catch (err) {
        //g(err); // Log des erreurs pour mieux comprendre ce qui se passe
        setError(err.response?.data.user?.message || 'Matricule ou mot de passe incorrect');
      }
       finally {
      setLoading(false);
    }
  };

return (
  <Box
    sx={{
      height: '100vh',
      background: 'linear-gradient(135deg, #4a90e2 0%, #50e3c2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url("https://source.unsplash.com/featured/?mail,office")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backdropFilter: 'blur(6px)',
      px: 2
    }}
  >
    <CssBaseline />

    <Paper
      elevation={8}
      sx={{
        p: 6,
        width: { xs: '100%', sm: 420 },
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
        border: '1px solid #1976d2'
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar
          sx={{
            bgcolor: '#1976d2',
            margin: '0 auto',
            mb: 2,
            width: 64,
            height: 64
          }}
        >
          <LockOutlinedIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          GTickets
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Accédez à votre application GTickets
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          required
          label="Matricule"
          variant="outlined"
          id="matricule"
          name="matricule"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          autoComplete="username"
          autoFocus
          margin="normal"
        />

        <TextField
          fullWidth
          required
          label="Mot de passe"
          variant="outlined"
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            mt: 4,
            py: 1.75,
            borderRadius: 4,
            fontWeight: 700,
            fontSize: '1.1rem',
            backgroundColor: '#1976d2',
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: '#125ea4'
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
        </Button>

        <Grid container sx={{ mt: 2 }}>
          <Grid item xs>
            <Link href="#" variant="body2" underline="hover">
              Mot de passe oublié ?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2" underline="hover">
              Besoin d’aide ?
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  </Box>
);

};

export default Login;