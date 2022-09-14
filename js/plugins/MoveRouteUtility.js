//=============================================================================
// MoveRouteUtility.js
//=============================================================================

/*:
 * @plugindesc provides utility functions that calls from Move Route's Script.
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * usage: Write down following commands 'Script' in 'Move Route'
 *
 * [MOVE SPECIFIED STEPS]
 * this.moveForwards([step]);       #ex1. this.moveForwards(3);
 * this.moveBackwards([step]);
 * this.moveRight([step]);          #ex2. this.moveRight(); param default is 1
 * this.moveLeft([step]);
 * this.moveUp([step]);
 * this.moveDown([step]);
 * this.moveStraights(dir [,step]);
 * #=> dir : 2=down, 4=left, 6=right, 8=up
 * 
 * [MOVE LIKE A CRAB]
 * this.slide9oClockDir([step]);
 * this.slideLeft90Dir([step]);     # the same as above
 * this.slide3oClockDir([step]);
 * this.slideRight90Dir([step]);    # the same as above
 * 
 * [POSITION]
 * this.moveToward(x, y [,step]);      #ex. this.moveToward(5, 10);  1step
 * this.moveAwayFrom(x, y [,step]);    #ex. this.moveToward(5, 10, 4); 4steps
 * this.turnToward(x, y);
 * this.turnAwayFrom(x, y);
 *
 * [EVENT]
 * this.moveTowardEvent(eventId [,step]);
 * this.moveAwayFromEvent(eventId [,step]);
 * this.turnTowardEvent(eventId);
 * this.turnAwayFromEvent(eventId);
 *
 * [GRID]
 * this.setGrid(dir, pattern);
 * #=> Change grid (dir and pattern) of the event's image
 *     dir : 2=down, 4=left, 6=right, 8=up
 *     pattern : 0,1, or 2.
 * this.setImageGrid = function(name, index, dir, pattern);
 * #=> Change both image and grid.
 *     name, index : the name/index of the picture
 *
 * [SELF SWITCH]
 * this.setSelfSw(letter, value)
 * #=> letter : 'A', 'B', 'C' or 'D'. (must be capital)
 *     value  : true , false or 'flip'.
 *     ex1. this.setSelfSw('A', true);
 *     ex2. this.setSelfSw('B', false);
 */
/*:ja
 * @plugindesc 「移動ルートの設定」の「スクリプト」から呼び出す便利な関数集
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * 
 * イベントコマンド「移動ルートの設定」の「スクリプト」で以下を呼びだして下さい
 *
 * [歩数を指定して移動]
 * this.moveForwards([step]);       # 前進
 * this.moveBackwards([step]);      # 後退
 * this.moveRight([step]);          # 右に移動
 * this.moveLeft([step]);           # 左に移動
 * this.moveUp([step]);             # 上に移動
 * this.moveDown([step]);           # 下に移動
 * this.moveStraights(dir [,step]); # 数字で指定した方向に移動
 * #=> dir : 2=下, 4=上, 6=右, 8=左
 *     [step] : 歩数。省略時は1。
 * 例：this.moveForwards(3);        # 3歩前進
 *     this.moveRight();            # 1歩右に進む
 * 
 * [蟹歩き]
 * this.slide9oClockDir([step]);    # 9時方向(＝左90度)に向きを変えずに移動
 * this.slideLeft90Dir([step]);     # 上記と同じ
 * this.slide3oClockDir([step]);    # 3時方向(＝右90度)に向きを変えずに移動
 * this.slideRight90Dir([step]);    # 上記と同じ
 * #=>  [step] : 歩数。省略時は1。
 * 
 * [座標指定]
 * this.moveToward(x, y [,step]);   # 座標(x, y)に向かう
 * this.moveAwayFrom(x, y [,step]); # 座標(x, y)から離れる
 * this.turnToward(x, y);           # 座標(x, y)の方を向く
 * this.turnAwayFrom(x, y);         # 座標(x, y)の逆を向く
 * 例：this.moveToward(5, 10);      # 座標(5, 10)に1歩向かう
 *     this.moveToward(5, 10, 4);   # 座標(5, 10)に4歩向かう
 *
 * [イベント指定]
 * this.moveTowardEvent(eventId [,step]);   # IDがeventIdのイベントに近づく
 * this.moveAwayFromEvent(eventId [,step]); # IDがeventIdのイベントから離れる
 * this.turnTowardEvent(eventId);           # IDがeventIdのイベントの方を向く
 * this.turnAwayFromEvent(eventId);         # IDがeventIdのイベントの逆を向く
 *
 * [キャラクターの任意の方向/パターンを指定]
 * this.setGrid(dir, pattern);
 * #=> グリッド(向きとパターン)を指定します。
 *     dir : 2=上, 4=左, 6=右, 8=上
 *     pattern : 左から順に、0,1,2.
 * this.setImageGrid(name, index, dir, pattern);
 * #=> グリッドと画像を一括で指定します
 *     name, index : 画像の名前とインデックス(0～7)
 *
 * [セルフスイッチ操作]
 * this.setSelfSw(letter, value);
 * #=> letter : 'A', 'B', 'C' または 'D'. (大文字にしてください)
 *     value  : true または false. 'flip' の場合反転します。
 * 例： this.setSelfSw('A', true);    # セルフスイッチA を ON
 *      this.setSelfSw('B', false);   # セルフスイッチB を OFF
 */
(function() {

  // ------------------------------------------------------------
  // script iterator
  //
  Game_Character.prototype.initRepeatScript = function() {
    this._repeatScriptCount = 0;
    this._repeatScriptCallBack = null;
  };

  var _Game_Character_initMembers = Game_Character.prototype.initMembers;
  Game_Character.prototype.initMembers = function() {
    _Game_Character_initMembers.call(this);
    this.initRepeatScript();
  };

  var _Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    this.initRepeatScript();
    _Game_Event_setupPage.call(this);
  };

  //
  // set routine
  //
  Game_Character.prototype.setRepeatScript = function(callbackFn, step){
    this._repeatScriptCallBack = callbackFn.bind(this);
    this._repeatScriptCallBack();   // execute at least once.
    this._repeatScriptCount = Math.max((Number(step) || 1), 1);
  };

  //
  // execute routine
  //
  var _Game_Character_processMoveCommand =
   Game_Character.prototype.processMoveCommand;
  Game_Character.prototype.processMoveCommand = function(command) {
    this._repeatScriptCount = this._repeatScriptCount || 0;
    if (this._repeatScriptCount > 0) {
      this._repeatScriptCallBack();
      return;
    }
    _Game_Character_processMoveCommand.call(this, command);
  };

  var _Game_Character_advanceMoveRouteIndex =
   Game_Character.prototype.advanceMoveRouteIndex;
  Game_Character.prototype.advanceMoveRouteIndex = function() {
    if (this._repeatScriptCount > 0) {
      if (this.isMovementSucceeded() || this._moveRoute.skippable) {
        this._repeatScriptCount--;
      }
    }
    if (this._repeatScriptCount === 0) {
      _Game_Character_advanceMoveRouteIndex.call(this);
    }
  };

  // ------------------------------------------------------------
  // move several steps by 1 command
  //
  Game_Character.prototype.moveForwards = function(step) {
    this.moveStraights(this.direction(), step);
  };

  Game_Character.prototype.moveBackwards = function(step) {
    this.setRepeatScript(this.moveBackward, step);
  };

  Game_Character.prototype.moveRight = function(step) {
    this.moveStraights(6, step);
  };

  Game_Character.prototype.moveLeft = function(step) {
    this.moveStraights(4, step);
  };

  Game_Character.prototype.moveUp = function(step) {
    this.moveStraights(8, step);
  };

  Game_Character.prototype.moveDown = function(step) {
    this.moveStraights(2, step);
  };

  Game_Character.prototype.moveStraights = function(dir, step) {
    this.setRepeatScript(function () {
      this.moveStraight(dir);
    }, step);
  };

  // ------------------------------------------------------------
  // move like a crab
  //
  Game_Character.prototype.slide9oClockDir = function(step) {
    var dir;
    switch (this.direction()) {
    case 2:
      dir = 6;
      break;
    case 4:
      dir = 2;
      break;
    case 6:
      dir = 8;
      break;
    case 8:
      dir = 4;
      break;
    }
    this.setRepeatScript(function () {
      this.slideCallback(dir);
    }, step);
  };

  Game_Character.prototype.slide3oClockDir = function(step) {
    var dir;
    switch (this.direction()) {
    case 2:
      dir = 4;
      break;
    case 4:
      dir = 8;
      break;
    case 6:
      dir = 2;
      break;
    case 8:
      dir = 6;
      break;
    }
    this.setRepeatScript(function () {
      this.slideCallback(dir);
    }, step);
  };

  Game_Character.prototype.slideCallback = function(dir) {
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.moveStraight(dir);
    this.setDirectionFix(lastDirectionFix);
  };

  // make alias
  Game_Character.prototype.slideLeft90Dir =
   Game_Character.prototype.slide9oClockDir;

  Game_Character.prototype.slideRight90Dir =
   Game_Character.prototype.slide3oClockDir;

  // ------------------------------------------------------------
  // depends on specified position
  //
  Game_Character.prototype.moveToward = function(x, y, step) {
    this.setRepeatScript(function () {
      this.moveTowardCallback(x, y);
    }, step);
  };
  Game_Character.prototype.moveTowardCallback = function(x, y) {
    var sx = this.deltaXFrom(x);
    var sy = this.deltaYFrom(y);
    if (Math.abs(sx) > Math.abs(sy)) {
      this.moveStraight(sx > 0 ? 4 : 6);
      if (!this.isMovementSucceeded() && sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
      }
    } else if (sy !== 0) {
      this.moveStraight(sy > 0 ? 8 : 2);
      if (!this.isMovementSucceeded() && sx !== 0) {
        this.moveStraight(sx > 0 ? 4 : 6);
      }
    }
  };

  Game_Character.prototype.moveAwayFrom = function(x, y, step) {
    this.setRepeatScript(function () {
      this.moveAwayFromCallback(x, y);
    }, step);
  };
  Game_Character.prototype.moveAwayFromCallback = function(x, y) {
    var sx = this.deltaXFrom(x);
    var sy = this.deltaYFrom(y);
    if (Math.abs(sx) > Math.abs(sy)) {
      this.moveStraight(sx > 0 ? 6 : 4);
      if (!this.isMovementSucceeded() && sy !== 0) {
        this.moveStraight(sy > 0 ? 2 : 8);
      }
    } else if (sy !== 0) {
      this.moveStraight(sy > 0 ? 2 : 8);
      if (!this.isMovementSucceeded() && sx !== 0) {
        this.moveStraight(sx > 0 ? 6 : 4);
      }
    }
  };

  Game_Character.prototype.turnToward = function(x, y) {
    var sx = this.deltaXFrom(x);
    var sy = this.deltaYFrom(y);
    if (Math.abs(sx) > Math.abs(sy)) {
      this.setDirection(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
      this.setDirection(sy > 0 ? 8 : 2);
    }
  };

  Game_Character.prototype.turnAwayFrom = function(x, y) {
    var sx = this.deltaXFrom(x);
    var sy = this.deltaYFrom(y);
    if (Math.abs(sx) > Math.abs(sy)) {
      this.setDirection(sx > 0 ? 6 : 4);
    } else if (sy !== 0) {
      this.setDirection(sy > 0 ? 2 : 8);
    }
  };

  // ------------------------------------------------------------
  // depends on event position
  //
  Game_Character.prototype.moveTowardEvent = function(eventId, step) {
    this.setRepeatScript(function () {
      this.moveTowardEventCallback(eventId);
    }, step);
  };
  Game_Character.prototype.moveTowardEventCallback = function(eventId) {
    this.moveTowardCharacter($gameMap.event(eventId));
  };

  Game_Character.prototype.moveAwayFromEvent = function(eventId, step) {
    this.setRepeatScript(function () {
      this.moveAwayFromEventCallback(eventId);
    }, step);
  };
  Game_Character.prototype.moveAwayFromEventCallback = function(eventId) {
    this.moveAwayFromCharacter($gameMap.event(eventId));
  };

  Game_Character.prototype.turnTowardEvent = function(eventId) {
    this.turnTowardCharacter($gameMap.event(eventId));
  };

  Game_Character.prototype.turnAwayFromEvent = function(eventId) {
    this.turnAwayFromCharacter($gameMap.event(eventId));
  };

  // ------------------------------------------------------------
  // set grid
  // 
  Game_CharacterBase.prototype.setImageGrid = function(name, index, dir, pattern) {
    this.setImage(name, index);
    this.setGrid(dir, pattern);
  };

  Game_CharacterBase.prototype.setGrid = function(dir, pattern) {
    this._originalDirection = dir;
    this.setDirection(dir);
    this._originalPattern = pattern;
    this.setPattern(pattern);  
  };

  // ------------------------------------------------------------
  // set self switch
  //
  Game_CharacterBase.prototype.setSelfSw = function(letter, value) {
  };

  Game_Event.prototype.setSelfSw = function(letter, value) {
    if (letter.match(/^[A-D]$/)) {
      var key = [$gameMap.mapId(), this._eventId, letter];
      switch (value) {
      case 'flip':
        var originalValue = $gameSelfSwitches.value(key);
        $gameSelfSwitches.setValue(key, !originalValue);
        break;
      default:
        $gameSelfSwitches.setValue(key, !!value);
        break;
      }
    }
  };

})();
