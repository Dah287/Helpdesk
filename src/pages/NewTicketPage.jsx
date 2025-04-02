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
  
  // Données provenant de votre JSON
  const data = {
    departements: [
      { id: 1, nom: 'DPF' },
      { id: 2, nom: 'DRH' }
    ],
    services: [
      { id: 1, nom: 'SP', departement_id: 1 },
      { id: 2, nom: 'SI', departement_id: 1 },
      { id: 3, nom: 'SF', departement_id: 1 },
      { id: 4, nom: 'S.G.P', departement_id: 2 },
      { id: 5, nom: 'S.FC.C', departement_id: 2 }
    ],
    bureaux: [
      { id: 1, nom: 'B.P.B', service_id: 1 },
      { id: 2, nom: 'B.S.E', service_id: 1 },
      { id: 3, nom: 'B.E.I', service_id: 2 },
      { id: 4, nom: 'B.E.M', service_id: 2 },
      { id: 5, nom: 'B.C.P', service_id: 3 },
      { id: 6, nom: 'B.C.GA', service_id: 3 },
      { id: 7, nom: 'B.F', service_id: 3 },
      { id: 8, nom: 'B.P.P', service_id: 4 },
      { id: 9, nom: 'B.AS', service_id: 4 },
      { id: 10, nom: 'G.C', service_id: 5 },
      { id: 11, nom: 'F.C', service_id: 5 }
    ]
  };

  const [ticket, setTicket] = useState({
    serialNumber: '',
    equipmentType: '',
    brand: '',
    problemDescription: '',
    status: 'OPEN',
    priority: 'MEDIUM',
    bureau: { id: '' },
    department: { id: '' },
    service: { id: '' },
    createdBy: { id: 1 }
  });

  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredBureaus, setFilteredBureaus] = useState([]);

  const equipmentTypes = ['Ordinateur portable', 'Ordinateur de bureau', 'Imprimante', 'Scanner'];
  const brands = ['Dell', 'HP', 'Lenovo', 'Epson', 'Canon', 'Autre'];

  useEffect(() => {
    if (id) {
      const fetchTicket = async () => {
        try {
          const response = await api.getTicket(id);
          const ticketData = response.data;
          
          // Filtrer d'abord les services correspondants au département
          const servicesForDept = data.services.filter(s => s.departement_id === ticketData.department.id);
          setFilteredServices(servicesForDept);
          
          // Ensuite filtrer les bureaux correspondants au service
          const bureausForService = data.bureaux.filter(b => b.service_id === ticketData.service.id);
          setFilteredBureaus(bureausForService);
          
          // Enfin, mettre à jour le ticket avec toutes les données
          setTicket(ticketData);
          
        } catch (error) {
          console.error("Error fetching ticket:", error);
        }
      };
      fetchTicket();
    }
  }, [id]);
  
  // Modifiez les autres useEffect pour ne pas réinitialiser lors du chargement initial
  useEffect(() => {
    if (ticket.department.id && !id) { // Ne pas réinitialiser si on est en mode édition
      const servicesForDept = data.services.filter(s => s.departement_id === ticket.department.id);
      setFilteredServices(servicesForDept);
      setTicket(prev => ({
        ...prev,
        service: { id: '' },
        bureau: { id: '' }
      }));
      setFilteredBureaus([]);
    }
  }, [ticket.department.id]);
  
  useEffect(() => {
    if (ticket.service.id && !id) { // Ne pas réinitialiser si on est en mode édition
      const bureausForService = data.bureaux.filter(b => b.service_id === ticket.service.id);
      setFilteredBureaus(bureausForService);
      setTicket(prev => ({
        ...prev,
        bureau: { id: '' }
      }));
    }
  }, [ticket.service.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'departmentId') {
      setTicket({
        ...ticket,
        department: { id: parseInt(value) }
      });
    } else if (name === 'serviceId') {
      setTicket({
        ...ticket,
        service: { id: parseInt(value) }
      });
    } else if (name === 'bureauId') {
      setTicket({
        ...ticket,
        bureau: { id: parseInt(value) }
      });
    } else {
      setTicket({
        ...ticket,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.updateTicket(id, ticket);
      } else {
        await api.createTicket(ticket);
      }
      navigate('/');
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
        {/* Sélection du département */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Département</InputLabel>
          <Select
            name="departmentId"
            value={ticket.department.id}
            onChange={handleChange}
            label="Département"
          >
            <MenuItem value="">Sélectionnez un département</MenuItem>
            {data.departements.map(dept => (
              <MenuItem key={dept.id} value={dept.id}>{dept.nom}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sélection du service (dépend du département) */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Service</InputLabel>
          <Select
            name="serviceId"
            value={ticket.service.id}
            onChange={handleChange}
            label="Service"
            disabled={!ticket.department.id}
          >
            <MenuItem value="">Sélectionnez un service</MenuItem>
            {filteredServices.map(service => (
              <MenuItem key={service.id} value={service.id}>{service.nom}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sélection du bureau (dépend du service) */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Bureau</InputLabel>
          <Select
            name="bureauId"
            value={ticket.bureau.id}
            onChange={handleChange}
            label="Bureau"
            disabled={!ticket.service.id}
          >
            <MenuItem value="">Sélectionnez un bureau</MenuItem>
            {filteredBureaus.map(bureau => (
              <MenuItem key={bureau.id} value={bureau.id}>{bureau.nom}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Autres champs du formulaire... */}
        <TextField
          fullWidth
          label="Numéro de série"
          name="serialNumber"
          value={ticket.serialNumber}
          onChange={handleChange}
          margin="normal"
          required
        />
        
        {/* Sélection du type d'équipement */}
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
        
        {/* Sélection de la marque */}
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
          <InputLabel>Statut</InputLabel>
          <Select
            name="status"
            value={ticket.status}
            onChange={handleChange}
            label="Statut"
          >
            <MenuItem value="OPEN">Ouvert</MenuItem>
            <MenuItem value="IN_PROGRESS">En cours</MenuItem>
            <MenuItem value="RESOLVED">Résolu</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Priorité</InputLabel>
          <Select
            name="priority"
            value={ticket.priority}
            onChange={handleChange}
            label="Priorité"
          >
            <MenuItem value="LOW">Basse</MenuItem>
            <MenuItem value="MEDIUM">Moyenne</MenuItem>
            <MenuItem value="HIGH">Haute</MenuItem>
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