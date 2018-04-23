/*
 	(c) 2018 Julian Weiss // insanj
	dial
	https://github.com/insanj/dial
*/

/* Dependencies */
function include(jsFilePath) {
	// https://stackoverflow.com/a/950098
    var js = document.createElement("script");

    js.type = "text/javascript";
    js.src = jsFilePath;

    document.body.appendChild(js);
}

include("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.js");
include("https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.0/underscore.js");
include("dial/emoji.js");

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
	constructor(dialItem, emojiGenerator) {
		this.dialItem = dialItem;
		this.emojiGenerator = emojiGenerator;
		this.emojiEnabled = true;
	}

	convertToHTMLDiv(i) {
		var htmlDivContents = "";
		if (this.emojiEnabled == true) {
			htmlDivContents = this.generateEmojiForItem();
		} 
		var htmlDivElement = "<div id='"+i+"' class='dialui-item'>"+htmlDivContents+"</div>";
		return htmlDivElement;
	}

	generateEmojiForItem() {
		var dateTimestamp = this.dialItem.date.getTime();
		var emoji = this.emojiGenerator.getEmojiForTimestamp(dateTimestamp);
		return emoji;
	}

	static createDialUIItemsFromArray(dialItems) {
		var convertedDialUIItems = [];
		var emojiGenerator = new ByrdseedEmoji();
		for (var i = 0; i < dialItems.length; i++) {
			var thisDialItem = dialItems[i];
			var newDialUIItem = new DialUIItem(thisDialItem, emojiGenerator);
			convertedDialUIItems.push(newDialUIItem);
		}

		return convertedDialUIItems;
	}

	static convertGithubCommitsToDialUIItems(commits) {
		var dialItems = DialItem.convertGithubCommitsToDialItems(commits);
		var dialUIItems = DialUIItem.createDialUIItemsFromArray(dialItems);
		return dialUIItems;
	}
}

class DialUIItemCSS {
	constructor(width, padding, selectedWidth) {
		this.width = width;
		this.padding = padding;
		this.selectedWidth = selectedWidth;
	}

	static fromDict(dict) {
		var pcWidth = dict["width"];
		var pcPadding = dict["padding"];
		var pcSelectedWidth = dict["selectedWidth"];
		return new DialUIItemCSS(pcWidth, pcPadding, pcSelectedWidth);
	}

	convertToCSSDict() {
		var keys = ["width", "margin-left"];
		var values = [this.width, this.padding];

		var dict = {};
		for (var i = 0; i < keys.length; i++) {
			dict[keys[i]] = values[i] + "px";
		}
		return dict;
	}

	getSelectedWidthCSSDict() {
		return {"width" : this.selectedWidth + "px !important;"};
	}
}

/* Drawing */
class DialDrawer {
	static drawDialUIItems(dialItems, dialItemCSS, parentDivId) {
		var dialUIItemContainerId = "dialui-container";
		var dialUIItemContainerDiv = "<div id='" + dialUIItemContainerId +"'></div>";
		$("#"+parentDivId).append(dialUIItemContainerDiv);

		var dialUIItemContainerHashId = "#"+dialUIItemContainerId;
		for (var i = 0; i < dialItems.length; i++) {
			var uiItem = dialItems[i];
			var uiItemDiv = uiItem.convertToHTMLDiv(i);
			$(dialUIItemContainerHashId).append(uiItemDiv);
		}

		DialDrawer.setDialUIItemCSS(dialItemCSS, dialUIItemContainerHashId);
	}

	static setDialUIItemCSS(resetCSS, parentDivId) {
		var dialItemCSSDict = resetCSS.convertToCSSDict();
		$(parentDivId).children(".dialui-item").css(dialItemCSSDict);

		var dialItemSelectedCSSDict = resetCSS.getSelectedWidthCSSDict();
		DialDrawer.addCSSRule(".selected", dialItemSelectedCSSDict);
	}

	static addCSSRule(rule, css) { // https://stackoverflow.com/a/29307266
		$("#dialdrawer-css").remove();
		css = JSON.stringify(css).replace(/"/g, "").replace(/,/g, ";");
		$("<style>").prop("type", "text/css").prop("id", "dialdrawer-css").html(rule + css).appendTo("head");
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

/* Runtime */
var globalDialListeners = [];
function addDialListener(newDialListener) {
	globalDialListeners.push(newDialListener);
}

var defaultDialListener = new DialListener(function(target) {
	$(".selected").removeClass("selected");
	$(target).addClass("selected");
});
addDialListener(defaultDialListener);


$("body").click("dialui-item", function(e) {
	if (e.target.className != "dialui-item") {
		return;
	}

	for (var i = 0; i < globalDialListeners.length; i++) {
		var listener = globalDialListeners[i];
		listener.doCallback(e.target);
	}
});


