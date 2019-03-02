# FS_js_Tech_Degree_Project_10
Library Manager System
## Description of Web Application

This is a web application that enables a librarian to enter data and the data is then stored in a SQLite database.

SQL ORM Sequelize is used to migrate the data from the Express application to the SQLite database.  

## Required Software to run
1. Updated version of Node.js (https://nodejs.org/en/download/)
2. Updated version of NPM, should be also downloaded when Node.js is downloaded

## Available Scripts

In the project directory using your desired terminal window, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run-script reinit:db`
This script will reset the development.db file (database file) and populate the database with information in the seeder files. This is accomplished by undoing Sequelize migration, running the Sequelize Migration, and running Sequelize seed all.

## App layout

The app is broken into three main pages (books, patrons, and loans) that can be navigated using the navigation bar at the top of the webpage. Pagination functions creates a new page every 5 books or 5 patrons. Search function can be used to search any word, or multi word combination and is not case sensitive.
New Books and Patrons can be added using the add new buttons.
