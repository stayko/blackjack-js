/*
	Card class
*/
function Card(rank, suit){
	this.rank = rank;
  this.suit = suit;
}

Card.prototype.getValue = function(currentTotal){
	var value = 0;

	if (this.rank == 1 && currentTotal < 11){
			value = 11;
	} else if (this.rank == 1){
			value = 1;
	} else if (this.rank == 11 || this.rank == 12 || this.rank == 13){
			value = 10;
	} else {
			value = this.rank;
	}
	return value;
}

/*
	Player class
*/
function Player(hand){
	this.hand = hand;
}

Player.prototype.hit = function(card){
	this.hand.push(card);
}

Player.prototype.showHand = function(){
	return this.hand;
}

Player.prototype.getPoints = function(){
	var points = 0;
	for(var i = 0; i < this.hand.length; i++){
		if(i == 0) points = this.hand[i].getValue(0);
		else points += this.hand[i].getValue(points);
	}
	return points;
}



/*
	Deck - Singleton class
*/
var Deck = new function(){
	this.ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	this.suits = ['H', 'S', 'D','C'];
  this.deck = [];

	this.init = function(){
		for(var s = 0; s < this.suits.length; s++){
	  	for(var r = 0; r < this.ranks.length; r++){
	    	this.deck.push(new Card(this.ranks[r], this.suits[s]));
	    }
	  }
	}

	this.shuffle = function(){
		 var j, x, i;
		 for (i = this.deck.length; i; i--) {
				 j = Math.floor(Math.random() * i);
				 x = this.deck[i - 1];
				 this.deck[i - 1] = this.deck[j];
				 this.deck[j] = x;
		 }
	}

	this.deal = function(){

		var dealer = new Player([Deck.deck.pop()])
		var player1 = new Player([Deck.deck.pop(), Deck.deck.pop()]);

		console.log(dealer.showHand());
		console.log(player1.showHand());

		console.log(dealer.getPoints());
		console.log(player1.getPoints());


	}

}

/*
	Game - Singleton class
*/
var Game = new function(){
	this.start = function(){
		Deck.init();
		Deck.shuffle();
		Deck.deal();
	}
}


/*
	Init
*/
Game.start();
