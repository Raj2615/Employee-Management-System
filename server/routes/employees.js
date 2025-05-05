const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Create a unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new employee
router.post('/', upload.single('profilePicture'), async (req, res) => {
    try {
        console.log('File upload:', req.file); // Debug log

        const employeeData = {
            ...req.body,
            profilePicture: req.file ? `/uploads/${req.file.filename}` : undefined
        };

        console.log('Profile picture path:', employeeData.profilePicture); // Debug log

        if (employeeData.address) {
            employeeData.address = JSON.parse(employeeData.address);
        }

        console.log('Employee data:', employeeData); // Debug log

        const employee = new Employee(employeeData);
        const newEmployee = await employee.save();
        console.log('Saved employee:', newEmployee); // Debug log
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error('Error creating employee:', error); // Debug log
        res.status(400).json({ message: error.message });
    }
});

// Get a specific employee
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an employee
router.put('/:id', upload.single('profilePicture'), async (req, res) => {
    try {
        console.log('File upload for update:', req.file); // Debug log

        const updateData = { ...req.body };
        
        if (req.file) {
            // Delete old profile picture if it exists
            const employee = await Employee.findById(req.params.id);
            if (employee && employee.profilePicture) {
                const oldFilePath = path.join(__dirname, '..', employee.profilePicture);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
            updateData.profilePicture = `/uploads/${req.file.filename}`;
        }

        if (updateData.address) {
            updateData.address = JSON.parse(updateData.address);
        }

        console.log('Update data:', updateData); // Debug log

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee);
    } catch (error) {
        console.error('Error updating employee:', error); // Debug log
        res.status(400).json({ message: error.message });
    }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Delete profile picture if it exists
        if (employee.profilePicture) {
            const filePath = path.join(__dirname, '..', employee.profilePicture);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search employees
router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const employees = await Employee.find({
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { department: { $regex: query, $options: 'i' } },
                { position: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 