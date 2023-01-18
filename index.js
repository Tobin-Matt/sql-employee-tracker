const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '@f$#s&723Qf3',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)   
);

//initiate prompts for the user to navigate the database
const startPrompts = () => {
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'Would you like to view company info or add company info?',
            name: 'viewOrAdd', 
            choices: ['View all departments', 
            'View all roles', 
            'View all employees', 
            'Add a department', 
            'Add a role', 
            'Add an employee', 
            'Update an employee role', 
            'CLOSE DATABASE'],
        }
    ])
    .then((selection) => {
        switch(selection.viewOrAdd) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                promptDepartment();
                break;
            case 'Add a role':
                promptRole();
                break;
            case 'Add an employee':
                promptEmployee();
                break;
            case 'Update an employee role':
                promptUpdateEmployee();
                break;
            case 'CLOSE DATABASE':
                console.log('Database closed!');
                db.end()
        }
    });
};

//will return all columns in the "department" table
const viewDepartments = () => {
    db.query('SELECT * FROM department', function (err, results) {
        //the empty console.log prints a blank line so that the table is easier to read in the console
        console.log();
        console.log('Departments:');
        console.table(results);
        startPrompts();
    });
};

//function below will display the id, title, and salary for each role along with the name of the department that role belongs to
const viewRoles = async () => {
    const joinQuery = `SELECT roles.id, roles.title, roles.salary, department.name
                       FROM roles
                       JOIN department ON roles.department_id = department.id`;
    const rolesTable = await db.promise().query(joinQuery);
    console.log();
    console.log('Roles:');
    console.table(rolesTable[0]);
    startPrompts();
}

//function below returns a table with each employee's id, first & last name, role title, department, salary and their manager. 
const viewEmployees = async () => {
    const joinQuery = `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    roles.title, 
    department.name AS department, 
    roles.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee 
    LEFT JOIN roles ON employee.role_id = roles.id
    LEFT JOIN department ON roles.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`
    const employeeTable = await db.promise().query(joinQuery);
    console.log();
    console.log('Employees:');
    console.table(employeeTable[0]);
    startPrompts();
}

//function to run validation for the prompts with type "input"
const inputValidation = (input) => {
    if (input) {
        return true;
    } else {
        console.log('Please input information before proceeding.');
        return false;
    }
};

//prompt for user to add a department
const promptDepartment = () => {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:',
            validate: inputValidation
        }
    ])
    .then((newDepartment) => {
        db.query('INSERT INTO department (name) VALUES (?)', [newDepartment.departmentName], (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log(`Added ${newDepartment.departmentName} to the database.`);
            startPrompts();
        })
    })
}

//prompt for user to add a role
const promptRole = async () => {
    //selects the departments from the sql table and returns as an array
    const [rows] = await db.promise().query(`SELECT * FROM department`);
    //maps through the above array and adds the properties of name and value to be used in the inquirer prompt
    const departmentList = rows.map(({ id, name }) => ({
        name: name,
        value: id
    }))

    inquirer
    .prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter the name of the new role:',
            validate: inputValidation
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary for this new role:',
            validate: inputValidation
        },
        {
            type: 'list',
            name: 'roleDepart',
            message: 'What department does this role belong to?',
            choices: departmentList,
        }
    ])
    .then((newRole) => {
        db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', 
        [newRole.roleName, newRole.roleSalary, newRole.roleDepart], 
        (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log(`Added ${newRole.roleName} to the database.`);
            startPrompts();
        })
    })
}

//prompt for user to add an employee
const promptEmployee = async () => {
    //selects the roles from the sql table and returns as an array
    const [rolesRows] = await db.promise().query(`SELECT id, title FROM roles`);
    //map through the roles array and returns as a new array with the prompt properties
    const rolesList = rolesRows.map(({ id, title }) => ({
        name: title,
        value: id
    }))

    const [managerRows] = await db.promise().query(`SELECT id, first_name, last_name FROM employee`);
    const managerList = managerRows.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id
    }))

    inquirer
    .prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: inputValidation
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: inputValidation
        },
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: rolesList,
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: managerList,
        }
    ])
    .then((newEmployee) => {
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, 
        [newEmployee.firstName, newEmployee.lastName, newEmployee.role, newEmployee.manager],
        (err, res) => {
            if (err) {
                console.log(err);
            } 
            console.log(`Added ${newEmployee.firstName} ${newEmployee.lastName} to the database.`)
            startPrompts();
        })
    })
}

//prompt to update an employee's role
const promptUpdateEmployee = async () => {
    const [empRows] = await db.promise().query(`SELECT id, first_name, last_name FROM employee`);
    const empList = empRows.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id
    }));

    const [roleRows] = await db.promise().query(`SELECT id, title FROM roles`);
    const roleList = roleRows.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee's role do you want to update?",
            choices: empList
        },
        {
            type: 'list',
            name: 'updatedRole',
            message: "Which role do you want to assign to the selected employee?",
            choices: roleList
        }
    ])
    .then((updatedEmp) => {
        db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, 
        [updatedEmp.updatedRole, updatedEmp.employee],
        (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log("Updated employee's role");
            startPrompts();
        });
    });
}

startPrompts();