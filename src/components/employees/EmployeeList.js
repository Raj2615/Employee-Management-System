import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  Stack,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import axios from 'axios';

const EmployeeList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchEmployees();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/employees/search/${searchQuery}`);
      setEmployees(response.data);
      setError(null);
    } catch (error) {
      console.error('Error searching employees:', error);
      setError('Failed to search employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${selectedEmployee._id}`);
      setDeleteDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Failed to delete employee. Please try again.');
    }
  };

  const EmployeeCard = ({ employee }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={employee.profilePicture ? `http://localhost:5000${employee.profilePicture}` : undefined}
            sx={{ 
              width: 80, 
              height: 80, 
              mr: 2,
              border: '2px solid',
              borderColor: 'primary.main',
              objectFit: 'cover'
            }}
          >
            {!employee.profilePicture && `${employee.firstName[0]}${employee.lastName[0]}`}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {employee.firstName} {employee.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {employee.position}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2">{employee.email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2">{employee.phone}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon fontSize="small" color="action" />
            <Typography variant="body2">{employee.department}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkIcon fontSize="small" color="action" />
            <Typography variant="body2">{employee.employeeType}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoneyIcon fontSize="small" color="action" />
            <Typography variant="body2">₹{employee.salary.toLocaleString('en-IN')}</Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Chip
            label={employee.department}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={employee.employeeType}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/employees/edit/${employee._id}`)}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => {
            setSelectedEmployee(employee);
            setDeleteDialogOpen(true);
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={8}>
                <TextField
                  fullWidth
                  label="Search Employees"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/employees/new')}
                  >
                    Add Employee
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
              <Typography>{error}</Typography>
            </Paper>
          </Grid>
        )}

        {employees.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No employees found
              </Typography>
            </Paper>
          </Grid>
        ) : (
          employees.map((employee) => (
            <Grid item xs={12} sm={6} md={4} key={employee._id}>
              <EmployeeCard employee={employee} />
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedEmployee?.firstName} {selectedEmployee?.lastName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeList; 