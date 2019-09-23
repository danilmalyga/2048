function MatrixView() {
  this.matrixModel = new MatrixModel();
  this.controller = new Controller();
  this.template = document.getElementById('matrixTemplate').innerHTML;
  this.className = 'table';
  // this.newGameButton = document.getElementById('newGameBtn');
  BaseView.call(this);
}

MatrixView.prototype = Object.create(BaseView.prototype);
MatrixView.prototype.constructor = MatrixView;

MatrixView.prototype.beforeRender = function() {
  this.matrixModel.subscribe('changeData', this.reRender, this);
};

MatrixView.prototype.render = function() {
  var i,
    j,
    size = this.matrixModel.grid.length,
    str = '';
  for (i = 0; i < size; i += 1) {
    str += '<div class = "row">';
    for (j = 0; j < this.matrixModel.grid[i].length; j += 1) {
      str +=
        '<div class = "cell appear-' +
        this.matrixModel.grid[i][j] +
        ' ">' +
        this.matrixModel.grid[i][j] +
        '</div>';
    }
    str += '</div>';
  }

  return this.template.replace('{{ matrix }}', str);
};

MatrixView.prototype.afterRender = function() {
  window.onkeydown = this.controller.onKeyPress.bind(this.controller); // processes keydown event in controller context
  var self = this.controller;

  window.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
      self.onClickNewGame.call(self);
    }
  });
};
