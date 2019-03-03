# req -> json() -> route -> res
more middleware@ expressjs.com/en/resourses/middleware

helmet - set various headers for secure

#should never store secrets in conf files
use env vars
$export prefix_password=1234 (prefix - app name, etc.)


#DEBUG (replace console.log in other places)
to handle set DEBUG env vars
$export DEBUG=app:needed_workspace
$export DEBUG=app:startup,app:db - [can be multiple]
$export DEBUG=* debug all namespaces
$export DEBUG=   - set to nothing - reset

-shorter way
 `DEBUG=app:db nodemon server.js`

