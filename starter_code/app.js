const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials")

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = 'ec3b3b68b0c34a769822ade285c09d5a',
    clientSecret = '62e6a369042c42f3b769ef82aa4458e7';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log("Token accepted")
    })
    .catch(error => {
        console.log('Something went wrong when retrieving an access token', error);
    })


// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index');
    console.log("Index rendered")
});

app.get('/artists', (req, res, next) => { // nur "/artists"
    console.log("Check for Artist");
    //linksArray from beer example = searchedArtists ?
    spotifyApi
        .searchArtists(req.query.artist) // localhost:3000/artists?artist=123
        .then(data => {
            console.log("The received data from the API: ", data.body.artists);
            res.render('artists', { searchedArtists: data.body.artists.items });
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});

app.get('/albums/:artistId', (req, res, next) => {
    console.log("Accessed Albums")
    // .getArtistAlbums() code goes here
    spotifyApi
        .getArtistAlbums(req.params.artistId, { limit: 10, offset: 0 }) // localhost:3000/albums/123
        .then(data => {
            console.log('Album information', data.body);
            res.render('albums', {pickedAlbum: data.body.items})
            },
            function (err) {
                console.error(err);
            }
        );
});

app.get('/songs/:albumId', (req, res,) =>    {
    console.log("Accessed Songlist")

    spotifyApi
    .getAlbumTracks(req.params.albumId, { limit : 25, offset : 0 })
    .then(data => {
        console.log(data.body);
        res.render('songs', {allSongs: data.body.items})
    }, function(err) {
        console.log('Something went wrong!', err);
    });
})


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
