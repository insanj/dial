/*
 	(c) 2018 Julian Weiss // insanj
	dial
	https://github.com/insanj/dial
*/

/* Backend */
class DialItem {
	constructor(date, data) {
		if (date == null) {
			throw "Date parameter required for DialItem: " + data;
		}

		this.date = new Date(date); 
		this.data = data;
	}

	static createDialItemFromGithubCommit(commit) {
		var commitDate = commit.author.date;
		if (commitDate == null) {
			// we might me one level up from the commit metadata
			commitDate = commit.commit.author.date;
		}

		var newDialItem = new DialItem(commitDate, commit);
		return newDialItem;
	}

	static convertGithubCommitsToDialItems(commitArray) {
		var convertedDialItems = [];
		for (var i = 0; i < commitArray.length; i++) {
			var thisCommit = commitArray[i];
			var convertedItem = DialItem.createDialItemFromGithubCommit(thisCommit);
			convertedDialItems.push(convertedItem);
		}

		var sortedItems = convertedDialItems.sort(function (a, b) {
			return a.date - b.date;
		});

		return sortedItems;
	}
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
	constructor(dialItem, xOffset, individualXOffset) {
		this.dialItem = dialItem;
		this.xOffset = xOffset;
		this.individualXOffset = individualXOffset;
		this.usesLeftMargin = false;
	}

	convertToHTMLDiv(i) {
		var htmlMarginStyle = "margin-left: "+this.individualXOffset+"px;";
		if (this.usesLeftMargin == true) {
			htmlMarginStyle = "margin-left: " + this.xOffset + "px;";
		}

		var htmlDivElement = "<div id='"+i+"' class='dialui-item' style='"+htmlMarginStyle+"'></div>";
		return htmlDivElement;
	}

	static createDialUIItemsFromArray(dialItems, individualXOffset) {
		var convertedDialUIItems = [];
		for (var i = 0, o = 0.0; i < dialItems.length; i++, o=o+individualXOffset) {
			var thisDialItem = dialItems[i];
			var newDialUIItem = new DialUIItem(thisDialItem, o, individualXOffset);
			convertedDialUIItems.push(newDialUIItem);
		}

		return convertedDialUIItems;
	}

	static convertGithubCommitsToDialUIItems(commits) {
		var dialItems = DialItem.convertGithubCommitsToDialItems(commits);
		var dialUIItems = DialUIItem.createDialUIItemsFromArray(dialItems, 10.0);
		return dialUIItems;
	}
}

/* Drawing */
class DialDrawer {
	static drawDialUIItems(dialItems) {
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
}

/* Interactions */
class DialListener {
	constructor(callback) {
		this.listenerCallback = callback;
	}

	doCallback(param) {
		this.listenerCallback(param);
	}
}

var globalDialListeners = [];
$("body").click("dialui-item", function(e) {
	if (e.target.className != "dialui-item") {
		return;
	}

	for (var i = 0; i < globalDialListeners.length; i++) {
		var listener = globalDialListeners[i];
		listener.doCallback(e.target);
	}
});

function addDialListener(newDialListener) {
	globalDialListeners.push(newDialListener);
}

// Default Listener
var defaultDialListener = new DialListener(function(target) {
	$(".selected").removeClass("selected");
	$(target).addClass("selected");
});

addDialListener(defaultDialListener);