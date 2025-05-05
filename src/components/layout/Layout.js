import React from 'react';
import { Container } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
    </div>
  );
};

export default Layout; 