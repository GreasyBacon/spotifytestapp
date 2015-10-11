$(document).ready(function(){

	//set height of jumbotron straight away	
	var jumbotronHeader = $("#jumboheader");
	var initialJumboHeight = jumbotronHeader.height();
	jumbotronHeader.height(window.innerHeight / 2);
	
	var msie = navigator.userAgent.indexOf('MSIE ');
    var trident = navigator.userAgent.indexOf('Trident/');
    var edge = navigator.userAgent.indexOf('Edge/');
	
	if (msie > 0 || trident > 0 || edge > 0) {
        // IE 10/11/12 or older
		$("#login-button").prop('disabled', true);
		$("#login-button").parent().append("<div class='alert alert-danger' role='alert'>" +
			"Looks like you're running Internet Explorer. Unfortunately, I can't guarantee that this app will work" +
			" for you, or look as how it has been designed." +
			" Please download the latest version of Google Chrome (which this has been tested with)" + 
			" if you would like to use this app.</div>");
    }
	
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
			
			userId.then(function(response){
				
				if (response['id']) {
					
					var userId = response['id'];
				
					userProfilePlaceholder.innerHTML = userProfileTemplate(response);
					
					$('#login').hide();
					$("#mainpageinfo").hide();
					jumbotronHeader.height(initialJumboHeight);
					$('#loggedin').show();
					
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