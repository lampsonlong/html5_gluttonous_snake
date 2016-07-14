function Game(player){
	var self = this;
	this.p1 = null;
	this.p2 = null;
	this.wall = wall;
	this.model = model;
	
	if(this.model == 1){
		this.p1 = new Snake("p1", canvasWidth/5, canvasHeight/5, this.wall, 4);
	} else if(this.model == 2){
		this.p1 = new Snake("p1", canvasWidth/5, canvasHeight/5, this.wall, 4);
		this.p2 = new Snake("p2", canvasWidth*4/5, canvasHeight*4/5, this.wall, 2);
	}
	
	this.foods = new Array();
	this.get = function(){return this.Process(self);}
	this.innervalID = null;
	this.ret = null;
	
	/*
	$(window).keydown(self ,function(event){
		if(self.p2 != null) {
			// �O��L�[�ۑ�
			var p2key = self.p2.control;
		
			if(event.which == "38"){
				// up�L�[
				self.p2.control = 1;
			} else if(event.which == "40"){
				// down�L�[
				self.p2.control = 3;
			} else if(event.which == "37"){
				// left�L�[
				self.p2.control = 2;
			} else if(event.which == "39"){
				// right�L�[
				self.p2.control = 4;
			}
			
			if(Math.abs(self.p2.control - self.p1.direction) == 2){
				// �x��0.1�b����
				setTimeout(self.p2.control = p2key, 100);
			}
		}
		
		if(self.p1 != null) {
			// �O��L�[�ۑ�
			var p1key = self.p1.control;
			
			if(event.which == "87"){
				// up�L�[
				self.p1.control = 1;
			} else if(event.which == "83"){
				// down�L�[
				self.p1.control = 3;
			} else if(event.which == "65"){
				// left�L�[
				self.p1.control = 2;
			} else if(event.which == "68"){
				// right�L�[
				self.p1.control = 4;
			}
			
			if(Math.abs(self.p1.control - self.p1.direction) == 2){
				// �x��0.1�b����
				setTimeout(self.p1.control = p1key, 100);
			}
		}
	});*/
}

Game.process = function(o){
	status = o.get();
}

Game.prototype.Start = function(){
	var self = this;
	this.innervalID = setInterval(function(){Game.process(self)},speed);
}

Game.prototype.Process = function(){
	if(this.model == 2) {
		var selfP1 = this.p1;
		var selfP2 = this.p2;
		
		// �ֈړ�
		selfP1.Move(this.foods);
		selfP2.Move(this.foods);

		
		// �����邩�̔��f
		selfP1.isDead(selfP2.body);
		selfP2.isDead(selfP1.body);
		
		// ����Ă邩���H
		if(selfP1.eat || selfP2.eat){
			selfP1.eat = false;
			selfP2.eat = false;
			if(doubleFood > 0){
				this.CreateFood();
				this.CreateFood();
				doubleFood --;
			} else {
				if(this.foods.length > 0){
					this.foods = new Array();
				}
				this.CreateFood();
			}
		}
		
		// �ւ�`��
		this.Draw();
		
		// Score�X�V
		$("#p1score").html(this.p1.score);
		$("#p2score").html(this.p2.score);
		
		// ���ʔ���ƕ\��
		this.BattleResult(selfP1, selfP2);
		
	} else if(this.model == 1) {
		var selfP1 = this.p1;
		
		selfP1.Move(this.foods);
		
		selfP1.isDead(null);
		
		// ����Ă邩���H
		if(selfP1.eat){
			selfP1.eat = false;
			if(doubleFood > 0){
				this.CreateFood();
				this.CreateFood();
				doubleFood --;
			} else {
				if(this.foods.length == 0){
					this.CreateFood();
				}
			}
		}
		
		// �ւ�`��
		this.Draw();
		
		// Score�X�V
		$("#p1score").html(this.p1.score);
		
		// ���ʔ���ƕ\��
		this.SingleResult(selfP1);
	}
	
	// ���O
	this.WriteLog();
}

Game.prototype.BattleResult = function(selfP1, selfP2){
	if(selfP1.dead || selfP2.dead){
		if(selfP1.dead && selfP2.dead){
			if(selfP1.body.length > selfP2.body.length){
				this.ret = "1P WIN!";
			} else if(selfP1.body.length < selfP2.body.length){
				this.ret = "2P WIN!";
			} else {
				this.ret = "DRAW!";
			}
		} else if(selfP1.dead){
			this.ret = "2P WIN!";
		} else if(selfP2.dead){
			this.ret = "1P WIN!";
		}
		
		showResult(this.ret);
		clearInterval(this.innervalID);
	}
}

Game.prototype.SingleResult = function(selfP1){
	if(selfP1.dead){
		this.ret = "GAME OVER";
		showResult(this.ret,this);
		clearInterval(this.innervalID);
	}
}

// �V�K�H��
Game.prototype.CreateFood = function(){
	var food = new Object();
	food.x = getRandom(canvasWidth/pLong)*pLong;
	food.y = getRandom(canvasHeight/pLong)*pLong;
	
	food.pty = getRandom(6);
	if(doubleFood > 0 && food.pty == 3){
		food.pty = 0;
	}
	
	if(this.Check(food)){
		this.CreateFood();
	} else {
		this.foods.push(food);
		this.DrawFoods(food);
	}
}

// �V�K�H���͔��Ȃ��悤��
Game.prototype.Check = function(food){
	for(var i = 0; i < this.foods.length; i++){
		if (food.x == this.foods[i].x 
		 && food.y == this.foods[i].y) {
		 	return true;
		}
	}
	
	for(var i = 0; i < this.p1.body.length; i++) {
		if (food.x == this.p1.body[i].x 
		 && food.y == this.p1.body[i].y) {
		 	return true;
		}
	}
	
	if(this.model == 2){
		for(var i = 0; i < this.p2.body.length; i++) {
			if (food.x == this.p2.body[i].x 
			 && food.y == this.p2.body[i].y) {
			 	return true;
			}
		}
	}
	
	return false;
}

// �H���ĕ`��
Game.prototype.DrawFoods = function(food) {

		if (this.wall && food.pty == 1) {
			context.fillStyle="orange";
		} else if (food.pty == 2) {
			context.fillStyle="pink";
		} else if (food.pty == 3) {
			context.fillStyle="black";
		}  else {
			context.fillStyle="green";
		}
		context.fillRect(food.x+1, food.y+1, pLong-2, pLong-2);
}

// �֍ĕ`��
Game.prototype.Draw = function() {
	if(this.p1 != null){
		var selfP1 = this.p1;
		selfP1.Draw("blue");
	}
	if(this.p2 != null){
		var selfP2 = this.p2;
		selfP2.Draw("red");
	}
}

Game.prototype.WriteLog = function() {
	// �H�����W���O
	$("#foodPos").html("");
	for (var i = 0; i < this.foods.length; i++) {
		var foodPosLog = "(" + this.foods[i].x/pLong + "," + this.foods[i].y/pLong + "," + this.foods[i].pty +");";
		$("#foodPos").append(foodPosLog);
	}
}