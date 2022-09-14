//=============================================================================
// SuspendEventProcess.js
//=============================================================================

/*:
 * @plugindesc suspend the specified events' move or parallel events' function
 * @author Sasuke KANNAZUKI
 *
 * @help
 * This plugin enables following 3 functions by plugin commands:
 * - suspend parallel events (including parallel common events).
 * - suspend the event's move route forcing.
 * - suspend routine moving of the specified event(s).
 *
 * Plugin Commands:
 * SuspendEvent <eventID>
 * SuspendEvent all
 * SuspendEvent <srcID> <destID>
 * SuspendEvent <notation> <objID>
 *  <notation>: gt > gte >= lt < lte <=
 *  (gt: Greater Than, gte: GT or Equal, lt:Less Than, lte:LT or Equal)
 * 
 * ResumeEvent <eventID>
 * ResumeEvent all
 * ResumeEvent <srcID> <destID>
 * ResumeEvent <notation> <objID>
 * 
 * SuspendCommon <eventID>
 * SuspendCommon all
 * SuspendCommon <srcID> <destID>
 * SuspendCommon <notation> <objID>
 * 
 * ResumeCommon <eventID>
 * ResumeCommon all
 * ResumeCommon <srcID> <destID>
 * ResumeCommon <notation> <objID>
 *
 * - invalid events are simply ignored.
 * - suspention is reset when player's transferring is performed.
 * - at eventID parameter such as <srcID> , <destID> and so on,
 *  you can use following notations:
 *   15 (immidiate value 15)
 *   V15 (value of variable id #15)
 *   anyString (the event whose name is 'anyString')
 */
/*:ja
 * @plugindesc 指定したイベントの動きや並列イベントを一時停止します
 * @author 神無月サスケ
 *
 * @help
 * プラグインコマンドを実行すると、以下の３つを一時停止します:
 * - 並列処理のイベントとコモンイベント
 * - 移動ルートの設定で行動中のイベント
 * - 自律移動中のイベント
 *
 * ■プラグインコマンド
 * SuspendEvent <eventID>
 *  イベント <eventId> の上記機能を停止します。
 * SuspendEvent all
 *  全てのイベントの上記機能を停止します。
 * SuspendEvent <srcID> <destID>
 *  <srcID>から<destID>までの全てのイベントの上記機能を停止します。
 *  無効なイベントが含まれていても、エラーにならず、単に無視されます。
 * SuspendEvent <notation> <objID>
 *  <notation>には、次の8通りの記法が可能です。 gt > gte >= lt < lte <=
 *  gt  または >  : <objId>より値の大きなイベントID全ての上記機能を停止
 *  gte または >= : <objId>以上のイベントID全ての上記機能を停止
 *  lt  または <  : <objId>未満のイベントID全ての上記機能を停止
 *  lte または <= : <objId>以下のイベントID全ての上記機能を停止
 *  無効なイベントが含まれていても、エラーにならず、単に無視されます。
 * 
 * ResumeEvent <eventID>
 * ResumeEvent all
 * ResumeEvent <srcID> <destID>
 * ResumeEvent <notation> <objID>
 *  停止中のイベントを再開します。パラメータは SuspendEvent と同じ書式です。
 *  停止中でないなどのイベントが含まれていても、単に無視されます。
 * 
 * SuspendCommon <eventID>
 * SuspendCommon all
 * SuspendCommon <srcID> <destID>
 * SuspendCommon <notation> <objID>
 *  並列コモンイベントを停止します。パラメータは SuspendEvent と同じ書式です。
 *  並列でないなどのコモンイベントが含まれていても、単に無視されます。
 * 
 * ResumeCommon <eventID>
 * ResumeCommon all
 * ResumeCommon <srcID> <destID>
 * ResumeCommon <notation> <objID>
 *  停止中の並列コモンイベントを再開します。引数は SuspendEvent と同じです。
 *
 * ■イベントIDの書式
 * 上記の<srcID>や<destID>などは、通常の数値の他に、以下の表記も指定可能です
 *  - V15 のように頭にVを付けると、指定したIDの変数の値になります。
 *  - それ以外の任意の文字列を設定すると、イベント名とみなされ、
 *    その名前の一番若いイベントIDになります。(コモンイベント名も同様)
 *
 * ■注意
 * イベントの一時停止は、マップが切り替わると全てリセットされます。
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
    case 'SuspendEvent':
      var range = getEventIdRangeFromParam(args[0], args[1]);
      suspendEvents(range.src, range.dest);
      break;
    case 'ResumeEvent':
      if (args[0] === 'all') {
        resumeAllEvents();
      } else {
        var range = getEventIdRangeFromParam(args[0], args[1]);
        resumeEvents(range.src, range.dest);
      }
      break;
    case 'SuspendCommon':
      var range = getCommonEventIdRangeFromParam(args[0], args[1]);
      suspendCommonEvents(range.src, range.dest);
      break;
    case 'ResumeCommon':
      if (args[0] === 'all') {
        resumeAllCommonEvents();
      } else {
        var range = getCommonEventIdRangeFromParam(args[0], args[1]);
        resumeCommonEvents(range.src, range.dest);
      }
      break;
    }
  };

  //
  // functions for process parameters
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

  var getEventIdFromParam = function (idNotation) {
    var reg;
    if (reg = (/^(V?)([0-9]+)/i).exec(idNotation)) {
      return reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
    } else {
      return getEventIdWhoseNameIs(idNotation);
    }
  };

  var getCommonEventIdWhoseNameIs = function (name) {
    var commonEvent;
    for (var i = 0; i < $dataCommonEvents.length; i++) {
      commonEvent = $dataCommonEvents[i];
      if (commonEvent && commonEvent.name === name) {
        return i;
      }
    }
    return 0;
  };

  var getCommonEventIdFromParam = function (idNotation) {
    var reg;
    if (reg = (/^(V?)([0-9]+)/i).exec(idNotation)) {
      return reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
    } else {
      return getCommonEventIdWhoseNameIs(idNotation);
    }
  };

  var isParamNotation = function (param) {
    return (/^((gte?)|(lte?)|(>=?)|(<=?))$/i).test(param);
  };

  var getIdRangeFromNotation = function (notation, objId, maxId) {
    var srcId, destId;
    srcId = destId = objId;
    switch(notation) {
    case 'gt':
    case '>':
      srcId++;
      destId = maxId;
      break;
    case 'gte':
    case '>=':
      destId = maxId;
      break;
    case 'lt':
    case '<':
      destId--;
      srcId = 1;
      break;
    case 'lte':
    case '<=':
      srcId = 1;
      break;
    }
    return {src:srcId, dest:destId};
  };

  var getEventIdRangeFromNotation = function (notation, objId) {
    return getIdRangeFromNotation(notation, getEventIdFromParam(objId),
     $dataMap.events.length - 1);
  };

  var getCommonEventIdRangeFromNotation = function (notation, objId) {
    return getIdRangeFromNotation(notation, getCommonEventIdFromParam(objId),
     $dataCommonEvents.length - 1);
  };

  var getEventIdRangeFromParam = function (p1, p2) {
    if (p1 === 'all') {
      return {src:1, dest:$dataMap.events.length - 1};
    } else if (p2 == null) { // null or undefined
      var value = getEventIdFromParam(p1);
      return {src:value, dest:value};
    } else if (isParamNotation(p1)) {
      return getEventIdRangeFromNotation(p1, p2);
    } else {
      var value1 = getEventIdFromParam(p1);
      var value2 = getEventIdFromParam(p2);
      return {src:value1, dest:value2};
    }
  };

  var getCommonEventIdRangeFromParam = function (p1, p2) {
    if (p1 === 'all') {
      return {src:1, dest:$dataCommonEvents.length - 1};
    } else if (p2 == null) { // null or undefined
      var value = getCommonEventIdFromParam(p1);
      return {src:value, dest:value};
    } else if (isParamNotation(p1)) {
      return getCommonEventIdRangeFromNotation(p1, p2);
    } else {
      var value1 = getCommonEventIdFromParam(p1);
      var value2 = getCommonEventIdFromParam(p2);
      return {src:value1, dest:value2};
    }
  };

  //
  // suspend flags and accessors
  //
  var _Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId);
    this._suspendedCommonEvents = null;
    this._suspendedEvents = null;
  };

  var eventSuspended = function(eventId) {
    return $gameMap._suspendedEvents && $gameMap._suspendedEvents[eventId];
  };

  var suspendEvents = function(srcEventId , destEventId) {
    destEventId = destEventId || srcEventId;
    if (!$gameMap._suspendedEvents) {
      $gameMap._suspendedEvents = new Array($dataMap.events.length);
    }
    for (var i = srcEventId; i <= destEventId; i++) {
      $gameMap._suspendedEvents[i] = true;
    }
  };

  var resumeEvents = function(srcEventId , destEventId) {
    destEventId = destEventId || srcEventId;
    if (!$gameMap._suspendedEvents) {
      return;
    }
    for (var i = srcEventId; i <= destEventId; i++) {
      $gameMap._suspendedEvents[i] = false;
    }
  };

  var resumeAllEvents = function() {
    $gameMap._suspendedEvents = null;
  };

  var commonEventSuspended = function(commonId) {
    return $gameMap._suspendedCommonEvents &&
     $gameMap._suspendedCommonEvents[commonId];
  };

  var suspendCommonEvents = function(srcCommonId , destCommonId) {
    destCommonId = destCommonId || srcCommonId;
    if (!$gameMap._suspendedCommonEvents) {
      $gameMap._suspendedCommonEvents = new Array($dataCommonEvents.length);
    }
    for (var i = srcCommonId; i <= destCommonId; i++) {
      $gameMap._suspendedCommonEvents[i] = true;
    }
  };

  var resumeCommonEvents = function(srcCommonId , destCommonId) {
    destCommonId = destCommonId || srcCommonId;
    if (!$gameMap._suspendedCommonEvents) {
      return;
    }
    for (var i = srcCommonId; i <= destCommonId; i++) {
      $gameMap._suspendedCommonEvents[i] = false;
    }
  };

  var resumeAllCommonEvents = function() {
    $gameMap._suspendedCommonEvents = null;
  };

  //
  // suspending routines
  //
  var _Game_Event_updateParallel = Game_Event.prototype.updateParallel;
  Game_Event.prototype.updateParallel = function() {
    if (!eventSuspended(this._eventId)) {
      _Game_Event_updateParallel.call(this);
    }
  };

  var _Game_CommonEvent_update = Game_CommonEvent.prototype.update;
  Game_CommonEvent.prototype.update = function() {
    if (!commonEventSuspended(this._commonEventId)) {
      _Game_CommonEvent_update.call(this);
    }
  };

  var _Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
  Game_Event.prototype.updateSelfMovement = function() {
    if (eventSuspended(this._eventId)) {
      this.resetStopCount();
      return;
    }
    _Game_Event_updateSelfMovement.call(this);
  };

  var _Game_Event_updateRoutineMove = Game_Event.prototype.updateRoutineMove;
  Game_Event.prototype.updateRoutineMove = function() {
    if (eventSuspended(this._eventId)) {
      this.resetStopCount();
      return;
    }
    _Game_Event_updateRoutineMove.call(this);
  };

})();
