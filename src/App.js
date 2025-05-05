import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import EmployeeList from './components/employees/EmployeeList';
import EmployeeForm from './components/employees/EmployeeForm';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Create router with future flags
const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/employees',
    element: <Layout><EmployeeList /></Layout>,
  },
  {
    path: '/employees/new',
    element: <Layout><EmployeeForm /></Layout>,
  },
  {
    path: '/employees/edit/:id',
    element: <Layout><EmployeeForm /></Layout>,
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 