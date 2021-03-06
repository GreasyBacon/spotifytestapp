var mergeCompleted = function(userId, playlistId) {
	
	$("#progress-status").text('All done!');
	
	var footerInfo = $("#footer-info");
	var mergeButton = $("#merge-button");
	
	$('#loggedin').hide();
	$('#userplaylists').hide();
	$('#playlist-created').show();
	$('#embedded-playlist').show();
	
	var playlistUri = "spotify:user:" + userId + ":playlist:" + playlistId;
	var playlistName = $("#playlist-name").val();
	
	var playlistEmbedHtml = '<iframe src=' + 
		'"https://embed.spotify.com/?uri=' + playlistUri + '"' +
		 'width="300px" height="380px" frameborder="0"' +
		 'allowtransparency="true"></iframe>';
	
	$('#playlist-embed').append(playlistEmbedHtml);
	
	$('iframe[src*="embed.spotify.com"]').each( function() {
		$(this).css('width',$(this).parent(1).css('width'));
		$(this).attr('src',$(this).attr('src'));
  	});
	  
	var playlistShareText = 'I just created a new merged playlist using mergeyoplaylists.today!';
	var playlistShareUrl = 'https://open.spotify.com/user/' + userId + '/playlist/' + playlistId;
	
	//set share button links
	
	//facebook - example:
	$("#facebook-share").prop('href', 'https://www.facebook.com/sharer/sharer.php?u=' + 
		playlistShareUrl
	);

	//twitter - example:	
	$("#twitter-share").prop('href', 'http://twitter.com/share?text=' +
		playlistShareText + '&url=' + playlistShareUrl
	);

	//tumblr - example:	
	$("#tumblr-share").prop('href', 'http://www.tumblr.com/share/link?url=' + 
		playlistShareUrl + '&description=I just created a new merged playlist using <a href="https://mergeyoplaylists.today">mergeyoplaylists.today</a>!'
	);
	
	//reddit - example:	
	$("#reddit-share").prop('href', 'https://www.reddit.com/submit?url=' +
		playlistShareUrl + '&title=' + playlistName + ' - created with mergeyoplaylists.today!'
	);
	
	mergeButton.prop('disabled', 'disabled');
	footerInfo.animate( { height:"0px" }, { queue:false, duration:500 });
	
};

var applyEventListeners = function(userId, access_token) {
	
	$( ".playlist-grid-cell img" ).off('mouseenter');
	$( ".playlist-grid-cell" ).off('click');
	$('#merge-button').off('click');
	$('#new-merge').off('click');
	
	$( ".playlist-grid-cell img" ).mouseenter(
							
		function() {
							
			var title = $(this).data('name');
			var tracks = $(this).data('trackcount');
									
			$( this ).parents('div').find('.layer').remove();
			$( this ).parent().append( $( "<div class='layer'>" +
			"<table><tr><td>" + 
			title + 
			"</td></tr>" +
			"<tr><td><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></td>" +			
			"</tr><tr><td>" +
			tracks + 
			" tracks</td></tr>" +
			"</table>" + 			
			"</div>" ) );
	
		}
	);
						
	$( ".playlist-grid-cell" ).click(
							
		function() {

			var mergeButton = $("#merge-button");
			var albumCount = $("#album-count");
			var trackCount = $("#track-count");
			var footerInfo = $("#footer-info");
			var progressDiv = $("#progress-div");
			var dataTrackCount = parseInt($( this ).find('img').data('trackcount'));
		
			if ( $( this ).find('.selected').length ) {

				$( this ).find('.selected').remove();
				
				var count = parseInt(albumCount.text()) - 1;
				albumCount.text(count);
				
				var trackCountVal = parseInt(trackCount.text()) - dataTrackCount;
				trackCount.text(trackCountVal);
				
				if (count == 0 || trackCountVal == 0) {
					mergeButton.prop('disabled', 'disabled');
					footerInfo.animate( { height:"0px" }, { queue:false, duration:500 });
				}
												
			} else {
			
				$( this ).parents('div').find('.layer').remove();
				$( this ).children('a').append( $("<div class='selected'><table><tr><td>Selected!</td></tr>" +
				"<tr><td><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></td></tr></table></div>" ) );								
				
				//albumCount.text() will be '0' by default
				if (albumCount.text() !== '0') {
					var count = parseInt(albumCount.text()) + 1;
					albumCount.text(count);
					
					var trackCountVal = parseInt(trackCount.text()) + dataTrackCount;
					trackCount.text(trackCountVal);
					
				} else {
					albumCount.text('1');
					trackCount.text(dataTrackCount);
					
					//animate in footer with info - TRIGGERED
					footerInfo.animate( { height:"0px" }, { queue:false, duration:0 });					
					footerInfo.prop('hidden', false);
					progressDiv.hide();
					footerInfo.animate( { height:"70px" }, { queue:false, duration:500 });
				}
				
				mergeButton.prop('disabled', false);
				
				
			}
			
		}
	);
						
	$('#merge-button').click(
							
		function() {
								
			var playlistResults = $("#playlist-results");
			var playlistName = $("#playlist-name").val();
			
			$( this ).prop('disabled', true);
			$("#playlist-name").prop('disabled', true);
			$("#progress-div").show();
						
			//create new playlist with name provided
			var playlistId = createPlaylist(userId, access_token, playlistName);
			
			playlistId.then(function(id){
			
				var playlistId = id;	
			
				//get tracks for each playlist, add to big array
				Promise.map(playlistResults.find('.selected').toArray(), function(playlistResult) {
					
					var playlist = $(playlistResult).parent();
					var tracksURL = $(playlist.children('img')).data('trackurl');
					
					return Promise.delay(2000).then(function(){
						return getPlaylistTracks(userId, access_token, tracksURL);
					});
					
				}).then(function(allTracks){
					
					var mergedList = [].concat.apply([], allTracks);
					var filteredList = mergedList.concat();
					
					for(var i=0; i<filteredList.length; ++i) {
						for(var j=i+1; j<filteredList.length; ++j) {
							if(filteredList[i] === filteredList[j] || filteredList[j].indexOf('local') !== -1)
								filteredList.splice(j--, 1);								
						}
					}
					
					//add all tracks to new playlist - with playlistId
					var addTracks = addTracksToPlaylist(userId, access_token, playlistId, filteredList);
					
					addTracks.then(function(playlistId){
						mergeCompleted(userId, playlistId);
					});				
					
				});
			
			});
			
		}
	);
	
	$('#new-merge').click(
	
		function() {

			$("#playlist-name").prop('disabled', false);
			
			var userPlaylistsSource = document.getElementById('playlist').innerHTML,
				userPlaylistsTemplate = Handlebars.compile(userPlaylistsSource),
				userPlaylistsPlaceholder = document.getElementById('user-playlists');
				
			$("#user-playlists").empty();
			$("#album-count").text('0');
			$("#track-count").text('0');
			$('#playlist-embed').find('iframe').remove();
			$("#no-playlists-left").hide();
			$('#progress-div').hide();
		
			getPlaylists(access_token, userId, userPlaylistsPlaceholder, userPlaylistsTemplate);
			
			$('#loggedin').show();
			$('#userplaylists').show();
			$('#playlist-created').hide();
			$('#embedded-playlist').hide();
			
		}
	);
};