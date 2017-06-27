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
}

Player.prototype.getScore = function(){
	var points = 0;
	for(var i = 0; i < this.hand.length; i++){
		if(i == 0) points = this.hand[i].getValue(0);
		else points += this.hand[i].getValue(points);
	}
	return points;
}

Player.prototype.showHand = function(){
	var hand = "";
	for(var i = 0; i < this.hand.length; i++){
		 hand += this.hand[i].view();
	}
	return hand;
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

var Game = new function(){

	this.dealer;
	this.player;
	this.dealerScore;
	this.playerScore;

	var self = this;

	this.init = function(){

		Deck.init();

		this.dealerScore = document.getElementById('dealer-score').getElementsByTagName("span")[0];
		this.playerScore = document.getElementById('player-score').getElementsByTagName("span")[0];

		var dealButton = document.getElementById('deal');
		var hitButton = document.getElementById('hit');
		var standButton = document.getElementById('stand');

		dealButton.addEventListener('click', function(){

			Game.start();

			dealButton.classList.add('disabled');
			hitButton.classList.remove('disabled');
			standButton.classList.remove('disabled');

			hitButton.addEventListener('click', function(){
				var card = Deck.deck.pop();
				self.player.hit(card);
				document.getElementById(self.player.element).innerHTML += card.view();
				self.playerScore.innerHTML = self.player.getScore();
			});

		});

	}

	this.start = function(){

		Deck.shuffle();

		this.dealer = new Player('dealer', [Deck.deck.pop()]);
		this.player = new Player('player', [Deck.deck.pop(), Deck.deck.pop()]);

		document.getElementById(this.dealer.element).innerHTML += this.dealer.showHand();
		document.getElementById(this.player.element).innerHTML = this.player.showHand();

		this.dealerScore.innerHTML = this.dealer.getScore();
		this.playerScore.innerHTML = this.player.getScore();
	}
}


/*
	Init
*/
Game.init();
