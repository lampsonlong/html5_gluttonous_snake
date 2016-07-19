function Game(player) {
	var self = this;
	this.p1 = null;
	this.p2 = null;
	this.wall = wall;
	this.mode = mode;
	
	if(this.mode == 1) {
		this.p1 = new Snake("p1", canvasWidth/5, canvasHeight/5, this.wall, 4);
	} else if(this.mode == 2) {
		this.p1 = new Snake("p1", canvasWidth/5, canvasHeight/5, this.wall, 4);
		this.p2 = new Snake("p2", canvasWidth*4/5, canvasHeight*4/5, this.wall, 2);
	} else if(this.mode == 3){
		this.p1 = new Snake("p1", canvasWidth/5, canvasHeight/5, this.wall, 4);
		this.p2 = new Snake("p2", canvasWidth*4/5, canvasHeight*4/5, this.wall, 2);
		this.boss = new Boss("boss", canvasWidth*3/5, canvasHeight*2/5, 3);
	} else if(this.mode == 4){
		this.p1 = new Snake("p1", canvasWidth/5, canvasHeight/5, this.wall, 4);
		this.boss = new Boss("boss", canvasWidth*3/5, canvasHeight*2/5, 3);
	}
	
	this.foods = new Array();
	this.get = function() {return this.Process(self);}
	this.innervalID = null;
	this.ret = null;
}

Game.process = function(o) {
	status = o.get();
}

Game.prototype.Start = function() {
	var self = this;
	this.innervalID = setInterval(function() {Game.process(self)},speed);
}

Game.prototype.Process = function() {
	if(this.mode == 2) {
		var selfP1 = this.p1;
		var selfP2 = this.p2;
		
		// 蛇移動
		selfP1.Move(this.foods);
		selfP2.Move(this.foods);

		
		// 生きるかの判断
		selfP1.isDead(selfP2.body, null);
		selfP2.isDead(selfP1.body, null);
		
		// スコア、コンボの計算と画面更新
		selfP1.ScoreStatistics(selfP2.eat, null);
		selfP2.ScoreStatistics(selfP1.eat, null);
		
		// 喰ってるかい？
		if(selfP1.eat || selfP2.eat) {
			selfP1.eat = false;
			selfP2.eat = false;
			
			// 食物再生産
			if(doubleFood > 0) {
				this.CreateFood();
				this.CreateFood();
				doubleFood --;
			} else {
				if(this.foods.length > 0) {
					this.foods = new Array();
				}
				this.CreateFood();
			}
		}
		
		// 蛇を描画
		this.Draw();
	} else if(this.mode == 3) {
		var selfP1 = this.p1;
		var selfP2 = this.p2;
		var selfBoss = this.boss;
		
		// 蛇移動
		selfBoss.Move(this.foods, selfP1, selfP2);
		selfP1.Move(this.foods);
		selfP2.Move(this.foods);

		
		// 生きるかの判断
		selfP1.isDead(selfP2.body, selfBoss.body);
		selfP2.isDead(selfP1.body, selfBoss.body);
		selfBoss.isDamaged(selfP1.body, selfP2.body);
		
		// スコア、コンボの計算と画面更新
		selfP1.ScoreStatistics(selfP2.eat, selfBoss);
		selfP2.ScoreStatistics(selfP1.eat, selfBoss);
		
		// BossHP更新
		selfBoss.HPStatistics();
		
		// 蛇を描画
		this.Draw();
		
		// 喰ってるかい？
		if(selfP1.eat || selfP2.eat || selfBoss.eat) {
			selfP1.eat = false;
			selfP2.eat = false;
			selfBoss.eat = false;
			
			// 食物再生産
			if(doubleFood > 0) {
				this.CreateFood();
				this.CreateFood();
				doubleFood --;
			} else {
				if(this.foods.length > 0) {
					this.foods = new Array();
				}
				this.CreateFood();
			}
		}
	} else if(this.mode == 1) {
		var selfP1 = this.p1;
		
		selfP1.Move(this.foods);
		
		selfP1.isDead(null, null);
		
		// スコア、コンボの計算と画面更新
		selfP1.ScoreStatistics(false, null);
		
		// 蛇を描画
		this.Draw();
		
		// 喰ってるかい？
		if(selfP1.eat) {
			selfP1.eat = false;
			if(doubleFood > 0) {
				this.CreateFood();
				this.CreateFood();
				doubleFood --;
			} else {
				if(this.foods.length == 0) {
					this.CreateFood();
				}
			}
		}
	} else if(this.mode == 4) {
		var selfP1 = this.p1;
		var selfBoss = this.boss;
		
		selfBoss.Move(this.foods, selfP1, null);
		selfP1.Move(this.foods);
		
		selfP1.isDead(null, selfBoss.body);
		selfBoss.isDamaged(selfP1.body, null);
		
		// スコア、コンボの計算と画面更新
		selfP1.ScoreStatistics(false, selfBoss);
		
		// BossHP更新
		selfBoss.HPStatistics();
		
		// 蛇を描画
		this.Draw();
		
		// 喰ってるかい？
		if(selfP1.eat || selfBoss.eat) {
			selfP1.eat = false;
			selfBoss.eat = false;
			
			if(doubleFood > 0) {
				this.CreateFood();
				this.CreateFood();
				doubleFood --;
			} else {
				if(this.foods.length == 0) {
					this.CreateFood();
				}
			}
		}
	}
	
	// 結果判定と表示
	this.BattleResult();
	
	// ログ
	this.WriteLog();
}

Game.prototype.BattleResult = function() {
	if (this.mode == 1) {
		if(this.p1.dead) {
			this.ret = "GAME OVER";
			showResult(this.ret,this);
			clearInterval(this.innervalID);
		}
	} else if (this.mode == 2) {
		if(this.p1.dead || this.p2.dead) {
			if(this.p1.dead && selfP2.dead) {
				if(this.p1.body.length > this.p2.body.length) {
					this.ret = "1P WIN!";
				} else if(this.p1.body.length < this.p2.body.length) {
					this.ret = "2P WIN!";
				} else {
					this.ret = "DRAW!";
				}
			} else if(this.p1.dead) {
				this.ret = "2P WIN!";
			} else if(this.p2.dead) {
				this.ret = "1P WIN!";
			}
			
			showResult(this.ret);
			clearInterval(this.innervalID);
		}
	} else if (this.mode == 3) {
		if(this.p1.dead && this.p2.dead) {
			this.ret = "GAME OVER";
			
			showResult(this.ret);
			clearInterval(this.innervalID);
		}
		if(this.boss.dead) {
			this.ret = "YOU WIN!";
			
			showResult(this.ret);
			clearInterval(this.innervalID);
		}
	} else if (this.mode == 4) {
		if(this.p1.dead) {
			this.ret = "GAME OVER";
			
			showResult(this.ret);
			clearInterval(this.innervalID);
		}
		if(this.boss.dead) {
			this.ret = "YOU WIN!";
			
			showResult(this.ret);
			clearInterval(this.innervalID);
		}
	}
}

// 新規食物
Game.prototype.CreateFood = function() {
	var food = new Object();
	food.x = getRandom(canvasWidth/pLong)*pLong;
	food.y = getRandom(canvasHeight/pLong)*pLong;
	
	food.pty = getRandom(6);
	if(doubleFood > 0 && food.pty == 3) {
		food.pty = 0;
	}
	
	if(this.Check(food)) {
		this.CreateFood();
	} else {
		this.foods.push(food);
		this.DrawFoods(food);
	}
}

// 新規食物は被らないように
Game.prototype.Check = function(food) {
	for(var i = 0; i < this.foods.length; i++) {
		if (food.x == this.foods[i].x 
		 && food.y == this.foods[i].y) {
		 	return true;
		}
	}
	
	if(this.p1.body != null){
		for(var i = 0; i < this.p1.body.length; i++) {
			if (food.x == this.p1.body[i].x 
			 && food.y == this.p1.body[i].y) {
			 	return true;
			}
		}
	}
	
	if(this.mode == 2 || this.mode == 3) {
		if (this.p2.body != null) {
			for(var i = 0; i < this.p2.body.length; i++) {
				if (food.x == this.p2.body[i].x 
				 && food.y == this.p2.body[i].y) {
				 	return true;
				}
			}
		}
	}
	
	if(this.mode == 3 || this.mode == 4) {
		for (var i = 0; i < this.boss.body.length; i++) {
			if (food.x == this.boss.body[i].x 
			 && food.y == this.boss.body[i].y) {
			 	return true;
			}
		}
	}
	
	return false;
}

// 食物再描画
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

// 蛇再描画
Game.prototype.Draw = function() {
	if(this.p1 != null) {
		var selfP1 = this.p1;
		
		if(selfP1.dead){
			selfP1.Clear();
		} else {
			selfP1.Draw("blue");
		}
	}
	if(this.p2 != null) {
		var selfP2 = this.p2;
		
		if(selfP2.dead){
			selfP2.Clear();
		} else {
			selfP2.Draw("red");
		}
	}
	if(this.boss != null) {
		var selfBoss = this.boss;
		selfBoss.Draw("purple");
	}
}

Game.prototype.WriteLog = function() {
	// 食物座標ログ
	$("#foodPos").html("");
	for (var i = 0; i < this.foods.length; i++) {
		var foodPosLog = "(" + this.foods[i].x/pLong + "," + this.foods[i].y/pLong + "," + this.foods[i].pty +");";
		$("#foodPos").append(foodPosLog);
	}
}