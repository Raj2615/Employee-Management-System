# Employee Management System

A full-stack web application for managing employee information, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- Employee CRUD operations
- Profile picture upload and management
- Search functionality
- Responsive design
- Department and employee type categorization
- Salary management
- Address management

## Tech Stack

- Frontend: React.js, Material-UI
- Backend: Node.js, Express.js
- Database: MongoDB
- File Storage: Local file system (for profile pictures)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Raj2615/employee-management.git
cd employee-management
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/employee-management
PORT=5000
JWT_SECRET=your_jwt_secret
```

4. Create an uploads directory in the server folder:
```bash
mkdir server/uploads
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
employee-management/
├── client/                 # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/     # React components
│       ├── context/        # Context providers
│       └── App.js          # Main application component
├── server/                 # Backend Node.js application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── uploads/           # Profile picture storage
│   └── server.js          # Main server file
└── README.md
```

## API Endpoints

### Employees
- GET /api/employees - Get all employees
- POST /api/employees - Create new employee
- GET /api/employees/:id - Get employee by ID
- PUT /api/employees/:id - Update employee
- DELETE /api/employees/:id - Delete employee
- GET /api/employees/search/:query - Search employees

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Raj2615 - [GitHub Profile](https://github.com/Raj2615) 