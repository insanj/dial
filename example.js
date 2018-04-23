/*
 	(c) 2018 Julian Weiss // insanj
	dial
	https://github.com/insanj/dial
*/

function getGithubCommits(callback) {
	var githubCommitURL = "https://api.github.com/repos/insanj/insanj.com/commits"; 
	$.getJSON(githubCommitURL, function (result) {
		callback(result);
	});
}

function loadDialForGithubCommits(commits) {
	// convert github items to dial UI items that have the ability to be drawn
	var uiItems = DialUIItem.convertGithubCommitsToDialUIItems(commits);
	
	// draw the github commits into the existing dial UI
	var uiItemCSS = DialUIItemCSS.fromDict({"width" : 20.0,
											"padding" : 2.0,
											"selectedWidth" : 30.0});

	DialDrawer.drawDialUIItems(uiItems, uiItemCSS, "dial");

	// if clicked, show alert with emoji and the date of the commit
	var uiItemClickedCallback = function(target) {
		var intId = parseInt(target.id);
		var globalItem = commits[intId];

		$("#alert").remove();
		var itemDate = globalItem.commit.author.date;
		var dateMessage = timeago().format(new Date(itemDate));
		var shaMessage = globalItem.sha;
		var message = "🎾 " + dateMessage + '<br/>' + shaMessage;
		$("body").append("<div id='alert' class='alert alert-dark' role='alert'>"+message+"</div>");	
	};

	var dialListener = new DialListener(uiItemClickedCallback);
	addDialListener(dialListener);
}

$(document).ready(function() {
	getGithubCommits(function(mockCommits) {
		loadDialForGithubCommits(mockCommits);
	});
});