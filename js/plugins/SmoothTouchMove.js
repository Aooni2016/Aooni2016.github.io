//=============================================================================
// SmoothTouchMove.js
//=============================================================================
/*:
 * @plugindesc on touch move, player can through events under the player
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * 
 * Normal touch move cannot through the event under the player.
 * This plugin enables through the such events without using wait,
 * message, or any other time consuming commands.
 */
/*:ja
 * @plugindesc タッチ移動で、プレイヤーの下のイベントを通過可能にします。
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * 
 * 従来のタッチ移動では、プレイヤーの足元にイベントが存在した場合、
 * そこで移動を打ち切ります。
 * このプラグインは、会話やウェイトなどがないイベントに限り、
 * 足元にあっても通過することを可能にします。
 */

(function() {
  var resumed = false;

  //
  // Game_Temp
  //
  var _Game_Temp_setDestination = Game_Temp.prototype.setDestination;
  Game_Temp.prototype.setDestination = function(x, y) {
    _Game_Temp_setDestination.call(this, x, y);
    resumed = false;
  };

  var _Game_Temp_clearDestination = Game_Temp.prototype.clearDestination;
  Game_Temp.prototype.clearDestination = function() {
    if (!resumed) {
      return;
    }
    _Game_Temp_clearDestination.call(this);
  };

  var resume = function () {
    resumed = true;
    $gameTemp.clearDestination();
  };

  //
  // Game_Player
  //
  var _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
  Game_Player.prototype.updateNonmoving = function(wasMoving) {
    _Game_Player_updateNonmoving.call(this, wasMoving);
    if (this.isTransferring() || !wasMoving) {
      resume();
    }
  };

  var _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
  Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
      if (this.getInputDirection()) {
        resume();
      }
    }
    _Game_Player_moveByInput.call(this);
  };

})();
