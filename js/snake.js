
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

// �a�ʒu��ݒ�
Snake.prototype.CreateFood = function(){
	this.food.x = getRandom(canvasWidth/pLong)*pLong;
	this.food.y = getRandom(canvasHeight/pLong)*pLong;
	if(this.checkBody(this.food)){
		this.CreateFood();
	} else {
		this.DrawFood();
	}
}

// �a��`��
Snake.prototype.DrawFood = function(){
	context.fillStyle="#0000ff";
	context.fillRect(this.food.x+1, this.food.y+1, pLong-2, pLong-2);
}

// �֓��ʒu�擾
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

// �ֈړ�
Snake.prototype.Move = function(){
	// ���̐V���W���擾
	var snakeHeadPos = this.GetHeadPos();
	
	// ���ʁH
	if(this.isDead(snakeHeadPos)) {
		clearInterval(this.innervalID);
		alert("GAME OVER");
	}
	
	// ����ǉ�����
	this.body.splice(0,0,snakeHeadPos);
	
	// ����Ă�H
	if(this.isAte(snakeHeadPos)) {
		// �����
		this.CreateFood();
	} else {
		// ����ĂȂ�
		this.tail.x = this.body[this.body.length-1].x;
		this.tail.y = this.body[this.body.length-1].y;
		this.body.splice(this.body.length-1, 1);
	}
	
	// �ւ�`��
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
	// ���g�ɂԂ���
	if(this.checkBody(snakeHeadPos)){
		return true;
	}
	
	// �ǂɂԂ���
	if(snakeHeadPos.x > canvasWidth
	 || snakeHeadPos.x < 0
	 || snakeHeadPos.y > canvasHeight
	 || snakeHeadPos.y < 0) {
		return true;
	}
	
	return false;
}

// �֍ĕ`��
Snake.prototype.Draw = function(){
	var snakeLonger = this.body.length;
	var pX;
	var pY;
	
	// �ւ̐K����؂�
	if (this.tail != null) {
		context.fillStyle="#000000";
		context.clearRect(this.tail.x+1, this.tail.y+1, pLong-2, pLong-2);
		clearSnake = null;
	}
	
	// �ĕ`��
	for (var i=0; i< this.body.length; i++) {
		pX = this.body[i].x;
		pY = this.body[i].y;
		
		context.fillStyle="#000000";
		context.fillRect(pX, pY, pLong, pLong);
	}
}


// �C���|�[�g���W�͎փ{�f�B�[�Əd�˂Ă��邩�̃`�F�b�N
// �߂�l�Ftrue  �d�˂Ă�
//         false �d�˂Ă��Ȃ�
Snake.prototype.checkBody = function(pos){
	for(var i = 0; i < this.body.length; i++) {
		if (pos.x == this.body[i].x 
		 && pos.y == this.body[i].y) {
		 	return true;
		}
	}
	
	return false;
}