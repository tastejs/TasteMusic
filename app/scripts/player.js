/*jslint global soundManager: true, global SC: true */
'use strict';
(function(_, window, soundManager, SC, undefined) {
    
    var app = window.app;
    var $ = window.jQuery;
    var clientId = '6aeb01b043ebc13df5e211ab3187464f';

    var sounds = [];
    
    SC.initialize({
        /*jslint camelcase: false */
        client_id: clientId
        //, redirect_uri: "http://example.com/callback.html",
    });
    
    // Helpers
    var resolve = function(url, callback) {
        /*jslint camelcase: false */
        SC.get('/resolve.json', { url: url }, callback);
    };
    
    function Player() {

    }

    Player.playTrack = function(track, callback) {
        var self = this;
        var url = track.url;
        resolve(url, function(track) {
            console.log(track);
            SC.stream('/tracks/'+track.id, function(sound) {
                self.stopAllSounds();
                sounds.push(sound);
                sound.play();
                return callback && callback();
            });
        });
    };

    Player.stopAllSounds = function() {
        for (var i=0, len=sounds.length; i<len; i++)
        {
            sounds[i].stop();
        }
    };

    /*
    soundManager.setup({
        url: '/path/to/swf-files/',
        flashVersion: 9, // optional: shiny features (default = 8)
        // optional: ignore Flash where possible, use 100% HTML5 mode
        // preferFlash: false,
        onready: function() {
            // Ready to use; soundManager.createSound() etc. can now be called.
        }
    });
    */

    Player.updatePlaylist = function() {
        $('.track').click(function(event) {
            console.log(event, this);
            event.preventDefault();

            var $el = $(this);
            var url = $el.attr('href');
            var track = {
                url: url
            };

            Player.playTrack(track, function() {
                console.log('Playing '+url);
            });

            return false;
        });
    };

    app.Player = Player;

    $(document).ready(function() {
        app.Player.updatePlaylist();
    });

})(_, window, window.soundManager, window.SC);