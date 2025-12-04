import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      await axios.post(`http://192.168.1.14:8083/api/auth/change-password`, {
        userId: user.id,
        oldPassword,
        newPassword,
      });

      // Après changement, redirection vers le dashboard selon le rôle
      user.firstLogin = false;
      sessionStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "ADMIN":
          navigate("/admin/Dashboard");
          break;
        case "CHEF_BUR":
          navigate("/c-b-v");
          break;
        case "CHEF_SI":
          navigate("/c-s-v");
          break;
        case "CHEF_DEP":
          navigate("/c-d-v");
          break;
        case "CHEF_DEP_SI":
          navigate("/c-d-si");
          break;
        default:
          navigate("/ticketsPage");
      }
    } catch (err) {
      setError("Erreur lors du changement de mot de passe");
    }
  };

  return (
<Box
  sx={{
    position: "fixed",          // ✅ occupe tout l'écran sans décalage
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1565c0, #42a5f5)",
    margin: 0,                 // ✅ supprime toute marge externe
    padding: 0,                // ✅ supprime toute marge interne
    overflow: "hidden",        // ✅ empêche le scroll
    boxSizing: "border-box",   // ✅ évite tout calcul de largeur anormal
  }}
>

      <Card
        sx={{
          width: 400,
          borderRadius: 4,
          boxShadow: 8,
          backgroundColor: "white",
          p: 3,
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <LockOutlinedIcon color="primary" sx={{ fontSize: 45, mb: 1 }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#1976d2", mb: 3 }}
          >
            Changer votre mot de passe
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Ancien mot de passe"
              type={showPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Nouveau mot de passe"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                py: 1.2,
                fontWeight: "bold",
                borderRadius: 3,
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              }}
            >
              Enregistrer
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePassword;
