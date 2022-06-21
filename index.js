const mysql = require('mysql2');
const inquirer = require('inquirer');
let isrunning=true;
//const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'oI0_E_BVqG3',
      database: 'employeesJM'
    },
    console.log(`Connected to the Employee database.`)
);

function keepGoing(){
    return inquirer.prompt([
        {
            type: "list",
            name: "mainMenu",
            message: "Return to Main Menu?",
            choices: ['Yes','No'],       
        },
    ])
}

function mainMenu(){
    inquirer.prompt([
        {
            type: "list",
            name: "menuOption",
            message: "Please choose a Menu Option",
            choices: ['View All Departments','View All Roles','View All Employees','View Employees by Manager','View Employees by Department','View Total Employee Budget by Dept.',
            'Add a Department','Add a Role','Add an Employee',
            'Update Employee Role','Update Employee Managers',
            'Delete Employee','Delete Department','Delete Role','Exit Application'],       
        },
    ])
    .then(val => {
        switch (val.menuOption){
            case 'View All Departments':
                viewDepartment();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Employees':
                viewEmployees();
                break;
            case 'View Employees by Manager':
                employeesByManager();
                break;
            default:
                isrunning=false;
        }
        if (isrunning){
            return keepGoing()
            .then((answer)=>{
                if (answer.mainMenu==='No'){
                    db.end();
                }
                else{
                    mainMenu()
                }
            })
        }
        else{
            db.end()
        }
    });
}

function viewDepartment(){
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

function employeesByManager(){
    inquirer.prompt([
        {
            type: "input",
            name: "mgr",
            message: "Please enter the ID of your preferred manager",      
        },
    ])
    .then((answer)=>{
        db.query(`SELECT * FROM employee where manager_id =?`,answer.mgr,function(err,results){
            err? console.error('Your manager ID is incorrect!') :console.table(results);
        })
    })
}

mainMenu()