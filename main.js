class model {
   constructor() {
     this.playerCount = 1;
     this.bluePlayerMoves = [];
     this.redPlayerMoves = [];
     this.won = false;
   }

   playerPlayed(cellId) {
        if (this.playerCount % 2 === 0) {
           this.bluePlayerMoves.push(Number(cellId));
           this.playerCount ++;
           this.checkForWin('bluePlayerMoves');
           if (this.won) {
               return 'Blue Player Wins'
           }
           return 'blue';
        }
        if (this.playerCount % 2 !== 0) {
            this.redPlayerMoves.push(Number(cellId));
            this.playerCount ++;
            this.checkForWin('redPlayerMoves');
            if (this.won) {
                return 'Red Player Wins'
            }
            return 'red';
        }
   }

   checkForWin(player) {
      const playerOrderedMoves =  this[player].sort((a, b) => a - b);
      playerOrderedMoves.forEach(position => {
          if ((playerOrderedMoves.includes(position + 1) && playerOrderedMoves.includes(position + 2) && playerOrderedMoves.includes(position + 3)) ||
                (playerOrderedMoves.includes(position + 7) && playerOrderedMoves.includes(position + 14) && playerOrderedMoves.includes(position + 21)) || 
                (playerOrderedMoves.includes(position + 8) && playerOrderedMoves.includes(position + 16) && playerOrderedMoves.includes(position + 24))) {
                   console.log(`${player} one`)
                   this.won =  true;
                }
      })
   }
}

class view { 
   constructor() {
   }

    // generic create element function
    static createElement(tagName, children = [], classes = [], attributes = {}) {
        let newEl = document.createElement(tagName);
        for(let child of children){
            if(typeof(child) === "string"){
                child = document.createTextNode(child);
            }
            newEl.append(child);
        }
        for(let cls of classes){
            newEl.classList.add(cls);
        }
        for(let attr in attributes){
            newEl.setAttribute(attr, attributes[attr]);
        }
        return newEl
    }
    // render function
    render() {
        let id = -1;
        this.cells = Array(49).fill().map((cell) => {
            id ++;
            const cellDiv = view.createElement('div', [], ['board-cell'], {id: id});
            return cellDiv;
        })
        this.board = view.createElement('div', [...this.cells], ['main-board'], {});
        // this.cells.push(view.createElement('div', [], ['board-cell'], {}));
        document.getElementById('root').appendChild(this.board);
    }

    addToken(id, player) {
        const circle = view.createElement('div', [], [player], {});
        this.cells[Number(id)].appendChild(circle);
    }

}

class Controller {
    constructor() {
        this.view = new view;
        this.model = new model;
        this.currentPlayer = 'red';
    }
    
    // calls the dom build method from the view obkect
    run() {
       this.view.render();
       Array.from(this.view.cells).forEach(cell => {
           cell.addEventListener('click', (e) => {
               if(e.target.className !== "board-cell"){
                alert('illegal move');
                   return;
               }
              this.currentPlayer = this.model.playerPlayed(e.target.id);
              if (this.currentPlayer !== 'red' && this.currentPlayer !== 'blue') {
                  alert (this.currentPlayer);
                  return;
              }
              this.view.addToken(e.target.id, this.currentPlayer);
           })
       })
    }
}


const controller = new Controller;
controller.run();
