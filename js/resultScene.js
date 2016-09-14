"use strict";

enchant();

function createResultScene() {
  var core = Core.instance;
  var scene = new Scene();

  var score1 = core.scores[0];
  var score2 = core.scores[1];

  if (score1 > score2) {
    var back1 = new Sprite(236, 318);
    back1.image = core.assets["img/back1.png"]
    back1.x = 695;
    back1.y = -80;
    back1.scaleX = 10;
    back1.scaleY = 10;
    scene.addChild(back1);

    for (var i = 0; i < 200; i++) {
      sakura = new Sprite(34, 32);
      sakura.image = core.assets["img/sakura.gif"];

      var hanax = Math.floor(Math.random() * 1000);
      var hanay = Math.floor(Math.random() *  600);
      sakura.x = hanax;
      sakura.y = hanay;
      sakura.scaleX = 1;
      sakura.scaleY = 1;
      sakura.rotation = i;

      scene.addChild(sakura);
    }

    var win = new Sprite(845, 257);
    win.image = core.assets["img/win.png"];
    win.x = 90;
    win.y = 320;
    win.scaleX = 0.9;
    win.scaleY = 0.9;
    scene.addChild(win);

    var chara = new Sprite(375, 239);
    chara.image = core.assets["img/chara1.png"];
    chara.x = 260;
    chara.y = 130;
    chara.scaleX = 1.2;
    chara.scaleY = 1.2;
    scene.addChild(chara);
  } else if (score1 < score2) {
    var back2 = new Sprite(236, 318);
    back2.image = core.assets["img/back2.png"];
    back2.x = 695;
    back2.y = -80;
    back2.scaleX= 10;
    back2.scaleY= 10;
    scene.addChild(back2);

    for (var i = 0; i < 200; i++) {
      var sakura = new Sprite(34, 32);
      sakura.image = core.assets["img/sakura.gif"];
      var hanax = Math.floor(Math.random() * 1000);
      var hanay = Math.floor(Math.random() *  600);
      sakura.x = hanax;
      sakura.y = hanay;
      sakura.scaleX = 1;
      sakura.scaleY = 1;
      sakura.rotation = i;

      scene.addChild(sakura);
    }

    var win = new Sprite(845, 257);
    win.image = core.assets["img/win.png"];
    win.x = 75;
    win.y = 330;
    win.scaleX = 0.9;
    win.scaleY = 0.9;
    scene.addChild(win);

    var chara2 = new Sprite(158, 194);
    chara2.image = core.assets["img/chara2.png"];
    chara2.x = 380;
    chara2.y = 140;
    chara2.scaleX= 1.5;
    chara2.scaleY= 1.5;
    scene.addChild(chara2);
  } else { // score1 === score2
    var back3 = new Sprite(236, 318);
    back3.image = core.assets["img/back3.png"];
    back3.x = 695;
    back3.y = -80;
    back3.scaleX = 10;
    back3.scaleY = 10;
    scene.addChild(back3);

    var chara1 = new Sprite(375, 239);
    chara1.image = core.assets["img/chara1.png"];
    chara1.x = 30;
    chara1.y = 150;
    chara1.scaleX = 1.1;
    chara1.scaleY = 1.1;
    scene.addChild(chara1);

    var chara2 = new Sprite(158, 194);
    chara2.image = core.assets["img/chara2.png"];
    chara2.x = 630;
    chara2.y = 140;
    chara2.scaleX = 1.5;
    chara2.scaleY = 1.5;
    scene.addChild(chara2);

    var draw = new Sprite(641, 257);
    draw.image = core.assets["img/draw.png"];
    draw.x = 200;
    draw.y = 350;
    draw.scaleX = 0.8;
    draw.scaleY = 0.8;
    scene.addChild(draw);
  }

  return scene;
}
