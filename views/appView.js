function AppView() {
  var matrixView = new MatrixView(); //new instance of class
  var summaryView = new SummaryView(); //new instance of class

  this.render = function(selector) {
    var element = document.getElementById(selector);
    summaryView.show(element);
    matrixView.show(element);
  };
}

var appView = new AppView(); //the bith our app 🎈🎂
appView.render('root');
