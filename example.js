/*
 	(c) 2018 Julian Weiss // insanj
	dial
	https://github.com/insanj/dial
*/

var globalCommits = [];
function getMockCommits(callback) {
	$.getJSON("https://api.github.com/repos/insanj/insanj.com/commits", function (result) {
		// ? var parsedMockCommit = JSON.parse(mockCommitJSON);
		callback(result);
	});
}

$(document).ready(function() {
	var dialListenerCallback = function(clickedId) {
		var intId = parseInt(clickedId);
		var globalItem = globalCommits[intId];
		console.log(globalItem);

		$("#alert").remove();
		var message = globalItem.commit.author.date;
		message = "🎾 " + message;
		$("body").append("<div id='alert'>"+message+"</div>");
	};

	var dialListener = new DialListener(dialListenerCallback);
	addDialListener(dialListener);

	getMockCommits(function(mockCommits) {
		var uiItems = convertGithubCommitsToDialUIItems(mockCommits);
		drawDialUIItems(uiItems);
		globalCommits = mockCommits;
	});
});