const Snaker = require('Snaker');
const Food = require('Food');

cc.Class({
	extends: cc.Component,

	properties: {
		body: {
			default: null,
			type: cc.Node
		},
		foodPrefab: {
			default: null,
			type: cc.Prefab
		},
		bodyPrefab: {
			default: null,
			type: cc.Prefab
		},
		snaker: {
			default: null,
			type: Snaker
		},
		scoreDisplay: {
			default: null,
			type: cc.Label
		},
		scoreAudio: {
			default: null,
			type: cc.AudioClip
		},
		btnNode: {
			default: null,
			type: cc.Node
		},
		gameOverNode: {
			default: null,
			type: cc.Node
		},
	},

	onLoad() {
		this.snakerPosition = []; //存储snaker head 和 body 的位置信息
		this.bodyList = [];
		this.score = 0;
		// set button and gameover text out of screen
		this.enabled = false;
		this.gameOverNode.active = false;

		this.snaker.getComponent('Snaker').game = this;

		this.foodPool = new cc.NodePool();
		this.bodyPool = new cc.NodePool();

		this.createNewFood();

		this.bodyCount = 12;
		for (let i = 0; i < this.bodyCount; ++i) {
			let body = cc.instantiate(this.bodyPrefab); // 创建节点
			this.bodyPool.put(body); // 通过 put 接口放入对象池
		}

		// this.x = this.snaker.node.x;
		// this.y = this.snaker.node.y;
		// this.snakerPosition.unshift([this.x, this.y])
	},

	onStartGame() {
		if (this.bodyPool && this.bodyList) {
			for (let i = 0; i < this.bodyCount; i++) {
				this.bodyPool.put(this.bodyList[i]);
			}
			this.bodyList = [];
		}
		if (this.snakerPosition) {
			this.snakerPosition = [];
			this.x = this.snaker.node.x;
			this.y = this.snaker.node.y;
			this.snakerPosition.unshift([this.x, this.y])
		}
		this.snaker.initSnaker();
		this.snaker.addListenEvent();
		this.score = 0;
		this.scoreDisplay.string = 'Score: ' + this.score.toString();
		this.enabled = true;
		// set button and gameover text out of screen
		this.btnNode.active = false;
		this.gameOverNode.active = false;
		// reset snaker position
		this.snaker.startMoveAt();
	},

	createNewFood() {
		let newFood = null;
		if (this.foodPool.size() > 0) {
			newFood = this.foodPool.get();
		} else {
			newFood = cc.instantiate(this.foodPrefab);
		}
		this.node.addChild(newFood);
		newFood.setPosition(this.getNewFoodPosition());

		// 在Food组件上暂存 Game 对象的引用
		newFood.getComponent('Food').game = this;
	},

	destroyFood(food) {
		this.foodPool.put(food);
		this.createNewFood();
	},

	createNewBody() {
		let body = null;
		if (this.bodyPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
			body = this.bodyPool.get();
			this.bodyList.push(body);
			// 为body设置一个位置
			body.parent = this.body;
			body.setPosition(this.snakerPosition[this.bodyList.length-1][0], this.snakerPosition[this.bodyList.length-1][1]);
			body.getComponent('Body').init(); //接下来就可以调用 body 身上的脚本进行初始化
		} else {
			for (let j = 0; j < this.bodyCount; j++) {
				this.bodyPool.put(this.bodyList[j]);
			}
			this.bodyList = [];
		}
	},

	move() {
		//获取 snaker head 的位置
		this.x = this.snaker.node.getPosition().x;
		this.y = this.snaker.node.getPosition().y;
		this.snakerPosition.unshift([this.x, this.y]);

		if (this.bodyList) {
			for (let k = 0; k < this.bodyList.length; k++) {
				this.bodyList[k].setPosition(this.snakerPosition[k + 1][0], this.snakerPosition[k + 1][1])
			}
		}
	},


	gainScore: function () {
		this.score += 1;
		// 更新 scoreDisplay Label 的文字
		this.scoreDisplay.string = 'Score: ' + this.score.toString();
		// 播放得分音效
		cc.audioEngine.playEffect(this.scoreAudio, false);
	},

	getNewFoodPosition() {
		let FoodX = Math.floor((Math.random() - 0.5) * 2 * this.node.width / 40) * 20;
		let FoodY = Math.ceil((Math.random() - 0.5) * 2 * this.node.height / 40) * 20;
		return cc.v2(FoodX, FoodY);
	},


	update(dt) {
		if (this.snaker.timer < this.snaker.snakerSpeed) {
			this.snaker.timer += dt;
		} else {
			//边界判断
			if (this.snaker.judgement()) {
				this.snaker.onDestroy();
				this.enabled = false;
				this.gameOverNode.active = true;
				this.btnNode.active = true;
			} else {
				if (this.snaker.currentDirection == this.snaker.left) {
					this.snaker.node.x -= 20;
					this.snaker.timer = 0;
				} else if (this.snaker.currentDirection == this.snaker.right) {
					this.snaker.node.x += 20;
					this.snaker.timer = 0;
				} else if (this.snaker.currentDirection == this.snaker.up) {
					this.snaker.node.y += 20;
					this.snaker.timer = 0;
				} else if (this.snaker.currentDirection == this.snaker.down) {
					this.snaker.node.y -= 20;
					this.snaker.timer = 0;
				}

				this.move();

				this.snakerPosition.splice(this.bodyCount - this.bodyPool.size() + 1);
			}
		}
	},
});