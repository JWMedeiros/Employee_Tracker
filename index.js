const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();
let isrunning=true;

// Connect to database (please enter your preferred connection + password)
const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PASSWORD,
      database: 'employeesJM'
    },
    console.log(`Connected to the Employee database.`)
);

async function keepGoing(){
    return inquirer.prompt([
        {
            type: "list",
            name: "mainMenu",
            message: "Return to Main Menu?",
            choices: ['Yes','No'],       
        },
    ])
}

async function mainMenu(){
    let val=await inquirer.prompt([
        {
            type: "list",
            name: "menuOption",
            message: "Please choose a Menu Option",
            choices: ['View All Departments','View All Roles','View All Employees','View Employees by Manager','View Employees by Department','View Total Employee Budget by Dept',
            'Add a Department','Add a Role','Add an Employee',
            'Update Employee Role','Update Employee Managers',
            'Delete Employee','Delete Department','Delete Role','Exit Application'],       
        },
    ])
    switch (val.menuOption){
        case 'View All Departments':
            viewDepartments();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'View All Employees':
            viewEmployees();
            break;
        case 'View Employees by Manager':
            await employeesByManager();
            break;
        case 'View Employees by Department':
            await employeesByDepartment();
            break;
        case 'View Total Employee Budget by Dept':
            await budgetByDept();
            break;
        case 'Add a Department':
            await addDept();
            break;
        case 'Add a Role':
            await addRole();
            break;
        case'Add an Employee':
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateRole();
            break;
        case 'Update Employee Managers':
            await updateManager();
            break;
        case 'Delete Employee':
            await deleteEmployee();
            break;
        case 'Delete Department':
            await deleteDepartment();
            break;
        case 'Delete Role':
            await deleteRole();
            break;
        default:
            isrunning=false;
    }
    if (isrunning){
        let answer =await keepGoing()
        if (answer.mainMenu==='No'){
            db.end();
        }
        else{
            mainMenu()
        }
    }
    else{
        db.end()
    }
}

function viewDepartments(){
    db.query(`SELECT * FROM department`,function(err,results){
        err? console.error(err) : console.table(results);
    })
}

function viewRoles(){
    db.query(`SELECT * FROM role`,function(err,results){
        err? console.error(err) : console.table(results);
    })
}

function viewEmployees(){
    db.query(`SELECT * FROM employee`,function(err,results){
        err? console.error(err) : console.table(results);
    })
}

async function employeesByManager(){
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "mgr",
            message: "Please enter the ID of your preferred manager",      
        },
    ])
    db.query(`SELECT * FROM employee where manager_id =?`,answer.mgr,function(err,results){
        err? console.error('Your manager ID is incorrect!') :console.table(results);
    })
}

async function employeesByDepartment(){
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "dpt",
            message: "Please enter the name of the department you would like to see employees from",      
        },
    ])
    db.query(`SELECT department.id,department.name,role.title,role.salary,employee.id,employee.first_name,employee.last_name,employee.manager_id FROM department INNER JOIN role ON department.id=role.department_id INNER JOIN employee ON role.id=employee.role_id WHERE department.name=?`,answer.dpt,function(err,results){
        err? console.error('Your department name is incorrect!') :console.table(results);
    })
}

async function budgetByDept(){
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "dpt",
            message: "Please enter the name of the department you would like to see total employee budget from",      
        },
    ])
    db.query(`SELECT SUM (role.salary) AS 'Total Employee Budget' FROM department INNER JOIN role ON department.id=role.department_id INNER JOIN employee ON role.id=employee.role_id WHERE department.name=?`,answer.dpt,function(err,results){
        err? console.error('Your department name is incorrect!') :console.table(results);
    })
}

async function addDept(){
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Please enter the name of the department you wish to add",      
        },
    ])
    db.query(`INSERT INTO department (name) VALUES (?)`,answer.name,function(err,results){
        err? console.error(err) :console.log("\nDepartment added Successfully.");
    })
}

async function addRole(){
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Please enter the title of the role you wish to add",      
        },
        {
            type: "input",
            name: "salary",
            message: "Please enter the salary of the role you wish to add",      
        },
        {
            type: "input",
            name: "dept",
            message: "Please enter the department ID this role will belong to",      
        },
    ])
    db.query(`INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`,[answer.title,answer.salary,answer.dept],function(err,results){
        err? console.error(err) :console.log("\nRole added Successfully.");
    })
}

async function addEmployee(){
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Please enter the first name of the employee",      
        },
        {
            type: "input",
            name: "last_name",
            message: "Please enter the last name of the employee",      
        },
        {
            type: "input",
            name: "roleID",
            message: "Please enter ID of the role this employee will have",      
        },
        {
            type: "input",
            name: "managerID",
            message: "Please enter ID of the manager this employee will work for",      
        },
    ])
    db.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)`,[answer.first_name,answer.last_name,answer.roleID,answer.managerID],function(err,results){
        err? console.error(err) :console.log("\nEmployee added Successfully.");
    })
}

async function updateRole(){
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Please enter the ID of the employee whos role you would like to update",      
        },
        {
            type: "input",
            name: "newRole",
            message: "Please enter the ID of the new role you would like them to have",      
        },
    ])
    db.query(`UPDATE employee SET role_id=? WHERE id=?`,[answer.newRole,answer.id],function(err,results){
        err? console.error(err) :console.log('\nRole updated successfully');
    })
}

async function updateManager(){
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Please enter the ID of the employee whos manager you would like to update",      
        },
        {
            type: "input",
            name: "mgrId",
            message: "Please enter the ID of the new manager you would like them to have",      
        },
    ])
    db.query(`UPDATE employee SET manager_id=? WHERE id=?`,[answer.mgrId,answer.id],function(err,results){
        err? console.error(err) :console.log('\nManager updated successfully');
    })
}

async function deleteRole(){
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "del",
            message: "Please enter the ID of the role you wish to remove",      
        },
    ])
    db.query(`DELETE FROM role where id=?`,answer.del,function(err,results){
        err? console.error(err) :console.table(results);
    })
}
async function deleteDepartment(){
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "del",
            message: "Please enter the ID of the department you wish to remove",      
        },
    ])
    db.query(`DELETE FROM department where id=?`,answer.del,function(err,results){
        err? console.error(err) :console.table(results);
    })
}
async function deleteEmployee(){
    let answer = await inquirer.prompt([
        {
            type: "input",
            name: "del",
            message: "Please enter the ID of the employee you wish to remove",      
        },
    ])
    db.query(`DELETE FROM employee where id=?`,answer.del,function(err,results){
        err? console.error(err) :console.table(results);
    })
}

mainMenu()