import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Container, Typography
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TicketFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Récupérer l'utilisateur connecté depuis le localStorage
  const userData = localStorage.getItem('user');
  const bureau_id = localStorage.getItem('bureau_id');
  const service_id = localStorage.getItem('service_id');
  const department_id = localStorage.getItem('department_id');
  const parseddepartment_id = department_id ? JSON.parse(department_id) : null;
  const parsedbureau_id = bureau_id ? JSON.parse(bureau_id) : null;
  const parsedservice_id = service_id ? JSON.parse(service_id) : null;
  const parsedUser = userData ? JSON.parse(userData) : null;



  const [ticket, setTicket] = useState(() => {
    const bureauId = parsedbureau_id?.id || '';
    const serviceId = parsedservice_id?.id || '';
  
    let status = 'SERVICE_VALIDATED';
  
    if (bureauId === 10 && serviceId === 10 && parsedUser.role !== "CHEF_DEP_SI" ) {
      status = 'DEPT_VALIDATED';
    } else if (bureauId === 10 && serviceId !== 10) {
      status = 'SERVICE_VALIDATED';
    }
    // else if (parsedUser.role === "CHEF_DEP_SI") {
    //   status = 'SI_SERVICE';
    // }
  
    return {
      typeDemande: '',
      serialNumber: '',
      equipmentType: '',
      brand: '',
      problemDescription: '',
      status,
      priority: 'MEDIUM',
      bureau: { id: bureauId },
      department: { id: parseddepartment_id?.id || '' },
      service: { id: serviceId },
      createdBy: { id: parsedUser?.id || '' }
    };
  });
  
console.log("parsedUser?.department_id",parsedUser?.department_id)
console.log("parsedUser?.department_id",parsedUser?.id)
  const equipmentTypes = ['Ordinateur portable', 'Ordinateur de bureau', 'Imprimante', 'Scanner'];
  const brands = ['Dell', 'HP', 'Lenovo', 'Epson', 'Canon', 'Autre'];

  useEffect(() => {
    if (id) {
      const fetchTicket = async () => {
        try {
          const response = await api.getTicket(id);
          setTicket(response.data);
        } catch (error) {
          console.error("Error fetching ticket:", error);
        }
      };
      fetchTicket();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket({
      ...ticket,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.updateTicket(id, ticket);
      } else {
        console.log("ticket :", ticket);
        await api.createTicket(ticket);
      }
      switch(parsedUser.role) {
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
    } catch (error) {
      console.error("Error saving ticket:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        {id ? 'Modifier le Ticket' : 'Créer un Nouveau Ticket'}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Type de demande */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Type de demande</InputLabel>
          <Select
            name="typeDemande"
            value={ticket.typeDemande}
            onChange={handleChange}
            label="Type de demande"
          >
            <MenuItem value="maintenance">Demande de reparation</MenuItem>
            <MenuItem value="intervention">Demande d'intervention</MenuItem>
          </Select>
        </FormControl>

        {ticket.typeDemande === 'maintenance' && (
          <>
            <TextField
              fullWidth
              label="Numéro de série"
              name="serialNumber"
              value={ticket.serialNumber}
              onChange={handleChange}
              margin="normal"
              required
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Type d'équipement</InputLabel>
              <Select
                name="equipmentType"
                value={ticket.equipmentType}
                onChange={handleChange}
                label="Type d'équipement"
              >
                {equipmentTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Marque</InputLabel>
              <Select
                name="brand"
                value={ticket.brand}
                onChange={handleChange}
                label="Marque"
              >
                {brands.map(brand => (
                  <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description du problème"
          name="problemDescription"
          value={ticket.problemDescription}
          onChange={handleChange}
          margin="normal"
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Priorité</InputLabel>
          <Select
            name="priority"
            value={ticket.priority}
            onChange={handleChange}
            label="Priorité"
          >
            <MenuItem value="BASSE">Basse</MenuItem>
            <MenuItem value="MOYENNE">Moyenne</MenuItem>
            <MenuItem value="HAUTE">Haute</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
        >
          {id ? 'Mettre à jour' : 'Créer le Ticket'}
        </Button>
      </form>
    </Container>
  );
};

export default TicketFormPage;