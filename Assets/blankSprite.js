(function(window) {
Symbol_1 = function() {
	this.initialize();
}
Symbol_1._SpriteSheet = new SpriteSheet({images: ["blankSprite.png"], frames: [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]});
var Symbol_1_p = Symbol_1.prototype = new BitmapAnimation();
Symbol_1_p.BitmapAnimation_initialize = Symbol_1_p.initialize;
Symbol_1_p.initialize = function() {
	this.BitmapAnimation_initialize(Symbol_1._SpriteSheet);
	this.paused = false;
}
window.Symbol_1 = Symbol_1;
}(window));

