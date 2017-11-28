# Jammming Spotify Playlist Application
This application is build with React as a project for Codecademy Intensive Front-End developer course.

The application allows a user to connect the app to his or her Spotify account, search for tracks by providing either
an artist name, album title, or song title. Individual tracks can be added and removed from the search results to the playlist using the corresponding + and - buttons. Additionally, the playlist title can be changed and the playlist will be saved to the user's account on successful save.

A live demo of this app is currently deployed on [Surge](https://surge.sh/) and can be located [here](http://jammming-ca.surge.sh).

## Instructions
1. Download or clone repo.
2. Navigate to the project folder in terminal.
3. Run 'npm install'
4. Create a config.js file in src/utils containing the following object with values set to your Spotify API credentials and redirect url: 

```
   const CONFIG = {
    clientId: <Client ID>,
    redirectURI: <Application URI>
   }

   export default CONFIG;
```
5. Run 'npm run build' in the terminal to create the application's production build.
6. Deploy the production build to your hosting service of choice.

### Functionality

* This application makes use of [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) to provide drag-and-drop sorting in the user created playlist.

* User can clear active tokens by using the logout option located in the header dropdown menu. This will clear any active token and require the user to request a new token to continue. Currently, Spotify provides no endpoint to 
revoke permissions; however, with the `show_dialog` parameter in the request URI set to true, the user can choose to log in under a different account.