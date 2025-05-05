import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardActions,
  CircularProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  Add as AddIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: {},
    employeeTypes: {},
    totalSalary: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentEmployees, setRecentEmployees] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Employees', icon: <PeopleIcon />, path: '/employees' },
    { text: 'Add Employee', icon: <AddIcon />, path: '/employees/new' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employees');
        const employees = response.data;

        // Calculate statistics
        const departments = {};
        const employeeTypes = {};
        let totalSalary = 0;

        employees.forEach(emp => {
          // Count departments
          departments[emp.department] = (departments[emp.department] || 0) + 1;
          // Count employee types
          employeeTypes[emp.employeeType] = (employeeTypes[emp.employeeType] || 0) + 1;
          // Sum salaries
          totalSalary += emp.salary || 0;
        });

        setStats({
          totalEmployees: employees.length,
          departments,
          employeeTypes,
          totalSalary
        });

        // Get 5 most recent employees
        setRecentEmployees(employees.slice(-5).reverse());
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const QuickActionCard = ({ title, description, icon, onClick, color }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton sx={{ color: color, mr: 1 }}>
            {icon}
          </IconButton>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClick}>Go to {title}</Button>
      </CardActions>
    </Card>
  );

  const StatCard = ({ title, value, icon, color }) => (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 140,
        bgcolor: color,
        color: 'white'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <IconButton sx={{ color: 'white' }}>
          {icon}
        </IconButton>
      </Box>
      <Typography variant="h4" component="div" sx={{ mt: 2 }}>
        {value}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Employee Management System
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.username}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </Drawer>

      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={<PeopleIcon />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Departments"
              value={Object.keys(stats.departments).length}
              icon={<BusinessIcon />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Employee Types"
              value={Object.keys(stats.employeeTypes).length}
              icon={<WorkIcon />}
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              title="Total Salary"
              value={`₹${stats.totalSalary.toLocaleString('en-IN')}`}
              icon={<MoneyIcon />}
              color="#9c27b0"
            />
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Quick Actions
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <QuickActionCard
              title="View Employees"
              description="View and manage all employees in the system"
              icon={<PeopleIcon />}
              onClick={() => navigate('/employees')}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <QuickActionCard
              title="Add Employee"
              description="Add a new employee to the system"
              icon={<AddIcon />}
              onClick={() => navigate('/employees/new')}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <QuickActionCard
              title="Search Employees"
              description="Search for specific employees"
              icon={<SearchIcon />}
              onClick={() => navigate('/employees')}
              color="#ed6c02"
            />
          </Grid>

          {/* Recent Employees */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Employees
              </Typography>
              <List>
                {recentEmployees.map((employee) => (
                  <React.Fragment key={employee._id}>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${employee.firstName} ${employee.lastName}`}
                        secondary={`${employee.position} - ${employee.department}`}
                      />
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/employees/edit/${employee._id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Department Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Department Distribution
              </Typography>
              <List>
                {Object.entries(stats.departments).map(([dept, count]) => (
                  <React.Fragment key={dept}>
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={dept}
                        secondary={`${count} employees`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 