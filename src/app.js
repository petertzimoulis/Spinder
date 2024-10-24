//Modified 5/4 by David
//Modified 5/19 by David

let recommendedTracks = [];
let currentIndex = 0;
let playlistExist = false
let curTrack
let curUri
let curId
let embed
let embedStart
let songData
let recTrackSeed
let accessToken = sessionStorage.getItem('accessToken');
let playlistId = sessionStorage.getItem('playlistId');


document.addEventListener('DOMContentLoaded', () => {
window.onSpotifyIframeApiReady = (IFrameAPI) => { 
    const clientId = '0d53638e2caf4c27baac778a2b25b7e1'; // ilysia-299ffb73a0554f3fb3a64dee2d906075    david-72e25dcdd5724439a0449f87d16e0be9 - main:0d53638e2caf4c27baac778a2b25b7e1 
    const redirectUri = 'https://www.cs.drexel.edu/~dac443/spinder/main/'; // Update with your actual Redirect URI (ilysia-https://www.cs.drexel.edu/~ik395/SpotifyTrials)
    const scope = 'user-read-private user-read-email playlist-read-private user-top-read playlist-modify-public playlist-modify-private';

    const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;

    const loginButton = document.getElementById('login')
    
    const headText = document.getElementById('head-text')

    const infoContainer = document.getElementById('info-container')

    const topTracksContainer = document.getElementById('top-tracks')
    const topArtistsContainer = document.getElementById('top-artists')

    const playContainer = document.getElementById('playlist-box')
    const addToPlaylistButton = document.getElementById('playlist-button')
    const prevRec = document.getElementById('prevButton')
    const nextRec = document.getElementById('nextButton')

    const nameInput = document.getElementById('playlistName')

    const pieChart = document.getElementById('chart')

    const filterDanceability = document.getElementById('filter-danceability');
    const filterEnergy = document.getElementById('filter-energy');
    const filterSpeechiness = document.getElementById('filter-speechiness');
    const filterAcousticness = document.getElementById('filter-acousticness');
    const filterLiveness = document.getElementById('filter-liveness');
    const filterValence = document.getElementById('filter-valence');

    filterDanceability.addEventListener('click', () => {
        getRecommendations(topTracksIds, accessToken, { danceability: 0.8 }); 
    });

    filterEnergy.addEventListener('click', () => {
        getRecommendations(topTracksIds, accessToken, { energy: 0.8 }); 
    });

    filterSpeechiness.addEventListener('click', () => {
        getRecommendations(topTracksIds, accessToken, { speechiness: 0.8 }); 
    });

    filterAcousticness.addEventListener('click', () => {
        getRecommendations(topTracksIds, accessToken, { acousticness: 0.8 }); 
    });

    filterLiveness.addEventListener('click', () => {
        getRecommendations(topTracksIds, accessToken, { liveness: 0.8 }); 
    });

    filterValence.addEventListener('click', () => {
        getRecommendations(topTracksIds, accessToken, { valence: 0.8 }); 
    });

    // Check if the login button should be hidden
    const shouldHideLoginButton = sessionStorage.getItem('hideLoginButton');
    if (!shouldHideLoginButton) {loginButton.classList.remove('hidden');}
   
    // Check if the titles should remain visible
    const shouldShowTitles = sessionStorage.getItem('showTitles');
    if (shouldShowTitles) {
        loginButton.classList.add('hidden');
        
        headText.classList.remove('hidden');
        
        infoContainer.classList.remove('hidden');

        // Clear the flag to prevent titles from showing again on subsequent page loads
        sessionStorage.removeItem('showTitles');
    } //show titles

    loginButton.addEventListener('click', () => {
        // Redirect the user to Spotify for authentication
        window.location.href = authorizeUrl;

        // Store a flag to indicate that the titles should remain visible
        sessionStorage.setItem('showTitles', true);
        
        // Store a flag to indicate that the login button should be hidden
        sessionStorage.setItem('hideLoginButton', true);
        loginButton.classList.add('hidden');
    }); //login click

    // Extract the authorization code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        // Use the authorization code to get the access token
        const tokenUrl = 'https://accounts.spotify.com/api/token';
        const data = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: '809a20dffe06480b82e9d2d7c0c1ade4', //ilysia - 51914281609b413fbc9ca96303a34909   david - 9a2f35e9c7754ab99ccd51afe55379b7--- main:809a20dffe06480b82e9d2d7c0c1ade4
        };

        fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data),
        })
        .then(response => response.json())
        .then(data => {
            const accessToken = data.access_token;

            // Fetch user's top tracks of the last 30 days and display them
            getItem('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', topTracksContainer, 'name', accessToken);

            getItem('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5', topArtistsContainer, 'name', accessToken);

            getTopTracks(accessToken)
                .then(topTracksIds => {
                    getRecommendations(topTracksIds, accessToken)
                        .then(tracks => {
                            recommendedTracks = tracks;
                            currentIndex = 0;

                            playContainer.appendChild(addToPlaylistButton)                            

                             // checks if the playlist exists---------------------------------------------
                            let playlists = [];
                            fetch('https://api.spotify.com/v1/me/playlists', {
                                headers: {'Authorization': `Bearer ${accessToken}`}
                            })
                            .then(response => response.json())
                            .then(data => {
                                const receivedItems = data.items;
                                receivedItems.forEach(item => {playlists.push(item['id'])});
                                    for (id in playlists) {
                                        if (playlists[id] == sessionStorage.getItem('playlistId')) {playlistExist = true}
                                    }
                            })
                              // check if playlist exist-------------------------------------------------
                             
                              // hides extra playlist stuff if it exists and reformats
                                .then(()=>{
                                    if (playlistExist) {
                                        addToPlaylistButton.innerHTML = 'Add to playlist'
                                        pieChart.style.height = '200px'
                                        pieChart.style.width = '200px'
                                    }
                                    else{nameInput.classList.remove('hidden')}

                                addToPlaylistButton.addEventListener('click', () => {
                                const accessToken = sessionStorage.getItem('accessToken');
                               
                                if (!accessToken){
                                    console.error('Access token not found');
                                    return;} 
                                    
                                    let song = String(recommendedTracks[currentIndex].uri)
                                    recTrackSeed = recommendedTracks[currentIndex].id

                                    if (!playlistExist) {
                                        const playlistName = document.getElementById('playlistName').value.trim();
                                        createPlaylist(playlistName)
                                            .then(newPlaylistId => {
                                                playlistId = newPlaylistId;
                                                sessionStorage.setItem('playlistId', playlistId)
                                                playlistExist = true;
                                                addTracks(playlistId, song)  
                                                .then(() => {console.log('Recommended tracks added')})
                                            })
                                            .catch(error => {console.error('Error creating playlist:', error)});
                                    } // playlist doesnt exists
                                    
                                    else {
                                        addTracks(playlistId, song)
                                        .then(() => {console.log('Recommended tracks added')})
                                    } // playlist exist
                                 // code to add the song to playlist
                                
                                // reformat stuff
                                nameInput.classList.add('hidden')
                                addToPlaylistButton.innerHTML = 'Add to playlist'
                            })}); // add song to playlist when button clicked
                            
                        
                            curTrack = recommendedTracks[currentIndex]
                            curUri = curTrack.uri
                            curId = curTrack.id
                            

                            const element = document.getElementById('embed-player');
                            const options = {width: '100%', height: '85', uri: curUri};
                            
                            const callback = (EmbedController) => {
                                embed = EmbedController
                                prevRec.addEventListener('click', () => {
                                    prevTrack()
                                    //EmbedController.loadUri(curUri, false, startAt=embedStart)
                                    });
                              
                                nextRec.addEventListener('click', () => {
                                    nextTrack()
                                    /* currentIndex++;
                                    
                                    if (currentIndex < recommendedTracks.length) {
                                        curUri = (recommendedTracks[currentIndex]).uri
                                        curId = recommendedTracks[currentIndex].id
                                        EmbedController.loadUri(curUri, false, embedStart)
                                        
                                    }
                                    else {
                                        getRecommendations(recTrackSeed)
                                        .then(tracks=>{
                                            console.log(`adding tracks ${tracks}`);
                                            recommendedTracks.push(...tracks);
                                            curUri = (recommendedTracks[currentIndex]).uri
                                            curId = recommendedTracks[currentIndex].id
                                            EmbedController.loadUri(curUri,false,embedStart)
                                        })   
                                    }*/
                                    });

                                EmbedController.addListener('ready', () => {
                                    EmbedController.play()

                                    //David at 4pm 4/28/2024
                                    getSongData(curId,accessToken)
                                    .then(data => {
                                        chartData.length = 0;
                                        chartData.push(data["danceability"], data["energy"], data["speechiness"], data["acousticness"], data["instrumentalness"], data["liveness"], data["valence"])
                                        
                                        for (i in chartData){
                                            chartData[i] = Math.round(chartData[i]*100);
                                        }
                                        chart.update();
                                    })
                                    });    
                            }; // functions for embed  
                            
                            //  creates embed
                            IFrameAPI.createController(element, options, callback);

                        }) // use the recommended tracks for data
                        
                        .catch(error => {console.error('Error fetching recommendations', error)});
                }) // use the top tracks for data
                .catch(error => {console.error('Error fetching top tracks', error)});
        }); // actions after getting data
    } // got code from url
};  // spotify iframe api ready
}); // page loaded

// function put items on page
function getItem(url, container = null, value, accessToken) {
    const apiUrl = url;
    fetch(apiUrl, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        const receivedItems = data.items;
   
        receivedItems.forEach(item => {
            if (container != null) {
                // Display
                const link = document.createElement('a');
                link.textContent = item[value];
                link.href = item.external_urls.spotify;
                link.target = '_blank';
                link.style.textDecoration = 'none';
                link.style.color = 'inherit';
                link.id = 'data';
                container.appendChild(link);
                container.appendChild(document.createElement('br'));
            }
        });
    });
} 

function setTrack() {
    curTrack = recommendedTracks[currentIndex];
    curUri = curTrack.uri
    curId = curTrack.id
    embedStart = (curTrack.duration_ms / 1000)/2
    embed.loadUri(curUri,false,embedStart)

}

// Function to handle previous button click
function prevTrack() {
    if (currentIndex > 0) {
        currentIndex--;
        setTrack()
    }
}

// Function to handle next button click
function nextTrack() {
    currentIndex++;
                               
    if (currentIndex < recommendedTracks.length) {setTrack()}
    
    else {
        getRecommendations(recTrackSeed)
        .then(tracks=>{
            console.log(`adding tracks ${tracks}`);
            recommendedTracks.push(...tracks);
            setTrack()
        })   
    }
}

// function to get an audio feature from a song (dancability, acousticness, etc.)
// created by David - 4-26-24 11:15pm
async function getSongData(uri, accessToken) {
    return fetch(`https://api.spotify.com/v1/audio-features/${uri}`, {
        headers: {'Authorization': `Bearer ${accessToken}`,},
    })
    .then(response => {
        if (!response.ok) {throw new Error('Failed to get audio features');}
        return response.json();
    })
}

// Get top tracks from Spotify
async function getTopTracks(accessToken) {
    return fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5', {
        headers: {'Authorization': `Bearer ${accessToken}`,},
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch top tracks');
        }
        return response.json();
    })
    .then(data => {
        return data.items.map(item => item.id);
    })
    .catch(error => {
        console.error('Error fetching top tracks:', error);
        throw error;
    });
} 

//Function that gets recommendations 
async function getRecommendations(topTracksIds, accessToken, filter = null) {
    let endpoint = `https://api.spotify.com/v1/recommendations?limit=25&seed_tracks=${topTracksIds.join(',')}`;
    
    if (filter != null) {
    // Append filter parameters to the API endpoint
        for (const [key, value] of Object.entries(filter)) {
           endpoint += `&${key}=${value}`;
        }
    }
    
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        return data.tracks;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

//Function to create a recommended playlist for the user
async function createPlaylist(accessToken, playlistName) {
    try{
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            method: 'POST',
            headers : {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistName, //get playlist name from user
                description: 'Playlist of recommended songs generated by Spinder'
                //collaborative: collaborative //Takes boolean parameter to determine if playlist is open for collaborators
            })
        });

        if (!response.ok) {throw new Error('Failed to create playlist');}

        const data = await response.json();
        return data.id;
        
    } catch (error) {
        console.error('Error creating playlist:', error);
        throw error;
    }
}

//Function to add tracks to the playlist 
async function addTracks(accessToken, playlistId, trackUris) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
                //'Content-Type': 'application/json'
            },
           
            body: JSON.stringify({
                uris: [trackUris]})
        });
        if (!response.ok) {
            throw new Error('Failed to add tracks to playlist');
        }
    } catch (error) {
        console.error('Error adding tracks to playlist: ADDTRACK', error);
        throw error;
    }
}

function displayOutput(message, containerId){
    const container = document.getElementById(containerId);
    console.log('Container ID:', containerId);
    console.log('Container Element:', container);
    message.forEach(message => {
        const div = document.createElement('div');
        div.textContent = message;
        container.appendChild(div);
    });
}

