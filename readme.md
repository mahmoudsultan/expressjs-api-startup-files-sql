ITW Mobile Application Backend API
------------------------------------

ENDPOINTS
------------

**Users**:
----
    GET /users/ (200)=> returns a list of all users

    GET /users/:alias (200) => returns the information of the specified user

    POST /users/login (200)
        Request Body = {
            alias: ..
            password: ..
        }
    => logs the user in if the information provided is valid or else a 400 will be initiated
    => the authentication key will be provided in the 'Authorization' Header in form 'Bearer Auth-Key'

    POST /users/logout (200)
        Authorization Header = 'Bearer Auth-key'
    => the user will be logged out and a new authentication key will be created making the old one invalid.

    PUT /users/:alias (200)
        Authorization Header = 'Bearer Auth-key'
    => if the auth key matches that of the user being updated the fields permitted will be updated with the information given in the request body
    => fileds permitted: alias, name, email, collage, and department.

**Admin**
-------
    POST /admin/create/user (201)
        Request Body = {
            alias: user alias
            name: user full name
            password: password unencreapted
            email: da
            collage: optional
            department: optional
        }
    => Creates the user and returns the information with the id of the newly created record.

    POST /admin/delete/user (200)
        Request body =  {
        id: user's - that's to be deleted -  id 
        }
    => deletes the user denoted by this alias

    POST /admin/update/key (200)
        Request body = {
            id: user's id
            key: the new key
        }
    => updates the user's ticket key.

    POST /admin/push (200)
        Request body = {
            channel: (optional)
            event: (optional)
            mssg: notifications method
        }
    => sends notifcations to channel with the event and mssg