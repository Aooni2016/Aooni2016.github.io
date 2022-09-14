//=============================================================================
// AooniMoveSet.js
//=============================================================================
/*:
 * @plugindesc change Aooni's move speed and frequency defined in AooniLib.js
 * @author Sasuke KANNAZUKI
 *
 * @help
 * This plugin is works with AooniLib.js.
 * Put below of AooniLib in the plugin list.
 * 
 * *** Plugin Commands
 * AooniMoveSet <speed> [<frequency> <eventId>]
 *  - <speed> must be the integer or floating point number(from 0 by 7).
 *    when <speed> is 0, Aooni stop moving.
 *  - <frequency> is the wait count for each step Aooni waits.
 *    default value is 2. if <frequency> is 0, Aooni moves highest frequency.
 *  - <eventId> is the id or name of Aooni event. if the event isn't Aooni,
 *    the command is ignored.
 *    <eventId> is also set the word all, and it is the default.
 * AooniMoveReset [<eventId>]
 *  - reset the setting and normal moving speed and frequency.
 * 
 * *** Move Routing -> Script
 * this.setAooniMove(speed, frequency);
 * this.setAooniMoveSpeed(speed);
 * this.setAooniWaitCount(frequency);
 * ex：
 * AooniMoveSet 3.8 10 all  // speed is 3.8, 10 frame wait for each step.
 * AooniMoveSet 4 0 all     // speed is 4, frequency is the same as highest
 *  // (above of all, 'all' is omissible)
 * AooniMoveSet 5           // the case only speed is setting.
 *
 * ***Main Mechanism
 * The setting done by this plugin is remain to the next map's the same name of
 * Aooni. So, name each Aooni event unique name.
 * If plural Aooni events has the same name, the result is not specified.
 */
/*:ja
 * @plugindesc AooniLib.js で定義された青鬼の移動速度および頻度を変更します
 * @author 神無月サスケ
 *
 * @help
 * このプラグインの実行には AooniLib.js が必要です。
 * このプラグインを AooniLib の後に置いてください。
 * 
 * ■プラグインコマンド
 * AooniMoveSet <速度> [<頻度> <イベントID>]
 *  - <速度>は 0 ～ 7 の整数か小数にしてください。
 *    0 にした場合、青鬼はその場で動かなくなるため、「移動ルートの設定」などの
 *    際は注意してください。
 *  - <頻度>は、青鬼が一歩ごとにウェイトするフレーム数です。
 *    デフォルト値は2です。<頻度>が0の場合、最高頻度と同じになります。
 *  - <イベントID> は設定する青鬼イベントのIDか名前が設定できます。
 *    青鬼はイベント名が「青」で始まらなければなりません。
 *    もしイベントが青鬼でない場合、設定は無視されます。
 *    <イベントID> に all と設定すると、全ての青鬼イベントを一括設定します。
 *    省略した場合も、全ての青鬼イベントを一括設定します。
 * AooniMoveReset [<eventId>]
 *  - 速度や頻度をリセットし、デフォルトの設定に戻します。
 *
 * ■移動ルートの設定→スクリプト
 * this.setAooniMove(速度, 頻度);
 * this.setAooniMoveSpeed(速度);
 * this.setAooniWaitCount(頻度);
 * 例：
 * AooniMoveSet 3.8 10 all  // 速度3.8 で、一歩ごとに10フレームウェイト
 * AooniMoveSet 4 0 all     // 速度４で、移動頻度＝最高と同じ
 *  // (上記、allは省略可)
 * AooniMoveSet 5           // 速度のみ設定
 *
 * ■基本メカニズム
 * 変更された移動速度は、マップが切り替わった時、同じ名前の青鬼イベントがあれば
 * そのイベントに引き継がれます。ただし、複数の同名の青鬼イベントがある場合、
 * 結果は不定です。それぞれに異なる名前をつけてください。
 */

(function() {
  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'AooniMoveSet') {
      setAooniMoveFromParam(args[0], args[1], args[2]);
    } else if (command === 'AooniMoveReset') {
      setAooniMoveFromParam(null, null, args[0]);
      if (!args[0] || args[0] === 'all') {
        resetSystemAooniMove();
      }

    }
  };

  //
  // process parameters
  //
  var getEventWhoseNameIs = function (name) {
    var arr = $gameMap.events().filter(function (event) {
      return event.event().name === name;
    });
    return arr[0];
  };

  var getAooniEvents = function () {
    var events = $gameMap.events().filter(function (event) {
      return event.isAooni();
    });
    return events;
  };

  var setAooniMoveFromParam = function (speed, waitCount, eventIdNotation) {
    var reg;
    if (!eventIdNotation || eventIdNotation === 'all') {
      getAooniEvents().forEach(function (event) {
        event.setAooniMove(speed, waitCount);
      });
    } else if (reg = /^([0-9]+)$/.exec(eventIdNotation)) {
      var event = $gameMap.event(Number(reg[1]));
      if (event) {
        event.setAooniMove(speed, waitCount);
      }
    } else {
      var event = getEventWhoseNameIs(eventIdNotation);
      if (event) {
        event.setAooniMove(speed, waitCount);
      }
    }
  };

  //
  // set values : also called by script on move routing.
  //
  Game_CharacterBase.prototype.setAooniMove = function (speed, waitCount) {
  };

  Game_Event.prototype.setAooniMove = function (speed, waitCount) {
    // note: parameters will be either number, string, or null.
    this.setAooniMoveSpeed(speed != null ? Number(speed) : null);
    this.setAooniWaitCount(waitCount != null ? Number(waitCount) : null);
  };

  Game_CharacterBase.prototype.setAooniMoveSpeed = function (speed) {
  };

  Game_Event.prototype.setAooniMoveSpeed = function (speed) {
    if (this.isAooni()) {
      this._aooniMoveSpeed = speed;
      this.setMoveSpeed(this.page() ? this.page().moveSpeed : 4);
      setSystemAooniMoveSpeed(this.event().name, speed);
    }
  };

  Game_CharacterBase.prototype.setAooniWaitCount = function (waitCount) {
  };

  Game_Event.prototype.setAooniWaitCount = function (waitCount) {
    if (this.isAooni()) {
      this.aooniWaitCount = waitCount;
      setSystemAooniWaitCount(this.event().name, waitCount);
    }
  };

  //
  // the process for map changes
  //
  var resetSystemAooniMove = function () {
    $gameSystem.aooniMoveSet = null;
  };

  var setSystemAooniMoveSpeed = function (name, speed){
    $gameSystem.aooniMoveSet = $gameSystem.aooniMoveSet || {};
    $gameSystem.aooniMoveSet[name] = $gameSystem.aooniMoveSet[name] || {};
    $gameSystem.aooniMoveSet[name]['speed'] = speed;
  };

  var setSystemAooniWaitCount = function (name, waitCount){
    $gameSystem.aooniMoveSet = $gameSystem.aooniMoveSet || {};
    $gameSystem.aooniMoveSet[name] = $gameSystem.aooniMoveSet[name] || {};
    $gameSystem.aooniMoveSet[name]['waitCount'] = waitCount;
  };

  var _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this.aooniMoveSet = null;
  };

  var _Game_Event_refresh = Game_Event.prototype.refresh;
  Game_Event.prototype.refresh = function() {
    this.intializeAooniMoveSet();
    _Game_Event_refresh.call(this);
  };

  Game_Event.prototype.intializeAooniMoveSet = function () {
    var s, n;
    if (this.isAooni() && !this.AooniInitialized) {
      if ((s = $gameSystem.aooniMoveSet) && (n = s[this.event().name])) {
        this._aooniMoveSpeed = n.speed;
        this.aooniWaitCount = n.waitCount;
      }
      this.AooniInitialized = true;
    }
  };

})();
