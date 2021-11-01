var macaco = {
	height: get_attribute('macaco', 'height'),
	width: get_attribute('macaco', 'width'),
	posX: get_attribute('macaco', 'left'),
	img_pos1:'0px 0px',
	img_pos2:'-150px 0px',
	img_pos:'',
	velocidade:0,
	pontos: 0,	
	acertos:0,
	limite:0,
	update: function(direction){
		switch ( direction ){
			case 'left':
				if ( macaco.posX <= 0 ){
					macaco.posX = 0;
				}else{
					macaco.posX -= macaco.velocidade;
				}
				macaco.img_pos = macaco.img_pos1;
			break;
			case 'right':
				if ( macaco.posX >= macaco.limite ){
					macaco.posX = macaco.limite;
				}else{
					macaco.posX += macaco.velocidade;
				}
				macaco.img_pos = macaco.img_pos2;
			break;
		}
		set_attribute('macaco', 'left', macaco.posX);		
		set_attribute('macaco', 'background-position', macaco.img_pos);
	},
};