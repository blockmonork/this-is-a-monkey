var banana = {
	posX: get_attribute('banana', 'right'),
	posY: get_attribute('banana', 'top'),
	velocidade:0,
	width:get_attribute('banana', 'width'),
	height:get_attribute('banana', 'height'),
	hide: function(){
		hide('banana');
		set_attribute('banana', 'top', _BANANA_INIT_POSY);
		set_attribute('banana', 'left', banana.get_x());
	},
	show: function(){
		show('banana');
		hide('bang');
	},
	get_x: function(){
		x = Math.random() * theCanvas.width;
		if ( x <= 0 ) { x *= -1; }
		if ( x > parseInt(theCanvas.width-banana.width) ) { x = parseInt(theCanvas.width-banana.width); }
		return x;
	},
	update: function(){
		banana.posX = get_attribute('banana', 'left');
		banana.posY = get_attribute('banana', 'top');
		y = parseInt(banana.posY+(banana.height+(banana.height/2)));
		if( y <= theCanvas.height ){
			banana.posY += banana.velocidade; 
		}else{ 
			banana.posY = _BANANA_INIT_POSY;
			banana.posX = banana.get_x(); 
			game.pontoUser = false;
			game.pontoJogo = false;
		}
		banana.show();
		return true;
	},
};