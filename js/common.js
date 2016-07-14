var canvasWidth = 500; // 画布の長さ
var canvasHeight = 300; // 画布の幅
var pLong = 20; // ピクセルの長さ
var speed = 100;
var model = 1;  // 1:一人モード  2:二人バトルモード
var wall = true;
var doubleFood = 0;

$(document).ready(function(){
	init();
});

function init(){
	$("#showDiv").hide();
	$("#p1block").hide();
	$("#p1score").html("0");
	$("#p2block").hide();
	$("#p2score").html("0");
}

function initModel1(){
	$("#p1block").show();
	$("#p1statusDiv span").each(function(){
		$(this).hide();
	});
}

function initModel2(){
	$("#p1block").show();
	$("#p2block").show();
	
	$("#p1statusDiv span").each(function(e){
		$(this).hide();
	});
	
	$("#p2statusDiv span").each(function(e){
		$(this).hide();
	});
}


// Canvas初期化
function prepareCanvas()
{
    // Canvas初期化
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");
	
	// 背景初期化
	initBackground();
}

function start(m){
	init();
	model = m;
	$(".startBtn").hide();
	$("#canvasDiv").html("");
	
	showTime();
	setTimeout("startNewGame()",4000);
}

function showTime(){
	$("#showDiv").fadeIn();
	$("#showDiv").html("3");
	setTimeout("$('#showDiv').html('2');",1000);
	setTimeout("$('#showDiv').html('1');",2000);
	setTimeout("$('#showDiv').fadeOut();",3000);
	prepareCanvas();
}

function showResult(ret){
	$("#showDiv").html(ret);
	$("#showDiv").fadeIn(1000);
	setTimeout("$('.startBtn').show();",1000);
}

function startNewGame(p){
	if(model == 1){
		initModel1();
	} else if (model == 2){
		initModel2();
	}

	var newgame = new Game();
	newgame.CreateFood();
	newgame.Start();
}

// ランダム整数作成 範囲[0,n)
function getRandom(n){
	return Math.floor(Math.random()*n);
}

// 背景初期化
function initBackground(){
	for(var i = 0; i <= canvasWidth/pLong; i++){
		context.beginPath();
		context.strokeStyle="#000000";
		context.moveTo(i*pLong,0);
		context.lineTo(i*pLong,canvasHeight);
		context.moveTo(0,i*pLong);
		context.lineTo(canvasWidth,i*pLong);
		context.stroke();
	}
}

function setWall(wa, text){
	wall = wa;
	$("#showWall").html(text);
}

function setSpeed(spd, text){
	speed = spd;
	$("#showSpd").html(text);
}

function setSize(size,text){
	init();
	$("#canvasDiv").html('<img src="img/snakelogo.jpg" width="100%" class="img-rounded">');
	if(size == 1){
		canvasWidth = 500;
		canvasHeight = 300;
		$("#p1block").parent().removeClass();
		$("#p1block").parent().addClass("col-sm-offset-2 col-sm-2");
		$("#p2block").parent().removeClass();
		$("#p2block").parent().addClass("col-sm-2");
		$(".jumbotron").css("height",(canvasHeight+60)+'px');
	} else if (size == 2){
		canvasWidth = 800;
		canvasHeight = 500;
		$("#p1block").parent().removeClass();
		$("#p1block").parent().addClass("col-sm-offset-1 col-sm-2");
		$("#p2block").parent().removeClass();
		$("#p2block").parent().addClass("col-sm-2");
		$(".jumbotron").css("height",(canvasHeight+60)+'px');
	}
	
	$("#canvasDiv").css("width",(canvasWidth + 50) + 'px');
	$("#showSize").html(text);
}