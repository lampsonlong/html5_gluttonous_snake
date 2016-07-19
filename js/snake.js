function Snake(n,x,y,w,c){
	var self = this;
	this.name = n;
	this.head = new Object();
	this.head.x = x;
	this.head.y = y;
	
	this.body = new Array();
	this.body.push(this.head);
	this.tail = new Object();
	this.eat = false;
	this.control = c;
	this.direction = c;
	this.score = 0;
	this.combo = 0;
	this.wall = w;
	this.invincible = false;
	this.dead = false;
	this.timerPty1;
	this.timerPty2;
	
	$(window).keydown(self ,function(event){
		if(self.name == "p1") {
			// 前回キー保存
			var p1key = self.control;
			
			if(event.which == "87"){
				// upキー
				self.control = 1;
			} else if(event.which == "83"){
				// downキー
				self.control = 3;
			} else if(event.which == "65"){
				// leftキー
				self.control = 2;
			} else if(event.which == "68"){
				// rightキー
				self.control = 4;
			}
			
			if(Math.abs(self.control - self.direction) == 2){
				// 遅延0.1秒押下
				setTimeout(self.control = p1key, 100);
			}
		} else {
			// 前回キー保存
			var p2key = self.control;
			
			if(event.which == "38"){
				// upキー
				self.control = 1;
			} else if(event.which == "40"){
				// downキー
				self.control = 3;
			} else if(event.which == "37"){
				// leftキー
				self.control = 2;
			} else if(event.which == "39"){
				// rightキー
				self.control = 4;
			}
			
			if(Math.abs(self.control - self.direction) == 2){
				// 遅延0.1秒押下
				setTimeout(self.control = p2key, 100);
			}
		}
	});
}

// 蛇のbody,head,tailを更新する
Snake.prototype.Move = function (foods){
	if(this.dead){
		return;
	}

	// 頭の新座標を取得
	this.GetHeadPos();
	
	// 喰ってる？
	if(this.isAte(foods)){
		// 喰った
	} else {
		// 喰ってない
		// 尻尾を切る
		this.tail.x = this.body[this.body.length-1].x;
		this.tail.y = this.body[this.body.length-1].y;
		this.body.splice(this.body.length-1, 1);
	}
	
	// 頭を追加する
	this.body.splice(0,0,this.head);
}

// 蛇頭位置取得
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
	
	this.direction = this.control;
	this.head = newHead;
}

// スコア、コンボの計算と画面更新
Snake.prototype.ScoreStatistics = function(rivalIsEat, boss) {
	// コンボ計算
	if(this.eat){
		this.combo ++;
	} else if(rivalIsEat){
		this.combo = 0;
	}
	
	// スコア計算
	if(this.eat){
		var plusScore = Math.round((1+this.combo*0.1)*100);
		this.score += plusScore;
		if(boss != null){
			boss.hp -= plusScore;
		}
	}
	
	// スコアコンボ画面更新
	$("#" + this.name + "score").html(this.score);
	$("#" + this.name + "combo").html(this.combo);
}

Snake.prototype.isAte = function(foods){
	for(var i = 0; i < foods.length; i ++) {
		if (this.head.x == foods[i].x && this.head.y == foods[i].y) {
			this.eat = true;
			
			// 食物スキール発動
			if(this.name != "boss"){
				this.TriggerFoodProperty(foods[i].pty);
			}
			// 食物削除
			foods.splice(i,1);
			
			return true;
		}
	}
	
	return false;
}

Snake.prototype.isDead = function(body, bossBody){
	if(this.dead){
		return;
	}

	var headPos = this.body[0];
	var otherBody = new Array();
	if(body == null && bossBody == null) {
		otherBody = null;
	} else if(body == null){
		otherBody = otherBody.concat(bossBody);
	} else if(bossBody == null){
		otherBody = otherBody.concat(body);
	} else {
		otherBody = otherBody.concat(body,bossBody);
	}

	// 自身にぶつかる
	for(var i = 1; i < this.body.length; i++) {
		if (headPos.x == this.body[i].x 
		 && headPos.y == this.body[i].y) {
		 	this.dead = true;
		}
	}
	
	// 他の蛇にぶつかる
	if(!this.invincible){
		if(otherBody != null){
			for(var i = 0; i < otherBody.length; i++) {
				if (headPos.x == otherBody[i].x 
				 && headPos.y == otherBody[i].y) {
				 	this.dead = true;
				}
			}
		}
	}
	
	// 壁にぶつかる
	if(this.wall){
		if(headPos.x >= canvasWidth
		 || headPos.x < 0
		 || headPos.y >= canvasHeight
		 || headPos.y < 0) {
			this.dead = true;
		}
	} else {
		if(headPos.x >= canvasWidth){
			headPos.x = 0;
		} else if (headPos.x < 0){
			headPos.x = canvasWidth;
		}
		
		if(headPos.y >= canvasHeight){
			headPos.y = 0;
		} else if (headPos.y < 0){
			headPos.y = canvasHeight;
		}
	}
}

// 蛇再描画
Snake.prototype.Draw = function(color){
	if(this.dead){
		return;
	}
	
	var snakeLonger = this.body.length;
	var pX;
	var pY;
	
	// 蛇の尻尾を切る
	if (this.tail != null) {
		context.clearRect(this.tail.x+1, this.tail.y+1, pLong-2, pLong-2);
	}
	
	// 再描画
	for (var i=0; i< this.body.length; i++) {
		pX = this.body[i].x;
		pY = this.body[i].y;
		
		context.fillStyle=color;
		context.fillRect(pX+1, pY+1, pLong-2, pLong-2);
	}
}

// 蛇クリア
Snake.prototype.Clear = function(){
	if(this.body == null){
		return;
	}
	var snakeLonger = this.body.length;
	var pX;
	var pY;
	
	// 蛇の尻尾を切る
	if (this.tail != null) {
		context.clearRect(this.tail.x+1, this.tail.y+1, pLong-2, pLong-2);
	}
	
	for (var i=0; i< this.body.length; i++) {
		pX = this.body[i].x;
		pY = this.body[i].y;
		
		context.clearRect(pX+1, pY+1, pLong-2, pLong-2);
	}
	
	this.body = null;
	$("#" + this.name + "statusDiv").html("You Die.");
}

// 食物スキール発動
Snake.prototype.TriggerFoodProperty = function(pty){
	var player = this.name;
	var millisec = 5000;

	// ５秒間、境界なしになる
	if(wall && (pty == 1)){
		// 前回のタイマーを消去
		if(this.timerPty1 != null && this.timerPty1 != undefined){
			clearTimeout(this.timerPty1);
		}
		
		// 境界なし
		var statusId = "#" + player + "_status" + pty;
		this.wall = false;
		$(statusId).show();
		
		// ５秒後、境界あり
		var self = this;
		self.timerPty1 = setTimeout(function(){
										self.wall = true;
										$(statusId).hide();
									},
									millisec);
	}
	
	// ５秒間、無敵
	if(pty == 2){
		// 前回のタイマーを消去
		if(this.timerPty2 != null && this.timerPty2 != undefined){
			clearTimeout(this.timerPty2);
		}
		
		// 無敵
		var statusId = "#" + player + "_status" + pty;
		this.invincible = true;
		$(statusId).show();
		
		// ５秒後、無敵なし
		var self = this;
		self.timerPty2 = setTimeout(function(){
										self.invincible = false;
										$(statusId).hide();
									},
									millisec);
	}
	
	// 5秒間、ダブルフード
	if(pty == 3){
		doubleFood = 1;
	}
}