//=============================================================================
// CastCommonEvent.js
//=============================================================================

/*:
 * @plugindesc force to run the common event to the specified named event
 * @author Sasuke KANNAZUKI
 *
 * @help
 * [Plugin Command]
 * CastCommonEvent <eventName> <commonEventId>
 *  - the event whose name is <eventName> invokes common event <commonEventId>.
 *  - if plural events have the name, only the smallest ID's one is chosen.
 *  - if the eventName contains white space, this plugin command cannot use.
 *    call 'Scrpit' instead.
 * ex:
 * CastCommonEvent Initializer 4
 * CastCommonEvent Trap 7
 *
 * CastCommonEventName <eventName> <commonEventName>
 *  - the event whose name is <eventName> invokes common event whose name is 
 *   <commonEventName>.
 *  - if commonEventName includes the white space, use 'Script' instead.
 * ex.
 * CastCommonEventName Initializer CommonInitializeProcess
 * CastCommonEvent Trap CommonTrapProcess
 * 
 * [Script]
 * Call from Event Command 'Script' as follows:
 * this.castCommonEvent('<eventName>', <commonEventId>);
 * ex:
 * this.castCommonEvent('My Box', 4);
 * this.castCommonEvent("Water Trap", 7);
 *
 * this.CastCommonEventName('<eventName>', '<commonEventName>');
 * ex.
 * this.castCommonEventName('My Box', 'Common Process 1');
 * this.castCommonEventName('Water Trap', 'Trap Process');
 */
/*:ja
 * @plugindesc 特定の名前のイベントに任意のコモンイベントを実行させます
 * @author 神無月サスケ
 *
 * @help
 * プラグインコマンド書式：
 * CastCommonEvent <eventName> <commonEventId>
 *  - そのマップにある <eventName> という名前のイベントに対して、
 *   <commonEventId>番のコモンイベントを起動します。
 *  - その名前のイベントが複数ある場合、イベントIDの一番若い物だけに対して
 *   実行されます。
 *  - 半角/全角スペースを含む名前の場合、プラグインコマンドは使えません。
 *   下記のスクリプトを呼び出してください。
 * 例:
 * CastCommonEvent 人形 4
 * CastCommonEvent 立て札 7
 * 
 * CastCommonEventName <eventName> <commonEventName>
 *  - そのマップにある <eventName> という名前のイベントに対して、
 *   <commonEventName> という名前のコモンイベントを起動します。
 *  - 半角/全角スペースを含む名前の場合、プラグインコマンドは使えません。
 *   下記のスクリプトを呼び出してください。
 * ex.
 * CastCommonEventName 初期化 初期化共通処理
 * CastCommonEvent 罠 罠共通処理
 * 
 * スクリプト：
 * 以下の書式で呼び出してください。
 * this.castCommonEvent('<eventName>', <commonEventId>);
 * 例:
 * this.castCommonEvent('My Box', 4);
 * this.castCommonEvent("Water Trap", 7);
 *
 * this.CastCommonEventName('<eventName>', '<commonEventName>');
 * 例.
 * this.castCommonEventName('My Box', 'Common Process 1');
 * this.castCommonEventName('Water Trap', 'Trap Process');
 */

(function() {

  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'CastCommonEvent') {
      $gameMap._interpreter.castCommonEvent(args[0], Number(args[1]));
    }
    if (command === 'CastCommonEventName') {
      $gameMap._interpreter.castCommonEventName(args[0], args[1]);
    }
  };

  //
  // main routine
  //
  var getEventWhoseNameIs = function (name) {
    var arr = $gameMap.events().filter(function (event) {
      return event.event().name === name;
    });
    return arr[0];
  };

  var getCommonEventIdWhoseNameIs = function (name) {
    for (var i = 1; i < $dataCommonEvents.length; i++) {
      var commonEvent = $dataCommonEvents[i];
      if (commonEvent && commonEvent.name === name) {
        return i;
      }
    }
    return 0;
  };

  //
  // force to run the common event to the event whose name is eventName.
  //
  Game_Interpreter.prototype.castCommonEvent = function (eventName, commonId) {
    var event = getEventWhoseNameIs(eventName);
    var commonEvent = $dataCommonEvents[commonId];
    if (event && commonEvent) {
      if (this.isRunning()) {
        this.setupChild(commonEvent.list, event.eventId());
      } else { // when called by parallel event.
        this.setup(commonEvent.list, event.eventId());
      }
    }
  };

  Game_Interpreter.prototype.castCommonEventName = function (eventName, commonEventName) {
    var commonEventId = getCommonEventIdWhoseNameIs(commonEventName);
    this.castCommonEvent(eventName, commonEventId);
  };

})();
