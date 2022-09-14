//=============================================================================
// LargeNameWnd.js
//=============================================================================

/*:
 * @plugindesc display name window at full screen
 * @author Sasuke KANNAZUKI
 *
 * @param font size
 * @desc font size (default 36)
 * @default 36
 * 
 * @help This plugin does not provide plugin commands.
 * 
 * this plugin assumes the use of touch devices.
 * this plugin assumes 960x720 screen size.
 */

/*:ja
 * @plugindesc 名前入力画面をフルスクリーンで表示します
 * @author 神無月サスケ
 *
 * @param font size
 * @desc フォントの大きさです (デフォルト:36, 最大値48)
 * @default 36
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * 
 * タッチデバイスでの仕様を想定しています。
 * 960×720 ピクセルでの使用を想定しています。
 */

(function() {

  //
  // process parameters
  //
  var parameters = PluginManager.parameters('LargeNameWnd');
  var fontSize = Number(parameters['font size'] || 36);

  // 
  // change size
  // 
  Window_NameEdit.prototype.windowWidth = function() {
    return 720;
  };

  Window_NameEdit.prototype.windowHeight = function() {
    return this.fittingHeight(2);
  };

  Window_NameEdit.prototype.lineHeight = function() {
    return 54;  // 36 * 1.5
  };

  Window_NameEdit.prototype.standardPadding = function() {
    return 27;  // 18 * 1.5
  };

  Window_NameEdit.prototype.standardFontSize = function() {
    return fontSize;
  };

  Window_NameInput.prototype.lineHeight = function() {
    return 54;  // 36 * 1.5
  };

  Window_NameInput.prototype.standardPadding = function() {
    return 27;  // 18 * 1.5
  };

  var _Window_NameInput_itemRect = Window_NameInput.prototype.itemRect;
  Window_NameInput.prototype.itemRect = function(index) {
    var rect = _Window_NameInput_itemRect.call(this, index);
    rect.width = 63; // 42 * 1.5
    rect.x = index % 10 * rect.width + Math.floor(index % 10 / 5) * 36
    return rect;
  };

  Window_NameInput.prototype.standardFontSize = function() {
    return fontSize;
  };

  //
  // not display face, but character instead.
  //
  var _Window_NameEdit_initialize = Window_NameEdit.prototype.initialize;
  Window_NameEdit.prototype.initialize = function(actor, maxLength) {
    _Window_NameEdit_initialize.call(this, actor, maxLength);
    ImageManager.loadCharacter(actor.characterName());
  };

  Window_NameEdit.prototype.drawActorFace =
   function(actor, x, y, width, height) {
    this.drawActorCharacter(actor, x + Window_Base._faceWidth / 2,
     y + 50 + this.lineHeight());
  };


})();
