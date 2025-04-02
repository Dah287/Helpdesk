import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TicketsPage from './pages/TicketsPage';
import NewTicketPage from './pages/NewTicketPage';
import { CssBaseline, Container } from '@mui/material';
import AdminDashboard from './components/AdminDashboard';
function App() {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<TicketsPage />} />
          <Route path="/new-ticket" element={<NewTicketPage />} />
          <Route path="/tickets/:id/edit" element={<NewTicketPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;