//=============================================================================
// BindVariableDisplay.js
//=============================================================================

/*:
 * @plugindesc Set specified variable the property to display value on window
 * @author Sasuke KANNAZUKI
 * 
 * @help 
 * Set properties for specified variable to display the value on window.
 * - change color according to the value
 * - whether to display number in Zenkaku character in Japanese
 * - whether to display absolute value.
 * these are configurable for each variable id.
 *
 * *** script commands:
 * call following from 'scrpit' of either event command or move routing.
 *
 * this.setVariableConditionColor(<varIdNotation>, <colorTableArray>);
 *  when display the value <varIdNotation> as \V[n] notation,
 *  change the color according to the rule of <colorTableArray>.
 *
 * - You can use following notations at <varIdNotation>.
 *  - immidiate value (ex. 5, 10. string like '5' is also acceptable.)
 *  - the value of variable  (ex. 'V10', 'V20' the value of V+variable id)
 *  - the variable name (ex. 'LuckOfHiroshi', 'MikaCondition')
 *
 * ・ <colorTableArray> is an array literal as follows:
 *   [<colorTable1>, <colorTable2>, ...]
 *   The number of <colorTableN> can any natural number.
 *   each <colorTableN> is array literal with 2 elements.
 *   [<eval notaton>, <color ID>]
 *  ・<eval notation> is either the number or Javascript string that can
 *    fundamental function eval().
 *    when set the variable value in string literal, you can write v[n].
 *    for example, '300' is evaluated 300, 'v[10] * 3' is three times of
 *    variable id 10, and you can also write conplex notation like
 *    '$gameActors.actor(1).hp'. (this is actor #1's current HP).
 *  ・<color ID> is from 0 to 31 that the same color as \C[n].
 *    Also like 'V10', you can also set the value of variable.
 *    ex. 0=white/1=blue/2=red/3=green/4=cyan/5=purple/6=yellow/7=gray.
 *    (at default window skin)
 *
 * ・Mechanism of color decision:
 *   from top of the <colorTableArray>, inspecting
 *   [<eval notation>, <colorID>].
 *   when <eval notation> value become >= the value of <varIdNotation>, 
 *   returns the <color ID> of <colorTableN>.
 *   when no <eval notation> value become >= the value of <varIdNotation>,
 *   return the <color ID> of last index of <colorTableN>.
 *
 * ・Example
 * this.setVariableConditionColor(15, [[200,2],[400,6],[600,0],[800,3]]);
 *  In this case, check the value of Variable ID #15.
 *  When the value is <= 200, the color will be 2(red), else if <= 400,
 *  will be 6(yellow), else if <= 600, will be 6(=white), else will be
 *  3(green).
 *  color changes only the value.
 *
 * this.resetVariableConditionColor(<varIdNotation>);
 *  reset the settings of above.
 *
 * this.setVariableIsZenkaku(<varIdNotation>, <boolean>);
 *  set/reset the display of <varIdNotation>'s value Japanese Zenkaku
 *  characters. (<boolean>; true/set, false/reset)
 *
 * this.setVariableIsAbs(<varIdNotation>, <boolean>);
 *  set/reset the display of <varIdNotation>'s absolute value.
 *  (<boolean>; true/set, false/reset)
 *
 * this.resetAllForTheVariable(<varIdNotation>);
 *  reset all settings of <varIdNotation>.
 *
 * *** Note:
 * If you use EventRelativeCoords.js together and you'll set the configuration
 * in the term of direction, 
 * Put EventRelativeCoords.js below this plugin.
 * 
 */
/*:ja
 * @plugindesc 特定の変数をウィンドウに表示する際のプロパティを設定します
 * @author 神無月サスケ
 * 
 * @help 
 * 特定の変数をウィンドウで表示する際(例:メッセージウィンドウにおける\V[10])に
 * 以下の特徴を設定できます：
 * - 値に応じて色を変更
 * - 値を全角表示するか
 * - 絶対値を表示するか
 * これらは、変数IDごとに設定可能です。
 *
 * ■スクリプトコマンド
 * イベントコマンドの「スクリプト」または「移動ルートの設定」の「スクリプト」
 * から呼び出して下さい。
 *
 * this.setVariableConditionColor(<変数ID記法>, <色対応配列>);
 * <変数ID記法>で設定された変数を \V[n]の形で表示するとき、
 * <色対応配列>で指定したルールに基づいて、変数部分だけ色を変更します。
 *
 * ・<変数ID記法> には以下の書式が可能です。
 *  - 即値 (5, 10 など、通常の数値。'5'のように文字列にしても可)
 *  - 変数IDの値 ('V10', 'V20'など。Vに続く番号の変数の値になります)
 *  - 変数名 ('ひろしSAN値', '美香との友好度' など。)
 *
 * ・ <色対応配列> は以下のように配列リテラルで指定して下さい。
 *   [<色対応1>, <色対応2>, ...]
 *   ここで、<色対応n> は任意の数に出来ます。
 *   <色対応n> は、それぞれ以下の2要素の配列リテラルにしてください。
 *   [<eval式>, <色ID>]
 *  ・<eval式> は、数値か、eval()で解釈可能なJavascriptの文字列にします。
 *    変数nの値を参照する場合、v[n]という書式で可能です。
 *    例えば '300' なら 300、'v[10] * 3' なら、変数10番の値の3倍になります。
 *    また、'$gameActors.actor(1).hp' のような複雑な書式も可能です。
 *    (この場合、アクターID1番のアクターのHPの値になります。」
 *  ・<色ID>は、\C[n]で設定可能な色と同じで、0～31が指定可能です。
 *    また、nには'V10'のように Vを付けることで、変数の値も指定可能です。
 *    よく使う値として、0=白/1=青/2=赤/3=緑/4=水色/5=紫/6=黄色/7=灰色 が
 *    挙げられます(デフォルトのウィンドウスキンの場合)。
 *
 * ・色決定メカニズム
 *   <色対応配列>の頭から順番に[<eval式>, <色ID>]を見て行きます。
 *   <eval式>の評価結果の値が、<変数ID記法>の変数の値以上になったところで
 *   探索を打ち切り、そこの<色ID>の値を返します。
 *   どの<eval式>も変数の値を上回らなかった場合は、配列の最後の<色対応配列>の
 *   <色ID>が返されます。
 *
 * ・実例
 * this.setVariableConditionColor(15, [[200,2],[400,6],[600,0],[800,3]]);
 *  変数15番の値が200以下の場合、赤(色=2), 400以下の場合、黄色(=6)、
 *  600以下の場合、白(=6)、それ以上の場合、緑(=3)になります。
 *  この設定後、 \V[15] と指定した場合、その値の部分だけ、この色になります。
 *
 * this.resetVariableConditionColor(<変数ID記法>);
 *  上記の設定をリセットします。
 *
 * this.setVariableIsZenkaku(<変数ID記法>, <真偽値>);
 *  <変数ID記法>の変数の値を表示するとき、全角で表示します。
 *  <真偽値>が true なら開始、false なら終了です。
 *
 * this.setVariableIsAbs(<変数ID記法>, <真偽値>);
 *  <変数ID記法>の変数の値を表示するとき、絶対値を表示します。
 *  <真偽値>が true なら開始、false なら終了です。
 *
 * this.resetAllForTheVariable(<変数ID記法>);
 *  上記の設定を全部リセットします。
 *
 * ■注意
 * EventRelativeCoords.js (イベント間の相対座標に関するプラグイン)を使う方で、
 * 方向を表す用語の中でこの設定を有効にしたい方は、
 * EventRelativeCoords.js はこのプラグインの下に配置してください。
 */

(function() {

  //
  // routine for process parameters
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
    varIdNotation = String(varIdNotation);
    if (reg = (/^(V?)([0-9]+)/i).exec(varIdNotation)) {
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
  // define variables and setter/getter
  //
  var _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this.varProperties = null;
  };

  Game_System.prototype.setVariableProperty = function (
   varIdNotation, propertyName, value) {
    var varId = getVariableIdFromParam(varIdNotation);
    if (varId) {
      var p = this.varProperties = this.varProperties || {};
      var q = p[varId] = p[varId] || {};
      q[propertyName] = value;
    }
  };

  Game_System.prototype.resetVariableProperty = function (
   varIdNotation, propertyName) {
    var varId = getVariableIdFromParam(varIdNotation);
    if (varId) {
      var p, q;
      if ((p = this.varProperties) && (q = p[varId]) && q[propertyName]) {
       delete q[propertyName];
      }
    }
  };

  Game_System.prototype.resetVariableProperties = function (varIdNotation) {
    var varId, p;
    if (varId = getVariableIdFromParam(varIdNotation)) {
      if ((p = this.varProperties) && p[varId]) {
       delete p[varId];
      }
    }
  };

  //
  // setter functions called from script.
  //
  Game_Character.prototype.setVariableConditionColor = 
  Game_Interpreter.prototype.setVariableConditionColor = function (
   varIdNotation, condArray) {
    $gameSystem.setVariableProperty(varIdNotation, 'condArray', condArray);
  };

  Game_Character.prototype.resetVariableConditionColor = 
  Game_Interpreter.prototype.resetVariableConditionColor = function (
   varIdNotation) {
    $gameSystem.resetVariableProperty(varIdNotation, 'condArray');
  };

  Game_Character.prototype.setVariableIsZenkaku = 
  Game_Interpreter.prototype.setVariableIsZenkaku = function (
   varIdNotation, booleanValue) {
    if (booleanValue) {
      $gameSystem.setVariableProperty(varIdNotation, 'zenkaku', true);
    } else {
      $gameSystem.resetVariableProperty(varIdNotation, 'zenkaku');
    }
  };

  Game_Character.prototype.setVariableIsAbs = 
  Game_Interpreter.prototype.setVariableIsAbs = function (
   varIdNotation, booleanValue) {
    if (booleanValue) {
      $gameSystem.setVariableProperty(varIdNotation, 'doAbs', true);
    } else {
      $gameSystem.resetVariableProperty(varIdNotation, 'doAbs');
    }
  };

  Game_Character.prototype.resetAllForTheVariable = 
  Game_Interpreter.prototype.resetAllForTheVariable = function (
   varIdNotation) {
    $gameSystem.resetVariableProperties(varIdNotation);
  };

  //
  // converters for getters
  //
  var ZenkakuNumber = '０１２３４５６７８９';
  var toZenkaku = function (value) {
    var result = String(value || 0).replace(/([0-9])/g , function (m0, m1) {
      return ZenkakuNumber[+m1];
    });
    return result.replace(/^\-/, '－');
  };

  var evalWithVar = function (string) {
    try {
      // the notation like 'v[10]' is replaced to the value of variable id 10.
      var v = $gameVariables._data;
      var value = eval(String(string));
      return !isNaN(value) ? value : 0;
    } catch (e) {
      return 0;
    }
  };

  var findCurrentColor = function (value, condArray) {
    for (var i = 0; i < condArray.length - 1; i++) {
      var a = condArray[i];
      var key = evalWithVar(condArray[i][0]);
      if (key >= value) {
        break;
      }
    }
    return getNumberFromParam(condArray[i][1]);
  };

  //
  // process escape sequence of window
  //
  var processVariableId = function (arg) {
    var varId = parseInt(arg);
    var originalValue = value = $gameVariables.value(varId);
    var p, q;
    if ((p = $gameSystem.varProperties) && (q = p[varId])) {
      if (q.doAbs) {
        value = Math.abs(value);
      }
      if (q.zenkaku) {
        value = toZenkaku(value);
      }
      if (q.condArray) {
        var color = findCurrentColor(originalValue, q.condArray);
        value = "\x1bCRECORD[" + color + "]" + value + "\x1bCRESUME";
      }
    }
    return value;
  };

  var _tempColor;

  var _Window_Base_processEscapeCharacter =
   Window_Base.prototype.processEscapeCharacter;
  Window_Base.prototype.processEscapeCharacter = function(code, textState) {
    _Window_Base_processEscapeCharacter.call(this, code, textState);
    switch (code) {
    case 'CRECORD':
      _tempColor = this.contents.textColor;
      this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
      break;
    case 'CRESUME':
      this.changeTextColor(_tempColor);
      break;
    }
  };

  var _Window_Base_convertEscapeCharacters =
   Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\\\');
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
      return processVariableId(arguments[1]);
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
      return processVariableId(arguments[1]);
    }.bind(this));
    return _Window_Base_convertEscapeCharacters.call(this, text);
  };

})();
