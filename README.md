# Leave-Application Portal
This responsive web-portal was specifically designed for the research scholars within our institute. Addressing the significant challenges associated with processing
hardcopy applications through various authorities, we have developed a centralized portal for managing leave applications. This user-friendly platform enables scholars to easily apply for leaves, track their leave balances, and receive timely notifications. Simultaneously, the portal simplifies administrative tasks by providing seamless access to critical information, such as remaining leave days per student and leave types applied by each. This comprehensive solution not only empowers scholars but also eases the administrative burden, resulting in a streamlined and efficient leave management system.

## Functionalities provided in Webportal:
1. Student:<br>
a. Can login using his smail ID, and apply for leave. <br>
b. He can view his past leave applications and approval status.<br>
c. After Student applies, email notification would be sent to his corresponding faculty advisor, for approval and also to the assigned TA (if assigned in place) for confirmation.

2. Faculty Advisor:<br>
a. FA can only access the leave applications of students for whom he is the FA.<br>
b. He can view the student application form and either approve or reject the application. Additional comments can be provided by the FA, if he wants. He then submits his response and the form is then sent to the corresponding student’s project mentor.<br>

3. Project Mentor:<br>
a. Similar functionalities as of FA.<br>
b. After the update of approval/rejection status by mentor, the form is finally sent to Admin.<br>

4. Admin:<br>
a. Admin can view all the applications (past and also current pending ones separately).<br>
b. The final approval is of admin. The update of admin_approval status, will be mailed to the student at the end.<br>
c. Admin has access to all applications, and databases. He can modify every table, and also can add or upload holiday lists in the database.

### Consistency:<br>
a. Constraints on Date, number of days leaves are applied, leave types and rules associated with each, error handling, wrong requests, etc. are handled properly through frontend and database.<br>
b. Inconsistent input would not be accepted from the front end itself, as the constraints on data according to the database is implemented correctly.

## Steps to start server
1. create a .env file containing the following information.

        GOOGLE_CLIENT_ID=
        GOOGLE_CLIENT_SECRET=
        REDIRECT_URL=
        USER_EMAIL=
        PASSWORD=
        ADMIN_EMAIL=
        SESSION_SECRETE=

2. Install PostgreSQL 12.x (https://www.postgresql.org/)
3. Inside ./data/database.js, set the host, password, database, and port according to your runtime environment.
4. Please make sure that database have relational model as given in ./sql_qeuries/erd.png. leave_application.tar can be use to restore database.
5. Install Node.js based on your operating system. Visit the website (https://nodejs.org) and download the LTS version 19.9.x of Node.js along with version 9.6.x of npm.
6. Install all required dependencies

        npm install

7. start server using following in dev mode
    
        npm start
        
8. To close server

        ./close.sh
