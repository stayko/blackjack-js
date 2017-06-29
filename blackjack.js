/*
	Blackjack 21
	A simple game developed using Javascript, HTML and CSS

	@author Stayko Chalakov
	@version 1.0
	@date 29.06.2017
*/

//namespacing
var BlackjackJS = (function() {

	/**************
		Card class
	***************/

	/*
		Constructor
		@param {String or Number} rank
		@param {String} suit
	*/
	function Card(rank, suit){
		this.rank = rank;
	  this.suit = suit;
	}

	/*
		Gets the value or points of the card
		@param {Integer} currentTotal - The current total score of the
		player's hand
	*/
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

	/*******************
		Renders the card
	*******************/
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

	/*************************** End of Card class ********************************/

	/***************
		Player class
	***************/

	/*
		Constructor
		@param {String} element - The DOM element
		@param {Array} hand - the array which holds all the cards
	*/
	function Player(element, hand){
		this.hand = hand;
		this.element = element;
	}

	/*
		Hit player with new card from the deck
		@param {Card} card - the card to deal to the player
	*/
	Player.prototype.hit = function(card){
		this.hand.push(card);
	}

	/*
		Returns the total score of all the cards in the hand of a player
	*/
	Player.prototype.getScore = function(){
		var points = 0;
		for(var i = 0; i < this.hand.length; i++){
			if(i == 0) points = this.hand[i].getValue(0);
			else points += this.hand[i].getValue(points);
		}
		return points;
	}

	/*
		Returns the array (hand) of cards
	*/
	Player.prototype.showHand = function(){
		var hand = "";
		for(var i = 0; i < this.hand.length; i++){
			 hand += this.hand[i].view();
		}
		return hand;
	}

	/*************************** End of Player class ******************************/

	/*************************
		Deck - Singleton class
	*************************/
	var Deck = new function(){
		this.ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
		this.suits = ['hearts', 'spades', 'diamonds','clubs'];
	  this.deck;

		/*
			Fills up the deck array with cards
		*/
		this.init = function(){
			this.deck = []; //empty the array
			for(var s = 0; s < this.suits.length; s++){
		  	for(var r = 0; r < this.ranks.length; r++){
		    	this.deck.push(new Card(this.ranks[r], this.suits[s]));
		    }
		  }
		}

		/*
			Shuffles the cards in the deck randomly
		*/
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

	/**************************** End of Deck class *******************************/

	/*************************
		Game - Singleton class
	**************************/

	var Game = new function(){

		//for accessing the correct context
		//in the event handler functions and Game.init
		var self = this;

		/*
			Initialise
		*/
		this.init = function(){
			self.dealerScore = document.getElementById('dealer-score').getElementsByTagName("span")[0];
			self.playerScore = document.getElementById('player-score').getElementsByTagName("span")[0];
			self.dealButton = document.getElementById('deal');
			self.hitButton = document.getElementById('hit');
			self.standButton = document.getElementById('stand');

			/*
				Deal button event handler
			*/
			self.dealButton.addEventListener('click', function(){
				Game.start();
				self.dealButton.disabled = true;
				self.hitButton.disabled = false;
				self.standButton.disabled = false;
			});

			/*
				Hit button event handler
			*/
			self.hitButton.addEventListener('click', function(){
				//deal a card and add to player's hand
				var card = Deck.deck.pop();
				self.player.hit(card);

				//render the card and score
				document.getElementById(self.player.element).innerHTML += card.view();
				self.playerScore.innerHTML = self.player.getScore();

				//if over, then player looses
				if(self.player.getScore() > 21){
					self.gameEnded('You lost!');
				}
			});

			/*
				Stand button event handler
			*/
			self.standButton.addEventListener('click', function(){
				self.hitButton.disabled = true;
				self.standButton.disabled = true;

				//deals a card to the dealer until
				//one of the conditions below is true
				while(true){
					var card = Deck.deck.pop();
					self.dealer.hit(card);
					document.getElementById(self.dealer.element).innerHTML += card.view();
					self.dealerScore.innerHTML = self.dealer.getScore();

					//Rule set
					if(self.dealer.getScore() == 21 && self.player.getScore() != 21){
						self.gameEnded('You lost!');
						break;
					} else if(self.dealer.getScore() == 21 && self.player.getScore() == 21){
						self.gameEnded('Draw!');
						break;
					} else if(self.dealer.getScore() > 21 && self.player.getScore() <= 21){
						self.gameEnded('You won!');
						break;
					} else if(self.dealer.getScore() > self.player.getScore() && self.dealer.getScore() <= 21 && self.player.getScore() < 21){
						self.gameEnded('You lost!');
						break;
					}
					//TODO needs to be expanded..

				}

			});

		}

		/*
			Start the game
		*/
		this.start = function(){

			//initilaise and shuffle the deck of cards
			Deck.init();
			Deck.shuffle();

			//deal one card to dealer
			this.dealer = new Player('dealer', [Deck.deck.pop()]);

			//deal two cards to player
			this.player = new Player('player', [Deck.deck.pop(), Deck.deck.pop()]);

			//render the cards
			document.getElementById(this.dealer.element).innerHTML = this.dealer.showHand();
			document.getElementById(this.player.element).innerHTML = this.player.showHand();

			//renders the current scores
			this.dealerScore.innerHTML = this.dealer.getScore();
			this.playerScore.innerHTML = this.player.getScore();

			this.setMessage("Hit or Stand");
		}

		/*
			If the player wins or looses
		*/
		this.gameEnded = function(str){
			this.setMessage(str);
			this.dealButton.disabled = false;
			this.hitButton.disabled = true;
			this.standButton.disabled = true;

		}

		/*
			Instructions or status of game
		*/
		this.setMessage = function(str){
			document.getElementById('status').innerHTML = str;
		}


	}

	//Exposing the Game.init function
	//to the outside world
	return {
		init: Game.init
	}

})()
