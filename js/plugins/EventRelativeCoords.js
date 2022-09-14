//=============================================================================
// EventRelativeCoords.js
//=============================================================================

/*:
 * @plugindesc Get relative distance between events and dispath various things.
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin has no plugins commands.
 *
 * ***Script Commands:
 * call 'Script' at either event command or move roiting.
 *
 * **At first you should set
 * this.setVarIdForRelativeXy(<XVarIdNotation>, <YVarIdNotation>);
 *  set the variable ID that stores relative distance.
 *  Following functions won't work until you run the command.
 *  You can use following notation to<XVarIdNotation>, <YVarIdNotation>:
 *   - Immidiate value (ex. 5, 10. string like '5' is also acceptable.)
 *   - The number of variable (ex. 'V10', 'V20'.)
 *   - Variable name (ex. 'relative X', 'relative Y')
 *
 * this.setTermsOfRelativeXy(<termUp>,<termDown>,<termLeft>,<termRight>,
 * <bothXYNZTerm>, <XZeroTerm>, <YZeroTerm>, <bothXYZeroTerm>, <eitherXYNZTerm>
 * );
 *  all parameters are string words to display on window(esp. message window).
 *  I'll explain the meaning of each parameter later.
 *  It's not necessary to all paramaters, omitted parameter are not changed.
 *  The default string of parameters above are: '↑','↓','←','→',
 *  '','','','',''.
 *  ・You can use escape characters like \C[1], \V[1], and so on.
 *  In the case write down 2 back slashes like \\V[1].
 *  (because it is the rule of string literal)
 *
 * *** Getter functions
 * this.getRelativeXyToVar(<OrgEventNotation>, <TargetEventNotation>);
 *  Set relative position of target event from org event to specified variable.
 *  You can use <OrgEventNotation>, <TargetEventNotation> notation as follows:
 *   - Immidiate value (ex. 5, 10. string like '5' is also acceptable.)
 *   - The variable id (ex. 'V10', 'V20'. it'll be the value of variable ID)
 *   - 'p' or 'player' : Player
 *   - 't' or 'this' : this event (or event running the map interpreter)
 *   - Event name such as 'Hiroshi', 'Takuro'.
 *
 * this.getDistanceToVar(<VarIdNotation>);
 *  set the manhattan distance to variable <VarIdNotation>.
 *  (manhattan distance = (abs of X) + (abs of Y)）
 *  <VarIdNotation> is the same notation as this.setVarIdForRelativeXy.
 *
 * *** Escape Sequence at window (esp. message window)
 *
 * \evX1 : replaced when XVar is positive <termRight> and negative <termLeft>.
 *  when XVar is zero, if YVar is also zero <bothXYZeroterm>, else <XZeroTerm>.
 *
 * \evY1 : replaced when YVar is positive <termDown> and negative <termUp>.
 *  when YVar is zero, if XVar is also zero <bothXYZeroterm>, else <YZeroTerm>.
 *
 * \evX2 : replaced when XVar is positive <termRight> and negative <termLeft>.
 *  When XVar is zero, empty string.
 *
 * \evY2 : replaced when YVar is positive <termDown> and negative <termUp>.
 *  When YVar is zero, empty string.
 *
 * \evCt : replaced when both XVar and YVar are zero <bothXYZeroterm>,
 *  else <eitherXYNZTerm>
 *
 * \evCm : replaced when neither Xvar nor YVar are zero <bothXYNZTerm>,
 *  else empty string.
 *
 * \evEt : replaced to '\n'.
*/

/*:ja
 * @plugindesc ２つのイベントの相対位置を変数に保存、ウィンドウに表示できます
 * @author 神無月サスケ
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 
 * ■スクリプトコマンド
 * イベントコマンドの「スクリプト」または「移動ルートの設定」の「スクリプト」
 * から呼び出して下さい。
 *
 * ◆最初に設定すべき項目
 * this.setVarIdForRelativeXy(<X変数ID記法>, <Y変数ID記法>);
 *  相対座標を求めた際に結果を代入する変数のIDを設定します。
 *  これを行うまで、相対座標は求められません。
 *  <X変数ID記法>, <Y変数ID記法> には以下の書式が可能です：
 *   - 即値 (5, 10 など、通常の数値。'5'のように文字列にしても可)
 *   - 変数IDの値 ('V10', 'V20'など。Vに続く番号の変数の値になります)
 *   - 変数名 ('相対X座標', '相対Y座標'など。)
 *
 * this.setTermsOfRelativeXy(<上用語>,<下用語>,<左用語>,<右用語>,<XY間語>,
 *  <X中央用語>, <Y中央用語>, <XY中央用語>, <XY非中央用語>);
 *  メッセージウィンドウに表示する単語を文字列で設定します。
 *  （パラメータの意味は後述）
 *  途中までの指定も可能で、その場合、残りの引数は変更されません。
 *  この設定を行う前のデフォルト値は、順番に はそれぞれ'↑','↓','←','→',
 *  '','','','','' となっています。
 *  ・これらの用語には変数などの制御文字も使用可能です。
 *  この場合、\V[1] なら、\\V[1] のように、\マークを二つ書いてください。
 *
 * ◆取得関数
 * this.getRelativeXyToVar(<原点イベントID記法>, <対象イベントID記法>);
 *  先に設定した変数に、対象イベントの原点イベントからの相対タイル座標を代入。
 *  <原点イベントID記法>, <対象イベントID記法> には以下の書式が可能です。
 *   - 即値 (5, 10 など、通常の数値。'5'のように文字列にしても可)
 *   - 変数IDの値 ('V10', 'V20'など。Vに続く番号の変数の値になります)
 *   - 'p' または 'player' : プレイヤー
 *   - 't' または 'this' : このイベント(またはスクリプト実行中のイベント)
 *   - イベント名 ('ひろし', '卓郎'など。)
 *
 * this.getDistanceToVar(<変数ID記法>);
 *  指定した変数に、現在のX,Y変数のマンハッタン距離を代入します。
 *  (マンハッタン距離＝(X変数の絶対値)＋(Y変数の絶対値)）
 *  <変数ID記法>には this.setVarIdForRelativeXy と同様の記法が使えます。
 *
 * ■ウィンドウでのエスケープ書式
 * 主としてメッセージウィンドウでの使用を想定しています。
 *
 * \evX1 : Ｘ用変数＝正のときは右用語、負のときは左用語、
 *  ゼロのときはＸ中央用語を表示
 *  ゼロのときでＹ用変数もゼロのときはXY中央用語を表示
 *
 * \evY1 : Ｙ用変数＝正のときは下用語、負のときは上用語、
 *  ゼロのときはＹ中央用語を表示
 *  ゼロのときでＸ用変数もゼロのときはXY中央用語を表示
 *
 * \evX2 : Ｘ用変数＝正のときは右用語、負のときは左用語、
 *  ゼロのときは文字列なし
 *
 * \evY2 : Ｙ用変数＝正のときは下用語、負のときは上用語、
 *  ゼロのときは文字列なし
 *
 * \evCt : Ｘ用変数、Ｙ用変数が(0, 0)のときはXY中央用語、
 *  そうでないときはXY非中央用語を表示
 *
 * \evCm : Ｘ用変数、Ｙ用変数がともにゼロでないときにXY間語を表示。
 *  どちらかがゼロだったときは文字列なし
 *
 * \evEt : 改行に置き換えられます
 */
(function() {

  //
  // routine for process parameters
  //
  var getEventWhoseNameIs = function (name) {
    var arr = $gameMap.events().filter(function (event) {
      return event.event().name === name;
    });
    return arr[0];
  };

  var getEventFromParam = function (param, thisId) {
    param = String(param);
    var result;
    if (result = (/^([0-9]+)$/).exec(param)) {
      return $gameMap.event(Number(result[1]));
    } else if (result = (/^V([0-9]+)$/i).exec(param)) {
      var id = $gameVariables.value(Number(result[1]));
      return $gameMap.event(id);
    } else if ((/^p(?:layer)?$/i).exec(param)) {
      return $gamePlayer;
    } else if ((/^t(?:his)?$/i).exec(param)) {
      return thisId > 0 ? $gameMap.event(thisId) : $gamePlayer;
    } else {
      return getEventWhoseNameIs(param);
    }
  };

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
    if (reg = (/^(V?)([0-9]+)/i).exec(varIdNotation)) {
      return reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
    } else {
      return getVariableIdWhoseNameIs(varIdNotation);
    }
  };

  //
  // define variables
  //
  var _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this.varIdOfRelativeX = null;
    this.varIdOfRelativeY = null;
    this.termsOfRelativeXy = null;
  };

  var defaultTermsOfRelativeXy = function () {
    return {down:'↓', up:'↑', right:'→', left:'←',
      xyNoneZero:'', // neither x nor y are zero.
      xZero:'',      // x is zero, but y isn't zero.
      yZero:'',      // y is zero, but x isn't zero.
      xyZero:'',     // both x and y are zero.
      notXyZero:''   // not both x and y are zero.
    };
  };

  Game_System.prototype.getTermsOfRelativeXy = function () {
    if (!this.termsOfRelativeXy) {
      this.termsOfRelativeXy = defaultTermsOfRelativeXy();
    }
    return this.termsOfRelativeXy;
  };

  //
  // setter functions
  //
  Game_Character.prototype.setVarIdForRelativeXy
  Game_Interpreter.prototype.setVarIdForRelativeXy = function (xVarNotation,
   yVarNotation) {
    $gameSystem.setVarIdForRelativeXy(xVarNotation, yVarNotation);
  };

  Game_System.prototype.setVarIdForRelativeXy = function (xVarNotation,
   yVarNotation) {
    this.varIdOfRelativeX = getVariableIdFromParam(xVarNotation);
    this.varIdOfRelativeY = getVariableIdFromParam(yVarNotation);
  };

  Game_Character.prototype.setTermsOfRelativeXy =
  Game_Interpreter.prototype.setTermsOfRelativeXy = function (up, down,
   left, right, xyNoneZero, xZero, yZero, xyZero, notXyZero) {
    $gameSystem.setTermsOfRelativeXy(up, down, left, right,
     xyNoneZero, xZero, yZero, xyZero, notXyZero);
  };

  Game_System.prototype.setTermsOfRelativeXy = function (up, down,
   left, right, xyNoneZero, xZero, yZero, xyZero, notXyZero) {
    var torx = this.getTermsOfRelativeXy();
    torx.down = down == null ? torx.down : down;
    torx.up = up == null ? torx.up : up;
    torx.right = right == null ? torx.right : right;
    torx.left = left == null ? torx.left : left;
    torx.xyNoneZero = xyNoneZero == null ? torx.xyNoneZero : xyNoneZero;
    torx.xZero = xZero == null ? torx.xZero : xZero;
    torx.yZero = yZero == null ? torx.yZero : yZero;
    torx.xyZero = xyZero == null ? torx.xyZero : xyZero;
    torx.notXyZero = notXyZero == null ? torx.notXyZero : notXyZero;
  };

  //
  // getter functions
  //
  Game_Character.prototype.getRelativeXyToVar =function (orgIdNotation,
   targetIdNotation) {
    var thisId = (this instanceof Game_Event) ? this.eventId() : -1;
    $gameSystem.getRelativeXyToVar(orgIdNotation, targetIdNotation, thisId);
  };

  Game_Interpreter.prototype.getRelativeXyToVar = function (orgIdNotation,
   targetIdNotation) {
    var thisId = this._eventId;
    if (thisId) {
      $gameSystem.getRelativeXyToVar(orgIdNotation, targetIdNotation, thisId);
    }
  };

  Game_System.prototype.getRelativeXyToVar = function (orgIdNotation,
   targetIdNotation, thisId) {
    var xId = this.varIdOfRelativeX;
    var yId = this.varIdOfRelativeY;
    if (xId && yId) {
      var evOrigin = getEventFromParam(orgIdNotation, thisId);
      var evTarget = getEventFromParam(targetIdNotation, thisId);
      if (evOrigin && evTarget) {
        $gameVariables.setValue(xId, evTarget.x - evOrigin.x);
        $gameVariables.setValue(yId, evTarget.y - evOrigin.y);
      }
    }
  };

  Game_Character.prototype.getDistanceToVar =
  Game_Interpreter.prototype.getDistanceToVar = function (varIdNotation) {
    $gameSystem.getDistanceToVar(varIdNotation);
  };

  Game_System.prototype.getDistanceToVar = function (varIdNotation) {
    var xId = this.varIdOfRelativeX;
    var yId = this.varIdOfRelativeY;
    var distId = getVariableIdFromParam(varIdNotation);
    if (xId && yId && distId) {
      var x = $gameVariables.value(xId);
      var y = $gameVariables.value(yId);
      $gameVariables.setValue(distId, Math.abs(x) + Math.abs(y));
    }
  };

  //
  // function for getting relativeXy variables
  //
  var getDistX = function () {
    var xId = $gameSystem.varIdOfRelativeX;
    if (xId) {
      return $gameVariables.value(xId);
    } else {
      return null;
    }
  };

  var getDistY = function () {
    var yId = $gameSystem.varIdOfRelativeY;
    if (yId) {
      return $gameVariables.value(yId);
    } else {
      return null;
    }
  };

  var isXyVarid = function () {
    return getDistX() !== null && getDistY() !== null;
  };

  var InvalidMsg = '■';

  //
  // function for getting string at window.
  //
  var evX = function (doDispXisZero) {
    if (!isXyVarid()) {
      return InvalidMsg;
    }
    var torx = $gameSystem.getTermsOfRelativeXy();
    var x = getDistX();
    if (x !== 0) {
      return x > 0 ? torx.right : torx.left;
    } else if (doDispXisZero){
      return getDistY() ? torx.xZero : torx.xyZero;
    } else {
      return '';
    }
  };

  var evX1 = function () {
    return evX(true);
  };

  var evX2 = function () {
    return evX(false);
  };

  var evY = function (doDispYisZero) {
    if (!isXyVarid()) {
      return InvalidMsg;
    }
    var torx = $gameSystem.getTermsOfRelativeXy();
    var y = getDistY();
    if (y !== 0) {
      return y > 0 ? torx.down : torx.up;
    } else if (doDispYisZero){
      return getDistX() ? torx.yZero : torx.xyZero;
    } else {
      return '';
    }
  };

  var evY1 = function () {
    return evY(true);
  };

  var evY2 = function () {
    return evY(false);
  };

  var evCt = function () {
    if (!isXyVarid()) {
      return InvalidMsg;
    }
    var torx = $gameSystem.getTermsOfRelativeXy();
    if (getDistX() === 0 && getDistY() === 0) {
      return torx.xyZero;
    } else {
      return torx.notXyZero;
    }
  };

  var evCm = function () {
    if (!isXyVarid()) {
      return InvalidMsg;
    }
    var torx = $gameSystem.getTermsOfRelativeXy();
    if (getDistX() !== 0 && getDistY() !== 0) {
      return torx.xyNoneZero;
    } else {
      return '';
    }
  };

  var evEt = function () {
    return '\n';
  };

  //
  // process message escape characters
  //
  var _Window_Base_convertEscapeCharacters =
   Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = text.replace(/(\\|\x1b)ev(([XY][12])|(C([tm]))|(Et))/g, function() {
      switch (arguments[2]) {
      case 'X1':
        return evX1();
      case 'X2':
        return evX2();
      case 'Y1':
        return evY1();
      case 'Y2':
        return evY2();
      case 'Ct':
        return evCt();
      case 'Cm':
        return evCm();
      case 'Et':
        return evEt();
      }
    });
    return _Window_Base_convertEscapeCharacters.call(this, text);
  };
})();
