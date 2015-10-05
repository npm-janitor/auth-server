# auth-server
> Helps in CLI authenation of github.

__END POINTS:__

`login` -> Hit this URL for the first time login and auth process.

`api` -> Returns an array of objects which has the user module info.

`token` -> Returns the oauth token for a given id.

__Use case:__

* Open the URL with query param `id` from the CLI in our case: `open(https://npm-janitor.herokuapp.com/login?id=42)`

* User logins and gives perms for the registered app and see a message: `DONE! CHECK YOUR CLI`.

* On CLI you could hit `https://npm-janitor.herokuapp.com/token?id=42` to get the oauth token.

* Victory! Save the token in a safe zone and use it.


