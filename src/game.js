// --- inits
$(document).ready(function(){
	$('#popup_close').click(function(){
		$('#popup').hide();
	});
	screen_options();
	$('#game_pause').click(function(e){
		e.preventDefault();
		$(this).text(game.pausa());
	});
	$('#play_again').click(function(e){
		e.preventDefault();
		playAgain();
	});
	$('#game_reset').click(function(e){
		e.preventDefault();
		gameReset();
	});
	$('body').gradient({
		direction:'45deg',
		colors:'white, #efefef'
	});
});

// --- game loop
/*
var __anim = new Animator();
var Jogo = __anim.add( theGamer, null, false );
*/
var __anim = 0;
// --- game funcs
var game = {
	initialized:false,
	frameRate:90,
	fase:1,
	pontosToNextLevel: 10,
	maxLevel: 10,
	pontoUser:false,
	pontoJogo:false,
	is_debug: false,
	is_paused:false,
	nextLevel:false,
	plSpeed: 1,
	level: ['Easy', 'Normal', 'Hard'],
	levelTxt:'',
	difficult: 0,
	checkLevel: function(){
		if ( macaco.pontos < 0 && !game.nextLevel ){
			game.fim();
		}
		if ( macaco.pontos == game.pontosToNextLevel ){
			//game.frameRate--;
			game.fase++,
			game.plSpeed++;
			banana.velocidade += game.plSpeed;
			if ( game.fase > 2 ){
				macaco.velocidade += game.plSpeed;
			}
			game.nextLevel = true;
			if ( game.fase == game.maxLevel ) { 
				game.fim(true); 
			}else{
				// --- limpa pontuação do macaco pra começar de novo (+bonus)
				macaco.pontos = game.fase-1;
			}
		}else{
			game.nextLevel = false;
		}
	},
	init: function(){
		game.frameRate = parseInt(game.frameRate/game.difficult);
		__anim = setInterval('theCanvas.update()', game.frameRate);
	},
	reinit: function(){
		__anim = setInterval('theCanvas.update()', game.frameRate);
	},
	pausa: function(){ 
		if ( !game.is_paused ){
			updateTela('<span style="font-size:44px;">Paused</span>');
			clearInterval(__anim);
			game.is_paused = true;
			x = 'Play';
		}else{
			game.is_paused = false;
			game.reinit();
			x = 'Pause';
		}
		return x;
	},	
	fim: function(){
		if ( game.initialized ){
			A = game.fim.arguments;
			win = A[0] || false;
			if ( win ){
				msg = '<br>CONGRATULATIONS! YOU WIN!';
			}else{
				msg = '<br>YOU LOOSE!';
			}
			clearInterval(__anim);
			telaEnd('Total Score: '+macaco.acertos+' Level: '+game.fase+msg);
		}
	},
};

var theCanvas = {
	width: get_attribute('canvas', 'width'),
	height:get_attribute('canvas', 'height'),
	update: function(){
		if ( banana.update() ){
			set_attribute('banana', 'top', banana.posY);
			set_attribute('banana', 'left', banana.posX);
		}
		theCanvas.hitTest();
		game.checkLevel();
		
		
		Tela = 'Level: '+game.fase + ' '+game.levelTxt+'<br>';
		Tela +='Score: Current: <b>' + macaco.pontos + '</b> | Total: <b>'+macaco.acertos+'</b><br>';
		Tela += 'Next Level: ' + game.pontosToNextLevel;
		
		if ( game.is_debug ){ 
			Tela += '<br>game.frameRate = ' + game.frameRate;
			Tela += '<br>macaco.velocidade = '+macaco.velocidade+', banana.velocidade = ' + banana.velocidade;
		}
		updateTela(Tela);
		if ( macaco.pontos != 0 ){
			game.initialized = true;
		}
		return true;
	},
	hitTest:function(){
		a = ( parseInt(banana.posX+banana.width) > parseInt(macaco.posX) ) ? true : false;
		b = ( parseInt(banana.posX+banana.width) <= parseInt(macaco.posX+macaco.width) ) ? true : false;
		c = ( parseInt(banana.posY+banana.height) >= parseInt(theCanvas.height - macaco.height ) ) ? true : false;
		if ( a && b && c ){
			if ( !game.pontoUser ){	
				banana.hide();
				hide('bang');
				macaco.pontos++;
				macaco.acertos++;
				game.pontoUser = true;
				game.pontoJogo = false;
			}
		}else{
			game.pontoUser = false;
			if ( c ){
				if ( !game.pontoJogo ){
					macaco.pontos--;
					game.pontoJogo = true;
					show('bang');
				}
				if ( game.pontoJogo ) {
					show('bang');
				}
			}
		}
	},
};
function theGamer()
{
	theCanvas.update();
}
function pausa()
{ 
	game.pausa(); 
}
function Bananas(lvl)
{
	// --- inicando objetos
	game.is_debug = _GAME_DEBUG;
	macaco.limite = parseInt( theCanvas.width - macaco.width );
	macaco.posX = parseInt((theCanvas.width/2)-(macaco.width/2));
	set_attribute('macaco', 'left', macaco.posX);
	
	bang_w = get_attribute('bang', 'width');
	bang_h = get_attribute('bang', 'height');
	set_attribute('bang', 'top', parseInt((theCanvas.height/2)-(bang_h/2)));
	set_attribute('bang', 'left', parseInt((theCanvas.width/2)-(bang_w/2)));
	

	banana.posX = parseInt((theCanvas.width/2)-(banana.width/2));
	banana.posY = _BANANA_INIT_POSY;
	set_attribute('banana', 'left', banana.posX);
	set_attribute('banana', 'top', banana.posY);

	// --- fase 1
	game.difficult = lvl;
	macaco.velocidade = (10*lvl);
	banana.velocidade = (5*lvl);
	game.levelTxt = game.level[lvl-1];

	
	/*if ( game.is_debug ){	
		macaco.pontos = 10000;
	}*/
	
	document.addEventListener('keydown', keyDown);
	game.init();
	
}
function keyDown(e)
{
	if ( game.is_paused ) return;
	switch (e.keyCode){
		case 37:
			macaco.update('left');
		break;
		case 39:
			macaco.update('right');
		break;
	}
}
function options_set(x)
{
	lvl = x || 1;
	if ( ws.get('LVL') == null ) {
		ws.set('LVL', lvl);
	}
	$('#popup').hide();
	Bananas(lvl);
}
function screen_options()
{
	if ( ws.get('LVL') == null ) {
		var txt = '<div class="screen_options"><select onchange="if ( this.value!=\'\' ) { options_set(this.value); } ">';
		txt += '<option value=""> --- Select Level --- </option>';
		txt += '<option value="1">Easy</option>';
		txt += '<option value="2">Normal</option>';
		txt += '<option value="3">Hard</option>';
		txt += '</select></div>';
		$('#popup').show();
		$('#popup_inner').html(txt);
	}else{
		options_set(ws.get('LVL'));
	}
}
function playAgain()
{
	window.location = _PAGE;
}
function gameReset()
{
	ws.clear();
	window.location = _PAGE;
}
function updateTela(txt)
{
	$('#menu_inner').html(txt);
}
function telaEnd(msg)
{
	$('#popup').show();
	$('#popup_inner').html(msg);
}

