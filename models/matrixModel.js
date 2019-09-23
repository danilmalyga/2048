function MatrixModel() {
  PubSub.call(this);
  this.grid = JSON.parse(localStorage.getItem('matrix')) || [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
  ];

  //Singleton
  var instance = this;
  MatrixModel = function() {
    return instance;
  };
  this.showInitialCells();
}

MatrixModel.prototype = Object.create(PubSub.prototype);
MatrixModel.prototype.constructor = MatrixModel;

MatrixModel.prototype.showInitialCells = function() {
  if (
    this.grid.flat().every(function(elem) {
      return elem === '';
    })
  ) {
    this.grid[this.getRandowCellNumber()][this.getRandowCellNumber()] = this.getRandowCellValue();
    this.transformArrayToMatrix(this.showRandomCellExceptExisting(this.grid));
  }
};

MatrixModel.prototype.transformArrayToMatrix = function(array) {
  var matrix = [];
  for (var i = 0; i < array.length; i += 4) {
    matrix.push(array.slice(i, i + 4));
  }

  this.grid = matrix;
  localStorage.setItem('matrix', JSON.stringify(this.grid));
  return this.grid;
};

MatrixModel.prototype.startNewGame = function() {
  localStorage.removeItem('matrix');
  this.plusScore = 0;
  this.grid = [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']];
  this.showInitialCells();
  this.publish('changeData');
};

MatrixModel.prototype.showRandomCellExceptExisting = function(grid) {
  var flattenArray = grid.flat(),
    arrayOfEmptyCells = [],
    x;
  for (x = 0; x < flattenArray.length; x += 1) {
    if (flattenArray[x] === '') {
      arrayOfEmptyCells.push(x);
    }
  }
  flattenArray[
    arrayOfEmptyCells[Math.round(Math.random() * (arrayOfEmptyCells.length - 1))]
  ] = this.getRandowCellValue();

  return flattenArray;
};

MatrixModel.prototype.getRandowCellNumber = function() {
  return Math.floor(Math.random() * 4);
};

MatrixModel.prototype.getRandowCellValue = function() {
  return Math.random() < 0.8 ? '2' : '4';
};

MatrixModel.prototype.displayActionResult = function(key) {
  this.plusScore = 0;
  var matchGrid = this.grid.flat().toString();
  if (key === 'left' || key === 'right') {
    this.turnLeftOrRight(key);
  } else {
    this.turnUpOrDown(key);
  }
  if (this.grid.flat().toString() !== matchGrid) {
    this.transformArrayToMatrix(this.showRandomCellExceptExisting(this.grid));
  }

  if (this.filterFromEmptyCells(this.grid.flat()).length === 16) {
    if (this.didWeEnd()) {
      console.log('Game Over');
    }
  }
  this.publish('changeData');

  return this.plusScore;
};

MatrixModel.prototype.didWeEnd = function() {
  for (x = 0; x < this.grid.length; x += 1) {
    for (y = 0; y < this.grid[x].length; y += 1) {
      if (this.grid[x][y] === this.grid[x][y + 1]) {
        //console.log('we believe in you');
        return;
      }
    }
  }
  var t = this.grid;
  t = this.transposingMatrix(); //this.grid
  for (x = 0; x < t.length; x += 1) {
    for (y = 0; y < t[x].length; y += 1) {
      if (t[x][y] === t[x][y + 1]) {
        //console.log('we believe in you');
        return;
      }
    }
  }
  return 8402;
};

MatrixModel.prototype.filterFromEmptyCells = function(row) {
  return row.filter(function(elem) {
    if (elem) {
      return elem;
    }
  });
};

MatrixModel.prototype.calculateCellsValues = function(arrayOfNumbers) {
  var t,
    size = arrayOfNumbers.length;
  for (t = 0; t < size; t += 1) {
    if (+arrayOfNumbers[t] === +arrayOfNumbers[t + 1]) {
      //делаем проверку и если соседние одинаковы
      this.plusScore += +arrayOfNumbers[t] + +arrayOfNumbers[t + 1];
      arrayOfNumbers[t] = String(+arrayOfNumbers[t] + +arrayOfNumbers[t + 1]); //результат сложения записываем в первую ячейку
      arrayOfNumbers.splice(t + 1, 1); //а вторую - обрезаем
    }
  }
  return arrayOfNumbers;
};

MatrixModel.prototype.formFullRow = function(newArr) {
  var z,
    q,
    newArrSize = newArr.length;
  for (z = 0; z < newArrSize; z += 1) {
    //how much empty cell we need
    var size = this.grid[z].length - newArr[z].length;
    for (q = 0; q < size; q += 1) {
      newArr[z].push(''); //добавляем пустые ячейки
    }
  }
  return newArr;
};

MatrixModel.prototype.filterByEmptyCellsAndCalculate = function(grid, direction) {
  var i,
    newArr = [],
    arrayStringOfNewMatrix;
  for (i = 0; i < grid.length; i += 1) {
    arrayStringOfNewMatrix = this.filterFromEmptyCells(
      direction === 'left' ? grid[i] : direction === 'up' ? grid[i] : grid[i].reverse()
    ); //отфильтровали от путых ячеек
    newArr.push(this.calculateCellsValues(this.filterFromEmptyCells(grid[i]))); //результат в новый массив
  }
  return newArr;
};

MatrixModel.prototype.turnLeftOrRight = function(key) {
  var r,
    size = this.grid.length;
  this.grid = this.formFullRow(this.filterByEmptyCellsAndCalculate(this.grid, key));

  if (key === 'right') {
    for (r = 0; r < size; r += 1) {
      this.grid[r].reverse();
    }
  }

  this.publish('changeData');

  return this.grid;
};

MatrixModel.prototype.turnUpOrDown = function(key) {
  this.grid = this.transposingMatrix();
  var r,
    size = this.grid.length;
  this.grid = this.formFullRow(this.filterByEmptyCellsAndCalculate(this.grid, key));
  if (key === 'down') {
    for (r = 0; r < size; r += 1) {
      this.grid[r].reverse();
    }
  }
  this.grid = this.transposingMatrix();
  this.publish('changeData');
  return this.grid;
};

MatrixModel.prototype.transposingMatrix = function() {
  var newTransformArray = [];
  for (var x = 0; x < this.grid.length; x += 1) {
    for (var y = 0; y < this.grid[x].length; y += 1) {
      newTransformArray.push(this.grid[y][x]); //каждый столбец переписываем в строку
    }
  }
  var newMatrixTransform = [];
  for (i = 0; i < newTransformArray.length; i += 4) {
    newMatrixTransform.push(newTransformArray.slice(i, i + 4)); //из строки по 4 эллемента нарезаем матрицу
  }
  return newMatrixTransform;
};
// разбить вспомогательные фунцкии вынести в utils
//function expretion //  function declaration
//запрос http
//принципы ООП
// все повторить
//core, замыкания, ивент луп, API - свободное время, алгоритмы и структуры данных - на свободное время.
