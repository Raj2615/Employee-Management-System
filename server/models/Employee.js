const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    employeeType: {
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Contract', 'Intern']
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String
    },
    joiningDate: {
        type: Date,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

// Create index for search functionality
employeeSchema.index({ 
    firstName: 'text', 
    lastName: 'text', 
    email: 'text', 
    department: 'text', 
    position: 'text' 
});

module.exports = mongoose.model('Employee', employeeSchema); 