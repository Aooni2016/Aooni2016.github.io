//=============================================================================
// CommonEventOnMenu.js
//=============================================================================

/*:
 * @plugindesc call specified common event before or after menu scene.
 * @author Sasuke KANNAZUKI
 *
 * @param Before Menu Variable ID
 * @desc Invoke common event whose ID is the value before opening menu.
 * @default 0
 *
 * @param After Menu Variable ID
 * @desc Invoke common event whose ID is the value after closing menu.
 * @default 0
 *
 * @help
 * About parameters:
 * - If the variable ID is 0, never invoke any events at the moment.
 * - When the value of variable is 0, no common events will invoke.
 */
/*:ja
 * @plugindesc メニューを開く直前または閉じた直後にコモンイベントを起動します。
 * @author 神無月サスケ
 *
 * @param Before Menu Variable ID
 * @desc メニューを開く直前に起動するコモンイベントのIDを入れる変数ID
 * @default 0
 *
 * @param After Menu Variable ID
 * @desc メニューを閉じた直後に起動するコモンイベントのIDを入れる変数ID
 * @default 0
 *
 * @help
 * パラメータについて:
 * - 変数に 0 番を指定した場合は、いかなる場合もコモンイベントは起動しません。
 * - 変数の値が 0 など無効な値の場合はコモンイベントは起動しません。
 */

(function() {
  //
  // process parameters
  //
  var parameters = PluginManager.parameters('CommonEventOnMenu');
  var atBeforeVarID = Number(parameters['Before Menu Variable ID'] || 0);
  var atAfterVarID = Number(parameters['After Menu Variable ID'] || 0);

  //
  // invoke before opening menu
  //
  var beforeCommonEventCalled = false;

  var beforeCommonEventReserved = function () {
    return !!(atBeforeVarID && $gameVariables.value(atBeforeVarID));
  };

  var invokeBeforeCommonEvent = function() {
    var eventId = $gameVariables.value(atBeforeVarID);
    var event = $dataCommonEvents[eventId];
    if (event) {
      $gameMap._interpreter.setup(event.list);
      return true;
    }
    return false;
  };

  var _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
  Scene_Map.prototype.callMenu = function() {
    if (beforeCommonEventReserved() && !beforeCommonEventCalled) {
      if (invokeBeforeCommonEvent()) {
        beforeCommonEventCalled = true;
        return;
      }
    }
    _Scene_Map_callMenu.call(this);
    beforeCommonEventCalled = false;
  };

  var _Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;
  Scene_Map.prototype.updateCallMenu = function() {
    _Scene_Map_updateCallMenu.call(this);
    if (beforeCommonEventCalled) {
      this.menuCalling = true;
    }
  };

  //
  // invoke after closing menu
  //
  var afterCommonEventReserved = function () {
    return !!(atAfterVarID && $gameVariables.value(atAfterVarID));
  };

   var reserveAfterCommonEvent = function() {
    var eventId = $gameVariables.value(atAfterVarID);
    var event = $dataCommonEvents[eventId];
    if (event) {
      $gameTemp.reserveCommonEvent(eventId);
    }
  };

  var _Scene_Menu_popScene = Scene_Menu.prototype.popScene;
  Scene_Menu.prototype.popScene = function() {
    if (afterCommonEventReserved()) {
      reserveAfterCommonEvent();
    }
    _Scene_Menu_popScene.call(this);
  };

})();
