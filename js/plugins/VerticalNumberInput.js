//=============================================================================
// VerticalNumberInput.js
//=============================================================================

/*:
 * @plugindesc displays number input window vartical
 * @author Sasuke KANNAZUKI
 *
 * @requiredAssets img/system/ButtonSet2
 *
 * @help
 * Plugin Commands:
 * VerticalNumberInput on     // call befor executing 'Number Input'
 * VerticalNumberInput off    // call after executing 'Number Input'
 */
/*:ja
 * @plugindesc 「数値入力の処理」の数値ウィンドウを縦並びにします。
 * @author 神無月サスケ
 *
 * @requiredAssets img/system/ButtonSet2
 *
 * @help
 * プラグインコマンド:
 * VerticalNumberInput on     // 「数値入力の処理」の実行前に呼び出して下さい
 * VerticalNumberInput off    // 「数値入力の処理」の実行後に呼び出して下さい
 */

(function() {
  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'VerticalNumberInput') {
      switch (args[0]) {
      case 'on':
        setVertNumInputWnd();
        break;
      case 'off':
        resetVertNumInputWnd();
        break;
      }
    }
  };

  //
  // process number input windows
  //
  var _tmpNumberWindow = null;

  var setVertNumInputWnd = function() {
    var scene = SceneManager._scene;
    var msgWnd = scene._messageWindow;
    if (msgWnd && !_tmpNumberWindow) {
      _tmpNumberWindow = msgWnd._numberWindow;
      scene.removeChild(_tmpNumberWindow);
      msgWnd._numberWindow = new Window_VertNumberInput(msgWnd);
      scene.addChild(msgWnd._numberWindow);
    }
  };

  var resetVertNumInputWnd = function() {
    var scene = SceneManager._scene;
    var msgWnd = scene._messageWindow;
    if (msgWnd && _tmpNumberWindow) {
      scene.removeChild(msgWnd._numberWindow);
      msgWnd._numberWindow = _tmpNumberWindow;
      scene.addChild(msgWnd._numberWindow);
      _tmpNumberWindow = null;
    }
  };

  //---------------------------------------------------------------------------
  // Window_VertNumberInput
  //
  // Vertical version of Window_NumberInput.

  function Window_VertNumberInput() {
    this.initialize.apply(this, arguments);
  }
  Window_VertNumberInput.prototype = Object.create(Window_NumberInput.prototype);
  Window_VertNumberInput.prototype.constructor = Window_VertNumberInput;

  Window_VertNumberInput.prototype.updatePlacement = function() {
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
    this._scrollY = 0;
  };

  Window_VertNumberInput.prototype.windowHeight = function() {
    return this.fittingHeight(this.maxRows());
  };

  Window_VertNumberInput.prototype.windowWidth = function() {
    return 32 + this.padding * 2;
  };

  Window_VertNumberInput.prototype.maxCols = function() {
    return 1;
  };

  Window_VertNumberInput.prototype.maxItems = function() {
    return this._maxDigits;
  };

  Window_VertNumberInput.prototype.spacing = function() {
    return 0;
  };

  Window_VertNumberInput.prototype.createButtons = function() {
    var bitmap = ImageManager.loadSystem('ButtonSet2');
    var buttonWidth = 48;
    var buttonHeight = 48;
    this._buttons = [];
    for (var i = 0; i < 3; i++) {
      var button = new Sprite_Button();
      var x = buttonWidth * [0, 3, 4][i];
      var w = buttonWidth * (i === 2 ? 2 : 1);
      button.bitmap = bitmap;
      button.setColdFrame(x, 0, w, buttonHeight);
      button.setHotFrame(x, buttonHeight, w, buttonHeight);
      button.visible = false;
      this._buttons.push(button);
      this.addChild(button);
    }
    this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
    this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
    this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
  };

  Window_VertNumberInput.prototype.placeButtons = function() {
    var numButtons = this._buttons.length;
    var buttonHeight = 48;
    var xSpacing = [0, 64, 8];
    var ySpacing = 16;
    for (var i = 0; i < numButtons; i++) {
      var button = this._buttons[i];
      button.x = this.buttonX() + xSpacing[i];
      button.y = this.height / 2 + (i === 2 ? ySpacing : -ySpacing - buttonHeight);
    }
  };

  Window_VertNumberInput.prototype.buttonX = function() {
    var spacing = 8;
    return this.width + spacing; 
  };

  Window_VertNumberInput.prototype.processDigitChange = function() {
    if (this.isOpenAndActive()) {
      if (Input.isRepeated('right')) {
        this.changeDigit(true);
      } else if (Input.isRepeated('left')) {
        this.changeDigit(false);
      }
    }
  };

})();
