//=============================================================================
// InputConfuse.js
//=============================================================================
/*:
 * @plugindesc Changes direction key assign of player's moving
 * @author Sasuke KANNAZUKI
 *
 * @help
 * At default, key assign is binded as follows:
 * down = 2, left = 4, right = 6, up =8.
 * this plugin changes the assign.
 * This plugin assumes the use of the scene to make player confuse.
 *
 * You can set by either plugin command or script at character's move route.
 *
 * * Plugin Commands:
 * InputConfuse def       # reset to default setting.
 * InputConfuse r90       # input turns 90 degree by clockwise
 * InputConfuse l90       # input turns 90 degree by reverse clockwise
 * InputConfuse rev       # input turns 180 degree
 * InputConfuse shuffle   # input direction is shuffled randomly
 *
 * InputConfuse set 2 8   # assign down(dir=2) to key 8(=up).
 * InputConfuse swap 4 6  # swap key assign of right(dir 4) and left(key 6)
 *
 * * Script at Move Route:
 * this.confuDef();      # reset to default setting.
 * this.confuR90();      # input turns 90 degree by clockwise
 * this.confuL90();      # input turns 90 degree by reverse clockwise
 * this.confuRev();      # input turns 180 degree
 * this.confuShuffle();  # input direction is shuffled randomly
 *
 * this.confuSet(2,8);   # assign down(dir=2) to key 8(=up).
 * this.confuSwap(4,6);  # swap key assign of right(dir 4) and left(key 6)
 *
 * Note: Touch input is also confused when key assign changes.
 * Touch input position rotates based on the key assign of down(=2).
 */
/*:ja
 * @plugindesc プレイヤーの方向移動の割り当てを変更します。
 * @author 神無月サスケ
 *
 * @help
 * 通常はキーの割り当ては以下のようになっています:
 * 下 = 2, 左 = 4, 右 = 6, 上 =8.
 * このプラグインは、方向キーの割り当てを変更します。
 * プレイヤーを混乱させるシーンでの使用を想定しています。
 *
 * プラグインコマンドまたは「移動ルートの設定」の「スクリプト」で呼び出します。
 *
 * ■プラグインコマンド
 * InputConfuse def       # 通常設定にリセットします。
 * InputConfuse r90       # 通常設定から時計回りに90度回転します
 * InputConfuse l90       # 通常設定から反時計回りに90度回転します
 * InputConfuse rev       # 通常設定から180度回転します。
 * InputConfuse shuffle   # 方向キーをランダムに入れ替えます。
 *
 * InputConfuse set 2 8   # 下(=2)の方向キーに上移動(=8)を割り当てます。
 * InputConfuse swap 4 6  # 左(=4)と右(=6)のキー割り当てを入れ替えます。
 *
 * ■「移動ルートの変更」での「スクリプト」
 * this.confuDef();      # 通常設定にリセットします。
 * this.confuR90();      # 通常設定から時計回りに90度回転します
 * this.confuL90();      # 通常設定から反時計回りに90度回転します
 * this.confuRev();      # 通常設定から180度回転します。
 * this.confuShuffle();  # 方向キーをランダムに入れ替えます。
 *
 * this.confuSet(2,8);   # 下(=2)の方向キーに上移動(=8)を割り当てます。
 * this.confuSwap(4,6);  # 左(=4)と右(=6)のキー割り当てを入れ替えます。
 *
 * 方向入れ替えた場合、タッチ入力もそれに伴って目的地が変更されます。
 * 下方向キーの割り当てに応じて、目的地が回転します。
 */
(function() {

  //
  // proecss plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'InputConfuse') {
      switch (args[0]) {
      case 'def':
        $gamePlayer.confuDef();
        break;
      case 'r90':
        $gamePlayer.confuR90();
        break;
      case 'l90':
        $gamePlayer.confuL90();
        break;
      case 'rev':
        $gamePlayer.confuRev();
        break;
      case 'shuffle':
        $gamePlayer.confuShuffle();
        break;
      case 'set':
        $gamePlayer.confuSet(Number(args[1]), Number(args[2]));
        break;
      case 'swap':
        $gamePlayer.confuSwap(Number(args[1]), Number(args[2]));
        break;
      }
    }
  };

  //
  // set default value
  //
  var _Game_Player_initMembers = Game_Player.prototype.initMembers;
  Game_Player.prototype.initMembers = function () {
    _Game_Player_initMembers.call(this);
    this.dirKeyAssign = null;
  };

  //
  // functions called from Script at Move Route
  // note: set player's key assign whatever the caller is.
  //
  var swapIndex = function (array, i, j) {
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  };

  var dirToIndex = function (dir) {
    return Math.floor((dir - 2) / 2);
  };

  Game_Character.prototype.confuDef = function () {
    $gamePlayer.dirKeyAssign = null;
  };

  Game_Character.prototype.confuR90 = function () {
    $gamePlayer.dirKeyAssign = [4, 8, 2, 6];
  };

  Game_Character.prototype.confuL90 = function () {
    $gamePlayer.dirKeyAssign = [6, 2, 8, 4];
  };

  Game_Character.prototype.confuRev = function () {
    $gamePlayer.dirKeyAssign = [8, 6, 4, 2];
  };

  Game_Character.prototype.confuShuffle = function () {
    var keyAssign = $gamePlayer.dirKeyAssign || [2, 4, 6, 8];
    var j, tmp;
    for (var i = 0; i < keyAssign.length; i++) {
      swapIndex(keyAssign, i, Math.randomInt(keyAssign.length));
    }
    $gamePlayer.dirKeyAssign = keyAssign;
    console.log($gamePlayer.dirKeyAssign);
  };

  Game_Character.prototype.confuSet = function (dir, value) {
    $gamePlayer.dirKeyAssign = $gamePlayer.dirKeyAssign || [2, 4, 6, 8];
    $gamePlayer.dirKeyAssign[dirToIndex(dir)] = value;
  };

  Game_Character.prototype.confuSwap = function (dir1, dir2) {
    $gamePlayer.dirKeyAssign = $gamePlayer.dirKeyAssign || [2, 4, 6, 8];
    swapIndex($gamePlayer.dirKeyAssign, dirToIndex(dir1), dirToIndex(dir2));
  };

  //
  // key direction manipulation
  //
  var _Game_Player_getInputDirection = Game_Player.prototype.getInputDirection;
  Game_Player.prototype.getInputDirection = function() {
    if (!this.dirKeyAssign) {
      return _Game_Player_getInputDirection.call(this);
    }
    var dir = _Game_Player_getInputDirection.call(this);
    return this.dirKeyAssign[dirToIndex(dir)];
  };

  //
  // touch input position manipulation
  //
  var _Game_Temp_setDestination = Game_Temp.prototype.setDestination;
  Game_Temp.prototype.setDestination = function(x, y) {
    if (!$gamePlayer.dirKeyAssign || $gamePlayer.dirKeyAssign[0] === 2) {
      _Game_Temp_setDestination.call(this, x, y);
      return;
    }
    var deltaX = $gameMap.deltaX(x , $gamePlayer.x);
    var deltaY = $gameMap.deltaY(y , $gamePlayer.y);
    switch ($gamePlayer.dirKeyAssign[0]) {
    case 4:
      this._destinationX = $gameMap.roundX($gamePlayer.x - deltaY);
      this._destinationY = $gameMap.roundY($gamePlayer.y + deltaX);
      break;
    case 6:
      this._destinationX = $gameMap.roundX($gamePlayer.x + deltaY);
      this._destinationY = $gameMap.roundY($gamePlayer.y - deltaX);
      break;
    case 8:
      this._destinationX = $gameMap.roundX($gamePlayer.x - deltaX);
      this._destinationY = $gameMap.roundY($gamePlayer.y - deltaY);
      break;
    }
  };

})();
