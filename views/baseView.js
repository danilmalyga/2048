function BaseView() {
  this.rootElement = document.createElement('div'); //create only element div
}
//1.Inintial Render Phase
//Facade Pattern
BaseView.prototype.show = function(element) {
  //facade method
  this.beforeRender();
  this.rootElement.innerHTML = this.render(); // this.render pass in rootElement in innerHTML
  this.rootElement.classList.add(this.className);
  element.appendChild(this.rootElement); /////////////////////////////for what?
  this.afterRender();
};
BaseView.prototype.render = function() {
  throw new Error('Need to override render method');
};

//  2. Update Phase

BaseView.prototype.beforeUpdate = function() {};

BaseView.prototype.reRender = function() {
  this.beforeUpdate();
  this.rootElement.innerHTML = this.render();
  this.afterUpdate();
};

BaseView.prototype.beforeRender = function() {};
BaseView.prototype.afterRender = function() {};
BaseView.prototype.afterUpdate = function() {};
