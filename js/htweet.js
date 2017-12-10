(function ($) {

    $.fn.extend({

        htweet:function(options){
				
				var settings = $.extend({
					twitterId: 'egrappler',
					noOfTweets: 3,
					refreshInterval: 5,
					showProfileImage: true,
					showDefaultProfileImage: false,
					showReTweets: true,
					showActions :true,
					defaultProfileImage :'twitter-bird.png',
					useCustomFormatting: false,
					onAllDataRecieved:null,
					onFormatTweet:null
					
				},options);	
				
				return this.each(function(){					
					getTweets($(this));					
				});
				
				function getTweets(wrapper){
				
					$.ajax({
						dataType: "json",
						type: "post",
						async: true,
						url: "get_tweets.php",
						data: { 'twitterId': settings.twitterId,
								'noOfTweets': settings.noOfTweets
							  },
						success: function(tweets) {
							if(!settings.useCustomFormatting){
								wrapper.html('');
								wrapper.append('<ul class="htweets"/>');
								
								$(tweets).each(function(){									
									wrapper.find('ul').append(getTweetItem(this));									
								});								
							}
							if(settings.onAllDataRecieved)
							{
								var allTweets = new Array();
								$(tweets).each(function(){
									allTweets.push(getRawTweetItem(this));
								});
								settings.onAllDataRecieved(allTweets);
							}
							if(settings.onFormatTweet)
							{
								$(tweets).each(function(){
									settings.onFormatTweet(this);
								});
							}							
						}
					});
				}				
				function getRawTweetItem(item)
				{
					var tweetId = item.id_str;
					var userName = item.user.screen_name;
					var name = item.user.name;
					var profileImage = item.user.profile_image_url || item.user.profile_image_url_https;
					var createdAt = Date.parse(item.created_at.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'));
					var tweetTime = getTweetTime(createdAt);
					var text = item.text;
					
					if(settings.showReTweets && item.retweeted){					   
					   userName = item.retweeted_status.user.screen_name;
					   name = item.retweeted_status.user.name;
					   profileImage = item.retweeted_status.user.profile_image_url_https;
					   tweetId = item.retweeted_status.id_str;
					   text = item.retweeted_status.text; 					   
					}
					text = prepareTweet(text);
					return {tweetId:tweetId,
							userName:userName,
							name:name,
							profileImage:profileImage,
							createdAt:createdAt,
							tweetTime:tweetTime,
							text:text};
				}
				function getTweetItem(item)
				{
					var tweetId = item.id_str;
					var userName = item.user.screen_name;
					var name = item.user.name;
					var profileImage = item.user.profile_image_url || item.user.profile_image_url_https;
					var createdAt = Date.parse(item.created_at.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'));
					var tweetTime = getTweetTime(createdAt);
					var text = item.text;
					
					if(settings.showReTweets && item.retweeted){					   
					   userName = item.retweeted_status.user.screen_name;
					   name = item.retweeted_status.user.name;
					   profileImage = item.retweeted_status.user.profile_image_url_https;
					   tweetId = item.retweeted_status.id_str;
					   text = item.retweeted_status.text; 					   
					}
					text = prepareTweet(text);
					var listItem = $('<li></li>');
					
					if(settings.showProfileImage)
					{					
						listItem.append('<div class="twitter-profile-image"><a href="https://twitter.com/'+userName+'" target="_blank"><img src="'+profileImage+'"/></a></div>');
												
					}
					else if(settings.showDefaultProfileImage)
					{						
						listItem.append('<div class="twitter-profile-image"><a href="https://twitter.com/'+userName+'" target="_blank"><img src="'+settings.defaultProfileImage+'"/></a></div>');
					}
					listItem.append('<div class="twitter-content"/>');
					var container = listItem.find('.twitter-content');
					container.append('<strong><a href="https://twitter.com/'+userName+'" target="_blank">'+name+'</a></strong> <a href="https://twitter.com/'+userName+'" target="_blank">@'+userName+'</a></span>');
					container.append('<span class="twitter-tweet-time"><a href="https://twitter.com/'+userName+'/status/'+tweetId+'" target="_blank">'+tweetTime+'</a></span>');					
					container.append('<p class="twitter-status">'+text+'</p>');
					
					if(settings.showReTweets && item.retweeted)
					{
						container.append('<span class="twitter-retweeted">Retweeted</span>');
					}
					
					if(settings.showActions)
					{					
						container.append('<span class="twitter-actions"><span class="twitter-reply"><a href="https://twitter.com/intent/tweet?in_reply_to='+tweetId+'" title="Reply" target="_blank">Reply</a></span><span class="twitter-retweet"><a href="https://twitter.com/intent/retweet?tweet_id='+tweetId+'" title="Retweet" target="_blank">Retweet</a></span><span class="twitter-fav"><a href="https://twitter.com/intent/favorite?tweet_id='+tweetId+'" title="Favorite" target="_blank">Favorite</a></span></span>');
						
					}
					
					return listItem;					
				}
				function getTweetTime(tweetTime) {
					var seconds = parseInt(((new Date()).getTime() - tweetTime) / 1000);					
					if (seconds < 1) {
						return '0s';
					} else if (seconds < 60 || seconds < 120) {
						return '1m';					
					} else if(seconds < (45*60)) {
						return  (parseInt(seconds / 60)).toString() + 'm';
					} else if(seconds < (2*60*60)) {
						return '1h';
					} else if(seconds < (24*60*60)) {
						return (parseInt(seconds / 3600)).toString() + 'h';
					} else if(seconds < (48*60*60)) {
						return '1d';
					} else {
					    var dt = new Date(tweetTime);						
						var day = dt.getDate();
						if(day<10)
							day = '0' + day;
						var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];	
						return day + ' '  +  months[dt.getMonth()];					
					}					
				}
				function prepareTweet(status) {
					//Add link to all http:// links within tweets
					 status = status.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
						return '<a href="'+url+'"  target="_blank">'+url+'</a>';
					});						 
					//Add link to @usernames used within tweets
					status = status.replace(/\B@([_a-z0-9]+)/ig, function(reply) {
						return '<a href="http://twitter.com/'+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
					});
					//Add link to #hastags used within tweets
					status = status.replace(/\B#([_a-z0-9]+)/ig, function(reply) {
						return '<a href="https://twitter.com/search?q='+reply.substring(1)+'" style="font-weight:lighter;" target="_blank">'+reply.charAt(0)+reply.substring(1)+'</a>';
					});
					return status;
				}
		}
	});
})(jQuery);	