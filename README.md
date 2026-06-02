# 🚌 Bus Pass Management System

## Overview

The Bus Pass Management System is a web application designed to manage student bus pass services efficiently. The system allows administrators to manage students, drivers, routes, and bus pass details through a centralized platform.

---

## Features

* Add Student Details
* View Student Records
* Search Students
* Delete Students
* Manage Drivers
* Manage Bus Routes
* Issue Bus Passes
* View Bus Pass Information
* Store Data Using MySQL Database

---

## Technology Stack

### Frontend

* React.js
* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Version Control

* Git
* GitHub

---

## Database Structure

### Student

* student_id
* name
* department
* year
* phone

### Driver

* driver_id
* name
* phone
* bus_no

### Route

* route_id
* driver_id
* source
* destination
* bus_no
* fare

### BusPass

* pass_id
* pass_type
* student_id
* route_id
* issue_date
* expiry_date
* status

---

## Project Structure

bus_tckt_mngment/

├── frontend/

├── backend/

├── database/

│   ├── schema.sql

│   └── sample_data.sql

└── README.md

---

## Installation

### Clone Repository

git clone <repository-url>

### Install Backend Dependencies

cd backend

npm install

### Start Backend Server

npm run dev

### Install Frontend Dependencies

cd frontend

npm install

### Start Frontend

npm run dev

---

## Database Setup

1. Open MySQL Workbench.
2. Create a database named:

bus_pass_management

3. Execute the commands in:

database/schema.sql

4. Insert sample data using:

database/sample_data.sql

---

---

## Academic Project

This project was developed for learning Full Stack Web Development concepts using React, Node.js, Express.js, and MySQL.
