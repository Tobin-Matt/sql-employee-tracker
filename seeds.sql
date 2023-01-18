INSERT INTO department (name)
VALUES ("Upper Management"),
       ("Sales"),
       ("Customer Service"),
       ("Accounting"),
       ("Warehouse");

INSERT INTO roles (title, salary, department_id)
VALUES ("Regional Manager", 100000, 1),
       ("Sales Rep", 80000, 2),
       ("Receptionist", 60000, 3),
       ("Accountant", 70000, 4),
       ("Warehouse Lead", 90000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Scott", 1, NULL),
       ("Jim", "Halpert", 2, 1),
       ("Pam", "Beesly", 3, 1),
       ("Angela", "Martin", 4, 1),
       ("Kevin", "Malone", 4, 4),
       ("Darryl", "Philbin", 5, 1);
