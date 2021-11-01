var _PAGE = './';
var _BANANA_INIT_POSY = -155;
var _GAME_DEBUG = false;
function get_attribute(classe, atributo)
{ 
	x = $('.'+classe).css(atributo);
	// se dimensoes, remover txt px
	if ( x.indexOf('px') != -1 ){
		var n = x.replace('px', '');
		return parseInt(n);
	}else{
		return x;
	}
}
function set_attribute(classe, atributo, valor)
{
	$('.'+classe).css(atributo, valor);
}
function hide(elID)
{
	$('#'+elID).hide();
}
function show(elID)
{
	$('#'+elID).show();
}
var ws = {
	set : function(k, v) { 
		localStorage.setItem(k,v);
	},
	get : function(k) { 
		return localStorage.getItem(k) || null;
	},
	size : function() { 
		return localStorage.length || 0;
	},
	clear : function() { 
		for ( a in localStorage ) { ws.set(a, null); }
		localStorage.clear();
	}
}

