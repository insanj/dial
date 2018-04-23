/*
		Derived from http://byrdseed.com/emoji/
*/
class ByrdseedEmoji {
	constructor() {		
		this.faces = _.range(128513,128592);
		this.transport = _.range(128640,128704)	
		this.food = _.range(parseInt("1F354",16),parseInt("1F373",16));
		this.activities = _.range(parseInt("1F3A3",16),parseInt("1F3CA",16));
		this.critters = _.range(parseInt("1F40C",16),parseInt("1F43E",16));
		this.morefaces = _.range(parseInt("1F466",16),parseInt("1F488",16));
		this.actionPacked = _.range(parseInt("1F525",16),parseInt("1F529",16))

		this.ultron = this.faces;

		this.ultron = this.ultron.concat(this.morefaces);		
		this.ultron = _.shuffle(this.ultron);		
		this.ultron = this.ultron.concat(this.critters);		
		this.ultron = _.shuffle(this.ultron);		
		this.ultron = this.ultron.concat(this.activities);		
		this.ultron = _.shuffle(this.ultron);		
		this.ultron = this.ultron.concat(this.transport);		
		this.ultron = _.shuffle(this.ultron);
		this.ultron = this.ultron.concat(this.food);
		this.ultron = _.shuffle(this.ultron);
		this.ultron = _.compact(_.without(this.ultron,parseInt("1F3B0",16),parseInt("1F3A6",16),parseInt("1f6bb",16), parseInt("1F6BD",16), parseInt("1F379",16), parseInt("1F37A",16), parseInt("1F37B",16), parseInt("1F377",16), parseInt("1F459",16), parseInt("1F4A9",16), parseInt("1F489",16), parseInt("1F46C",16), parseInt("1F46D",16)));
	
		this.i = 0;
	}

	getEmojiWithIndex(index) {
		var s = this.ultron[index].toString(16);
		s = "&#x" + s + ";";
		return s;
	}

	getNextEmoji() {
		return this.getEmojiWithIndex(this.i++);
	}

	getEmojiForTimestamp(emojiTimestamp)  {
		var emojiSeedString = emojiTimestamp.toString().substring(0, 3);
		var emojiIndex = Math.min(parseInt(emojiSeedString), this.ultron.length);
		return this.getEmojiWithIndex(emojiIndex);
	}
}
