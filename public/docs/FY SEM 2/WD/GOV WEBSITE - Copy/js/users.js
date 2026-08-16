/**
 * KhelConnect User Management System
 * This file stores user data and provides functions to manage users
 */

// Initialize users array from localStorage or with default users if not found
let USERS = JSON.parse(localStorage.getItem('khelconnect_users')) || [
    {
        id: 1,
        firstName: "Abhishek",
        lastName: "Patil",
        email: "abhipatil1403@gmail.com",
        password: "Abhi@123",
        role: "user",
        dateRegistered: "2025-05-22"
    },
    {
        id: 2,
        firstName: "Admin",
        lastName: "User",
        email: "admin@khelconnect.gov.in",
        password: "Admin@123",
        role: "admin",
        dateRegistered: "2025-05-22"
    }
];

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('khelconnect_users', JSON.stringify(USERS));
}

// Add a new user
function addUser(userData) {
    // Generate a new ID (max ID + 1)
    const newId = USERS.length > 0 ? Math.max(...USERS.map(user => user.id)) + 1 : 1;
    
    // Create new user object
    const newUser = {
        id: newId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: "user",
        dateRegistered: new Date().toISOString().split('T')[0]
    };
    
    // Add to users array
    USERS.push(newUser);
    
    // Save to localStorage
    saveUsers();
    
    // Return the new user (without password)
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

// Find user by email and password
function findUser(email, password) {
    return USERS.find(user => user.email === email && user.password === password);
}

// Check if email already exists
function emailExists(email) {
    return USERS.some(user => user.email === email);
}

// Export functions for use in auth.js
const UserManager = {
    addUser,
    findUser,
    emailExists
};
