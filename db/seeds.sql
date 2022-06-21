INSERT INTO department (name)
VALUES ("Shipping"),
       ("Human Resources"),
       ("Software Development"),
       ("Quality Analysis"),
       ("Sales");

INSERT INTO role (title,salary,department_id)
VALUES  ("Da Boss",350000,NULL),
        ("Junior Salesman",60000,5),
        ("Senior Salesman",110000,5),
        ("Warehouse Associate",50000,1),
        ("Head of Shipping",120000,1),
        ("Human Resources Professional",90000,2),
        ("Junior Developer",70000,3),
        ("Senior Software Developer",95000,3),
        ("Junior Tester",65000,4),
        ("Intermediate Tester",82000,4),
        ("Test and Analysis Expert",112000,4);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES  ("Kevin","Campiano",1,NULL),
        ("James","Jones",3,1),
        ("Nicole","Gianella",2,2),
        ("Freddy",'Bonovicci',5,1),
        ("Josip","Porcic",4,4),
        ("Kimi",'Watts',6,1),
        ("Margaret","Atellier",8,1),
        ("Bono",'Sanderson',7,7),
        ("Billy",'Batson',7,7),
        ("Ken",'Brown',11,1),
        ("Beth",'Patto',10,10),
        ("John",'Smith',9,10);