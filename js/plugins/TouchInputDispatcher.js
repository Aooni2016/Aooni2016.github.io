//=============================================================================
// TouchInputDispatcher.js
//=============================================================================

/*:
 * @plugindesc get the cursor position, set common events to touch input
 * @author Sasuke KANNAZUKI
 * *
 * @help
 * *** Plugin Commands
 * parameters in brackets are omissible.
 *
 * SetCoordOnTrigger <obj> <varIdToX> <varIdToY>
 * SetCommonOnTrigger <commonEvId>
 *  when either mouse click or touch panel, former is get position,
 *  and latter can invoke a common event.
 * SetCoordOnLongPress <obj> <varIdToX> <varIdToY> [<intervalFrame>]
 * SetCommonOnLongPress <commonEvId> [<intervalFrame>]
 *  invokes when either mouse or touch panel is being pressed long.
 * SetCoordOnRelease <obj> <varIdToX> <varIdToY>
 * SetCommonOnRelease <commonEvId>
 *  invokes when both mouse buttons and touch panel is released.
 * SetCoordOnMove <obj> <varIdToX> <varIdToY> [<intervalFrame>]
 * SetCommonOnMove <commonEvId> [<intervalFrame>]
 *  keep invoking when either mouse moved or touch panel swiped.
 * SetCoordOnHover <obj> <varIdToX> <varIdToY> [<intervalFrame>]
 * SetCommonOnHover <commonEvId> [<intervalFrame>]
 *  keep invoking when the mouse cursor is in the game screen.
 *
 * where, explain how to set above parameters.
 * <obj>: the method what kind of coordinate value you need to get.
 *  either sp, screenpixel, dd or displaydot: coords on the screen.
 *  either sg, screengrid, dg or displaygrid: tile coordination on screen.
 *  either mc, mapcoord, mg, mapgrid: the tile coordination of the map.
 *  either mp, mappixel, md, or mapdot: coordination from (0,0) of the map.
 * <varIdToX> <varIdToY>: variable id to restore the coordinations.
 *  you can use not only immidiate value, but also variable name.
 * <commoEvId>: common event id to invoke.
 *  you can use not only immidiate value, but also common event name.
 * <intervalFrame>: the frames until it invokes again since once invoked.
 *  default value is 1.
 *
 * ResetOnTrigger
 * ResetOnLongPress
 * ResetOnRelease
 * ResetOnMove
 * ResetOnHover
 *  resets each setting above.
 *
 * SetInterlockSwitch <switchId>
 *  after the setting, the switch expresses whether the mouse is pressed or
 *  touch panel is tapped.
 *  you can use not only immidiate value, but also switch name.
 * ResetInterlockSwitch
 *  reset the above setting.
 *
 * ***Script or 'Move Routing -> Script'
 * step1. change plugin name's top capital letter to lower-case.
 * step2. put round brackets and separate with comma.
 *
 * ex) SetCoordOnTrigger <obj> <varIdToX> <varIdToY>
 * changes to
 * this.setCoordOnTrigger(<obj>, <varIdToX>, <varIdToY>);
 *
 * ***Note:
 * - this plugin applies only on map scene, not on battle scene.
 */
/*:ja
 * @plugindesc タッチ入力と連動してコモンイベントを起動できます。
 * @author 神無月サスケ
 * *
 * @help
 * このプラグインはタッチデバイスのトリガに応じて次のことが出来ます。
 * ・ポインタの座標を知る
 * ・トリガに応じてコモンイベントを起動可能
 * 
 * ■プラグインコマンド
 * []でくくったオプションは省略可能です。
 *
 * SetCoordOnTrigger <obj> <varIdToX> <varIdToY>
 * SetCommonOnTrigger <commonEvId>
 *  マウスのクリックかタッチパネルのタップ時に、前者は座標を取得、
 *  後者はコモンイベントを起動します。
 * SetCoordOnLongPress <obj> <varIdToX> <varIdToY> [<intervalFrame>]
 * SetCommonOnLongPress <commonEvId> [<intervalFrame>]
 *  同様にマウスやタッチデバイスが長く押され続けたときに起動します。
 * SetCoordOnRelease <obj> <varIdToX> <varIdToY>
 * SetCommonOnRelease <commonEvId>
 *  同様にマウスやタッチデバイスが離された時に起動します。
 * SetCoordOnMove <obj> <varIdToX> <varIdToY> [<intervalFrame>]
 * SetCommonOnMove <commonEvId> [<intervalFrame>]
 *  同様にマウスやタッチデバイスが動いている間ずっと起動し続けます。
 * SetCoordOnHover <obj> <varIdToX> <varIdToY> [<intervalFrame>]
 * SetCommonOnHover <commonEvId> [<intervalFrame>]
 *  同様にマウスやタッチデバイスが画面内にある間ずっと起動し続けます。
 *
 * ・上記のパラメータについての説明：
 * <obj>: 取得したい座標のタイプを設定します。
 *  sp, screenpixel, dd, displaydot: スクリーン上のカーソル座標
 *  sg, screengrid, dg, displaygrid: スクリーン左上を原点としたタイル座標
 *  mc, mapcoord, mg, mapgrid: マップ上のタイル座標
 *  mp, mappixel, md, mapdot: マップ左上を(0,0)としたカーソル座標
 * <varIdToX> <varIdToY>: X座標とY座標を記録する変数のIDです。
 *  数値のほかに、Vを付けて変数の値、変数名での指定が可能です。
 * <commoEvId>: 起動するコモンイベントのIDです。
 *  数値のほかに、Vを付けて変数の値、コモンイベント名での指定が可能です。
 * <intervalFrame>: 一度起動した後、このフレーム数の間起動を行いません。
 *  省略した場合は1になります。
 *
 * ResetOnTrigger
 * ResetOnLongPress
 * ResetOnRelease
 * ResetOnMove
 * ResetOnHover
 *  上記で行った設定を元に戻す時に呼び出します。
 *
 * SetInterlockSwitch <switchId>
 *  この設定を行うと、指定したスイッチIDが、クリック時はON、そうでない時はOFFに
 *  自動的に切り替わるようになります。
 *  <switchId> には数値の他に、Vを付けて変数の値、スイッチ名が指定可能です。
 * ResetInterlockSwitch
 *  上記の設定を解除します。
 *
 * ■イベントコマンド「スクリプト」または「移動ルートの設定→スクリプト」
 * ほとんど同じ名前の関数が使えます。
 * ステップ1. コマンド名の頭にthis.を付け、一文字目を小文字にします。
 * ステップ2. 引数を();でくくり、引数同士の間に,を入れます。
 *
 * 例) SetCoordOnTrigger <obj> <varIdToX> <varIdToY>
 * は、スクリプトでは以下のように指定します。
 * this.setCoordOnTrigger(<obj>, <varIdToX>, <varIdToY>);
 *
 * ■注意
 * このプラグインはマップ専用です。戦闘中は無効です。
 */

(function() {

  //
  // define constant values
  //
  var DISPATCH_COMMON_ID = 9999;

  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    switch (command) {
    case 'SetCoordOnTrigger':
      this.setCoordOnTrigger(args[0], args[1], args[2]);
      break;
    case 'SetCommonOnTrigger':
      this.setCommonOnTrigger(args[0]);
      break;
    case 'ResetOnTrigger':
      this.resetOnTrigger();
      break;
    case 'SetCoordOnLongPress':
      this.setCoordOnLongPress(args[0], args[1], args[2], args[3]);
      break;
    case 'SetCommonOnLongPress':
      this.setCommonOnLongPress(args[0], args[1]);
      break;
    case 'ResetOnLongPress':
      this.resetOnLongPress();
      break;
    case 'SetCoordOnRelease':
      this.setCoordOnRelease(args[0], args[1], args[2]);
      break;
    case 'SetCommonOnRelease':
      this.setCommonOnRelease(args[0]);
      break;
    case 'ResetOnRelease':
      this.resetOnRelease();
      break;
    case 'SetCoordOnMove':
      this.setCoordOnMove(args[0], args[1], args[2], args[3]);
      break;
    case 'SetCommonOnMove':
      this.setCommonOnMove(args[0], args[1]);
      break;
    case 'ResetOnMove':
      this.resetOnMove();
      break;
    case 'SetCoordOnHover':
      this.setCoordOnHover(args[0], args[1], args[2], args[3]);
      break;
    case 'SetCommonOnHover':
      this.setCommonOnHover(args[0], args[1]);
      break;
    case 'ResetOnHover':
      this.resetOnHover();
      break;
    case 'SetInterlockSwitch':
      this.setInterlockSwitch(args[0]);
      break;
    case 'ResetInterlockSwitch':
      this.resetInterlockSwitch();
      break;
    }
  };

  //
  // process parameters
  //
  var getCommonEventIdWhoseNameIs = function (name) {
    var commonEvent;
    for (var i = 0; i < $dataCommonEvents.length; i++) {
      commonEvent = $dataCommonEvents[i];
      if (commonEvent && commonEvent.name === name) {
        return i;
      }
    }
    return 0;
  };

  var getCommonEventIdFromParam = function (idNotation) {
    var reg;
    if (reg = (/^(V?)([0-9]+)/i).exec(idNotation)) {
      return reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
    } else {
      return getCommonEventIdWhoseNameIs(idNotation);
    }
  };

  var getVariableIdWhoseNameIs = function (name) {
    var varNames = $dataSystem.variables;
    for (var i = 1; i < varNames.length; i++) {
      if (varNames[i] === name) {
        return i;
      }
    }
    return 0;
  };

  var getVariableIdFromParam = function (varIdNotation) {
    var reg;
    if (reg = (/^(V?)([0-9]+)/i).exec(varIdNotation)) {
      return reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
    } else {
      return getVariableIdWhoseNameIs(varIdNotation);
    }
  };

  var getSwitchIdWhoseNameIs = function (name) {
    var swNames = $dataSystem.switches;
    for (var i = 1; i < swNames.length; i++) {
      if (swNames[i] === name) {
        return i;
      }
    }
    return 0;
  };

  var getSwitchIdFromParam = function (swIdNotation) {
    var reg;
    if (reg = (/^(V?)([0-9]+)/i).exec(swIdNotation)) {
      return reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
    } else {
      return getSwitchIdWhoseNameIs(swIdNotation);
    }
  };

  //
  // find position
  //
  var getX = function (method) {
    switch (method) {
    case 'sp':
    case 'screenpixel':
    case 'dd':
    case 'displaydot':
      return TouchInput.x;
    case 'sg':
    case 'screengrid':
    case 'dg':
    case 'displaygrid':
      return Math.floor(TouchInput.x / $gameMap.tileWidth());
    case 'mc':
    case 'mapcoord':
    case 'mg':
    case 'mapgrid':
      return $gameMap.canvasToMapX(TouchInput.x);
    case 'mp':
    case 'mappixel':
    case 'md':
    case 'mapdot':
      return $gameMap.displayX() * $gameMap.tileWidth() + TouchInput.x;
    default: // something is wrong
      return TouchInput.x;
    }
  };

  var getY = function (method) {
    switch (method) {
    case 'sp':
    case 'screenpixel':
    case 'dd':
    case 'displaydot':
      return TouchInput.y;
    case 'sg':
    case 'screengrid':
    case 'dg':
    case 'displaygrid':
      return Math.floor(TouchInput.y / $gameMap.tileHeight());
    case 'mc':
    case 'mapcoord':
    case 'mg':
    case 'mapgrid':
      return $gameMap.canvasToMapY(TouchInput.y);
    case 'mp':
    case 'mappixel':
    case 'md':
    case 'mapdot':
      return $gameMap.displayY() * $gameMap.tileHeight() + TouchInput.y;
    default: // something is wrong
      return TouchInput.y;
    }
  };

  //
  // general setters
  //
  var setCoordVariable = function (obj, xVarId, yVarId) {
    // note: all parameters may be notation.
    var x = getVariableIdFromParam(String(xVarId));
    var y = getVariableIdFromParam(String(yVarId));
    if (x && y) {
      $gameVariables.setValue(x, getX(obj));
      $gameVariables.setValue(y, getY(obj));
    }
  };

  var setCommonEvent = function (CommonId) {
    // note: parameter may be notation.
    var c = getCommonEventIdFromParam(String(CommonId));
    if ($dataCommonEvents[c]) {
      var list = $dataCommonEvents[c].list;
      if (!$gameMap.isEventRunning()) {
        $gameMap._interpreter.setup(list, DISPATCH_COMMON_ID);
      } else if (!$gameMap._interpreter._childInterpreter) {
        if ($gameMap._interpreter.eventId() !== DISPATCH_COMMON_ID) {
          $gameMap._interpreter.setupChild(list, DISPATCH_COMMON_ID);
        }
      }
    }
  };

  //
  // construct touch input trigger table
  //
  var _Game_System_initialze = Game_System.prototype.initialze;
  Game_System.prototype.initialze = function () {
    _Game_System_initialze.call(this);
    this.touchInputTable = null;
    this.interLockSwitchId = null;
  };

  Game_System.prototype.setCoord = function (trig, obj, xId, yId, interval) {
    var s = this.touchInputTable = this.touchInputTable || {};
    var t = s[trig] = s[trig] || {};
    t.method = obj;
    t.xVarId = xId;
    t.yVarId = yId;
    if (interval != null) {
      t.interval = Number(interval);
      t.count = t.interval;
    }
  };

  Game_System.prototype.setCommon = function (trig, commonId, interval) {
    var s = this.touchInputTable = this.touchInputTable || {};
    var t = s[trig] = s[trig] || {};
    t.commonId = commonId;
    if (interval != null) {
      t.interval = Number(interval);
      t.count = t.interval;
    }
  };

  Game_System.prototype.resetTouchEvent = function (trig) {
    var s = $gameSystem.touchInputTable;
    if (!s || !s[trig]) {
      return;
    }
    delete s[trig];
  };

  //
  // functions for calling from 'script'.
  //
  Game_CharacterBase.prototype.setCoordOnTrigger =
  Game_Interpreter.prototype.setCoordOnTrigger = function(obj, xId, yId) {
    $gameSystem.setCoord('trigger', obj, xId, yId);
  };

  Game_CharacterBase.prototype.setCommonOnTrigger =
  Game_Interpreter.prototype.setCommonOnTrigger = function(cId) {
    $gameSystem.setCommon('trigger', cId);
  };

  Game_CharacterBase.prototype.resetOnTrigger =
  Game_Interpreter.prototype.resetOnTrigger = function() {
    $gameSystem.resetTouchEvent('trigger');
  };

  Game_CharacterBase.prototype.setCoordOnLongPress =
  Game_Interpreter.prototype.setCoordOnLongPress = function(obj, xId, yId,
   interval) {
    $gameSystem.setCoord('longpress', obj, xId, yId, interval);
  };

  Game_CharacterBase.prototype.setCommonOnLongPress =
  Game_Interpreter.prototype.setCommonOnLongPress = function(cId, interval) {
    $gameSystem.setCommon('longpress', cId, interval);
  };

  Game_CharacterBase.prototype.resetOnLongPress =
  Game_Interpreter.prototype.resetOnLongPress = function() {
    $gameSystem.resetTouchEvent('longpress');
  };

  Game_CharacterBase.prototype.setCoordOnRelease =
  Game_Interpreter.prototype.setCoordOnRelease = function(obj, xId, yId) {
    $gameSystem.setCoord('release', obj, xId, yId);
  };

  Game_CharacterBase.prototype.setCommonOnRelease =
  Game_Interpreter.prototype.setCommonOnRelease = function(cId) {
    $gameSystem.setCommon('release', cId);
  };

  Game_CharacterBase.prototype.resetOnRelease =
  Game_Interpreter.prototype.resetOnRelease = function() {
    $gameSystem.resetTouchEvent('release');
  };

  Game_CharacterBase.prototype.setCoordOnMove =
  Game_Interpreter.prototype.setCoordOnMove = function(obj, xId, yId,
   interval) {
    $gameSystem.setCoord('move', obj, xId, yId, interval);
  };

  Game_CharacterBase.prototype.setCommonOnMove =
  Game_Interpreter.prototype.setCommonOnMove = function(cId, interval) {
    $gameSystem.setCommon('move', cId, interval);
  };

  Game_CharacterBase.prototype.resetOnMove =
  Game_Interpreter.prototype.resetOnMove = function() {
    $gameSystem.resetTouchEvent('move');
  };

  Game_CharacterBase.prototype.setCoordOnHover =
  Game_Interpreter.prototype.setCoordOnHover = function(obj, xId, yId,
   interval) {
    $gameSystem.setCoord('hover', obj, xId, yId, interval);
  };

  Game_CharacterBase.prototype.setCommonOnHover =
  Game_Interpreter.prototype.setCommonOnHover = function(cId, interval) {
    $gameSystem.setCommon('hover', cId, interval);
  };

  Game_CharacterBase.prototype.resetOnHover =
  Game_Interpreter.prototype.resetOnHover = function() {
    $gameSystem.resetTouchEvent('hover');
  };

  Game_CharacterBase.prototype.setInterlockSwitch =
  Game_Interpreter.prototype.setInterlockSwitch = function(swId) {
    $gameSystem.interLockSwitchId = getSwitchIdFromParam(swId);
  };

  Game_CharacterBase.prototype.resetInterlockSwitch =
  Game_Interpreter.prototype.resetInterlockSwitch = function() {
    $gameSystem.interLockSwitchId = null;
  };

  //
  // dispatchers
  //
  var conditionMet = function (t) {
    if (SceneManager._scene.constructor !== Scene_Map) {
      return false;
    } else if (t.interval == null) {
      return true;
    }
    t.count = (t.count + 1) % (t.interval + 1);
    return t.count === 0;
  };

  var isDispatcherSet = function (trig) {
    var s, t;
    if ((s = $gameSystem) && (t = s.touchInputTable)) {
      return !!t[trig];
    }
    return false;
  };

  var dispatchTrigger = function (trig) {
    var s, t, t2;
    if ((s = $gameSystem) && (t = s.touchInputTable)) {
      if ((t2 = t[trig]) && conditionMet(t2)) {
        if (t2.method) {
          setCoordVariable(t2.method, t2.xVarId, t2.yVarId);
        }
        if (t2.commonId){
          setCommonEvent(t2.commonId);
        }
      }
    }
  };

  var dispatchInterlockSwitch = function () {
    if ($gameSystem && $gameSystem.interLockSwitchId) {
      var id = $gameSystem.interLockSwitchId;
      $gameSwitches.setValue(id, TouchInput.isPressed());
    }
  };

  //
  // dispatcher caller
  //
  var _TouchInput_update = TouchInput.update;
  TouchInput.update = function () {
    _TouchInput_update.call(this);
    dispatchInterlockSwitch();
    if (this.isLongPressed()) {
      dispatchTrigger('longpress');
    }
    if (Graphics.isInsideCanvas(this.x, this.y)) {
      dispatchTrigger('hover');
    }
  };

  var _TouchInput_onTrigger = TouchInput._onTrigger;
  TouchInput._onTrigger = function (x, y) {
    _TouchInput_onTrigger.call(this, x, y);
    dispatchTrigger('trigger');
  };

  var _TouchInput_onRelease = TouchInput._onRelease;
  TouchInput._onRelease = function (x, y) {
    _TouchInput_onRelease.call(this, x, y);
    dispatchTrigger('release');
  };

  var _TouchInput_onMove = TouchInput._onMove;
  TouchInput._onMove = function(x, y) {
    _TouchInput_onMove.call(this, x, y);
    dispatchTrigger('move');
  };

  //
  // change specification
  //
  var _TouchInput_onMouseMove = TouchInput._onMouseMove;
  TouchInput._onMouseMove = function(event) {
    _TouchInput_onMouseMove.call(this, event);
    if (!this._mousePressed &&
      (isDispatcherSet('move') || isDispatcherSet('hover'))) {
      var x = Graphics.pageToCanvasX(event.pageX);
      var y = Graphics.pageToCanvasY(event.pageY);
      this._onMove(x, y);
    }
  };

  var isDispatcherRunning = function () {
    var interpreter = $gameMap._interpreter;
    return interpreter.isRunning() &&
     interpreter.eventId() === DISPATCH_COMMON_ID;
  };

  var _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk
  Scene_Map.prototype.isMapTouchOk = function() {
    return (this.isActive() && isDispatcherRunning()) ||
     _Scene_Map_isMapTouchOk.call(this);
};

  var _Game_Temp_clearDestination = Game_Temp.prototype.clearDestination;
  Game_Temp.prototype.clearDestination = function() {
    if (isDispatcherRunning()) {
      return;
    }
    _Game_Temp_clearDestination.call(this);
  };

})();
