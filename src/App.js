import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TicketsPage from './pages/TicketsPage';
import NewTicketPage from './pages/NewTicketPage';
import { CssBaseline, Container } from '@mui/material';
import AdminDashboard from './components/AdminDashboard';
import ChefServiceList from './components/PagesProcessus/ChefServiceList';
import ChefDepV from './components/PagesProcessus/ChefDepV';
import ChefDepSI from './components/PagesProcessus/ChefDepSI';
import Login from './pages/Login';
import PrivateRoute from './pages/PrivateRoute';
function App() {
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth="lg" style={{ padding: '0px',marginLeft: '340px' }}>
        <Routes>
          {/* <Route path="/" element={<Login />} />
          <Route path="/ticketsPage" element={<TicketsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new-ticket" element={<NewTicketPage />} />
          <Route path="/tickets/:id/edit" element={<NewTicketPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/c-s-v" element={<ChefServiceList />} />
          <Route path="/c-d-v" element={<ChefDepV />} />
          <Route path="/c-d-si" element={<ChefDepSI />} /> */}

          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route path="/ticketsPage" element={<PrivateRoute><TicketsPage /></PrivateRoute>} />
          <Route path="/new-ticket" element={<PrivateRoute><NewTicketPage /></PrivateRoute>} />
          <Route path="/tickets/:id/edit" element={<PrivateRoute><NewTicketPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/c-s-v" element={<PrivateRoute><ChefServiceList /></PrivateRoute>} />
          <Route path="/c-d-v" element={<PrivateRoute><ChefDepV /></PrivateRoute>} />
          <Route path="/c-d-si" element={<PrivateRoute><ChefDepSI /></PrivateRoute>} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;