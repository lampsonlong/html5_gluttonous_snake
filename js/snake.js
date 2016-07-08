function Snake(n,x,y,w,c){
	this.name = n;
	this.head = new Object();
	this.head.x = x;
	this.head.y = y;

	this.body = new Array();
	this.body.push(this.head);
	this.tail = new Object();
	this.eat = false;
	this.control = c;
	this.score = 0;
	this.wall = w;
	this.invincible = false;
	this.dead = false;
	this.timerPty1;
	this.timerPty2;
}

// 蛇のbody,head,tailを更新する
Snake.prototype.Move = function (foods){
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
	
	this.head = newHead;
}

Snake.prototype.isAte = function(foods){
	for(var i = 0; i < foods.length; i ++) {
		if (this.head.x == foods[i].x && this.head.y == foods[i].y) {
			this.eat = true;
			this.score ++;
			
			// 食物スキール発動
			this.TriggerFoodProperty(foods[i].pty);
			// 食物削除
			foods.splice(i,1);
			
			return true;
		}
	}
	
	return false;
}

Snake.prototype.isDead = function(otherBody){
	var headPos = this.body[0];

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
	var snakeLonger = this.body.length;
	var pX;
	var pY;
	
	// 蛇の尻尾を切る
	if (this.tail != null) {
		context.fillStyle=color;
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