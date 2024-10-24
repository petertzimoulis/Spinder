//Document modified by Ilysia 4/28
//Modified 5/1 by Ilysia
//Modified 5/4 by David
//Modified 5/7 by Ilysia
//Modified 5/12 by David
//Modified 5/14 by David

document.addEventListener('DOMContentLoaded', () => {
    const clientId = '910fdf4b6d4b403cb887d1cd13120c4e'; // ilysia(299ffb73a0554f3fb3a64dee2d906075)    david(910fdf4b6d4b403cb887d1cd13120c4e) 

    const redirectUri = 'https://www.cs.drexel.edu/~dac443/spinder/main/search.html'; // Update with your actual Redirect URI [ ilysia(https://www.cs.drexel.edu/~ik395/SpotifyTrials) david(https://www.cs.drexel.edu/~dac443/spinder/main/search.html) ]
    const scope = 'user-read-private user-read-email playlist-read-private user-top-read playlist-modify-public playlist-modify-private';

    const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;

    const infoContainer = document.getElementById('info-container');
    const loginButton = document.getElementById('login') 

    const userSearchContainer = document.getElementById('userSearch-container');
    const generalSearchContainer = document.getElementById('generalSearch-container');

    const testframe = document.getElementById('test')

    searchResults1 = document.getElementById('searchResults1');
    searchResults2 = document.getElementById('searchResults2');
    // Check if the login button should be hidden
    const shouldHideLoginButton = sessionStorage.getItem('hideLoginButton');
    if (!shouldHideLoginButton) {loginButton.classList.remove('hidden');}
    
    // Check if the titles should remain visible
    const shouldShowTitles = sessionStorage.getItem('showTitles');
    if (shouldShowTitles) {
        loginButton.classList.add('hidden');
        sessionStorage.removeItem('showTitles');

        infoContainer.classList.remove('hidden');
    }

    // Event listener for login button click
    loginButton.addEventListener('click', () => {
        console.log('Login button clicked')
        // Redirect the user to Spotify for authentication
        window.location.href = authorizeUrl;
        

        
        // Store a flag to indicate that the titles should remain visible
        sessionStorage.setItem('showTitles', true);
        // Store a flag to indicate that the login button should be hidden
        sessionStorage.setItem('hideLoginButton', true);
        loginButton.classList.add('hidden');
    }); //login click

    // Obtain the access token
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        const tokenUrl = 'https://accounts.spotify.com/api/token';
        const data = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: 'f3ae2221a568425fb6e875f106a4b420' // ilysia(51914281609b413fbc9ca96303a34909) david(f3ae2221a568425fb6e875f106a4b420)
        };

        fetch(tokenUrl, {
            method: 'POST',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('access token good')
            const accessToken = data.access_token;
            
            sessionStorage.setItem('accessToken', accessToken)
            
            showSearchContainer(userSearchContainer, accessToken, 'searchButton', 'searchInputUser', searchUsers)           //show user search 
            showSearchContainer(generalSearchContainer, accessToken, 'trackButton', 'searchInputSpotify', searchSpotify)    // show general search

        })
        .catch(error => {
            console.error('Error getting access token:', error);
        });
    }
    else {
        console.error('Authorization code not found.');
    }
});



// Search users via search bar
function searchUsers(user_id, accessToken) {
    const searchURL = `https://api.spotify.com/v1/users/${user_id}`
    fetch(searchURL, {
        method: 'GET',
        headers: {'Authorization': `Bearer ${accessToken}`}
    })
    .then(response => response.json())
    .then(data => {

        var userResult = document.getElementById('userResults');
        if (data.display_name) { // Check if data.display_name and its items exist
            //const items = []
            
            const userImage = document.createElement('img'); // the users profile picture
            userImage.width = 125;
            userImage.height = 125;
            userImage.src = data.images[1].url;

            const link = document.createElement('a');
            link.textContent = data.display_name; //Test with Ilysia userid: eyjr7czi4xfrylpl8b8fue3hm    David: davidacala
            link.href = data.external_urls.spotify;
            link.style = 'color:white; font-size: 40px;'

            const followButton = document.createElement('button'); // Create the follow button
            followButton.textContent = 'Follow'; // Set the text content of the follow button
            followButton.dataset.userId = user_id; // Set the data attribute to store user id
            followButton.classList.add('followButton')
            followButton.addEventListener('click', followUser); // Add event listener to the follow button

            userResult.appendChild(userImage);
            userResult.appendChild(link);
            userResult.appendChild(followButton); // Append the follow button to the list item
            //userResult.appendChild(listItem);   


            
        } 
        else {resultList.innerHTML = '<li>No users found</li>';}
    })
    .catch(error => {
        console.error('Error searching Spotify:', error);
    });
}

// general spotify search
function searchSpotify(query, accessToken) {
    const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=track%2Calbum%2Cartist%2Cplaylist`;
    fetch(searchUrl, {
        method: 'GET',
        headers: {'Authorization': `Bearer ${accessToken}`}
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('results-container').classList.remove('hidden');
        displayResults(data);
    })
    .catch(error => {
        console.error('Error searching Spotify:', error);
    });
}


function followUser(event) {
    const userId = event.target.dataset.userId; // Get the user id from the dataset
    const accessToken = sessionStorage.getItem('accessToken');
    const followURL = `https://api.spotify.com/v1/me/following?type=user&ids=${userId}`;

    fetch(followURL, {
        method: 'PUT',
        headers: {'Authorization': `Bearer ${accessToken}`}
    })
    .then(response => {
        if (response.ok) {alert('User followed successfully!');} 
        else {alert('Failed to follow user.');}
    })
    .catch(error => {
        console.error('Error following user:', error);
    });
}

function displayResults(response) {
    var results = [];
    var trackMap = new Map();
    var artistMap = new Map();
    var albumMap = new Map();
    var playlistMap = new Map();

    // Concatenate items from response if they exist
    if (response.tracks) {
        results = results.concat(response.tracks.items);
        
        //set dictionary for track items
        response.tracks.items.forEach(item=>{
        trackMap.set(item.name, {
            artist: [item.artists[0].name, item.artists[0].external_urls.spotify], 
            album: [item.album.name, item.album.images[1].url], 
            link: item.external_urls.spotify,
            uri: item.uri})
        })
    }
    
    if (response.artists) {
        results = results.concat(response.artists.items);
        
        //set dictionary for artist items
        response.artists.items.forEach(item=>{
            artistMap.set(item.name, { 
                img: item.images[1], 
                link: item.external_urls.spotify,
                uri: item.uri})
            })
    }
    
    if (response.albums) {
        results = results.concat(response.albums.items);
        
        //set dictionary for album items
        response.albums.items.forEach(item=>{
            albumMap.set(item.name, {
                artist: [item.artists[0].name, item.artists[0].external_urls.spotify], 
                cover: item.images[1].url, 
                link: item.external_urls.spotify,
                uri: item.uri})
            })
    }
    
    if (response.playlists) {
        results = results.concat(response.playlists.items);

        //set dictionary for playlist items
        response.playlists.items.forEach(item=>{
            playlistMap.set(item.name, {
                img: item.images[1], 
                link: item.external_urls.spotify, 
                uri: item.uri})
            })
    }
 
    
    var trackResults = document.getElementById('trackResults');
    var artistResults = document.getElementById('artistResults');
    var albumResults = document.getElementById('albumResults');
    var playlistResults = document.getElementById('playlistResults');

    trackResults.innerHTML = '<h3>Songs</h3>'
    artistResults.innerHTML = '<h3>Artists</h3>'
    albumResults.innerHTML = '<h3>Albums</h3>'
    playlistResults.innerHTML = '<h3>Playlists</h3>'


    if (results.length === 0) {searchResults1.innerHTML = '<h2>No results found<h2>';} 
    else {
        results.forEach(function(result) {
            //var list = document.createElement('li'); // Changed from 'a' to 'li'
            var link = document.createElement('a'); // Create anchor element

            link.textContent = result.name;
            
            link.target = "_blank";                 // Open links in a new tab
        
            if (result.type === 'track') {          // Track URL
                link.textContent = `${result.artists[0].name} - ${result.name}`;
                //addToDisplay(searchResults1, trackResults, link, result);
                createEmbed(trackResults,'track', result.id)}
            
            else if (result.type === 'artist') {    // Artist URL
                addToDisplay(searchResults1, artistResults, link, result);}
            
            else if (result.type === 'album') {     // Album URL
                link.textContent = `${result.artists[0].name} - ${result.name}`;
                addToDisplay(searchResults2, albumResults, link, result);}
             
            else if (result.type === 'playlist') {  // Playlist URL
                addToDisplay(searchResults2, playlistResults, link, result);}
        });
    }
}

//Created by David 5/14
function addToDisplay(container, resultContainer, link, result){
    link.href = result.external_urls.spotify;
    resultContainer.appendChild(link);
    resultContainer.appendChild(document.createElement('br'));
    container.appendChild(resultContainer);
}

//Created by David 5/14
function showSearchContainer(container, accessToken, button, input, searchFunc) {
    container.classList.remove('hidden');
    container.style.display = 'block'; // Show the search container

    const trackButton = document.getElementById(button);
    trackButton.addEventListener('click', () => {
        // Retrieve the search query
        const query = document.getElementById(input).value.trim();
        
        // query not empty
        if (query !== '') {
            // Perform search when the search button is clicked
            accessToken = sessionStorage.getItem('accessToken')
            searchFunc(query, accessToken);
        } 
        
        // empty query
        else {alert('Please enter a search query.');}
    });
}

function createEmbed(container, type, typeId) {
    src = `https://open.spotify.com/embed/${type}/${typeId}?`
    iframe = document.createElement('iframe')
    iframe.id = `${type}Embed`
    iframe.setAttribute('loading','lazy')
    iframe.setAttribute('frameborder','0')
    iframe.setAttribute('allow','encrypted-media;')
    iframe.setAttribute('src', src)
    container.appendChild(iframe)
}
