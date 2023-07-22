# Leave-Application Portal
This responsive web-portal was specifically designed for the research scholars within our institute. Addressing the significant challenges associated with processing
hardcopy applications through various authorities, we have developed a centralized portal for managing leave applications. This user-friendly platform enables scholars to easily apply for leaves, track their leave balances, and receive timely notifications. Simultaneously, the portal simplifies administrative tasks by providing seamless access to critical information, such as remaining leave days per student and leave types applied by each. This comprehensive solution not only empowers scholars but also eases the administrative burden, resulting in a streamlined and efficient leave management system.

## Functionalities provided in Webportal:
1. Student:
a. Can login using his smail ID, and apply for leave.
b. He can view his past leave applications and approval status.
c. After Student applies, email notification would be sent to his corresponding faculty advisor, for approval and also to the assigned TA (if assigned in place) for confirmation.

2. Faculty Advisor:
a. FA can only access the leave applications of students for whom he is the FA.
b. He can view the student application form and either approve or reject the application. Additional comments can be provided by the FA, if he wants. He then submits his response and the form is then sent to the corresponding student’s project mentor.

3. Project Mentor:
a. Similar functionalities as of FA.
b. After the update of approval/rejection status by mentor, the form is finally sent to Admin.

4. Admin:
a. Admin can view all the applications (past and also current pending ones separately).
b. The final approval is of admin. The update of admin_approval status, will be mailed to the student at the end.
c. Admin has access to all applications, and databases. He can modify every table, and also can add or upload holiday lists in the database.

### Consistency:
a. Constraints on Date, number of days leaves are applied, leave types and rules associated with each, error handling, wrong requests, etc. are handled properly through frontend and database.
b. Inconsistent input would not be accepted from the front end itself, as the constraints on data according to the database is implemented correctly.

