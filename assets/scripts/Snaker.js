cc.Class({
	extends: cc.Component,

	properties: {
		up: 1,
		left: 2,
		down: -1,
		right: -2,
		currentDirection: 1,
		spriteAtlas: cc.SpriteAtlas,
		timer: 0,
		judge: false
	},

	initSnaker() {
		//snaker的移动速度
		this.snakerSpeed = 0.5;
		let sprite = this.node.getComponent(cc.Sprite);
		sprite.spriteFrame = this.spriteAtlas.getSpriteFrame('head_up');
		this.judge = false;
		//init snaker direction
		this.currentDirection = this.up;
		// init snaker position
		this.node.setPosition(0, 0);
	},

	addListenEvent() {
		//添加键盘监听事件
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
	},

	onDestroy() {
		//取消键盘监听事件
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
	},

	//边界判断
	judgement() {
		if (this.judge) {
			return true;
		} else if ((this.node.y == this.node.parent.height / 2 && this.currentDirection == this.up) ||
			(this.node.y == -((this.node.parent.height / 2) - this.node.height) && this.currentDirection == this.down) ||
			(this.node.x == -this.node.parent.width / 2 && this.currentDirection == this.left) ||
			(this.node.x == (this.node.parent.width / 2) - this.node.width) && this.currentDirection == this.right) {
			if (this.timer > this.snakerSpeed) {
				return true
			} else {
				return false;
			}
		} else {
			return false;
		}
	},

	in_array(stringToSearch, arrayToSearch) {
		for (let s = 0; s < arrayToSearch.length; s++) {
			let thisEntry = arrayToSearch[s].toString();
			if (thisEntry == stringToSearch.toString()) {
				return true;
			}
		}
		return false;
	},

	move() {
		this.game.move();
		// 获取 snaker head 的位置
		this.x = this.node.x;
		this.y = this.node.y;
		this.judge = this.in_array([this.x, this.y], this.game.snakerPosition.slice(1));
	},

	//根据按键换蛇头方向图片
	onKeyDown(event) {
		let sprite = this.node.getComponent(cc.Sprite);

		if (event.keyCode == cc.macro.KEY.a) {
			if (Math.abs(Math.abs(this.currentDirection) - Math.abs(this.left)) == 1 && !this.judgement()) {
				if (this.node.x == -this.node.parent.width / 2) {
					this.node.x -= 20;
					sprite.spriteFrame = this.spriteAtlas.getSpriteFrame('head_left');
					this.judge = true;
					return;
				}

				this.timer = 0;
				this.currentDirection = this.left
				this.node.x -= 20;
				sprite.spriteFrame = this.spriteAtlas.getSpriteFrame('head_left');
				this.move();
			}
		} else if (event.keyCode == cc.macro.KEY.d) {
			if (Math.abs(Math.abs(this.currentDirection) - Math.abs(this.right)) == 1 && !this.judgement()) {
				if (this.node.x == (this.node.parent.width / 2) - this.node.width) {
					this.node.x += 20
					sprite.spriteFrame = this.spriteAtlas.getSpriteFrame('head_right');
					this.judge = true;
					return;
				}
				this.timer = 0;
				this.currentDirection = this.right;
				this.node.x += 20;
				sprite.spriteFrame = this.spriteAtlas.getSpriteFrame('head_right');
				this.move();
			}
		} else if (event.keyCode == cc.macro.KEY.w) {
			if (Math.abs(Math.abs(this.currentDirection) - Math.abs(this.up)) == 1 && !this.judgement()) {
				if (this.node.y == this.node.parent.height / 2) {
					this.node.y += 20;
					sprite.spriteFrame = this.spriteAtlas.getSpriteFrame('head_up');
					this.judge = true;
					return;
				}
				this.timer = 0;
				this.currentDirection = this.up;
				this.node.y += 20;
				sprite.spriteFrame = this.spriteAtlas.getSpriteFrame('head_up');
				this.move();
			}
		} else if (event.keyCode == cc.macro.KEY.s) {
			if (Math.abs(Math.abs(this.currentDirection) - Math.abs(this.down)) == 1 && !this.judgement()) {
				if (this.node.y == -((this.node.parent.height / 2) - this.node.height)) {
					this.node.y -= 20;
					sprite.spriteFrame = this.spriteAtlas.getSpriteFrame('head_down');
					this.judge = true;
					return;
				}
				this.timer = 0;
				this.currentDirection = this.down;
				this.node.y -= 20;
				sprite.spriteFrame = this.spriteAtlas.getSpriteFrame('head_down');
				this.move();
			}
		}
	},

	startMoveAt() {
		this.enabled = true;
	},

	update(dt) {
		this.timer += dt;
	},
});