function Game(player){
	this.self = this;
	this.p1 = null;
	this.p2 = null;
	
	if(player == 1){
		this.p1 = new Snake(canvasWidth/5,canvasHeight/5);
	} else if(player == 2){
		this.p1 = new Snake(canvasWidth/5,canvasHeight/5);
		this.p2 = new Snake(canvasWidth*4/5,canvasHeight*4/5);
		
	}
	
	this.food = new Object();
	this.get = function(){return this.Process(self);}
	this.innervalID = null;
	this.ret = null;
}

Game.process = function(o){
	status = o.get();
}

Game.prototype.Start = function(){
	var self = this;
	this.innervalID = setInterval(function(){Game.process(self)},speed);
}

Game.prototype.Process = function(){
	if(this.p2 != null) {
		var selfP1 = this.p1;
		var selfP2 = this.p2;
		
		if(Math.abs(selfP1.control - p1key) != 2){
			selfP1.control = p1key;
		}
		
		if(Math.abs(selfP2.control - p2key) != 2){
			selfP2.control = p2key;
		}
		
		// ŽÖˆÚ“®
		selfP1.Move(this.food);
		selfP2.Move(this.food);

		
		// ¶‚«‚é‚©‚Ì”»’f
		var p1Dead = selfP1.isDead(selfP2.body);
		var p2Dead = selfP2.isDead(selfP1.body);
		
		// ‹ò‚Á‚Ä‚é‚©‚¢H
		if(selfP1.eat || selfP2.eat){
			this.CreateFood();
		}
		
		// ŽÖ‚ð•`‰æ
		this.Draw();
		
		// ScoreXV
		$("#p1score").html(this.p1.score);
		$("#p2score").html(this.p2.score);
		
		// Œ‹‰Ê”»’è‚Æ•\Ž¦
		this.BattleResult(p1Dead, p2Dead);
		
	} else {
		var selfP1 = this.p1;
		
		if(Math.abs(selfP1.control - p1key) != 2 && selfP1.control != p1key){
			selfP1.control = p1key;
		}
		
		selfP1.Move(this.food);
		
		var p1Dead = selfP1.isDead(null);
		
		// ‹ò‚Á‚Ä‚é‚©‚¢H
		if(selfP1.eat){
			this.CreateFood();
		}
		
		// ŽÖ‚ð•`‰æ
		this.Draw();
		
		// ScoreXV
		/*$("#p1score").html(this.p1.score);
		if(this.p1.score == 2){
			speed = speed*0.8;
			clearInterval(this.innervalID);
			this.Start();
		}*/
		
		// Œ‹‰Ê”»’è‚Æ•\Ž¦
		this.SingleResult(p1Dead);
	}
}

Game.prototype.BattleResult = function(p1Dead, p2Dead){
	if(p1Dead || p2Dead){
		if(p1Dead && p2Dead){
			if(selfP1.body.length > selfP2.body.length){
				this.ret = "P1 WIN!";
			} else if(selfP1.body.length < selfP2.body.length){
				this.ret = "P2 WIN!";
			} else {
				this.ret = "DRAW!";
			}
		} else if(p1Dead){
			this.ret = "P2 WIN!";
		} else if(p2Dead){
			this.ret = "P1 WIN!";
		}
		
		showResult(this.ret);
		clearInterval(this.innervalID);
	}
}

Game.prototype.SingleResult = function(p1Dead){
	if(p1Dead){
		this.ret = "GAME OVER";
		showResult(this.ret,this);
		clearInterval(this.innervalID);
	}
}

Game.prototype.CreateFood = function(){
	this.food.x = getRandom(canvasWidth/pLong)*pLong;
	this.food.y = getRandom(canvasHeight/pLong)*pLong;
	
	if(this.Check()){
		this.CreateFood();
	} else {
		this.DrawFood();
	}
}

Game.prototype.Check = function(){
	for(var i = 0; i < this.p1.body.length; i++) {
		if (this.food.x == this.p1.body[i].x 
		 && this.food.y == this.p1.body[i].y) {
		 	return true;
		}
	}
	
	if(this.p2 != null){
		for(var i = 0; i < this.p2.body.length; i++) {
			if (this.food.x == this.p2.body[i].x 
			 && this.food.y == this.p2.body[i].y) {
			 	return true;
			}
		}
	}
	
	return false;
}

Game.prototype.DrawFood = function(){
	context.fillStyle="green";
	context.fillRect(this.food.x+1, this.food.y+1, pLong-2, pLong-2);
}

// ŽÖÄ•`‰æ
Game.prototype.Draw = function(){
	if(this.p1 != null){
		var selfP1 = this.p1;
		selfP1.Draw("blue");
	}
	if(this.p2 != null){
		var selfP2 = this.p2;
		selfP2.Draw("red");
	}
}

function Snake(x,y,control){
	this.self = this;
	this.head = new Object();
	this.head.x = x;
	this.head.y = y;

	this.body = new Array();
	this.body.push(this.head);
	this.tail = new Object();
	this.eat = false;
	this.control = control;
	this.score = 0;
}

// ŽÖ‚Ìbody,head,tail‚ðXV‚·‚é
Snake.prototype.Move = function (food){
	// “ª‚ÌVÀ•W‚ðŽæ“¾
	this.GetHeadPos();
	
	// ‹ò‚Á‚Ä‚éH
	if(this.isAte(food)){
		// ‹ò‚Á‚½
	} else {
		// ‹ò‚Á‚Ä‚È‚¢
		// K”ö‚ðØ‚é
		this.tail.x = this.body[this.body.length-1].x;
		this.tail.y = this.body[this.body.length-1].y;
		this.body.splice(this.body.length-1, 1);
	}
	
	// “ª‚ð’Ç‰Á‚·‚é
	this.body.splice(0,0,this.head);
}

// ŽÖ“ªˆÊ’uŽæ“¾
Snake.prototype.GetHeadPos = function (){
	var oldHead = this.body[0];
	var newHead = new Object();
	if (this.control == 1) {
		newHead.x = oldHead.x;
		newHead.y = oldHead.y - pLong;
	} else if (this.control == 3) {
		newHead.x = oldHead.x;
		newHead.y = oldHead.y + pLong;
	} else if (this.control == 2) {
		newHead.x = oldHead.x - pLong;
		newHead.y = oldHead.y;
	} else if (this.control == 4) {
		newHead.x = oldHead.x + pLong;
		newHead.y = oldHead.y;
	}
	
	this.head = newHead;
}

Snake.prototype.isAte = function(food){
	var isAte = false;
	if (this.head.x == food.x && this.head.y == food.y) {
		isAte = true;
		this.score ++;
	}
	
	this.eat = isAte;
	return isAte;
}

Snake.prototype.isDead = function(otherBody){
	var headPos = this.body[0];

	// Ž©g‚É‚Ô‚Â‚©‚é
	for(var i = 1; i < this.body.length; i++) {
		if (headPos.x == this.body[i].x 
		 && headPos.y == this.body[i].y) {
		 	return true;
		}
	}
	
	// ‘¼‚ÌŽÖ‚É‚Ô‚Â‚©‚é
	if(otherBody != null){
		for(var i = 0; i < otherBody.length; i++) {
			if (headPos.x == otherBody[i].x 
			 && headPos.y == otherBody[i].y) {
			 	return true;
			}
		}
	}
	
	// •Ç‚É‚Ô‚Â‚©‚é
	if(headPos.x >= canvasWidth
	 || headPos.x < 0
	 || headPos.y >= canvasHeight
	 || headPos.y < 0) {
		return true;
	}
	
	return false;
}

// ŽÖÄ•`‰æ
Snake.prototype.Draw = function(color){
	var snakeLonger = this.body.length;
	var pX;
	var pY;
	
	// ŽÖ‚ÌK”ö‚ðØ‚é
	if (this.tail != null) {
		context.fillStyle=color;
		context.clearRect(this.tail.x+1, this.tail.y+1, pLong-2, pLong-2);
	}
	
	// Ä•`‰æ
	for (var i=0; i< this.body.length; i++) {
		pX = this.body[i].x;
		pY = this.body[i].y;
		
		context.fillStyle=color;
		context.fillRect(pX+1, pY+1, pLong-2, pLong-2);
	}
}