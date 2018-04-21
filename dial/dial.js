/*
 	(c) 2018 Julian Weiss // insanj
	dial
	https://github.com/insanj/dial
*/

/* Backend */
class DialItem {
	constructor(date, data) {
		self.date = date;
		self.data = data;
	}
}

function createDialItemFromGithubCommit(commit) {
	var commitDate = commit.author.date;
	var newDialItem = new DialItem(commitDate, commit);
	return newDialItem;
}

function convertGithubCommitsToDialItems(commitArray) {
	var convertedDialItems = [];
	for (var i = 0; i < commitArray.length; i++) {
		var thisCommit = commitArray[i];
		var convertedItem = createDialItemFromGithubCommit(thisCommit);
		convertedDialItems.push(convertedItem);
	}

	convertedDialItems.sort(function (a, b) {
		if (a.date > b.date) {
			return 1;
		} else if (a.date < b.date) {
			return -1;
		} else {
			return 0;
		}
	});

	return convertedDialItems;
}

/* Frontend */
/* Convert the array of dial items into an array of UI items.
	These items contain the dial item information as well as
	relative coordinate points in order to draw them. The
	first item begins with an x-offset of 0.0, and the last
	item contains an offset that is normalized from the total
	length of the array to the given per-item offet (default 5.0
	for visibility; 5px padding between each item drawn).

	Example: [ date1 0.0, date2 5.0, date3 10.0 ..... date10 50.0 ]
*/
class DialUIItem {
	constructor(dialItem, xOffset) {
		this.dialItem = dialItem;
		this.xOffset = xOffset;
	}

	convertToHTMLDiv(i) {
		var htmlDivElement = "<div id='"+i+"' class='dialui-item' style='margin-left: " + this.xOffset + "px;'></div>";
		return htmlDivElement;
	}
}

function createDialUIItemsFromArray(dialItems) {
	var convertedDialUIItems = [];
	var individualXOffset = 10.0;
	for (var i = 0, o = 0.0; i < dialItems.length; i++, o=o+individualXOffset) {
		var thisDialItem = dialItems[i];
		var newDialUIItem = new DialUIItem(thisDialItem, o);
		convertedDialUIItems.push(newDialUIItem);
	}

	return convertedDialUIItems;
}

function convertGithubCommitsToDialUIItems(commits) {
	var dialItems = convertGithubCommitsToDialItems(commits);
	var dialUIItems = createDialUIItemsFromArray(dialItems);
	return dialUIItems;
}

/* Drawing */
function drawDialUIItems(dialItems) {
	var dialUIItemContainerId = "dialui-container";
	var dialUIItemContainerDiv = "<div id='" + dialUIItemContainerId +"'></div>";
	$("body").append(dialUIItemContainerDiv);

	var dialUIItemContainerHashId = "#"+dialUIItemContainerId;
	for (var i = 0; i < dialItems.length; i++) {
		var uiItem = dialItems[i];
		var uiItemDiv = uiItem.convertToHTMLDiv(i);
		$(dialUIItemContainerHashId).append(uiItemDiv);
	}
}

/* Interactions */
class DialListener {
	constructor(callback) {
		self.listenerCallback = callback;
	}

	doCallback(param) {
		self.listenerCallback(param);
	}
}

var globalDialListeners = [];
$("body").click("dialui-item", function(e) {
	if (e.target.className != "dialui-item") {
		return;
	}

	var dialUIItemId = e.target.id;
	for (var i = 0; i < globalDialListeners.length; i++) {
		var listener = globalDialListeners[i];
		listener.doCallback(dialUIItemId);
	}
});

function addDialListener(newDialListener) {
	globalDialListeners.push(newDialListener);
}