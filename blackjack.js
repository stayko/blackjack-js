/*
	Card class
*/
function Card(rank, suit){
	this.rank = rank;
  this.suit = suit;
}

Card.prototype.show = function(){
	return this.rank + ' of ' + this.suit;
}

/*
	Deck - Singleton class
*/
var Deck = new function(){
	this.ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
	this.suits = ['HEARTS', 'SPADES', 'DIAMONDS','CLUBS'];
  this.deck = [];

	this.init = function(){
		for(var s = 0; s < this.suits.length; s++){
	  	for(var r = 0; r < this.ranks.length; r++){
	    	this.deck.push(new Card(this.ranks[r], this.suits[s]));
	    }
	  }
	}

	this.show = function(){
		for(var d = 0; d < this.deck.length; d++){
	  	console.log(this.deck[d].show());
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
		var dealer = [], player = [];
		dealer.push(this.deck.pop());
		player.push(this.deck.pop());
		player.push(this.deck.pop());

		console.log(dealer);
		console.log(player);
	}

}

function Dealer(){
	
}

Deck.init();
Deck.shuffle();
Deck.deal();
