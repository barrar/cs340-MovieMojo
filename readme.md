## Features of this project 
* Instant WebSocket search for movies or actors
* Deter spam bots with reCAPTCHA
* Add movie and actor data
* Link movies to actors (Powered by WebSocket instant search)
* Create a user account and log in
* Browse to a movie page from the actor details page
* Browse to an actor page from the movie details page
* Add your rating to a movie and update your ratings
* View all user ratings on movie details page
* Add a movie to watched list or watch later list
* Delete ratings
* Delete movies from watched list or watch later list
* Update account password
* Add or delete a favorite actor from your account
## Supporting technologies
* Ubuntu 19.10 VM on Azure as OS
* MySQL 8.0.19 as database for all data and session storage
* Node 12.15.0 LTS as main app engine
* pm2 4.2.3 as node process manager
* Nginx as proxy
    - http2 for performance
    - Let's Encrypt for TLS encryption
    - Serves static content directly from file system
## Node packages
* express 4.17.1
* express-mysql-session 2.1.3
* express-recaptcha 5.0.1
* express-session 1.17.0
* moment 2.24.0
* mysql 2.18.1
* pug 2.0.4
* require-dir 1.2.0
* socket.io 2.3.0
* browser-sync 2.26.7
* connect-browser-sync 2.1.0
