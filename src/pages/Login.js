import { useState } from 'react';
import { 
  Box, CssBaseline, Avatar, Typography, 
  TextField, Button, Grid, Card, CardContent,
  Link, Container, Alert, CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {

      const response = await axios.post('http://localhost:8080/api/auth/login', {
        matricule,
        password
      });
      console.log(response.data.role);  // Affiche la réponse complète
      // Stockage du token et des infos utilisateur
     // localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', JSON.stringify(response.data.id));
      localStorage.setItem('department_id', JSON.stringify(response.data.department));
      localStorage.setItem('service_id', JSON.stringify(response.data.service));
      localStorage.setItem('bureau_id', JSON.stringify(response.data.bureau));
      localStorage.setItem('user', JSON.stringify(response.data));


      // 

      
      
      console.log("dep :",response.data.department.id)
      // Redirection basée sur le rôle
      switch(response.data.role) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'CHEF_BUR':
          navigate('/ticketsPage');
          break;
          case 'CHEF_SI':
            navigate('/c-s-v');
            break;
            case 'CHEF_DEP':
                navigate('/c-d-v');
                break;
                case 'CHEF_DEP_SI':
                    navigate('/c-d-si');
                    break;
        default:
          navigate('/');
      }
      
    }catch (err) {
        console.log(err); // Log des erreurs pour mieux comprendre ce qui se passe
        setError(err.response?.data?.message || 'Matricule ou mot de passe incorrect');
      }
       finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <CssBaseline />
      
      <Container component="main" maxWidth="xs">
        <Card sx={{ 
          borderRadius: 2, 
          boxShadow: 3,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            height: 5,
            background: 'linear-gradient(90deg, #1976d2 0%, #4dabf5 100%)'
          }} />
          
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4
            }}>
              <Avatar sx={{ 
                m: 1, 
                bgcolor: 'primary.main', 
                width: 56, 
                height: 56 
              }}>
                <LockOutlinedIcon fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h5">
                Connexion
              </Typography>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="matricule"
                label="Matricule"
                name="matricule"
                autoComplete="username"
                autoFocus
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <BadgeOutlinedIcon 
                      color="action" 
                      sx={{ mr: 1, fontSize: 20 }} 
                    />
                  )
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  mt: 1,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Se connecter'
                )}
              </Button>
              
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" underline="hover">
                    Mot de passe oublié ?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2" underline="hover">
                    Aide
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;