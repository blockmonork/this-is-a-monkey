var _PAGE = 'bananas_v3.html';
function $(el) { var x = el.replace('#', ''); return document.getElementById(x); }
var __anim = new Animator();
var Jogo = __anim.add( theGamer, null, false );

var jogador = {
	altura: 231,
	largura: 303,
	posX: 0,
	velocidade:0,
	pontos: 0,	
	acertos:0,
	limite:0,
	img: new Image(),
	src: '_mac.png',
	update: function(direction){
		switch ( direction ){
			case 'left':
				if ( jogador.posX <= 0 ){
					jogador.posX = 0;
				}else{
					jogador.posX -= jogador.velocidade;
				}
			break;
			case 'right':
				if ( jogador.posX >= jogador.limite ){
					jogador.posX = jogador.limite;
				}else{
					jogador.posX += jogador.velocidade;
				}
			break;
		}
	},
};
var banana = {
	posX:0,
	posY:0,
	velocidade:0,
	largura:100,
	altura:54,
	img: new Image(),
	src: '_ban.png',
	update: function(){
		if(banana.posY <= theCanvas.height){
			banana.posY += banana.velocidade; 
		}else{ 
			banana.posY = -10;
			banana.posX = Math.random() * theCanvas.height;
			game.pontoUser = false;
			game.pontoJogo = false;
		}	
	},
};
var game = {
	initialized:false,
	frameRate:100,
	fase:1,
	pontosToNextLevel: 10,
	maxLevel: 10,
	pontoUser:false,
	pontoJogo:false,
	is_debug:true,
	nextLevel:false,
	plSpeed: 2,
	level: ['Easy', 'Normal', 'Hard'],
	levelTxt:'',
	difficult: 0,
	checkLevel: function(){
		if ( jogador.pontos < 0 && !game.nextLevel ){
			game.fim();
		}
		if ( jogador.pontos == game.pontosToNextLevel ){
			game.fase++,
			banana.velocidade +=2;
			game.plSpeed += parseInt( (jogador.acertos/10)+game.difficult );
			if ( game.fase > 2 ){
				game.plSpeed += game.fase;
			}
			jogador.velocidade += game.plSpeed;
			game.nextLevel = true;
			if ( game.fase == game.maxLevel ) { 
				game.fim(true); 
			}else{
				// --- limpa pontuação do jogador pra começar de novo
				jogador.pontos = 0;
			}
		}else{
			game.nextLevel = false;
		}
	},
	init: function(){
		__anim.start();
	},
	fim: function(){
		if ( game.initialized ){
			A = game.fim.arguments;
			win = A[0] || false;
			if ( win ){
				msg = ' YOU WIN!';
			}else{
				msg = ' YOU LOOSE!';
			}
			__anim.remove(Jogo);
			telaEnd('Total Score: '+jogador.pontos+' Level: '+game.fase+msg);
		}
	},
	pausa: function(){ 
		alert('game.pause');
		if ( __anim.isRunning() ){
			__anim.stop();
		}else{
			__anim.start();
		}
	}
};
var theCanvas = {
	id:'canvas',
	width:600,
	height:480,
	update: function(){
		x = 0;
		canvas = $('#canvas');
		context = canvas.getContext("2d");
		context.clearRect(0, 0, theCanvas.width, theCanvas.height); // --- limpa a tela
		// --- banana
		banana.img.onload = function() {
			context.drawImage(banana.img, banana.posX, banana.posY);
		},		
		banana.img.src = banana.src;
		// --- player
		/*jogador.img.onload = function() {
			context.drawImage(jogador.img, jogador.posX, jogador.posY);
		},		
		jogador.img.src = jogador.src;*/
		banana.update();
		theCanvas.hitTest();
		game.checkLevel();
		
		Tela = 'Difficult: '+game.levelTxt+' | Level: '+game.fase + '<br>';
		Tela +='Current score: <b>' + jogador.pontos + '</b> | Total score: <b>'+jogador.acertos+'</b><br>';
		Tela += '<small><i>to the next level: ' + game.pontosToNextLevel + '</i></small>';
		
		if ( game.is_debug ){ 
			Tela += '<br>jogador.limite = ' + jogador.limite + ' | jogador.posX = ' + jogador.posX; 
			Tela += '<br>banana.velocidade= '+banana.velocidade+' | jogador.velocidade = ' + jogador.velocidade;
		}
		
		atualizaTela(Tela);
		if ( jogador.pontos != 0 ){
			game.initialized = true;
		}
	},
	hitTest:function(){
		a = ( parseInt(banana.posX) > parseInt(jogador.posX) ) ? true : false;
		b = ( parseInt(banana.posX) <= parseInt(jogador.posX+jogador.largura) ) ? true : false;
		c = ( parseInt(banana.posY) >= parseInt(theCanvas.height - jogador.altura ) ) ? true : false;
		if ( a && b && c ){
			if ( !game.pontoUser ){	
				jogador.pontos++;
				jogador.acertos++;
				game.pontoUser = true;
				game.pontoJogo = false;
			}
		}else{
			game.pontoUser = false;
			if ( c ){
				if ( !game.pontoJogo ){
					jogador.pontos--;
					game.pontoJogo = true;
				}
			}
		}
	},
};
function theGamer(){theCanvas.update();}
function pausa(){ game.pausa(); }
function Bananas(lvl)
{
	// --- inicando objetos
	jogador.limite = parseInt( theCanvas.width - jogador.largura );
	jogador.posX = (theCanvas.width-jogador.largura)/2;

	banana.posX = theCanvas.width/2;
	banana.posY = -10

	// --- fase 1
	jogador.velocidade = 20;
	banana.velocidade = 5 + (5 * (lvl/10));
	game.levelTxt = game.level[lvl-1];
	game.difficult = lvl;
	
	document.addEventListener('keydown', keyDown);
	game.init();
}
function keyDown(e)
{
	switch (e.keyCode){
		case 37:
			jogador.update('left');
		break;
		case 39:
			jogador.update('right');
		break;
	}
}
function options_set(x)
{
	lvl = x || 1;
	if ( ws.get('LVL') == null ) {
		ws.set('LVL', lvl);
	}
	var C = '<canvas id="canvas" width="600" height="480">Navegador não suporta HTML5</canvas>';
	$('#container').innerHTML = C;
	Bananas(lvl);
}
function screen_options()
{
	if ( ws.get('LVL') == null ) {
		var txt = '<select onchange="if ( this.value!=\'\' ) { options_set(this.value); } ">';
		txt += '<option value="">Select Difficult Level</option>';
		txt += '<option value="1">Easy</option>';
		txt += '<option value="2">Normal</option>';
		txt += '<option value="3">Hard</option>';
		txt += '</select>';
		$('#container').innerHTML = txt;
	}else{
		options_set(ws.get('LVL'));
	}
}
function play_again()
{
	window.location = _PAGE;
}
function game_reset()
{
	ws.clear();
	window.location = _PAGE;
}
function atualizaTela(txt)
{
	var T = txt;
	// To-DO T += '&nbsp; <a href="#" onclick="pausa();">Pause</a>';
	T += '&nbsp; <a href="#" onclick="play_again();">Play Again</a>';
	T += '&nbsp; <a href="#" onclick="game_reset()">Reset</a>';
	$('#tela').innerHTML = T;
}
function closePP() { $('#popup').style.display='none'; }
function telaEnd(msg)
{
	$('#popup').style.display='block';
	$('#popup').innerHTML = msg + '<br><span class="mouse" onclick="closePP();">&times;</span>';
}
window.load=screen_options();
/*
var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');
      var imageObj = new Image();

      imageObj.onload = function() {
        context.drawImage(imageObj, 69, 50);
      };
      imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
*/