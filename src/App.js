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
import UserManagement from './components/UserManagement';
import ChefBureau from './components/PagesProcessus/ChefBureau';
import TicketsComponent from './components/TicketsComponent';
import DashboardComponent from './components/DashboardComponent';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        {/* Routes publiques (login) sans container */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Routes privées avec Container */}
        <Route 
          path="/ticketsPage" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <TicketsPage />
              </Container>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/new-ticket" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <NewTicketPage />
              </Container>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/tickets/:id/edit" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <NewTicketPage />
              </Container>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <AdminDashboard />
              </Container>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/c-s-v" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <ChefServiceList />
              </Container>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/c-b-v" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <ChefBureau />
              </Container>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/c-d-v" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <ChefDepV />
              </Container>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/c-d-si" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <ChefDepSI />
              </Container>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/user" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <UserManagement />
              </Container>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/Tickets" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <TicketsComponent />
              </Container>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/Dashboard" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <DashboardComponent />
              </Container>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/user" 
          element={
            <PrivateRoute>
              <Container maxWidth="lg" style={{ padding: '0px', marginLeft: '100px' }}>
                <UserManagement />
              </Container>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
