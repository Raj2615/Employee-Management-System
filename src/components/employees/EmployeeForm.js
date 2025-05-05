import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Avatar
} from '@mui/material';

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  employeeType: Yup.string().required('Employee type is required'),
  department: Yup.string().required('Department is required'),
  position: Yup.string().required('Position is required'),
  joiningDate: Yup.date().required('Joining date is required'),
  salary: Yup.number().required('Salary is required').min(0, 'Salary must be positive'),
  address: Yup.object({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip code is required'),
    country: Yup.string().required('Country is required'),
  })
});

const employeeTypes = ['Full-time', 'Part-time', 'Contract', 'Intern'];

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setProfilePicture(file);
      setError('');
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      employeeType: '',
      department: '',
      position: '',
      joiningDate: '',
      salary: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      }
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const formData = new FormData();

        // Append all form fields to FormData
        Object.keys(values).forEach(key => {
          if (key === 'address') {
            formData.append(key, JSON.stringify(values[key]));
          } else {
            formData.append(key, values[key]);
          }
        });

        if (profilePicture) {
          formData.append('profilePicture', profilePicture);
        }

        if (isEditMode) {
          await axios.put(`http://localhost:5000/api/employees/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          await axios.post('http://localhost:5000/api/employees', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }

        navigate('/employees');
      } catch (error) {
        console.error('Error saving employee:', error);
        setError(error.response?.data?.message || 'Failed to save employee');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
          const employee = response.data;
          
          // Format the date for the input field
          const joiningDate = new Date(employee.joiningDate).toISOString().split('T')[0];
          
          // Parse the address if it's a string
          const address = typeof employee.address === 'string' 
            ? JSON.parse(employee.address) 
            : employee.address;
          
          formik.setValues({
            ...employee,
            joiningDate,
            address: address || {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
            }
          });
        } catch (error) {
          console.error('Error fetching employee:', error);
          setError('Failed to fetch employee details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEmployee();
  }, [id, isEditMode]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {isEditMode ? 'Edit Employee' : 'Add New Employee'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="employeeType"
                label="Employee Type"
                value={formik.values.employeeType}
                onChange={formik.handleChange}
                error={formik.touched.employeeType && Boolean(formik.errors.employeeType)}
                helperText={formik.touched.employeeType && formik.errors.employeeType}
              >
                {employeeTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="department"
                label="Department"
                value={formik.values.department}
                onChange={formik.handleChange}
                error={formik.touched.department && Boolean(formik.errors.department)}
                helperText={formik.touched.department && formik.errors.department}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="position"
                label="Position"
                value={formik.values.position}
                onChange={formik.handleChange}
                error={formik.touched.position && Boolean(formik.errors.position)}
                helperText={formik.touched.position && formik.errors.position}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="joiningDate"
                label="Joining Date"
                value={formik.values.joiningDate}
                onChange={formik.handleChange}
                error={formik.touched.joiningDate && Boolean(formik.errors.joiningDate)}
                helperText={formik.touched.joiningDate && formik.errors.joiningDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                name="salary"
                label="Salary"
                value={formik.values.salary}
                onChange={formik.handleChange}
                error={formik.touched.salary && Boolean(formik.errors.salary)}
                helperText={formik.touched.salary && formik.errors.salary}
              />
            </Grid>

            {/* Address Fields */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Address
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address.street"
                label="Street"
                value={formik.values.address.street}
                onChange={formik.handleChange}
                error={formik.touched.address?.street && Boolean(formik.errors.address?.street)}
                helperText={formik.touched.address?.street && formik.errors.address?.street}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.city"
                label="City"
                value={formik.values.address.city}
                onChange={formik.handleChange}
                error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
                helperText={formik.touched.address?.city && formik.errors.address?.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.state"
                label="State"
                value={formik.values.address.state}
                onChange={formik.handleChange}
                error={formik.touched.address?.state && Boolean(formik.errors.address?.state)}
                helperText={formik.touched.address?.state && formik.errors.address?.state}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.zipCode"
                label="Zip Code"
                value={formik.values.address.zipCode}
                onChange={formik.handleChange}
                error={formik.touched.address?.zipCode && Boolean(formik.errors.address?.zipCode)}
                helperText={formik.touched.address?.zipCode && formik.errors.address?.zipCode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.country"
                label="Country"
                value={formik.values.address.country}
                onChange={formik.handleChange}
                error={formik.touched.address?.country && Boolean(formik.errors.address?.country)}
                helperText={formik.touched.address?.country && formik.errors.address?.country}
              />
            </Grid>

            {/* Profile Picture Upload */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {isEditMode && formik.values.profilePicture && (
                  <Avatar
                    src={`http://localhost:5000${formik.values.profilePicture}`}
                    sx={{ width: 100, height: 100, mb: 2 }}
                  />
                )}
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="profile-picture-upload"
                />
                <label htmlFor="profile-picture-upload">
                  <Button variant="outlined" component="span">
                    {isEditMode ? 'Change Profile Picture' : 'Upload Profile Picture'}
                  </Button>
                </label>
                {profilePicture && (
                  <Typography variant="body2" color="text.secondary">
                    Selected file: {profilePicture.name}
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/employees')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update' : 'Create')} Employee
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeeForm; 