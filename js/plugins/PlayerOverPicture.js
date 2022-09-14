//=============================================================================
// PlayerOverPicture.js
//=============================================================================
/*:
 * @plugindesc display player over the picture
 * @author Sasuke KANNAZUKI
 * *
 * @help plugin commands:
 * PlayerOverPicture set     # display player over the picture
 * PlayerOverPicture unset   # reset the setting
 *
 * note:
 * - when display player over the picture,
 *  player is over the all tiles and weathers and so on.
 * - setting remains forever. when event is finisied,
 *  be sure to unset.
 */
/*:ja
 * @plugindesc プレイヤーをピクチャの上に表示します
 * @author 神無月サスケ
 * *
 * @help プラグインコマンド：
 * PlayerOverPicture set     # ピクチャの上に表示開始
 * PlayerOverPicture unset   # 通常の表示に戻す
 *
 * 注意:
 * - ピクチャの上に表示されている時は、タイルや天候の上に表示されます
 * - 通行判定などは変わりません。
 * - 設定はずっと持続するので、イベント終了後などに忘れずに unset を
 *  行ってください。
 *
 * メモ：
 * このプラグインはプレイヤーのみしか扱えませんが、必要に応じて
 * 他のキャラも上層に置けるように改良する予定です。
 */

(function() {
  //
  // process plugin command
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'PlayerOverPicture') {
      if (args[0] === 'set') {
        $gamePlayer.displayUpper = true;
        var spriteset = SceneManager._scene._spriteset;
        if (!spriteset.upperPlayer) {
          spriteset.upperPlayer = new Sprite_UpperCharacter($gamePlayer);
          spriteset._upperCharacterLayer.addChild(spriteset.upperPlayer);
        }
      } else if (args[0] === 'unset') {
        $gamePlayer.displayUpper = false;
        var spriteset = SceneManager._scene._spriteset;
        if (spriteset.upperPlayer) {
          spriteset._upperCharacterLayer.removeChild(spriteset.upperPlayer);
          spriteset.upperPlayer = null;
        }
      }
    }
  };

  //
  // add setting to Game_Character
  //
  var _Game_Character_initMembers = Game_Character.prototype.initMembers;
  Game_Character.prototype.initMembers = function() {
    _Game_Character_initMembers.call(this);
    this.displayUpper = false;
  };

  //
  // add setting to sprite set
  //
  var _Spriteset_Map_createScreenSprites =
   Spriteset_Map.prototype.createScreenSprites;
  Spriteset_Map.prototype.createScreenSprites = function() {
    this.createUpperCharacterLayer();
    _Spriteset_Map_createScreenSprites.call(this);
  };

  Spriteset_Map.prototype.createUpperCharacterLayer = function() {
    this._upperCharacterLayer = new Sprite();
    this._upperCharacterLayer.setFrame(0, 0, Graphics.width, Graphics.height);
    this.addChild(this._upperCharacterLayer);
    // current version, player only.
    this.upperPlayer = null;
    if ($gamePlayer.displayUpper) {
      this.upperPlayer = new Sprite_UpperCharacter($gamePlayer);
      this._upperCharacterLayer.addChild(this.upperPlayer);
    }
  };

  //
  // setting character sprite
  //
  var _Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
  Sprite_Character.prototype.initMembers = function() {
    _Sprite_Character_initMembers.call(this);
    this._displayUpper = false;
  };

  var _Sprite_Character_isImageChanged =
   Sprite_Character.prototype.isImageChanged;
  Sprite_Character.prototype.isImageChanged = function() {
    return this._displayUpper || _Sprite_Character_isImageChanged.call(this);
  };

  var _Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
  Sprite_Character.prototype.updateBitmap = function() {
    if (this._character && this._character.displayUpper) {
      if (!this._displayUpper) {
        this._displayUpper = true;
        this.bitmap = ImageManager.loadEmptyBitmap();
      }
    } else {
      _Sprite_Character_updateBitmap.call(this);
      this._displayUpper = false;
    }
  };

  //
  // define new upper sprite setting
  //
  function Sprite_UpperCharacter() {
    this.initialize.apply(this, arguments);
  }
  Sprite_UpperCharacter.prototype = Object.create(Sprite_Character.prototype);
  Sprite_UpperCharacter.prototype.constructor = Sprite_UpperCharacter;

  Sprite_UpperCharacter.prototype.initialize = function(character) {
    Sprite_Character.prototype.initialize.call(this, character);
  };

  Sprite_UpperCharacter.prototype.isImageChanged = function() {
    return !this._displayUpper || _Sprite_Character_isImageChanged.call(this);
  };

  Sprite_UpperCharacter.prototype.updateBitmap = function() {
    if (this._character && this._character.displayUpper) {
      _Sprite_Character_updateBitmap.call(this);
      this._displayUpper = true;
    } else {
      if (this._displayUpper) {
        this._displayUpper = false;
        this.bitmap = ImageManager.loadEmptyBitmap();
      }
    }
  };

})();
