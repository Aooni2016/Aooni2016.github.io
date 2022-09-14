//=============================================================================
// InterlockPicture.js (ver1.2)
//=============================================================================

/*:
 * @plugindesc Interlock picture position with map, events, or another picture
 * @author Sasuke KANNAZUKI
 * *
 * @help This plugin does not provide plugin commands.
 * 
 * *** Notation 1 (Standard Mode)
 * Call following code at either 'Script' or 'Move Route' -> 'Script' :
 * this.setPictInterlock(<pictureId>, <mode> [,<id>, <doMove>]);
 * <pictureId> is target picture's id.
 * <mode>: 0=screen(default), 1=map, 2=event, 3=another picture
 * <id>: when mode is 2(event): event id. when -1:player, 0:this event.
 *       when mode is 3(picture): picture id
 * <doMove>: boolean :whether picture move to the target's center point
 *       this option is valid when mode is either 2 or 3.
 *       this is omissible option, and default value is false.
 *
 * ex：
 * this.setPictInterlock(1,1);     # interlock picture #1 with map
 * this.setPictInterlock(2,2,8);   # interlock picture #2 with event #8
 * this.setPictInterlock(1,0);     # reset to interlock picture #1
 * this.setPictInterlock(3,3,2);   # interlock picture #3 with picture #2
 * this.setPictInterlock(1,3,3);   # interlock picture #1 with picture #3
 * # by running above 2 lines continuous, interlock chain #2->#3->#1 is done.
 * # but after running follows, it will be error by cyclic reference!!
 * this.setPictInterlock(2,3,1);   # ***error!***
 *
 * *** Notation 2 (Advanced Mode)
 * - Processes moving picture to specified position at first.
 * - Call following code at either 'Script' or 'Move Route' -> 'Script' :
 * - Parameters in brackets are omissible.
 * this.InterlockPictureMap(<pictureId>, <tileX>, <tileY> [,
 *   <offsetX>, <offsetY>, <originDir>]);
 *  : interlocks with map.
 *  (<tileX>, <tileY>): initial position of tile map grid coord.
 *  (<offsetX>, <offsetY>): offset that to move to display
 *  <originDir>: determine the origin of the target tile.
 *   2,4,6,8: center-down, left-center, right-center, center-up
 *   1,3,7,9:left-down, right-down, left-up, right-up
 *   5:center of the tile
 * this.InterlockPicturePlayer(<pictureId>[, <offsetX>, <offsetY>, <originDir>,
 *   <isTileSize>]);
 * this.InterlockPictureEvent(<pictureId>, <eventIdNotation>
 *   [, <offsetX>, <offsetY>, <originDir>, <isTileSize>]);
 *  :interlocks with player, and event.
 *   <eventIdNotation>: immidiate value(ex.5)、V10(variable ID 10's value),
 *   or event name(Ex.Hiroshi)
 *   <isTileSize>: 0/set origin at the tile of player/event is.
 *    1/set origin considering the player/event's size.
 *   <originDir>: (1～9)origin of player/event. default：5
 * this.InterlockPictureOther(<pictureId>, <parentPictureId> [,
 *   <offsetX>, <offsetY>, <originDir>]);
 *  :interlocks with another picuture (where I call parent picture).
 *   <originDir>: (1～9) origin of the parent's position.
 *
 * ***note:
 * - interlocks only coords. not interlock origin or other settings.
 * - force set default if id specified event/picture is not exist.
 * - when you set mode 3, be sure to prevent cyclic refecence by yourself.
 * - be sure to reset(set mode 0) after the scene.
 *  otherwise, setting will remain forever.
 */
/*:ja
 * @plugindesc ピクチャの位置をマップやイベントなどと連動させます
 * @author 神無月サスケ
 * *
 * @help このプラグインには、プラグインコマンドはありません。
 * 
 * ■書式１（スタンダードモード）
 * 「移動ルートの設定」の「スクリプト」から以下の書式で呼び出してください。
 * ※イベントコマンド「スクリプト」でも可
 * this.setPictInterlock(<pictureId>, <mode> [,<id>, <doMove>]);
 * <pictureId> は、連動させるピクチャID です。
 * <mode>: 0/画面(既存), 1/マップ, 2/イベントorプレイヤー 3/他のピクチャ
 * <id>: <mode>が2の時：イベントID。-1の時はプレイヤー、0の時は「このイベント」
 *       <mode>が3の時：連動元のピクチャID
 * <doMove>: 最初にピクチャの原点を連動対象の中心点に移動するか
 *       (true/する, false/しない)
 *       <mode>が2か3の時のみ有効です。省略時は false になります。
 * 例：
 * this.setPictInterlock(1,1);     # ピクチャ1番をマップと連動
 * this.setPictInterlock(2,2,8);   # ピクチャ2番の動きをイベント8番のと連動
 * this.setPictInterlock(1,0);     # ピクチャ1番の連動をリセット。位置は留まる
 * this.setPictInterlock(3,3,2);   # ピクチャ3番の動きをピクチャ2番と連動
 * this.setPictInterlock(1,3,3);   # ピクチャ1番の動きを3番と連動。
 * # 上記2行を連続で行うと、2→3→1 の順番に連動
 * # 注：この状態で次を行うと、循環参照によりエラーとなる
 * this.setPictInterlock(2,3,1);   # 実行しないこと
 * 
 * ■書式２（アドバンスドモード）
 * 最初にピクチャの位置を対象の原点＋オフセット座標に移動して処理を行います。
 * 書式１と同様、移動ルートの設定でもイベントコマンド「スクリプト」でも可。
 * [] で囲ったパラメータは省略可能。
 * this.InterlockPictureMap(<pictureId>, <tileX>, <tileY> [,
 *   <offsetX>, <offsetY>, <originDir>]);
 *  マップと連動させます。
 *  (<tileX>, <tileY>): タイルのマスの初期座標
 *  (<offsetX>, <offsetY>): ずらすピクセル数
 *  <originDir>: そのマスのどこをピクチャの基点に合わせるか。
 *   2,4,6,8: マスの下中央、左中央、右中央、上中央
 *   1,3,7,9:マスの左下、右下、左上、右上
 *   5:マスの中心
 * this.InterlockPicturePlayer(<pictureId>[, <offsetX>, <offsetY>, <originDir>,
 *   <isTileSize>]);
 * this.InterlockPictureEvent(<pictureId>, <eventIdNotation>
 *   [, <offsetX>, <offsetY>, <originDir>, <isTileSize>]);
 *   順にプレイヤー、イベントと連動させます。
 *   <eventIdNotation>: 数値、V10(変数10番)、イベント名(例：ひろし)が設定可。
 *   <isTileSize>: 0/起点位置をプレイヤー、イベントのいるマスにする。
 *    1/起点位置をプレイヤー、イベントの現在のグラフィックサイズを考慮して決定
 *   <originDir>: (1～9)イベントのどの位置を原点とするか。省略時：5
 * this.InterlockPictureOther(<pictureId>, <parentPictureId> [,
 *   <offsetX>, <offsetY>, <originDir>]);
 *   他のピクチャと連動させます。
 *   <offset>: 親ピクチャとの相対距離
 *   <originDir>: (1～9)親ピクチャのどの位置を原点とするか。
 * 
 * ■注意：
 * - 連動するのは座標だけです。原点(中心、左上)の変更には連動しません。
 * - 該当するIDのイベントやピクチャが存在しない場合、デフォルト設定に戻します。
 * - <mode> を 3 にする場合、循環参照にならないように気を付けてください。
 *  チェックは一切行っていません。
 * - ピクチャを消去しない場合、使用後に必ずリセット(<mode>を0にする)を行ってください。
 *  さもないと、設定はずっと（マップ移動後も）残ります。
 */

(function() {

  //
  // base settings
  //
  var _Game_Picture_initialize = Game_Picture.prototype.initialize;
  Game_Picture.prototype.initialize = function() {
    _Game_Picture_initialize.call(this);
    this.interlockOriginX = null;
    this.interlockOriginY = null;
    this.interlockId = null;
    this.doMoveTarget = null;
    // following is for advanced mode setting.
    this.interlockOriginDir = null;
    this.tileBasedInterlock = null;
  };

  var getEventFromId = function (id) {
    return id >= 0 ? $gameMap.event(id) : $gamePlayer;
  };

  //
  // process parameters
  //
  var getEventIdWhoseNameIs = function (name) {
    var events = $gameMap.events();
    for (var i = 0; i < events.length; i++) {
      if (events[i].event().name === name) {
        return events[i].eventId();
      }
    }
    return 0;
  };

  var getEventIdFromParam = function (idNotation) {
    idNotation = String(idNotation);
    var reg;
    if (reg = (/^(V?)(\-?[0-9]+)/i).exec(idNotation)) {
      return reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
    } else {
      return getEventIdWhoseNameIs(idNotation);
    }
  };

  //
  // accessor from event move route script
  //
  Game_CharacterBase.prototype.setPictInterlock = function (pictureId, mode,
   id, doMove) {
    $gameScreen.setPictureInterlock(pictureId, mode, id, doMove);
  };

  Game_Event.prototype.setPictInterlock = function(pictureId, mode,
   id, doMove) {
    if (mode === 2 && id === 0) {
      id = this.eventId();
    }
    Game_CharacterBase.prototype.setPictInterlock.call(this, pictureId, mode,
     id, doMove);
  };

  Game_Player.prototype.setPictInterlock = function(pictureId, mode,
   id, doMove) {
    if (mode === 2 && id === 0) {
      id = -1;
    }
    Game_CharacterBase.prototype.setPictInterlock.call(this, pictureId, mode,
     id, doMove);
  };

  Game_Interpreter.prototype.setPictInterlock = function(pictureId, mode,
   id, doMove) {
    $gameScreen.setPictureInterlock(pictureId, mode, id, doMove);
  };

  Game_Screen.prototype.setPictureInterlock = function (pictureId, mode,
   id, doMove, offsetX, offsetY, originDir) {
    if (this.picture(pictureId)) {
      this.picture(pictureId).setInterlockMode(mode, id, doMove,
       offsetX, offsetY, originDir);
    }
  };

  //
  // picture interlock mode settings
  //
  Game_Picture.prototype.applyDefaultInterlockMode = function() {
    this.interlockMode = null;
  };

  Game_Picture.prototype.processDoMove = function(doMove, target,
   offsetX, offsetY, originDir) {
    // to determine the coordination, Sprite's information (ex. sprite's rect)
    // is required. These informations are set in Sprite side.
    if (doMove) {
      this._x = offsetX || 0
      this._y = offsetY || 0;
      this.interlockOriginDir = originDir || 0;
      this.doMoveTarget = target;
    } else {
      this.doMoveTarget = null;
    }
  };

  Game_Picture.prototype.setInterlockMode = function(mode, id, doMove,
   offsetX, offsetY, originDir) {
    this._x = this.x();
    this._y = this.y();
    this.interlockMode = mode;
    switch (this.interlockMode) {
    case 0: // defalut (screen)
      this.applyDefaultInterlockMode();
      break;
    case 1: // map
      this.processDoMove(doMove, true, offsetX, offsetY, originDir);
      this.interlockOriginX = $gameMap.displayX() * $gameMap.tileWidth();
      this.interlockOriginY = $gameMap.displayY() * $gameMap.tileHeight();
      break;
    case 2: // event
      id = getEventIdFromParam(id);
      var event = getEventFromId(id);
      if (event) {
        this.processDoMove(doMove, event, offsetX, offsetY, originDir);
        this.interlockOriginX = event.screenX();
        this.interlockOriginY = event.screenY();
        this.interlockId = id;
      } else {
        this.applyDefaultInterlockMode();
      }
      break;
    case 3: // another picture
      var picture = $gameScreen.picture(id);
      if (picture) {
        this.processDoMove(doMove, picture, offsetX, offsetY, originDir);
        this.interlockOriginX = picture.x();
        this.interlockOriginY = picture.y();
        this.interlockId = id;
      } else {
        this.applyDefaultInterlockMode();
      }
      break;
    default: // something is wrong
      this.applyDefaultInterlockMode();
      break;
    }
  };

  //
  // calc coorination
  //
  Game_Picture.prototype.x = function() {
    return this._x + this.xDiff();
  };

  Game_Picture.prototype.xDiff = function() {
    if (this.interlockMode) {
      switch (this.interlockMode) {
      case 1:
        var origin_x = $gameMap.displayX() * $gameMap.tileWidth();
        return this.interlockOriginX - origin_x;
      case 2:
        var event = getEventFromId(this.interlockId);
        return event.screenX() - this.interlockOriginX;
      case 3:
        var picture = $gameScreen.picture(this.interlockId);
        return picture.x() - this.interlockOriginX;
      }
    }
    return 0;
  };

  Game_Picture.prototype.xFromParent = function() {
    if (this.interlockMode) {
      switch (this.interlockMode) {
      case 1:
        return 0;
      case 2:
      case 3:
        return this._x - this.interlockOriginX;
      }
    }
    return 0;
  };

  Game_Picture.prototype.y = function() {
    return this._y + this.yDiff();
  };

  Game_Picture.prototype.yDiff = function() {
    if (this.interlockMode) {
      switch (this.interlockMode) {
      case 1:
        var origin_y = $gameMap.displayY() * $gameMap.tileHeight();
        return this.interlockOriginY - origin_y;
      case 2:
        var event = getEventFromId(this.interlockId);
        return event.screenY() - this.interlockOriginY;
      case 3:
        var picture = $gameScreen.picture(this.interlockId);
        return picture.y() - this.interlockOriginY;
      }
    }
    return 0;
  };

  Game_Picture.prototype.yFromParent = function() {
    if (this.interlockMode) {
      switch (this.interlockMode) {
      case 1:
        return 0;
      case 2:
      case 3:
        return this._y - this.interlockOriginY;
      }
    }
    return 0;
  };

  //
  // process doMove (set initialize position according to the target)
  //
  Sprite_Picture.prototype.updateGameObjectWithRect = function () {
    var picture = this.picture();
    if (picture.doMoveTarget) {
      var target = picture.doMoveTarget;
      var sprite, width, height;
      switch (picture.interlockMode) {
      case 1:
        picture._x += this.anchorOrgX() * $gameMap.tileWidth();
        picture._y += this.anchorOrgY() * $gameMap.tileHeight();
        break;
      case 2:
        var spriteSet = SceneManager._scene._spriteset;
        sprite = spriteSet._characterSprites.filter(function(cs){
          return cs && cs._character === target;
        })[0];
        if (picture.tileBasedInterlock !== 0) {
          width = sprite.patternWidth();
          height = sprite.patternHeight();
        } else {
          width = $gameMap.tileWidth();
          height = $gameMap.tileHeight();
        }
        break;
      case 3:
        sprite = this.parent.children.filter(function(ps){
          return ps && $gameScreen.picture(ps._pictureId) === target;
        })[0];
        width = sprite.bitmap ? sprite.bitmap.width : 0;
        height = sprite.bitmap ? sprite.bitmap.height : 0;
        break;
      }
      if ([2,3].contains(picture.interlockMode)) {
        picture._x += picture.interlockOriginX +
         Math.floor(width * (this.anchorOrgX() - sprite.anchor.x));
        picture._y += picture.interlockOriginY +
         Math.floor(height * (this.anchorOrgY() - sprite.anchor.y));
      }
      picture.doMoveTarget = null;
      this.x = picture.x();
      this.y = picture.y();
    }
  };

  var _Sprite_Picture_updatePosition = 
   Sprite_Picture.prototype.updatePosition;
  Sprite_Picture.prototype.updatePosition = function() {
    _Sprite_Picture_updatePosition.call(this);
    this.updateGameObjectWithRect();
  };

  //
  // setting anchor (for advance mode only)
  //
  Sprite_Picture.prototype.anchorOrgX = function () {
    if (!this.interlockOriginDir) {
      return 0.5;
    }
    var d = this.interlockOriginDir;
    return [3,6,9].contains(d) ? 1 : [1,4,7].contains(d) ? 0 : 0.5;
  };

  Sprite_Picture.prototype.anchorOrgY = function () {
    if (!this.interlockOriginDir) {
      return 0.5;
    }
    var d = this.interlockOriginDir;
    return [1,2,3].contains(d) ? 1 : [7,8,9].contains(d) ? 0 : 0.5;
  };

  //
  // advanced open methods
  //
  Game_CharacterBase.prototype.InterlockPictureMap = function (pictureId,
   x, y, offsetX, offsetY, originDir) {
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    var screenX = Math.round($gameMap.adjustX(x) * tw) + (offsetX || 0);
    var screenY = Math.round($gameMap.adjustY(y) * th) + (offsetY || 0);
    $gameScreen.setPictureInterlock(pictureId, 1, null, true, screenX, screenY,
     originDir);
  };

  Game_Interpreter.prototype.InterlockPictureMap =
   Game_CharacterBase.prototype.InterlockPictureMap;

  Game_CharacterBase.prototype.InterlockPictureEvent = function (pictureId, 
   idNotation, offsetX, offsetY, originDir, isTileBaseSize) {
    $gameScreen.setPictureInterlock(pictureId, 2, idNotation, true,
     offsetX, offsetY, originDir);
    $gameScreen.picture(pictureId).tileBasedInterlock = isTileBaseSize;
  };

  Game_Event.prototype.InterlockPictureEvent = function (pictureId, idNotation,
   offsetX, offsetY, originDir, isTileBaseSize) {
    if (idNotation == 0) {
      idNotation = this.eventId();
    }
    Game_CharacterBase.prototype.InterlockPictureEvent.call(this, pictureId,
     idNotation, offsetX, offsetY, originDir, isTileBaseSize);
  };

  Game_Interpreter.prototype.InterlockPictureEvent = 
   Game_Event.prototype.InterlockPictureEvent;

  Game_Player.prototype.InterlockPicturePlayer = function (pictureId,
   offsetX, offsetY, originDir, isTileBaseSize) {
    Game_CharacterBase.prototype.InterlockPictureEvent.call(this, pictureId,
     -1, offsetX, offsetY, originDir, isTileBaseSize);
  };

  Game_Interpreter.prototype.InterlockPicturePlayer =
   Game_Player.prototype.InterlockPicturePlayer;


  Game_CharacterBase.prototype.InterlockPictureOther = function (pictureId,
    parentPictId, offsetX, offsetY, originDir) {
    $gameScreen.setPictureInterlock(pictureId, 3, parentPictId, true,
     offsetX, offsetY, originDir);
  };

  Game_Interpreter.prototype.InterlockPictureOther = 
   Game_CharacterBase.prototype.InterlockPictureOther;

})();
