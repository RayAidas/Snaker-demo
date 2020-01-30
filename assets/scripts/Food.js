cc.Class({
	extends: cc.Component,

	properties: {
		// food和snaker-head之间的距离小于这个数值时，就会完成收集
		pickRadius: 0,
	},

	onLoad() {},

	init() {},

	reuse() {},

	getSnakerDistance() {
		// 根据 snaker 节点位置判断距离
		let snakerPos = this.game.snaker.node.getPosition();
		// 根据两点位置计算两点之间距离
		let dist = this.node.position.sub(snakerPos).mag();
		return dist;
	},

	onPicked() {
		this.game.gainScore();
		this.game.destroyFood(this.node);
		this.game.createNewBody();
	},

	update(dt) {
		if (this.getSnakerDistance() <= this.pickRadius) {
			// 调用收集行为
			// this.enable = false;
			this.onPicked();
			return;
		}
	},
});