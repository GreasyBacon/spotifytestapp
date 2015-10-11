$(document).ready(function(){

	//set height of jumbotron straight away	
	var jumbotronHeader = $("#jumboheader");
	var initialJumboHeight = jumbotronHeader.height();
	jumbotronHeader.height(window.innerHeight / 2);
	
	/**
		* Obtains parameters from the hash of the URL
		* @return Object
		*/
	function getHashParams() {
		var hashParams = {};
		var e, r = /([^&;=]+)=?([^&;]*)/g,
			q = window.location.hash.substring(1);
		while ( e = r.exec(q)) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		return hashParams;
	}

	var userProfileSource = document.getElementById('user-profile-template').innerHTML,
		userProfileTemplate = Handlebars.compile(userProfileSource),
		userProfilePlaceholder = document.getElementById('user-profile');
		
	var userPlaylistsSource = document.getElementById('playlist').innerHTML,
		userPlaylistsTemplate = Handlebars.compile(userPlaylistsSource),
		userPlaylistsPlaceholder = document.getElementById('user-playlists');
		
	//var oauthSource = document.getElementById('oauth-template').innerHTML,
	//	oauthTemplate = Handlebars.compile(oauthSource),
	//	oauthPlaceholder = document.getElementById('oauth');

	var params = getHashParams();

	var access_token = params.access_token,
		refresh_token = params.refresh_token,
		error = params.error;

	if (error) {
		alert('There was an error during the authentication');
	} else {
		if (access_token) {
			
			var userId = getUserDetails(access_token, userProfilePlaceholder, userProfileTemplate);
			
			userId.then(function(userId){
				
				if (userId) {
					getPlaylists(access_token, userId, userPlaylistsPlaceholder, userPlaylistsTemplate);
				} else {
					alert('Error signing in.');
				}
				
			});
			
		} else {
			// render initial screen
			$('#login').show();
			$("#mainpageinfo").show();			
			$('#loggedin').hide();
		}

		document.getElementById('obtain-new-token').addEventListener('click', function() {
		$.ajax({
			url: '/refresh_token',
			data: {
			'refresh_token': refresh_token
			}
		}).done(function(data) {
			access_token = data.access_token;
		});
		}, false);
		
	}
	
});