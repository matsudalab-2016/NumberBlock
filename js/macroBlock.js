"use strict";

enchant();

var blockCords = [];
// blockCords -> [colorID][direction][position][x or y]

blockCords[0] = [
  [[ 0,  0], [ 0,  1], [ 0,  2], [ 0,  3]],
  [[ 0, -1], [ 1, -1], [ 2, -1], [ 3, -1]],
  [[-1, -1], [-1, -2], [-1, -3], [-1, -4]],
  [[-1,  0], [-2,  0], [-3,  0], [-4,  0]]
];

blockCords[1] = [
  [[ 0,  0], [ 0,  1], [ 1,  1], [ 1,  0]],
  [[ 0, -1], [ 1, -1], [ 1, -2], [ 0, -2]],
  [[-1, -1], [-1, -2], [-2, -2], [-2, -1]],
  [[-1,  0], [-2,  0], [-2,  1], [-1,  1]]
];

blockCords[2] = [
  [[ 0,  0], [ 1,  0], [ 1, -1], [ 2, -1]],
  [[ 0, -1], [ 0, -2], [-1, -2], [-1, -3]],
  [[-1, -1], [-2, -1], [-2,  0], [-3,  0]],
  [[-1,  0], [-1,  1], [ 0,  1], [ 0,  2]]
];

blockCords[3] = [
  [[ 0,  0], [ 1,  0], [ 1,  1], [ 2,  1]],
  [[ 0, -1], [ 0, -2], [ 1, -2], [ 1, -3]],
  [[-1, -1], [-2, -1], [-2, -2], [-3, -2]],
  [[-1,  0], [-1,  1], [-2,  1], [-2,  2]]
];

blockCords[4] = [
  [[ 0,  0], [ 0,  1], [ 1,  1], [ 2,  1]],
  [[ 0, -1], [ 1, -1], [ 1, -2], [ 1, -3]],
  [[-1, -1], [-1, -2], [-2, -2], [-3, -2]],
  [[-1,  0], [-2,  0], [-2,  1], [-2,  2]]
];

blockCords[5] = [
  [[ 0,  0], [ 1,  0], [ 2,  0], [ 2, -1]],
  [[ 0, -1], [ 0, -2], [ 0, -3], [-1, -3]],
  [[-1, -1], [-2, -1], [-3, -1], [-3,  0]],
  [[-1,  0], [-1,  1], [-1,  2], [ 0,  2]]
];

blockCords[6] = [
  [[ 0,  0], [ 1,  0], [ 2,  0], [ 1, -1]],
  [[ 0, -1], [ 0, -2], [ 0, -3], [-1, -2]],
  [[-1, -1], [-2, -1], [-3, -1], [-2,  0]],
  [[-1,  0], [-1,  1], [-1,  2], [ 0,  1]]
];

var MacroBlock = Class.create(Group, {
  initialize: function(colorID, initX, initY) {
    var core = Core.instance;

    // `this` will be an instance of enchant.Group
    Group.call(this);

    this.x = initX;
    this.y = initY;

    // the position a block should go back to
    this.baseX = initX;
    this.baseY = initY;

    // to be used in resetBlocks()
    this.initX = initX;
    this.initY = initY;

    this.colorID = colorID;
    this.direction = 0; // initial value
    this.numbers = getPermutation();

    this.isLeftPressed = false;

    this.handleDrag = function(ev) {
      // ev is a DOM MouseEvent (not enchant's one)
      var core = Core.instance;
      if ((core.activePlayer === 1 && ev.pageX >= 660) ||
          (core.activePlayer === 2 && ev.pageX <= 340)) {
        this.x = this.baseX;
        this.y = this.baseY;
        return;
      }

      this.moveTo(this.baseX + (ev.pageX - this.startX),
                  this.baseY + (ev.pageY - this.startY));
    }.bind(this);

    this.paintMacroBlock();
    this.paintNumberImgs();
  },

  handleClick: function(ev) {
    if (ev.button === 2) { return; } // disable right button dragging

    this.isLeftPressed = true;

    // the position where a mouse clicked
    this.startX = ev.x;
    this.startY = ev.y;

    var stage = Core.instance._element;
    stage.addEventListener("mousemove", this.handleDrag, false);
  },

  handleRelease: function(ev) {
    if (ev.button === 2) { return this.rotate(ev.x, ev.y); } // right click

    this.isLeftPressed = false;

    var stage = Core.instance._element;
    stage.removeEventListener("mousemove", this.handleDrag, false);

    var nearestPos = this.getNearestPos();
    if (!this.canBePlacedAt(nearestPos.x, nearestPos.y)) {
      this.x = this.baseX;
      this.y = this.baseY;
      return;
    }

    var core = Core.instance;

    core.board.paintMacroBlock(this, nearestPos.x, nearestPos.y);
    core.rootScene.removeChild(this);
    core.playerBlocks[core.activePlayer - 1][this.colorID] = null;

    resetBlocks();

    core.rootScene.removeChild(core.btnCover);

    addScore(1);

    core.state = (core.state === 0) ? 1 : 3;
  },

  rotate: function(cx, cy) {
    // cx, cy => the center of rotation (clicked position)
    while (this.lastChild) { this.removeChild(this.lastChild); }

    var l = Math.sqrt(Math.pow(this.x - cx, 2) + Math.pow(this.y - cy, 2));
    var theta = Math.atan2(this.y - cy, this.x - cx);

    var newX = cx + l * Math.sin(theta);
    var newY = cy - l * Math.cos(theta);

    if (this.isLeftPressed) {
      this.baseX += newX - this.x;
      this.baseY += newY - this.y;
    } else {
      this.baseX = newX;
      this.baseY = newY;
    }

    this.x = newX;
    this.y = newY;

    this.direction = (this.direction + 1) % 4;
    this.paintMacroBlock();
    this.paintNumberImgs();
  },

  paintMacroBlock: function() {
    var core = Core.instance;
    var blockSize = 30;

    for (var i = 0; i < 4; i++) {
      var block = new Sprite(blockSize, blockSize);
      block.image = core.assets["img/blocks.png"];
      block.frame = this.colorID;

      block.x = blockCords[this.colorID][this.direction][i][0] * blockSize;
      block.y = blockCords[this.colorID][this.direction][i][1] * blockSize;

      this.addChild(block);
    }
  },

  paintNumberImgs: function() {
    var core = Core.instance;
    for (var i = 0; i < 4; i++) {
      var numberImg = new Sprite(30 , 30);
      numberImg.image = core.assets["img/numbers.png"];
      numberImg.frame = this.numbers[i] -1;

      var blockSize = 30;
      numberImg.x = blockCords[this.colorID][this.direction][i][0] * blockSize;
      numberImg.y = blockCords[this.colorID][this.direction][i][1] * blockSize;

      numberImg.addEventListener("mousedown", function(ev) {
        this.handleClick(ev);
      }.bind(this));

      numberImg.addEventListener("mouseup", function(ev) {
        this.handleRelease(ev);
        moveBlock();
      }.bind(this));

      this.addChild(numberImg);
    }
  },

  getNearestPos: function() {
    var nearestX = Math.round((this.x - 380) / 30);
    var nearestY = Math.round((this.y - 260) / 30);

    return { x: nearestX, y: nearestY };
  },

  canBePlacedAt: function(x, y) {
    var board = Core.instance.board;
    var order = blockCords[this.colorID][this.direction];

    var checkSum = 0;
    for (var i = 0; i < 4; i++) {
      var relativeX = order[i][0];
      var relativeY = order[i][1];

      if (x + relativeX < 0 || 8 <= x + relativeX ||
          y + relativeY < 0 || 8 <= y + relativeY) {
        return false;
      }

      checkSum += board.nums[y + relativeY][x + relativeX];
    }

    return checkSum === 0;
  },

  resetPosition: function() {
    while (this.lastChild) { this.removeChild(this.lastChild); }

    this.x = this.initX;
    this.y = this.initY;

    this.direction = 0;

    this.paintMacroBlock();
    this.paintNumberImgs();
  }
});

function getPermutation() {
  var src = [1, 2, 3, 4];
  var dst = [];

  for (var i = 0; i < 4; i++) {
    var idx = Math.floor(Math.random() * (4 - i));
    var val = src.splice(idx, 1)[0];
    dst.push(val);
  }

  return dst;
}

function moveBlock() {
  var core = Core.instance;
  core.se = DOMSound.load("sound/put.mp3");
  core.se.volume = 0.5;
  core.se.play();
}

function resetBlocks() {
  var core = Core.instance;

  for (var i = 0; i < 7; i++) {
    var block = core.playerBlocks[core.activePlayer - 1][i];
    if (block) { block.resetPosition(); }
  }
}
