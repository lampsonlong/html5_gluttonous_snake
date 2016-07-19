function Boss(n,x,y,c){
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
	this.wall = false;
	this.dead = false;
	this.hp = hp;
	for (var i = 1; i < 2; i++){
		this.body.push(canvasWidth*3/5-pLong*i, canvasHeight*2/5);
	}
}

// �ւ�body,head,tail���X�V����
Boss.prototype.Move = function (foods,p1, p2){
	// BOSS�R���g���[���ݒ�
	// �H�ו��Ɍ���
	var foodx = foods[0].x;
	var foody = foods[0].y;
	if(this.head.x > foodx){
		this.control = 2;
	} else if(this.head.x < foodx){
		this.control = 4;
	}
	
	if(this.head.y > foody){
		this.control = 1;
	} else if(this.heady < foody){
		this.control = 3;
	}
	
	// 1/2�T��Random
	var random = getRandom(2);
	if(random == 0){
		this.control = getRandom(4) + 1;
	}
	
	// 180�������ύX�֎~
	if(Math.abs(this.control - this.direction) == 2) {
		this.control = this.direction;
	}

	// ���̐V���W���擾
	this.GetHeadPos();
	
	// ����Ă�H
	if(this.isAte(foods)){
		// �����
		if(p1 != null){
			p1.combo = 0;
		}
		if(p2 != null){
			p2.combo = 0;
		}
		
		this.hp += 300;
	} else {
		// ����ĂȂ�
		// �K����؂�
		this.tail.x = this.body[this.body.length-1].x;
		this.tail.y = this.body[this.body.length-1].y;
		this.body.splice(this.body.length-1, 1);
	}
	
	// ����ǉ�����
	this.body.splice(0,0,this.head);
}

// �֓��ʒu�擾
Boss.prototype.GetHeadPos = function (){
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


Boss.prototype.isAte = function(foods){
	for(var i = 0; i < foods.length; i ++) {
		if (this.head.x == foods[i].x && this.head.y == foods[i].y) {
			this.eat = true;
			
			// �H���폜
			foods.splice(i,1);
			
			return true;
		}
	}
	
	return false;
}

Boss.prototype.isDamaged = function(p1Body, p2Body){
	var headPos = this.body[0];
	var otherBody = new Array();
	if(p1Body == null && p2Body == null){
		otherBody = null;
	} else if (p1Body == null){
		otherBody = otherBody.concat(p2Body);
	} else if (p2Body == null){
		otherBody = otherBody.concat(p1Body);
	} else {
		otherBody = otherBody.concat(p1Body,p2Body);
	}

	// P1,P2�ɂԂ���
	if(otherBody != null){
		for(var i = 0; i < otherBody.length; i++) {
			if (headPos.x == otherBody[i].x 
			 && headPos.y == otherBody[i].y) {
			 	this.hp -= 200;
			}
		}
	}
	
	// �ǂ�ʂ�
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

// �֍ĕ`��
Boss.prototype.Draw = function(color){
	var snakeLonger = this.body.length;
	var pX;
	var pY;
	
	// �ւ̐K����؂�
	if (this.tail != null) {
		context.fillStyle=color;
		context.clearRect(this.tail.x+1, this.tail.y+1, pLong-2, pLong-2);
	}
	
	// �ĕ`��
	for (var i=0; i< this.body.length; i++) {
		pX = this.body[i].x;
		pY = this.body[i].y;
		
		context.fillStyle=color;
		context.fillRect(pX+1, pY+1, pLong-2, pLong-2);
	}
}

Boss.prototype.HPStatistics = function() {
	if(this.hp > hp){
		this.hp = hp;
	} else if (this.hp < 0){
		this.hp = 0;
	}
	
	if(this.hp == 0){
		this.dead = true;
	}

	var perHP = Math.round(this.hp/hp*100);
	
	if(perHP >= 70){
		$("#BossHPBar").removeClass();
		$("#BossHPBar").addClass("progress-bar progress-bar-success");
	} else if (perHP < 70 && perHP >= 40){
		$("#BossHPBar").removeClass();
		$("#BossHPBar").addClass("progress-bar progress-bar-warning");
	} else {
		$("#BossHPBar").removeClass();
		$("#BossHPBar").addClass("progress-bar progress-bar-danger");
	}
	
	$("#BossHPBar").html(perHP+"%");
	$("#BossHPBar").css("width", perHP+"%");
}