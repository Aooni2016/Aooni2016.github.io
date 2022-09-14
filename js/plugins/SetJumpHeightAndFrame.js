//=============================================================================
// SetJumpHeightAndFrame.js
//=============================================================================
/*:
 * @plugindesc let character jump with specified frame and max-height
 * @author Sasuke KANNAZUKI
 * *
 * @help This plugin does not provide plugin commands.
 * 
 * usage: call from event command 'Move Route' -> 'Script' as follows:
 * this.setJmpFmt(maxHeight, frame);  # set height and frame
 * this.resetJmpFmt();    # reset this configuration
 * 例：
 * this.setJmpFmt(48, 24);   # jump 48 pixel within 24 frames.
 *
 * waring：be sure to run this.resetJmpFmt(); after the specied jump.
 * otherwise, the setting is remain after the move route command.
 * event's setting resets when map changes,
 * while player's setting remain forever.
 * 
 * note: at default frame count and max height is calculated as following:
 * where jumpPeak is 10 + distance - moveSpeed.
 * frame count is jumpPeak * 2.
 * max height is jumpPeak * jumpPeak / 2.
 */
/*:ja
 * @plugindesc キャラクターを指定されたフレーム数と高さでジャンプさせます。
 * @author 神無月サスケ
 * *
 * @help このプラグインには、プラグインコマンドはありません。
 * 
 * 「移動ルートの設定」の「スクリプト」から以下の書式で呼び出してください。
 * this.setJmpFmt(maxHeight, frame);  # 高さとフレーム数をセット
 * this.resetJmpFmt();                #  設定をリセット
 * 例：
 * this.setJmpFmt(48, 24);   # １キャラ分(48px)を 0.4秒(24フレーム)でジャンプ
 * 以後のジャンプでは、新たな設定が行われるまで、
 * 全て上記の設定でのジャンプを行います。
 *
 * 注意：全て終了後には this.resetJmpFmt(); を忘れずに実行してください。
 * さもないと、その後も設定が持続します。
 * イベントの場合、マップが切り替わるとリセットされますが、
 * プレイヤーの場合、ずっと設定が持続します。
 *
 * メモ: 通常のジャンプでは、以下の計算式でフレーム数と高さが決められています。
 * jumpPeak を 10 + 距離 - 移動速度 とします。
 * フレーム数は、jumpPeak の 2 倍です。
 * 頂点の高さは、jumpPeak の 2 乗の半分です。
 * 放物線(2次関数)の公式でジャンプします。
 */

(function() {

  //
  // setting routine : these are called from event command 'Set Move Route'.
  //
  Game_CharacterBase.prototype.setJmpFmt = function(maxHeight, frame) {
    this._maxJumpHeight = maxHeight;
    this._maxSpecifiedJumpCount = frame;
  };

  Game_CharacterBase.prototype.resetJmpFmt = function() {
    this._maxJumpHeight = null;
    this._maxSpecifiedJumpCount = null;
  };

  var _Game_CharacterBase_initMembers =
   Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_initMembers.call(this);
    this.resetJmpFmt();
  };

  //
  // specified jump judge routine
  //
  Game_CharacterBase.prototype.isJumpSpecified = function() {
    return !!this._maxJumpHeight;
  };

  //
  // set jump frame and height
  //
  var _Game_CharacterBase_jump = Game_CharacterBase.prototype.jump;
  Game_CharacterBase.prototype.jump = function(xPlus, yPlus) {
    _Game_CharacterBase_jump.call(this,xPlus, yPlus);
    if (this.isJumpSpecified()) {
      this._jumpCount = this._maxSpecifiedJumpCount;
      this._jumpPeak = this._jumpCount / 2;  // it may be floating number
    }
  };

  //
  // calc jump height
  //
  var _Game_CharacterBase_jumpHeight = Game_CharacterBase.prototype.jumpHeight;
  Game_CharacterBase.prototype.jumpHeight = function() {
    if (!this.isJumping()) {
      return 0;
    } else if(this.isJumpSpecified()) {
      var orgHeight = _Game_CharacterBase_jumpHeight.call(this);
      return  Math.round(orgHeight * this._maxJumpHeight /
       (this._jumpPeak * this._jumpPeak / 2));
    } else {
      return _Game_CharacterBase_jumpHeight.call(this);
    }
  };

})();
