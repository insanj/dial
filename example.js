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
	DialDrawer.drawDialUIItems(uiItems);

	// if clicked, show alert with emoji and the date of the commit
	var uiItemClickedCallback = function(target) {
		var intId = parseInt(target.id);
		var globalItem = commits[intId];

		$("#alert").remove();
		var message = globalItem.commit.author.date;
		message = "🎾 " + message;
		$("body").append("<div id='alert'>"+message+"</div>");
	};

	var dialListener = new DialListener(uiItemClickedCallback);
	addDialListener(dialListener);
}

$(document).ready(function() {
	getGithubCommits(function(mockCommits) {
		loadDialForGithubCommits(mockCommits);
	});
});