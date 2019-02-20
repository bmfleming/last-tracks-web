var lastTracks = {

    live: false,

    /**
     * Configuration settings for API key and last.fm user names,
     * These are passed in as query parameters, e.g.:
     *      ?apiKey=1234abc&userNames=myUserName,VanHalen1978
     */
    config: {
        "apiKey": "",
        "userNames": []
    },

    /**
     * Runs on page load and does the magic
     */
    initialize: function() {
        this.getConfiguration();
        this.getScrobbles();
    },

    /**
     * Get configurations from the query parameters for the API key and accounts to fetch
     */
    getConfiguration: function() {
        let urlParams = new URLSearchParams(window.location.search);
        this.config.apiKey = urlParams.get('apiKey');
        this.config.userNames = urlParams.get("userNames").split(",");
    },

    /**
     * Fetches the scrobbles for all of the users
     * the users in question are defined in the config object
     * @return scrobbleData for all users
     */
    getScrobbles: function() {
        for (var i=0; i < this.config.userNames.length; i++) {
            var userName = this.config.userNames[i];
            setTimeout(this.getScrobblesForUser(userName), 1000);
        }
    },

    /**
     * Actually goes and fetches the scrobble data for the given user
     * @param userName
     * @return scrobble data
     */
    getScrobblesForUser: function(userName) {
//        var scrobbleData = {}

        var apiKey = this.config.apiKey;
        var limit = 10;

        var url = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks" +
                    "&user=" + userName +
                    "&api_key=" + apiKey +
                    "&limit=" + limit +
                    "&format=json";

        if (this.live) {
            window.setTimeout(this.pollForScrobbles(url, userName), 5000);
        }
        else {
            // just for testing
            console.log("\tnot live, just testing");
            scrobbleData = JSON.parse('{"recenttracks":{"track":[{"artist":{"#text":"Tony Bennett","mbid":"8be0594f-8c13-46bb-ab06-f93ffba5c776"},"name":"Some Other Time","streamable":"0","mbid":"006b1a3d-5e9a-4944-ba06-68423683422a","album":{"#text":"The Tony Bennett/Bill Evans Album","mbid":""},"url":"https://www.last.fm/music/Tony+Bennett/_/Some+Other+Time","image":[{"#text":"https://lastfm-img2.akamaized.net/i/u/34s/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"small"},{"#text":"https://lastfm-img2.akamaized.net/i/u/64s/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"medium"},{"#text":"https://lastfm-img2.akamaized.net/i/u/174s/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"large"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"extralarge"}],"@attr":{"nowplaying":"true"}},{"artist":{"#text":"Tony Bennett","mbid":"8be0594f-8c13-46bb-ab06-f93ffba5c776"},"name":"The Touch Of Your Lips","streamable":"0","mbid":"c65de797-52cc-40a7-a299-dbc05661df73","album":{"#text":"The Tony Bennett/Bill Evans Album","mbid":""},"url":"https://www.last.fm/music/Tony+Bennett/_/The+Touch+Of+Your+Lips","image":[{"#text":"https://lastfm-img2.akamaized.net/i/u/34s/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"small"},{"#text":"https://lastfm-img2.akamaized.net/i/u/64s/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"medium"},{"#text":"https://lastfm-img2.akamaized.net/i/u/174s/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"large"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"extralarge"}],"date":{"uts":"1534709823","#text":"19 Aug 2018, 20:17"}},{"artist":{"#text":"Tony Bennett","mbid":"8be0594f-8c13-46bb-ab06-f93ffba5c776"},"name":"Young And Foolish","streamable":"0","mbid":"bba2ddb0-8b6d-4e12-bc55-2aec79d06fb3","album":{"#text":"The Tony Bennett/Bill Evans Album","mbid":""},"url":"https://www.last.fm/music/Tony+Bennett/_/Young+And+Foolish","image":[{"#text":"https://lastfm-img2.akamaized.net/i/u/34s/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"small"},{"#text":"https://lastfm-img2.akamaized.net/i/u/64s/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"medium"},{"#text":"https://lastfm-img2.akamaized.net/i/u/174s/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"large"},{"#text":"https://lastfm-img2.akamaized.net/i/u/300x300/62ba401697af4e78d5fd6c2dfb0292cd.png","size":"extralarge"}],"date":{"uts":"1534709588","#text":"19 Aug 2018, 20:13"}}],"@attr":{"user":"RnRG","page":"1","perPage":"2","totalPages":"80831","total":"161661"}}}');

            var userStall = lastTracks.buildScrobbleDisplayForUser(userName, scrobbleData);

            var scrobbleBarn = document.getElementById("scrobbleBarn");
            scrobbleBarn.appendChild(userStall);
        }
    },

    /**
     * Periodically polls for scrobble updates
     * @param url call to last.fm API
     * @param userName user whose scrobbles you're just dying to see
     */
    pollForScrobbles: function(url, userName) {
        url = "http://www.cnn.com";
        console.log(url);

        var pollFunction = this.pollForScrobbles;
        fetch(url, {"headers":{"Content-Type":"application/json"}})
            .then(function(response) {
                if (response.status !== 200) {
                    console.log("received status " + response.status + " from url: " + url);
                }
                else {
                    var responseJson = response.json().then(function(scrobbleData, pollFunction) {
                        var userStall = lastTracks.buildScrobbleDisplayForUser(userName, scrobbleData);

                        var scrobbleBarn = document.getElementById("scrobbleBarn");
                        scrobbleBarn.appendChild(userStall);

//                        window.setTimeout(pollFunction(url, userName), 5000);
                    });
                }
            })
            .catch(function(err) {
                console.log("could not fetch url: " + url);
                console.log(err);

                console.log("trying again?");
                window.setTimeout(pollFunction, 2000);
            });
    },

    /**
     * Formats the track date and time for display
     */
    parseTrackDateTimeForDisplay: function(trackDateTimeValue) {
        var display = "";
        display += trackDateTimeValue.getFullYear();
        display += "-";
        display += this.zeroPad(trackDateTimeValue.getMonth() + 1);
        display += "-";
        display += this.zeroPad(trackDateTimeValue.getDate());

        display += "&nbsp;";

        display += this.zeroPad(trackDateTimeValue.getHours());
        display += ":";
        display += this.zeroPad(trackDateTimeValue.getMinutes());

        return display;
    },

    zeroPad: function(value) {
        if (value < 10) {
            value = "0" + value;
        }

        return value;
    },

    /**
     * Builds the display for a user's scrobbles
     * @param user's username
     * @param their scrobble data
     * @return the HTML element containing their scrobbles for display
     */
    buildScrobbleDisplayForUser: function(userName, userScrobbleData) {

        var userStall = document.createElement("div");
        userStall.className = "userScrobbleStall";

        var userHeader = document.createElement("div");
        userHeader.className = "userScrobbleHeader";

        var userHeaderHref = document.createElement("a");
        userHeaderHref.href = "https://www.last.fm/user/" + userName + "/library";
        userHeaderHref.target = "_blank";
        userHeaderHref.className = "externalLink";
        userHeaderHref.innerHTML = userName;

        userHeader.appendChild(userHeaderHref);

        userStall.appendChild(userHeader);

        var userScrobbleBody = document.createElement("div");
        userScrobbleBody.className = "userScrobbleBody";

        // handle error case
        if(userScrobbleData.error != null) {
            userScrobbleBody.innerHTML = "User not found: " + userName;
        }
        else {
            var tracks = userScrobbleData.recenttracks.track;

            // Go through each track and build the display
            for (var i=0; i < tracks.length; i++) {
                var track = tracks[i];
                var trackData = document.createElement("div");
                trackData.className = "track";

                // Now playing status
                var nowPlaying = false;
                var trackNowPlaying = document.createElement("span");
                trackNowPlaying.className = "trackNowPlaying";
                if (track["@attr"] != null) {
                    if (track["@attr"]["nowplaying"]) {
                        nowPlaying = true;
                        trackNowPlaying.innerHTML = "&nbsp;&#127926";
                    }
                }

                // Date time
                var trackDateTime = document.createElement("span");
                trackDateTime.className = "trackDateTime";

                // We don't get a date/time if the track is currently playing
                // so just cheat and use the current date/time
                var trackDateTimeValue;
                if (nowPlaying) {
                    var now = new Date();
                    trackDateTimeValue = now;
                }
                else {
                    var tdt = new Date(track.date.uts * 1000);
                    trackDateTimeValue = tdt;
                }
                trackDateTime.innerHTML = "[" + this.parseTrackDateTimeForDisplay(trackDateTimeValue) + "]";

                // Artist name
                var trackArtist = document.createElement("span");
                trackArtist.className = "trackArtist";
                trackArtist.innerHTML = track.artist["#text"] + "&nbsp;-&nbsp;";

                // Track name
                var trackName = document.createElement("span");
                trackName.className = "trackName";
                trackName.innerHTML = track.name;

                // Put 'em all together
                trackData.appendChild(trackDateTime);
                trackData.appendChild(trackArtist);
                trackData.appendChild(trackName);
                if (nowPlaying) {
                    trackData.appendChild(trackNowPlaying);
                }

                userScrobbleBody.appendChild(trackData);
            }
        }

        userStall.appendChild(userScrobbleBody);
        return userStall;
    }
};

