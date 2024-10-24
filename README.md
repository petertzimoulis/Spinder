# Spinder

## Description
Spinder is a website where you can easily view your top Spotify data and find new music. Our website displays top songs, artists, recommended tracks based on user music listening data and swiping patterns, and much more. 

## Setting Up
Prerequisite: Have a registered Spotify account
1) Register an account with https://developer.spotify.com/
2) On the web developers page, go to 'My Dashboard' in the upper left hand corner under your profile name
3) Click Create App and title it accordingly.
4) Within your app, click on settings
    - To onboard other users onto your project such as other developers on the team, click user management and input the emails of your fellow developers.
    - Under basic information, add the redirect uris to your desired website and click save
    - Be sure to remember the location of your clientID and secretID on the basic information page as well 

You're all set to start developing the project. To understand the authorization access to Spotify Api, click the documentation link on the top of your screen. Click Web API, tutorial, and then authorization code. Once you understand these protocols, you can start calling API endpoints. 

## Testing
1) To test whether or not the web API endpoint was called your redirectURI, the team suggests using logging in the console. If any access to the endpoints is unattainable follow the below steps to determine if your authorization access is incorrect.
    - Check your redirectURI in your Spotify app. This must match the redirect link in your code completely otherwise you will not have access to the API
    - Check your inputted clientID and secretID. These must be identical to pass the authorization requirements
    - Check your spotify endpoint and confirm that you are calling it with the access token in order to display data. 

2) For errors regarding coding failures, it is recommended to add log errors throughout your code for troubleshooting.

3) For any additional issues or questions, contact another member of the development team for help. 


## Deploying codebase
1) The team is hosting all code files via Drexel University's Tux server. The team's project can be accessed via the link https://www.cs.drexel.edu/~dac443/spinder/main/

2) Please note you can host a local version of the project during testing stages to determine whether or the code is functional to push towards the main project

3) Utilize scp protocols within your terminal to push files to Drexel's tux server. 



## Changing codebase
1) Please  note that the team is using Gitlab to host different versions of the project. This allows the team to use branching and merging and therefore versional control. 

2) To make changes to the codebase, pull from Gitlab and make changes to your local copy of the project. 

3) After making your changes and testing them locally, you can push these changes to both Drexel's Tux server as well as your designated branch within Gitlab. 

4) It is good practice to frequently pull from the main code and push your changes in the event of errors or accidents that may occur will coding. 


## Support
If there are any issues, feel free to email one of the developers:

Peter Tzimoulis - ppt24@drexel.edu

Ilysia Krzywonos - ik395@drexel.edu

David Calamaro - dac443@drexel.edu

Richard Lee - rjl343@drexel.edu

## Authors and acknowledgment
This project was created by Peter Tzimoulis, Ilysia Krzywonos, David Calamaro, and Richard Lee with Spotify data access via the [Spotify API](https://developer.spotify.com/)


