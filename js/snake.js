
function Snake(){
	this.self = this;
	this.body = new Array();
	this.tail = new Object();
	this.food = new Object();
	this.get = function(){return this.Move(self);}
	this.innervalID = null;

}

Snake.move = function(o){
	status = o.get();
}

Snake.prototype.Start = function(){
	var self = this;
	this.innervalID = setInterval(function(){Snake.move(self)},100);
}

// 餌位置を設定
Snake.prototype.CreateFood = function(){
	this.food.x = getRandom(canvasWidth/pLong)*pLong;
	this.food.y = getRandom(canvasHeight/pLong)*pLong;
	if(this.checkBody(this.food)){
		this.CreateFood();
	} else {
		this.DrawFood();
	}
}

// 餌を描画
Snake.prototype.DrawFood = function(){
	context.fillStyle="#0000ff";
	context.fillRect(this.food.x+1, this.food.y+1, pLong-2, pLong-2);
}

// 蛇頭位置取得
Snake.prototype.GetHeadPos = function (){
	var oldHead = this.body[0];
	var newHead = new Object();
	if (keyListen == 1) {
		newHead.x = oldHead.x;
		newHead.y = oldHead.y - pLong;
	} else if (keyListen == 2) {
		newHead.x = oldHead.x;
		newHead.y = oldHead.y + pLong;
	} else if (keyListen == 3) {
		newHead.x = oldHead.x - pLong;
		newHead.y = oldHead.y;
	} else if (keyListen == 4) {
		newHead.x = oldHead.x + pLong;
		newHead.y = oldHead.y;
	}
	
	return newHead;
}

// 蛇移動
Snake.prototype.Move = function(){
	// 頭の新座標を取得
	var snakeHeadPos = this.GetHeadPos();
	
	// 死ぬ？
	if(this.isDead(snakeHeadPos)) {
		clearInterval(this.innervalID);
		alert("GAME OVER");
	}
	
	// 頭を追加する
	this.body.splice(0,0,snakeHeadPos);
	
	// 喰ってる？
	if(this.isAte(snakeHeadPos)) {
		// 喰った
		this.CreateFood();
	} else {
		// 喰ってない
		this.tail.x = this.body[this.body.length-1].x;
		this.tail.y = this.body[this.body.length-1].y;
		this.body.splice(this.body.length-1, 1);
	}
	
	// 蛇を描画
	this.Draw();
}

Snake.prototype.isAte = function(snakeHeadPos){
	var isAte = false;
	if (snakeHeadPos.x == this.food.x
	 && snakeHeadPos.y == this.food.y) {
		isAte = true;
	}
	
	return isAte;
}

Snake.prototype.isDead = function(snakeHeadPos){
	// 自身にぶつかる
	if(this.checkBody(snakeHeadPos)){
		return true;
	}
	
	// 壁にぶつかる
	if(snakeHeadPos.x > canvasWidth
	 || snakeHeadPos.x < 0
	 || snakeHeadPos.y > canvasHeight
	 || snakeHeadPos.y < 0) {
		return true;
	}
	
	return false;
}

// 蛇再描画
Snake.prototype.Draw = function(){
	var snakeLonger = this.body.length;
	var pX;
	var pY;
	
	// 蛇の尻尾を切る
	if (this.tail != null) {
		context.fillStyle="#000000";
		context.clearRect(this.tail.x+1, this.tail.y+1, pLong-2, pLong-2);
		clearSnake = null;
	}
	
	// 再描画
	for (var i=0; i< this.body.length; i++) {
		pX = this.body[i].x;
		pY = this.body[i].y;
		
		context.fillStyle="#000000";
		context.fillRect(pX, pY, pLong, pLong);
	}
}


// インポート座標は蛇ボディーと重ねているかのチェック
// 戻り値：true  重ねてる
//         false 重ねていない
Snake.prototype.checkBody = function(pos){
	for(var i = 0; i < this.body.length; i++) {
		if (pos.x == this.body[i].x 
		 && pos.y == this.body[i].y) {
		 	return true;
		}
	}
	
	return false;
}