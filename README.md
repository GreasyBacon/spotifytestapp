# Merge Yo' Playlists

This project is an attempt to create a small web application to allow users to merge their Spotify playlists and share with their friends or the world! 

It is also a chance for me to come to terms on using the "Authorization Code flow" present in the Spotify API. 

## Why the name 'Merge Yo' Playlists'?

Because it's incredibly ironic, as I'm pretty damn white. Plus, I love [this joke](https://www.youtube.com/watch?v=OP3xf6BFEIo) in Parks and Rec to death. 

## Installation

Close into a repo on your computer and run:

    $ npm install

Create a 'config' folder in the main directory and rename the example keys file to 'keys.js' and change to include your respective access keys for the spotify API. 

## Running the app

By default, I have it set up to run with https. Please comment out the following lines in app.js if you just want to run it locally without 's':

    $ var private_key = fs.readFileSync(keys['private_key_path'], 'utf8');
    $ var certificate = fs.readFileSync(keys['certificate_path'], 'utf8');
    $ var credentials = {key: private_key, cert: certificate};
    $ var httpsServer = https.createServer(credentials, app);
    $ httpsServer.listen(443);

Run via the app.js file contained within the main directory. 

    $ node app.js

Then, open `http://localhost` in a browser (it runs on port 80 by default).

### Using your own credentials
In order to use the application you will need to generate a client ID and secret key.

Go to [My Applications on Spotify Developer](https://developer.spotify.com/my-applications) and create your application. For this app, I followed Spotify's instructions and registered these Redirect URIs:

* http://localhost (needed for the implicit grant flow)
* http://localhost/callback

Once you have created your app, replace the `client_id`, `redirect_uri` and `client_secret` within the 'keys' config file.
