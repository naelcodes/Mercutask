>  API 

| Routes                    | HTTP VERB | Description                       | Methods         | Authorization |
| ------------------------- | --------- | --------------------------------- | --------------- | ------------- |
| /auth/login               | POST      | log a user                        | loginUser       | No            |
| /auth/refresh/token       | POST      | refresh the authentication token  | getRefreshToken |               |
| /auth/forgotten_password/ | POST      | forgot password logic             | forgetPassword  | yes           |
| /auth/reset_password      | POST      | reset password logic              | resetPassword   | yes           |
| /users/id                 | GET       | Load user details                 | getUser         | yes           |
| /users                    | POST      | create a new user                 | createUser      |               |
| /users/id                 | PUT       | update a user info                | updateUser      | yes           |
| /users/id                 | DELETE    | delete a user account(deactivate) | deleteUser      | yes           |
| /users/id/tasks           | GET       | Get all the tasks of a user       | getUserTasks    | yes           |
| /tasks/id                 | GET       | Get a single task info            | getTask         | yes           |
| /tasks                    | POST      | create a tasks                    | createTask      | yes           |
| /tasks/id                 | PUT       | update tasks details              | updateTask      | yes           |
| /tasks/id                 | DELETE    | delete  a tasks                   | deleteTask      | yes           |

1.  Token based - authentication

   - password encryption & decryption
   - token generation and checking 

2. ~~OAuth flow for google oauth~~

   - ~~Oauth flow for login~~

3. Authorization middleware - token authorization & refresh logic

   - Token refresh logic

4. Validation Middleware - with validation logic for database(handled by the database) & validation errors 

5. logging middleware - with  app error logs, app operation logs, request response logs – in files

6. Error handling middleware, Error -response code & custom messages

7. Request Header checker middleware, to invalidate request with content-type absent (POST,PUT & DELETE)

8. SMTP server to send emails in case of password reset/forgotten password

9. Write the User, Auth and Tasks logic (routes, services, models & controllers)

10. write unit test 

11. Write API test scripts

12. Database ERD & Collection Relation Diagram

13. API Documentation with Postman and Codegen

14. Data access object logic ((Users and tasks)

15. Base Abstract Model 

16. create a CI/CD pipeline with circle CI

17. complete Mercuro framework [create a routing & middleware system similar to express/koa]

    - customize the req and res
    - req and error pipelining
    - moving across the route layers using next()
    - Dynamic routing
    - Find the best data structure to model routing.

    

    







- 





















