/*
	Card class
*/
function Card(rank, suit){
	this.rank = rank;
  this.suit = suit;
}

Card.prototype.getValue = function(currentTotal){
	var value = 0;

	if (this.rank == 'A' && currentTotal < 11){
			value = 11;
	} else if (this.rank == 'A'){
			value = 1;
	} else if (this.rank == 'J' || this.rank == 'Q' || this.rank == 'K'){
			value = 10;
	} else {
			value = this.rank;
	}
	return value;
}

Card.prototype.view = function(){
	var htmlEntities = {
		'hearts' : '&#9829;',
		'diamonds' : '&#9830;',
		'clubs' : '&#9827;',
		'spades' : '&#9824;'
	}
	return `
		<div class="card ` + this.suit + `">
			<div class="top rank">` + this.rank + `</div>
			<div class="suit">` + htmlEntities[this.suit] + `</div>
			<div class="bottom rank">` + this.rank + `</div>
		</div>
	`;
}

/*
	Player class
*/
function Player(element, hand){
	this.hand = hand;
	this.element = element;
}

Player.prototype.hit = function(card){
	this.hand.push(card);
	document.getElementById(this.element).innerHTML += card.view();
}

Player.prototype.getPoints = function(){
	var points = 0;
	for(var i = 0; i < this.hand.length; i++){
		if(i == 0) points = this.hand[i].getValue(0);
		else points += this.hand[i].getValue(points);
	}
	return points;
}

Player.prototype.showHand = function(){
	for(var i = 0; i < this.hand.length; i++){
		document.getElementById(this.element).innerHTML += this.hand[i].view();
	}
}



/*
	Deck - Singleton class
*/
var Deck = new function(){
	this.ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
	this.suits = ['hearts', 'spades', 'diamonds','clubs'];
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

}

/*
	Game - Singleton class
*/

var dealer, player;

var Game = new function(){

	this.init = function(){
		Deck.init();
	}

	this.start = function(){


		Deck.shuffle();

		dealer = new Player('dealer', [Deck.deck.pop()])
		player = new Player('player', [Deck.deck.pop(), Deck.deck.pop()]);


		dealer.showHand();
		player.showHand();
	}
}


/*
	Init
*/
Game.init();

var dealButton = document.getElementById('deal');
var hitButton = document.getElementById('hit');
var standButton = document.getElementById('stand');

dealButton.addEventListener('click', Game.start);
hitButton.addEventListener('click', function(){
	player.hit(Deck.deck.pop());
});
