//=============================================================================
// SetPictureUnderMap.js
//=============================================================================

/*:
 * @plugindesc display picture between map and parallax layer
 * @author Sasuke KANNAZUKI
 * 
 * @help Plugin Commands:
 * SetPictureUnderMap set 1    # set picture #1 under map layer
 * SetPictureUnderMap unset 1  # set picture #1 normal layer
 *
 * This plugin moves picture to different layer.
 * Pictures set under layer can operate event commands the same as 
 * that of at normal layer.
 */
/*:ja
 * @plugindesc 指定したピクチャをマップと遠景の間のレイヤに表示します
 * @author 神無月サスケ
 * 
 * @help プラグインコマンド:
 * SetPictureUnderMap set 1    # 1番のピクチャをマップの下のレイヤに表示します
 * SetPictureUnderMap unset 1  # 1番のピクチャを本来のレイヤに表示します
 *
 * このプラグインは、ピクチャを表示するレイヤを変更するものです。
 * このため、マップの下に表示するようにしたピクチャも、通常のピクチャと同様、
 * ピクチャ関係のイベントコマンドで挙動を変更できます。
 * 
 */

(function() {

  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'SetPictureUnderMap') {
      // find args[1]
      var pictureId = Number(args[1] || 0);
      switch (args[0]) {
      case 'set':
        setUnderMapPictureFlag(pictureId, true);
        break;
      case 'unset':
        setUnderMapPictureFlag(pictureId, false);
        break;
      }
    }
  };

  function setUnderMapPictureFlag(id, flag) {
    $gameScreen.underMapPictureFlag[id] = flag;
    SceneManager._scene._spriteset.setLowerPictureSprites(id, flag);
  }

  //
  // add under map picture flag
  //
  var _Game_Screen_clearPictures = Game_Screen.prototype.clearPictures;
  Game_Screen.prototype.clearPictures = function() {
    _Game_Screen_clearPictures.call(this);
    this.underMapPictureFlag = [];
  };

  //
  // create layer and sprites for lower pictures
  //
  var _Spriteset_Map_createParallax = Spriteset_Map.prototype.createParallax;
  Spriteset_Map.prototype.createParallax = function() {
    _Spriteset_Map_createParallax.call(this);
    this.createLowerPictures();
  };

  Spriteset_Map.prototype.createLowerPictures = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    this._lowerPictureContainer = new Sprite();
    this._lowerPictureContainer.setFrame(x, y, width, height);
    this._baseSprite.addChild(this._lowerPictureContainer);
    // for optimize, create lower sprites only when it's needed
    $gameScreen.underMapPictureFlag = $gameScreen.underMapPictureFlag || [];
    this._lowerSpritesCreated = 0;
    for (var i = 1; i < $gameScreen.underMapPictureFlag.length; i++) {
      if ($gameScreen.underMapPictureFlag[i]) {
        this._lowerSpritesCreated = i;
      }
    }
    this._underMapPictures = [];
    for(i = 1; i <= this._lowerSpritesCreated; i++) {
      this._underMapPictures[i] = new Sprite_LowerPicture(i);
      this._lowerPictureContainer.addChild(this._underMapPictures[i]);
    }
  };

  Spriteset_Map.prototype.setLowerPictureSprites = function(id, flag) {
    if (flag) { // create under sprite
      if (this._lowerSpritesCreated < id) {
        for (var i = this._lowerSpritesCreated + 1; i <= id; i++) {
          this._underMapPictures[i] = new Sprite_LowerPicture(i);
          this._lowerPictureContainer.addChild(this._underMapPictures[i]);
        }
        this._lowerSpritesCreated = id;
      }
    } else { // remove under sprite
      var maxValid = 0;
      for (var i = 1; i < $gameScreen.underMapPictureFlag.length; i++) {
        if ($gameScreen.underMapPictureFlag[i]) {
          maxValid = i;
        }
      }
      for (i = maxValid + 1; i <= this._lowerSpritesCreated; i++) {
        this._lowerPictureContainer.removeChild(this._underMapPictures[i]);
        this._underMapPictures[i] = null;
      }
      this._lowerSpritesCreated = maxValid;
    }
  };

  //
  // configure piture sprite at normal layer
  //
  var _Sprite_Picture_picture = Sprite_Picture.prototype.picture;
  Sprite_Picture.prototype.picture = function() {
    if ($gameScreen.underMapPictureFlag[this._pictureId]) {
      return null;
    }
    return _Sprite_Picture_picture.call(this);
  };

  //
  // define picture sprite for lower layer
  //
  function Sprite_LowerPicture() {
    this.initialize.apply(this, arguments);
  }
  Sprite_LowerPicture.prototype = Object.create(Sprite_Picture.prototype);
  Sprite_LowerPicture.prototype.constructor = Sprite_LowerPicture;

  Sprite_LowerPicture.prototype.picture = function() {
    if ($gameScreen.underMapPictureFlag[this._pictureId]) {
      return _Sprite_Picture_picture.call(this);
    }
    return null;
  };

})();
