# Employee Tracker

## Description
This is a command-line application that can be used to manage a company's employee database.

## Installation & Usage
To isntall the application follow the steps below:
* Clone the repository into your desired directory on your local machine.
* Install the npm packages by running the "npm install" command in the directory terminal.

Below are the steps to run the application:
* To invoke the application the user must be in the root directory and run the command "node index.js" or "node .".
* The application will then connect to mysql and the user will be notified which database they are connected to.
* The user will be prompted with a question of how to manage the database and a list of options to choose.
* If the user selects to view departments, roles, or employees then a table with all the necessary info will be presented in the console.
* If a user selects to add a department, they will then be prompted to input the departments name.
* If a user selects to add a role, they will be prompted to enter the name of the role, the salary for this role and choose which department it belongs to.
* If a user selects to add an employee, they will be prompted to input their first name, last name, select what role they have and select who their manager is.
* The user has the option to update an employees role, they will choose the employee to update and that employee's new role.
* Once the user is done with the database they can choose the option of "CLOSE DATABASE" and the database will be closed and all updates will be saved.

## Technologies & Code Description
This application used several technologies and npm packages:
* Javascript
* Node.js
* MySQL2
* Inquirer
* console.table

The function of the application was written in the "index.js" file. Javascript was used to run the prompts for the user. Sql queries are included in the Javascript file by using the ".query()" mysql method. These queries handle the way the user views the tables and how the updated information is added to the tables. Two different sql files were created to handle the sql database. The "schema.sql" file creates the database for the company and creates the tables within the database. The "seeds.sql" file adds some initial data to all the tables in the database.

## Video Walkthrough
Below is a video demonstrating the functionality of the application.

https://drive.google.com/file/d/1Stj2rzZNCnyLaVi-EIRTVrPIVKzZIr9d/view
