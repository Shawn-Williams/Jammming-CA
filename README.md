# Jammming Spotify Playlist Application
This application is build with React as a project for Codecademy Intensive Front-End developer course.

The application allows a user to connect the app to his or her Spotify account, search for tracks by providing either
an artist name, album title, or song title. Individual tracks can be added and removed from the search results to the playlist using the corresponding + and - buttons. Additionally, the playlist title can be changed and the playlist will be saved to the user's account on successful save.

## Instructions
1. Download or clone repo.
2. Navigate to the project folder in terminal.
3. Run 'npm install'
4. Create a config.js file in src/utils containing the following object with values set to your Spotify API credentials and redirect url: 

```const CONFIG = {
    clientId: <Client ID>,
    redirectURI: <Application URI>
   }

   export default CONFIG;
```
}

export default CONFIG;
}
5. Run 'npm run build' in the terminal to create the application's production build.
6. Deploy the production build to your hosting service of choice.