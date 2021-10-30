class model {
   constructor() {
     this.playerCount = 1;
     this.bluePlayerMoves = [];
     this.redPlayerMoves = [];
     this.rows = {};
     this.won = false;
   }

   playerPlayed(rowNum, rowsArrays) {
        const currentTokenLocation = this.checkForToken(rowNum, rowsArrays);
         if (this.playerCount % 2 === 0) {
           this.bluePlayerMoves.push(Number(currentTokenLocation));
           this.checkForWin('bluePlayerMoves');
           if (this.won) {
               return {color: 'blue', location: currentTokenLocation, celebration: 'blue Player won'};
           }
           return {color: 'blue', location: currentTokenLocation};
        }
        if (this.playerCount % 2 !== 0) {
            this.redPlayerMoves.push(Number(currentTokenLocation));
            this.checkForWin('redPlayerMoves');
            if (this.won) {
                return {color: 'red', location: currentTokenLocation, celebration: 'red Player won'}
            }
            return {color: 'red', location: currentTokenLocation};
        }
   }

   checkForWin(player) {
      const playerOrderedMoves =  this[player].sort((a, b) => a - b);
      playerOrderedMoves.forEach(position => {
          if ((playerOrderedMoves.includes(position + 1) && playerOrderedMoves.includes(position + 2) && playerOrderedMoves.includes(position + 3)) ||
                (playerOrderedMoves.includes(position + 7) && playerOrderedMoves.includes(position + 14) && playerOrderedMoves.includes(position + 21)) || 
                (playerOrderedMoves.includes(position + 8) && playerOrderedMoves.includes(position + 16) && playerOrderedMoves.includes(position + 24)) ||
                (playerOrderedMoves.includes(position + 6) && playerOrderedMoves.includes(position + 12) && playerOrderedMoves.includes(position + 18))) {
                   console.log(`${player} one`)
                   this.won =  true;
                }
      })
   }

   checkForToken(rowNum, rowsArrays) {
       console.log(rowsArrays);
       // const currentRowArray = rowsArrays[rowNum[0].toString()];
       if (!this.rows[rowNum]) {
           this.rows[rowNum] = 1;
       } else {
        this.rows[rowNum] += 1;
       }
       this.playerCount ++;
       const currentRowArray = rowsArrays[rowNum[0].toString()];
       return  currentRowArray[currentRowArray.length - this.rows[rowNum]]; 
    }
}

class view { 
   constructor() {
       this.rows = {};
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
        let row = -1;
        this.cells = Array(49).fill().map((cell) => {
            id ++;
            row ++;
            if (row % 7 === 0) {
               row = 0;
            }
            if (!this.rows[row]) {
                this.rows[row] = [id];
            } else {
                this.rows[row].push(id);
            }
            const cellDiv = view.createElement('div', [], ['board-cell'], {id: id, 'data-row': row});
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



    // check if row is has a token in it or not, for deciding where to place the new token

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
               // logically adding the player's token in the model class
               this.currentPlayer = this.model.playerPlayed(e.target.getAttribute('data-row'), this.view.rows);
               // adding the player's token visually
               this.view.addToken(this.currentPlayer['location'], this.currentPlayer['color']);
              // player validator
              if (this.currentPlayer['celebration']) {
                  alert (this.currentPlayer['celebration']);
                  return;
              }
           })
       })
    }
}


const controller = new Controller;
controller.run();
