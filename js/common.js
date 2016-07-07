var canvasWidth = 500; // ��z�̒���
var canvasHeight = 300; // ��z�̕�
var pLong = 20; // �s�N�Z���̒���
var p1key = 4;
var p2key = 2;
var speed = 500;

$(window).keydown(function(event){
	if(event.which == "38"){
		// up�L�[
		p2key = 1;
	} else if(event.which == "40"){
		// down�L�[
		p2key = 3;
	} else if(event.which == "37"){
		// left�L�[
		p2key = 2;
	} else if(event.which == "39"){
		// right�L�[
		p2key = 4;
	}
	
	
	if(event.which == "87"){
		// up�L�[
		p1key = 1;
	} else if(event.which == "83"){
		// down�L�[
		p1key = 3;
	} else if(event.which == "65"){
		// left�L�[
		p1key = 2;
	} else if(event.which == "68"){
		// right�L�[
		p1key = 4;
	}
});

$(document).ready(function(){
	init();
});

function init(){
	$("#showDiv").hide();
	$("#p1scoreDiv").hide();
	$("#p1score").html("0");
	$("#p2scoreDiv").hide();
	$("#p2score").html("0");
}

// Canvas������
function prepareCanvas()
{
    // Canvas������
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
	
	// �w�i������
	initBackground();
}

function start(p){
	init();
	$(".startBtn").hide();
	$("#canvasDiv").html("");
	
	showTime();
	setTimeout("startNewGame("+p+")",4000);
	
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
	p1key = 4;
	p2key = 2;
}

function startNewGame(p){
	if(p == "1"){
		$("#p1scoreDiv").show();
	} else if (p == "2"){
		$("#p1scoreDiv").show();
		$("#p2scoreDiv").show();
	}

	var newgame = new Game(p);
	newgame.CreateFood();
	newgame.Start();
}

// �����_�������쐬
function getRandom(n){
	return Math.floor(Math.random()*n)
}

// �w�i������
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
		$("#p1scoreDiv").parent().removeClass();
		$("#p1scoreDiv").parent().addClass("col-sm-offset-2 col-sm-2");
		$("#p2scoreDiv").parent().removeClass();
		$("#p2scoreDiv").parent().addClass("col-sm-2");
		$(".jumbotron").css("height",(canvasHeight+60)+'px');
	} else if (size == 2){
		canvasWidth = 800;
		canvasHeight = 500;
		$("#p1scoreDiv").parent().removeClass();
		$("#p1scoreDiv").parent().addClass("col-sm-offset-1 col-sm-2");
		$("#p2scoreDiv").parent().removeClass();
		$("#p2scoreDiv").parent().addClass("col-sm-2");
		$(".jumbotron").css("height",(canvasHeight+60)+'px');
	}
	
	$("#canvasDiv").css("width",(canvasWidth + 50) + 'px');
	$("#showSize").html(text);
}