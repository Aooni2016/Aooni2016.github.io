//=============================================================================
// SelfSwitchUtility.js
//=============================================================================

/*:
 * @plugindesc provides plugin commands and script commands for self swithes
 * @author Sasuke KANNAZUKI
 *
 * @help
 * [move routing -> script]
 * this.setSelfSw(letter, value);
 * #=> letter : 'A', 'B', 'C' or 'D'. (must be capital)
 *     value  : true , false or 'flip'.
 *     ex1. this.setSelfSw('A', true);
 *     ex2. this.setSelfSw('B', 'flip');
 *
 * [event command interpreter -> script]
 * this.getSelfSw(eventIdNotation, letter)
 * #=> eventIdNotation :
 *  - immidiate value (ex. 5, 10)
 *  - variable value (ex.'V10', 'V7')
 *  - event's name (ex. 'ladder', 'doll')
 *  - 't' or 'this' indicates the event running the interpreter
 * #=> letter : 'A', 'B', 'C' or 'D'. (must be capital)
 * Note: This function assumes to the use on the condition branch.
 *
 * [Plugin Commands]
 * SetSelfSwitch <value> <eventId> <self1> [<self2> <self3>]
 * SetSelfSwitches <value> <srcEventId> <destEventId> <self1> [<self2> <self3>]
 * # parameters in brackets are omissible.
 * #=> <value>: on / true / off / false / flip / toggle
 * #=> <eventId> , <srcEventId>, <destEventId>:
 *  - immidiate value (ex. 5, 10)
 *  - variable value (ex. V10, V7)
 *  - event's name (ex. ladder, doll)
 *  - t or this : indicates the event running the interpreter
 * #=> <self1> <self2> <self3>: 'A', 'B', 'C', 'D' or 'all'
 *
 * Note: the self switches of invalid events are not modified.
 */

/*:ja
 * @plugindesc セルフスイッチ操作用のプラグインコマンドやスクリプト呼出関数集
 * @author 神無月サスケ
 *
 * @help
 * ■『移動ルートの設定』の『スクリプト』で指定
 * this.setSelfSw(letter, value);
 * #=> letter : 'A', 'B', 'C' または 'D'. (大文字にしてください)
 *     value  : true , false または 'flip'.
 *     ex1. this.setSelfSw('A', true);   // セルフスイッチAをONに
 *     ex2. this.setSelfSw('B', 'flip'); // セルフスイッチBを切り替える
 *
 * ■イベントコマンドの『スクリプト』で指定
 * this.getSelfSw(eventIdNotation, letter)
 * #=> eventIdNotation は以下の表記が使えます。
 *  - 即値 (例: 5, 10)
 *  - 指定したIDの変数の値 (例: 'V10', 'V7')
 *  - イベント名 (例: 'ひろし', '卓郎')
 *  - 't' または 'this' : インタプリタを実行中のイベントのID
 * #=> letter : 'A', 'B', 'C' または 'D'. (大文字にしてください)
 * 条件分岐での使用を想定しています。
 *
 * ■プラグインコマンド
 * SetSelfSwitch <value> <eventId> <self1> [<self2> <self3>]
 * SetSelfSwitches <value> <srcEventId> <destEventId> <self1> [<self2> <self3>]
 * # 指定したイベントのセルフスイッチの値を書きかえます。
 * # []で囲んだ引数は省略可能です。
 * #=> <value>: on / true / off / false / flip / toggle
 *      flip と toggle は on/off を切り替えます。
 * #=> <eventId> , <srcEventId>, <destEventId> は以下の表記が使えます。
 *  - 即値 (例: 5, 10)
 *  - 指定したIDの変数の値 (例: V10, V7)
 *  - イベント名 (例: ひろし, 卓郎)
 *  - t または this : インタプリタを実行中のイベントのID
 * #=> <self1> <self2> <self3>: A, B, C または D. all を指定すると全て。
 *
 * 注意：無効なイベントのセルフスイッチは更新されません。
 */

(function() {

  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    switch (command) {
    case 'SetSelfSwitch':
      this.setSelfSwitches(args[0], args[1], args[1], args[2], args[3],
        args[4], args[5]);
      break;
    case 'SetSelfSwitches':
      this.setSelfSwitches(args[0], args[1], args[2], args[3], args[4],
        args[5], args[6]);
      break;
    }
  };

  //
  // process parameters
  //
  var getEventIdWhoseNameIs = function (name) {
    var events = $gameMap.events();
    for (var i = 0; i < events.length; i++) {
      if (events[i].event().name === name) {
        return events[i].eventId();
      }
    }
    return 0;
  };

  var getEventIdFromParam = function (idNotation, thisId) {
    var reg;
    idNotation = String(idNotation);
    if ((/^t(his)?$/i).test(idNotation)) {
      return thisId;
    } else if (reg = (/^(V?)([0-9]+)/i).exec(idNotation)) {
      return reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
    } else {
      return getEventIdWhoseNameIs(idNotation);
    }
  };

  //
  // setter and getter at event class
  //
  Game_CharacterBase.prototype.setSelfSw = function(letter, value) {
  };

  Game_Event.prototype.setSelfSw = function(letter, value) {
    if (letter.match(/^[A-D]$/)) {
      var key = [$gameMap.mapId(), this._eventId, letter];
      switch (value) {
      case 'on':
      case 'true':
        $gameSelfSwitches.setValue(key, true);
        break;
      case 'off':
      case 'false':
        $gameSelfSwitches.setValue(key, false);
        break;
      case 'flip':
      case 'toggle':
        var originalValue = $gameSelfSwitches.value(key);
        $gameSelfSwitches.setValue(key, !originalValue);
        break;
      default: // ex. boolean value
        $gameSelfSwitches.setValue(key, !!value);
        break;
      }
    }
  };

  Game_CharacterBase.prototype.getSelfSw = function(letter) {
    return false;
  };

  Game_Event.prototype.getSelfSw = function(letter) {
    if (letter.match(/^[A-D]$/)) {
      var key = [$gameMap.mapId(), this._eventId, letter];
      return !!$gameSelfSwitches.value(key);
    } else {
      return false;
    }
  };

  //
  // setter and getter at event command interpreter
  //
  Game_Interpreter.prototype.setSelfSw = function(idNotation, letter, value) {
    var event = $gameMap.event(getEventIdFromParam(idNotation, this._eventId));
    if (event) {
      event.setSelfSw(letter, value);
    }
  };

  Game_Interpreter.prototype.getSelfSw = function(idNotation, letter) {
    var event = $gameMap.event(getEventIdFromParam(idNotation, this._eventId));
    if (event) {
      return event.getSelfSw(letter);
    } else {
      return false;
    }
  };

  //
  // process plugin command
  //
  var processLetters = function(letters) {
    var results = {A:false, B:false, C:false, D:false};
    for (var i = 0; i < letters.length; i++) {
      if (!letters[i]) {
        return results;
      } else if (letters[i] === 'all') {
        return {A:true, B:true, C:true, D:true};
      } else if (letters[i].match(/^[A-D]$/)) {
        results[letters[i]] = true;
      }
    }
    return results;
  };

  Game_Interpreter.prototype.setSelfSwitches = function(value, srcIdNote,
   destIdNote, letter1, letter2, letter3, letter4) {
    var letters = processLetters([letter1, letter2, letter3, letter4]);
    var srcId = getEventIdFromParam(srcIdNote, this._eventId);
    var destId = getEventIdFromParam(destIdNote, this._eventId);
    for (var i = srcId; i <= destId; i++) {
      var event = $gameMap.event(i);
      if (event) {
        for (var j in letters) {
          if (letters[j]) {
            event.setSelfSw(j, value);
          }
        }
      }
    }
  };

})();
