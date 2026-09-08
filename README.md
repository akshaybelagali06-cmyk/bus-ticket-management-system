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
* Store Data Using Firebase Firestore

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

* Firebase Firestore

### Version Control

* Git
* GitHub

---

## Firestore Collections

### students

* student_id
* name
* department
* year
* phone

### drivers

* driver_id
* name
* phone
* bus_no

### routes

* route_id
* driver_id
* source
* destination
* bus_no
* fare

### passes

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

## Firebase Setup

Configure `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and
`FIREBASE_PRIVATE_KEY` in the backend environment before starting the server.
Run `npm run create-admin` from `backend` to seed the initial administrator.

---

---

## Academic Project

This project was developed for learning Full Stack Web Development concepts using React, Node.js, Express.js, and Firebase.
