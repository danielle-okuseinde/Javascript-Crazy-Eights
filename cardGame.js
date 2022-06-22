document.addEventListener("DOMContentLoaded", () => {
    let gamestate = new GameState()
    //maybe add a rules page and a start button and then once that's clicked the game officially starts
    //go into deck of cards api and download card pngs
    let btn = document.getElementById("start-button")
    btn.addEventListener("click", () =>{
        let body = document.getElementsByClassName("container")
        body[0].innerHTML = "<h1>Crazy Eights</h1> <h3 id='turn'>Turn: Player "+(gamestate.turn+1)+"</h3> <div id='pile'></div> <div id='current-player'><div class='hand' id='p1-hand'></div></div> <div id='current-points'>Points: 0</div> <h3 id='declared-suit'>Declared Suit: "+gamestate.declaredSuit+"</h3>"
        gamestate.round()
    })
//make a new html file that implements carGame.js and just link start there so that i can at least see the html in the body lol
})

class Player{
    constructor(number){
        this.number = number
        this.hand = []
        this.points
    }

    updatePoints(){
        //based on the cards in the hand update the number of points the player currently has
    }
}

class Card{
    constructor(rank, suit, value)
    {
        this.suit = suit
        this.rank = rank
        this.value = value
        this.id = ""+rank+suit.charAt(0)
    }
}

//write shuffle and deal methods, finish display hands and display background hands, deal with the case of eights, dont forget to take sizing into account
class GameState{
    constructor(){
        this.players = []
        this.deck = []
        this.pile = []
        this.finished = false
        this.turn = 0
        this.currentPlayer;
        this.declaredSuit = " ";
        this.topCard;

        this.addPlayers()
        this.createDeck()
        this.shuffle()
        this.deal()

        while(!this.topCard || this.topCard.rank == "8"){
            this.topCard = this.deck.pop()
            this.pile.push(this.topCard)
        }
        
    }

    addPlayers(){
        for(let i = 0; i < 4; i++){
            let p = new Player(i+1)
            this.players.push(p)
        }
    }
    shuffle() {
        for (var i = this.deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    }
    deal(){
       for(let i = 0; i<this.players.length; i++)
       {
           this.players[i].hand.push(deck.splice(deck.length-5))
       }
    }
    createDeck(){
        let suits = ["Clubs", "Hearts", "Spades", "Diamonds"]
        for(let i = 0; i<4; i++)
        {
            for(let j = 1; j<14; j++)
            {
                let card;
                if(j == 1)
                {
                    card = new Card("A", suits[i], 1)
                }
                else if(j == 11)
                {
                    card = new Card("J", suits[i], 10)
                }
                else if(j == 12)
                {
                    card = new Card("Q", suits[i], 10)
                }
                else if(j == 13)
                {
                    card = new Card("K", suits[i], 10)
                }
                else{
                    card = new Card(""+j, suits[i], j)
                }
                this.deck.push(card)
            }
        }
    }

    deal(){
        for(let i = 0; i < this.players.length; i++)
        {
            for(let j = 0; j<5; j++)
            {
                this.players[i].hand.push(this.deck.pop())
            }
            
        }
    }
    // displays current players hand
    displayHands(){
            // let hands = document.querySelectorAll("hand")
            // let currentArea = document.getElementById("current-player")
            // currentArea.innerHTML = ""
            // currentArea.appendChild(hands[this.turn])

            // let count = 1
            // for(let i = 0; i < this.players.length; i++)
            // {
            //     if(i != this.turn)
            //     {
            //         let area = document.getElementById("player-"+count)
            //         area.innerHTML = ""
            //         area.appendChild(hands[i])
            //         let p = this.players[i].hand.length
            //         //add this many cards to the display (find an image for the back of a card)
            //         count++
            //     }
                
            // }
    
            let addition = "" // += everything here and then add it to inner html at the end
            let hand = this.currentPlayer.hand
            let currentHand = document.getElementById("current-player")
            for(let j = 0; j < hand.length; j++)
            {
                let file = hand[j].id+".png"
                addition += "<img class = 'card-image' id = '"+hand[j].id+"' src = 'assets/"+file+"' alt = '"+hand[j].id+"'>"
            }
            currentHand.innerHTML = addition
        }
    
    displayPile()
    {
        let file = this.topCard.id+".png"
        let p = document.getElementById('pile')
        p.innerHTML = "<img class = 'card-image' id = '"+this.topCard.id+"' src = 'assets/"+file+"' alt = '"+this.topCard.id+"'>"
    }

    updates(){
        let pnum = document.getElementById('turn')
        pnum.innerHTML = "Player "+(this.turn+1)
        let points = document.getElementById('current-points')
        //work on this later
        let suit = document.getElementById('declared-suit')
        if(this.topCard.rank == "8"){
            suit.innerHTML = "Declared Suit: "+this.declaredSuit
        }
        else{
            suit.innerHTML = " "
        }
    }
    round(){
        this.currentPlayer = this.players[this.turn]
        let num = this.turn+1
        let hand = this.currentPlayer.hand
        let id = "p"+num+"-hand"
        let count = 0
        this.updates()
        this.displayHands()
        this.displayPile()
        console.log(this.topCard)
        console.log(num)
        console.log(hand)
        for(let i = 0; i<hand.length; i++)
        {
            let card = hand[i]
            let currentSuit;
            if(this.topCard.rank == "8")
            {
                currentSuit = this.declaredSuit.toUpperCase()               
            }
            else{
                currentSuit = this.topCard.suit.toUpperCase()    
            }
            if(card.suit.toUpperCase() == currentSuit || card.rank == this.topCard.rank || card.rank == "8"){
                count++
                let cardID = card.id
                let cardElement = document.getElementById(cardID)
                cardElement.addEventListener('click', ()=>{
                    this.pile.push(card)
                    console.log("success")
                    let index = hand.indexOf(card)
                    hand.splice(index, 1)
                    if(hand.length == 0){
                        this.finished = true
                        this.declareWinner()
                    }
                    else if(card.rank == "8"){
                        this.declaredSuit = prompt("Declare a suit")
                        while (!(this.declaredSuit.toUpperCase() == "HEARTS" || this.declaredSuit.toUpperCase() == "SPADES" || this.declaredSuit.toUpperCase() == "DIAMONDS" || this.declaredSuit.toUpperCase() == "CLUBS")){
                            this.declaredSuit = prompt("That is not a valid suit. Please declare a suit.")
                        }
                        this.turn = (this.turn+1)%4
                        this.topCard = this.pile[this.pile.length-1]
                        this.round()
                    }
                    else{
                        this.turn = (this.turn+1)%4
                        this.topCard = this.pile[this.pile.length-1]
                        this.round()
                    }
                })

            }
        
        }
        if(count == 0){
            let body = document.getElementsByClassName("container")
            let draw = document.createElement("button")
            draw.type = "input"
            draw.className = "btn btn-danger"
            draw.id = "draw"
            draw.innerHTML = "Draw"
            body[0].appendChild(draw)
            draw.addEventListener('click', ()=>{
                this.currentPlayer.hand.push(this.deck.pop())
                this.turn = (this.turn+1)%4
                body[0].removeChild(draw)
                this.round()
            })

            
        }
        
        
    }
    declareWinner(){
        document.getElementById('container').innerHTML = "<div class='winner'>Player "+this.currentPlayer.number+" is the winner!</div>"
        //make more pretty and celebratory
    }

    

    
}


