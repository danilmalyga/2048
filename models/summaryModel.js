function SummaryModel() {
  PubSub.call(this);
  this.attributes = {
    totalScore: JSON.parse(localStorage.getItem('score')) || 0,
    bestScore: JSON.parse(localStorage.getItem('best')) || 0,
  };
  var instance = this;
  SummaryModel = function() {
    return instance;
  };
}

SummaryModel.prototype = Object.create(PubSub.prototype);
SummaryModel.prototype.constructor = SummaryModel;

SummaryModel.prototype.reset = function() {
  localStorage.removeItem('score');
  this.attributes.totalScore = 0;
  this.publish('changeData');
};

SummaryModel.prototype.countTotalScore = function(totalScore) {
  this.attributes.totalScore += totalScore;
  localStorage.setItem('score', JSON.stringify(this.attributes.totalScore));
  this.publish('changeData');
};

SummaryModel.prototype.countBestScore = function() {
  if (this.attributes.bestScore > this.attributes.totalScore) {
    this.attributes.bestScore = JSON.parse(localStorage.getItem('best'));
  } else {
    this.attributes.bestScore = this.attributes.totalScore;
  }

  localStorage.setItem('best', JSON.stringify(this.attributes.bestScore));
  this.publish('changeData');
};
