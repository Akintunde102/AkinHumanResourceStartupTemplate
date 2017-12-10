<?php
session_start();
require_once("twitteroauth/twitteroauth.php"); 

$twitteruser = $_POST['twitterId'];
$notweets = $_POST['noOfTweets'];

$consumerkey = "VR8pK1fxFFNNfesfiVrYA";
$consumersecret = "3zlkhm7duFfVlS7XrSYZkHqXbWqCMYpydRn8QS2oiE";
$accesstoken = "280100011-zByiPwwTzoNL7li3nK3bza6GRoqZQLK64EQqguIG";
$accesstokensecret = "a2gOSvrXjYzV4xLBdpd587y9cLbVKUzZSqCoz2zLTEs";
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
 
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);
 
echo json_encode($tweets);
?>