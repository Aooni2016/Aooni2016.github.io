//=============================================================================
// CommonEventByWalk2.js
//=============================================================================

/*:
 * @plugindesc Invoke specified common event when player walks except event.
 * @author Sasuke KANNAZUKI
 *
 * @param Common Event Var ID
 * @desc Invoke common event whose ID is the variable's value. If the value is 0, do nothing.
 * @default 92
 *
 * @param Step Interval Var ID
 * @desc call common event staring to move and each the value's step. If the value is 0, invoke only starting to move.
 * @default 93
 *
 * @help
 * Plugin Commands：
 * CommonEventByWalk reset   // reset step count. at next step common event will invoke.
 * CommonEventByWalk resetByStop ON  // reset step count for each stop walking.
 * CommonEventByWalk resetByStop OFF // don't reset step count.(default mode)
 * 
 */
/*:ja
 * @plugindesc 歩き始める直前または特定の歩数毎にコモンイベントを呼び出します。
 * @author 神無月サスケ
 *
 * @param Common Event Var ID
 * @desc この変数の値をIDに持つコモンイベントを呼び出します。値が 0 の時は起動しません。
 * @default 92
 *
 * @param Step Interval Var ID
 * @desc この変数の値の歩数毎にコモンイベントを呼び出します。 値が 0 の場合は、歩き始めた時のみ呼び出します。
 * @default 93
 *
 * @help
 * プラグインコマンド：
 * CommonEventByWalk reset   // 歩数リセット。次の一歩からコモンイベント起動。
 * CommonEventByWalk resetByStop ON  // 立ち止まると歩数がリセットされるように
 * CommonEventByWalk resetByStop OFF // 立ち止まっても歩数は維持(デフォルト)
 */

(function() {
  //
  // scope variables
  //
  var resumed = false;
  var _doResetByStop = false;

  //
  // process parameters
  //
  var parameters = PluginManager.parameters('CommonEventByWalk2');
  var _forceCommonEventVarId = Number(parameters['Common Event Var ID'] || 92);
  var _stepIntervalVarId = Number(parameters['Step Interval Var ID'] || 93);

  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'CommonEventByWalk') {
      switch (args[0]) {
      case 'reset':
        resetStepCount();
        break;
      case 'resetByStop':
        switch (args[1]) {
        case 'ON':
          _doResetByStop = true;
          break;
        case 'OFF':
          _doResetByStop = false;
          break;
        }
        break;
      }
    }
  };

  //
  // functions for judge from parameters
  //
  var forceCommonEventId = function () {
    return $gameVariables.value(_forceCommonEventVarId);
  };

  var stepInterval = function () {
    return $gameVariables.value(_stepIntervalVarId);
  };

  var conditionMet = function () {
    var interval = stepInterval();
    var startingSteps = $gamePlayer._forceCommonEventStartingSteps;
    if (interval > 0) {
      return $gameParty.steps() > startingSteps && 
       ($gameParty.steps() - startingSteps + interval - 1) % interval === 0;
    } else if (interval === 0){
      return $gameParty.steps() - startingSteps === 1;
    }
  };

  var canInvoke = function () {
    var eventId = forceCommonEventId();
    return !!$dataCommonEvents[eventId];
  };

  var isWorking = function () {
    return $gamePlayer._forceCommonEventWorking;
  };

  var doResetByStop = function () {
    return _doResetByStop;
  };

  //
  // functions for force common event invocation
  //
  var invoke = function () {
    var eventId = forceCommonEventId();
    var event = $dataCommonEvents[eventId];
    if (event) {
      resumed = false;
      $gameMap._interpreter.setup(event.list);
    }
  };

  var resume = function () {
    resumed = true;
    $gameTemp.clearDestination();
  };

  var resetStepCount = function () {
    $gamePlayer._forceCommonEventStartingSteps = $gameParty.steps();
  };

  //
  // init member variables
  //
  var _Game_Player_initialize = Game_Player.prototype.initialize;
  Game_Player.prototype.initialize = function () {
    _Game_Player_initialize.call(this);
    this.resetForceCommonEvent();
  };

  Game_Player.prototype.resetForceCommonEvent = function () {
    this._forceCommonEventWorking = false;
    this._forceCommonEventId = 0;
    this._forceCommonEventStepInterval = null;
    this._forceCommonEventStartingSteps = null;
  };

  //
  // update member variables
  //
  Game_Player.prototype.updateForceCommonEvent = function () {
    if (this.forceCommonEventNeedsModify()) {
      this.modifyForceCommonEvent();
    }
  };

  Game_Player.prototype.forceCommonEventNeedsModify = function () {
    return this._forceCommonEventId !== forceCommonEventId() ||
     this._forceCommonEventStepInterval !== stepInterval();
  };

  Game_Player.prototype.modifyForceCommonEvent = function () {
    this._forceCommonEventId = forceCommonEventId();
    this._forceCommonEventStepInterval = stepInterval();
    this._forceCommonEventStartingSteps = $gameParty.steps();
    this._forceCommonEventWorking = canInvoke();
  };

  //
  // main functions
  //
  var _Game_Player_update = Game_Player.prototype.update;
  Game_Player.prototype.update = function(sceneActive) {
    this.updateForceCommonEvent();
    _Game_Player_update.call(this, sceneActive);
  };

  var _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
  Game_Player.prototype.updateNonmoving = function(wasMoving) {
    _Game_Player_updateNonmoving.call(this, wasMoving);
    if (!$gameMap.isEventRunning() && isWorking()) {
      if (wasMoving && conditionMet()) {
        invoke();
      }
    }
    if (!wasMoving) {
      resume();
      if (doResetByStop()) {
        resetStepCount();
      }
    }
  };

  var _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
  Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
      if (this.getInputDirection() && $gameTemp.isDestinationValid()) {
        resume();
      }
    }
    _Game_Player_moveByInput.call(this);
  };

  var _Game_Temp_clearDestination = Game_Temp.prototype.clearDestination;
  Game_Temp.prototype.clearDestination = function() {
    if (!resumed) {
      return;
    }
    _Game_Temp_clearDestination.call(this);
  };

})();
