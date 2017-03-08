// Game logic
function Game2048 () {
  this.board = [
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null]
  ];

  this.score = 0;
  this.won   = false;
  this.lost  = false;

  this._generateTile();
  this._generateTile();
}

// Private method to generate tile
Game2048.prototype._generateTile = function () {
  // Gives 80% chance of being 2 and 20% chance of being 4
  var initialValue = (Math.random() < 0.8) ? 2 : 4;
  var emptyTile = this._getAvailablePosition();

  if (emptyTile) {
    this.board[emptyTile.x][emptyTile.y] = initialValue;
  }
};

// Private method to get a random available position
Game2048.prototype._getAvailablePosition = function () {
  var emptyTiles = [];
//                             v each row  v the row index
  this.board.forEach(function(row, rowIndex){
//                       v each elem  v elem index
    row.forEach(function(elem, colIndex){
      if (!elem) emptyTiles.push({ x: rowIndex, y: colIndex });
    });   // ^^ if null push this object ^ of 'coords' into emptyTiles var
  });

  if (emptyTiles.length === 0)
    return false;

  var randomPosition = Math.floor(Math.random() * emptyTiles.length);
  return emptyTiles[randomPosition];
};

// Private method to render board. Basically logs the board and the score
Game2048.prototype._renderBoard = function () {
  this.board.forEach(function(row){ console.log(row); });
  console.log('Score: ' + this.score);
};


// Private method that "rotates" the board in order to move up and down
Game2048.prototype._transposeMatrix = function () {
  for (var row = 0; row < this.board.length; row++) {
    for (var column = row+1; column < this.board.length; column++) {
      var temp = this.board[row][column];
      this.board[row][column] = this.board[column][row];
      this.board[column][row] = temp;
    }
  }
};


/* -------MOVING THE TILES------- */

// Moves tiles left
Game2048.prototype._moveLeft = function () {
  var newBoard = [];
  var that = this;
  // ^^ keeps 'this' as 'Game2048' instead of 'Window' which 'this' would be if you used 'this' inside of a function.
  var boardChanged = false;

  this.board.forEach (function (row) {
    var newRow = row.filter(function (i) {
      return i !== null;
    });

    for(i = 0; i < newRow.length - 1; i++) {
      if (newRow[i+1] === newRow[i]) {
        newRow[i]   = newRow[i] * 2;
        newRow[i+1] = null;

        that._updateScore(newRow[i]);
        // adds w/e was added together to the score
        // if you used 'this' it would be 'Window' here instead of 'Game2048'
      }
    }

    var merged = newRow.filter(function (i) {
      return i !== null;
    });

    while(merged.length < 4) {
      merged.push(null);
    }

    if (newRow.length !== row.length)
      boardChanged = true;

    newBoard.push(merged);
  });

  this.board = newBoard;
  return boardChanged;
};

// Move tiles Right
Game2048.prototype._moveRight = function () {
  var newBoard = [];
  var that = this;
  var boardChanged = false;

  this.board.forEach (function (row) {
    var newRow = row.filter(function (i) {
      return i !== null;
    });

    for (i=newRow.length - 1; i>0; i--) {
      if (newRow[i-1] === newRow[i]) {
        newRow[i]   = newRow[i] * 2;
        newRow[i-1] = null;
        that._updateScore(newRow[i]);
      }
    }

    var merged = newRow.filter(function (i) {
      return i !== null;
    });

    while(merged.length < 4) {
      merged.unshift(null);
    }

    if (newRow.length !== row.length)
      boardChanged = true;

    newBoard.push(merged);
  });

  this.board = newBoard;
  return boardChanged;
};

// Moves tiles up
Game2048.prototype._moveUp = function () {
  this._transposeMatrix();
  var boardChanged = this._moveLeft();
  this._transposeMatrix();
  return boardChanged;
};

// Moves tiles down
Game2048.prototype._moveDown = function () {
  this._transposeMatrix();
  var boardChanged = this._moveRight();
  this._transposeMatrix();
  return boardChanged;
};

Game2048.prototype.move = function (direction) {
  ion.sound.play("snap");
  if (!this._gameFinished()) {
    switch (direction) {
      case "up":    boardChanged = this._moveUp();    break;
      case "down":  boardChanged = this._moveDown();  break;
      case "left":  boardChanged = this._moveLeft();  break;
      case "right": boardChanged = this._moveRight(); break;
    }

    if (boardChanged) {
      this._generateTile();
      this._isGameLost();
    }
  }
};

Game2048.prototype._updateScore = function (value) {
  this.score += value;
};

Game2048.prototype._gameFinished = function(){
  return this.lost;
};

Game2048.prototype._isGameLost = function () {
  if (this._getAvailablePosition())
    return;

  var that   = this;
  var isLost = true;

  this.board.forEach(function (row, rowIndex) {
    row.forEach(function (cell, cellIndex) {
      var current = that.board[rowIndex][cellIndex];
      var top, bottom, left, right;

      if (that.board[rowIndex][cellIndex - 1]) {
        left  = that.board[rowIndex][cellIndex - 1];
      }
      if (that.board[rowIndex][cellIndex + 1]) {
        right = that.board[rowIndex][cellIndex + 1];
      }
      if (that.board[rowIndex - 1]) {
        top    = that.board[rowIndex - 1][cellIndex];
      }
      if (that.board[rowIndex + 1]) {
        bottom = that.board[rowIndex + 1][cellIndex];
      }

      if (current === top || current === bottom || current === left || current === right)
        isLost = false;
    });
  });

  this.lost = isLost;
};




// // Interraction Logic
// $(document).ready(function(){
//   var game = new Game2048();
//   game._renderBoard();
// });
