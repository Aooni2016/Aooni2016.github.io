//=============================================================================
// PictureUtility.js (Draft)
//=============================================================================
/*:
 * @plugindesc provides useful setters and getters for picture
 * @author Sasuke KANNAZUKI
 * *
 * @help This plugin does not provide plugin commands.
 * 
 * At default system, when you need to change a few parameters,
 * you must set all parameters. This is the difficulty of picture.
 * This plugin enables you to change only parameter(s) you need.
 *
 * ***NOTE: this is draft version that implements we need to our development.
 *
 * *** Scripts
 * Call at either event command or move routing's script command.
 * Parameters in brackets are omissible.
 *
 * this.getPictureCoords(<pictureId>, <xVarId>, <yVarId>);
 *  set picture's (x, y) whose id is <pictureId> to variables whose IDs are
 *  (<xVarId>, <yVarId>).
 *  where <xVarId> and <yVarId> are either the immidiate value(ex. 15),
 *  variable ID's value (ex.'V15'), or variable's name(ex. 'hiroshi').
 *  If <pictureId> indicates invalid picture, do nothing.
 *
 * this.getPictureFromParent(<pictureId>, <xVarId>, <yVarId>);
 *  this is the function for InterlockPicture.js users,
 *  to get the picture <pictureId>'s distance from parent object.
 *  if the picture has no parent or its parent is neither event nor picture,
 *  sets vars (0,0).
 *
 * this.setPictureOpacity(<pictureId>, <opacity>[, <frame>, <doWait>]);
 *  change only opacity within <frame> frames. default value is 1.
 *  If <doWait> is true, wait until changing opacity is done.
 *  If <pictureId> indicates invalid picture, do nothing including wait.
 *
 * this.setPitureScales(<pictureId>, <scaleX>, <scaleY>[, <frame>, <doWait>]);
 *  change only scales within <frame> frames. default value is 1.
 *  When both <scaleX> and <scaleY> are 100, it'll be original size.
 *
 * this.setPictureBlendMode(<pictureId>, <blendMode>);
 *  change only blend mode immidiately.
 *  <blendMode> : 0:normal, 1:add, 2:multiply, 3:screen.
 */
/*:ja
 * @plugindesc 表示中のピクチャの一部の値だけを変更/取得する関数集
 * @author 神無月サスケ
 * *
 * @help このプラグインには、プラグインコマンドはありません。
 * 
 * 既存のイベントコマンドでは、ピクチャの一部の値だけを変更したい場合でも
 * 「ピクチャの移動」で全ての値を設定する必要があり、若干煩雑です。
 : このプラグインでは、必要な値だけを書きかえる関数を提供します。
 *
 * ■注意: このプラグインはドラフト段階であり、作者の開発に必要なものだけしか
 *  準備されていません。
 *
 * ■スクリプト
 * イベントコマンドの「スクリプト」、または「移動ルートの設定」の「スクリプト」
 * から呼び出して下さい。
 * []でくくった引数は省略可能です。
 *
 * this.getPictureCoords(<ピクチャID>, <X変数ID>, <Y変数ID>);
 *  <ピクチャID>番の画像の現在座標を、変数IDが <X変数ID> と <Y変数ID> の変数に
 *  代入します。
 *  <X変数ID> と <Y変数ID> には、以下の書式が可能です。
 *  - 即値 (例: 10 や 15 など普通の数値)
 *  - 指定した変数IDの値 (例: 'V10' や 'V15')
 *  - 変数名 (例: 'ひろし' や '卓郎')
 *  <ピクチャID>番のピクチャが無効な場合は、何も行いません。
 *
 * this.getPictureFromParent(<ピクチャID>, <X変数ID>, <Y変数ID>);
 *  ピクチャの連動元からの相対距離を<X変数ID>, <Y変数ID>に代入します。
 *  連動元とは InterlockPicture.js で定義されるオブジェクトで、
 *  これがイベントかピクチャである場合に有効な相対座標の値になります」。
 *  連動元が存在しないか、マップ座標の場合、(0,0)になります。
 *  InterlockPicture.js が読み込まれていない場合、何も行いません。
 *
 * this.setPictureOpacity(<ピクチャID>, <不透明度> [,
 *  <フレーム数>, <ウェイトフラグ>]);
 *  画像の不透明度を<フレーム数>かけて徐々に変更します。
 *  - <フレーム数>は60フレームで1秒になります。
 *  - 省略時は 1 になります。
 *  <ウェイトフラグ> に true を指定すると、不透明度変更完了まで待ちます。
 *  <ピクチャID>番のピクチャが無効な場合は、ウェイトも含めて何も行いません。
 *
 * this.setPitureScales(<ピクチャID>, <X拡大率%>, <Y拡大率%> [,
 *  <フレーム数>, <ウェイトフラグ>]);
 *  画像の拡大率を<フレーム数>かけて徐々に変更します。
 *  - <フレーム数>は60フレームで1秒になります。
 *  - 省略時は 1 になります。
 *  <X拡大率%> と <Y拡大率%> が 100の時に通常サイズになります。
 *
 * this.setPictureBlendMode(<ピクチャID>, <合成方法>);
 *  ピクチャの「合成方法」を即座に変更します。
 *  <合成方法> : 0:通常, 1:加算, 2:乗算, 3:スクリーン.
 */
(function() {

  //
  // check if InterlockPicture.js is included.
  //
  var _interlockIncluded = null;
  var interlockIncluded = function () {
    if (_interlockIncluded == null) {
      _interlockIncluded = ("setInterlockMode" in Game_Picture.prototype);
    }
    return _interlockIncluded;
  };

  //
  // process parameters
  //
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
    if (reg = (/^(V?)([0-9]+)/i).exec(String(varIdNotation))) {
      return reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
    } else {
      return getVariableIdWhoseNameIs(varIdNotation);
    }
  };

  var getNumberFromParam = function (notation) {
    var reg;
    if (reg = (/^(V?)([0-9]+)/i).exec(String(notation))) {
      return reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
    }
    return 0;
  };

  //
  // functions called from 'script' at interpreter
  //
  Game_CharacterBase.prototype.getPictureCoords =
  Game_Interpreter.prototype.getPictureCoords = function (pictId, xId, yId,
   flag) {
    var pict;
    if (pict = $gameScreen.picture(pictId)) {
      var xVarId = getVariableIdFromParam(xId);
      var yVarId = getVariableIdFromParam(yId);
      if (xVarId && yVarId) {
        $gameVariables.setValue(xVarId, flag ? pict.xFromParent() : pict.x());
        $gameVariables.setValue(yVarId, flag ? pict.yFromParent() : pict.y());
      }
    }
  };

  Game_CharacterBase.prototype.getPictureFromParent =
  Game_Interpreter.prototype.getPictureFromParent = function (pictId, xId,
   yId) {
    if (interlockIncluded()) {
      this.getPictureCoords(pictId, xId, yId, true);
    }
  };

  Game_CharacterBase.prototype.setPictureOpacity =
  Game_Interpreter.prototype.setPictureOpacity = function (pictId, opacity,
   duration, needsWait) {
    var pict;
    if (pict = $gameScreen.picture(pictId)) {
      duration = getNumberFromParam(duration || 1);
      opacity = getNumberFromParam(opacity);
      pict.setOpacity(opacity, duration);
      if (needsWait) {
        $gameMap._interpreter.wait(duration);
        this._waitCount = duration;
      }
    }
  };

  Game_CharacterBase.prototype.setPitureScales =
  Game_Interpreter.prototype.setPitureScales = function (pictId,
   scaleX, scaleY, duration, needsWait) {
    var pict;
    if (pict = $gameScreen.picture(pictId)) {
      duration = getNumberFromParam(duration || 1);
      scaleX = getNumberFromParam(scaleX) || 100;
      scaleY = getNumberFromParam(scaleY) || 100;
      pict.setScales(scaleX, scaleY, duration);
      if (needsWait) {
        $gameMap._interpreter.wait(duration);
        this._waitCount = duration;
      }
    }
  };

  Game_CharacterBase.prototype.setPictureBlendMode =
  Game_Interpreter.prototype.setPictureBlendMode = function (pictId, mode) {
    var pict;
    if (pict = $gameScreen.picture(pictId)) {
      mode = getNumberFromParam(mode);
      if (![0,1,2,3].contains(mode)) { // something wrong
        mode = 0;
      }
      pict._blendMode = mode;
    }
  };

  //
  // process at Game_Picture
  //
  Game_Picture.prototype.setOpacity = function (opacity, duration) {
    this._targetOpacity = opacity;
    this._opacityDuration = duration;
  };

  Game_Picture.prototype.updateOpacity = function () {
    if (this._opacityDuration) {
      var d = this._opacityDuration;
      this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
      this._opacityDuration--;
    }
  };

  Game_Picture.prototype.setScales = function (scaleX, scaleY, duration) {
    this._targetScaleX = scaleX;
    this._targetScaleY = scaleY;
    this._scaleDuration = duration;
  };

  Game_Picture.prototype.updateScales = function () {
    if (this._scaleDuration) {
      var d = this._scaleDuration;
      this._scaleX = (this._scaleX * (d - 1) + this._targetScaleX) / d;
      this._scaleY = (this._scaleY * (d - 1) + this._targetScaleY) / d;
      this._scaleDuration--;
    }
  };

  var _Game_Picture_update = Game_Picture.prototype.update;
  Game_Picture.prototype.update = function() {
    _Game_Picture_update.call(this);
    this.updateOpacity();
    this.updateScales();
  };

})();
