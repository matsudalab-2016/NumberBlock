"use strict";

enchant();

function createStartScene() {
  var core = Core.instance;
  var scene = new Scene();

  var begin = new Sprite(1000,600);
  begin.image = core.assets['img/start_screen.png'];
  begin.frame = 0;
  begin.x = 0;
  begin.y = 0;
  scene.addChild(begin);

  var start = new Sprite(341,99);
  start.image = core.assets['img/start.png'];
  start.frame = 0;
  start.x = 300;
  start.y = 300;
  start.scaleX = 0.5;
  start.scaleY = 0.5;
  scene.addChild(start);

  var explain = new Sprite(386,89);
  explain.image = core.assets['img/explain.png'];
  explain.frame = 0;
  explain.x = 280;
  explain.y = 370;
  explain.scaleX = 0.5;
  explain.scaleY = 0.5;
  scene.addChild(explain);

  start.addEventListener("touchend", function() {
    core.popScene();
  });

  explain.addEventListener("touchend", function() {
    var explain2 = new Sprite(1000,600);
    explain2.image = core.assets['img/explain2.png'];
    explain2.frame = 0;
    explain2.x = 0;
    explain2.y = 0;
    scene.addChild(explain2);
    explain2.addEventListener("touchend", function() {
      scene.removeChild(explain2);
    });
  });

  return scene;
}
