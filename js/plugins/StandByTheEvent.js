//=============================================================================
// StandByTheEvent.js (ver1.1)
//=============================================================================

/*:
 * @plugindesc Locate(=stand) an event considered to another event.
 * @author Sasuke KANNAZUKI
 *
 * @help
 * To set, either plugin command or scrpit at move route is available.
 * **Plugin Commands:
 * StandTo <EventA> <EventT> <Distance>
 * : Set <EventA> to put <Distance> forward from <EventT>.
 *   if <Distance> is negative value, behind from  <EventT>.
 * - <EventA>,<EventT> : EventID number, V10 where variable id 10's number,
 *  or event name.
 *  When p or player, it is player. when t or this, it is this event
 * - <Distance> : number or V10 where variable id 10's number.
 * Ex.
 * StandTo Kayako p -2 // The event named Kayako stands behind 2 step of player
 * StandTo V10 V5 V2   // The event whose ID is V10 stands behind event 
 *                        whose ID is V5 with V2 steps.
 *
 * StandRev <EventA> <EventT> <Distance>
 * : Almost the same as StandTo but EventA's direction is opposite.
 *
 * StandBy <EventA> <EventT> [<deltaX> <deltaY> <Direction>]
 * : Position EventA (<deltaX>, <deltaY>) from <EventT> with <Direction>.
 * - <deltaX>, <deltaY>, <Direction> are omissible, default value is 0.
 * - <Direction> is defined as follows:
 *   2,4,6,8 or d,l,r,u : down, left, right, up.
 *   10 or to : set direction TOward <EventT>.
 *   11 or op : set direction OPposit to <EventT>.
 *   12 or fw : set direction ForWard (=the same direction) of <EventT>.
 *   13 or bw : set direction BackWard (=the opposit direction) of <EventT>.
 *
 * Stand <EventA> <EventT> [<DeltaX> <DeltaY> <Direction> <Interlock>]
 * : This is "full mode".
 * - Set <EventA> from (<DeltaX>, <DeltaY>) of <EventT> with <Direction>.
 *   when <Interlock> is 0, the same as StandBy.
 *   when <Interlock> is 1, (<DeltaX>, <DeltaY>) is rotated considering the
 *   direction of <EventT>.
 *
 * ***Plugin Commands added Ver1.1
 * SetStandBy <EventA> <reviseX> <reviseY> [<regionID>]
 * - When <EventA>'s destination is not passable, revise the position.
 * - This setting is need to do by each event before running StandBy.
 * - <reviseX> <reviseY>: revise method notation.
 *   near  : find passable tile toward <EventT>.
 *   away  : find passable tile away from <EventT>
 *   reach : find the most nearest from <EventA>tile which can reach <EventT>
 *   default (reset, or omitted) : do not revise
 * Ex:
 * unpassable tile is ■, and event A and T is following,the position will be
 * follows:
 * 　　　■　　aw■■Ａ■nr　■　■rc　　　　　Ｔ
 * - when <regionID> is set, avoid the region ID instead of unpassable tiles.
 * - prefix V,(ex.V15 ,V20) the variable's value's region ID.
 * - postfix + (ex.15+ V20+) avoid not only region tile but also unpassable
 *   tiles.
 *
 * **Script at Move Route:
 * this.standTo(eventA, eventT, distance);
 * this.standRev(eventA, eventT, distance);
 * this.standBy(eventA, eventT, x, y, dir);
 * this.stand(eventA, eventT, x, y, dir, interlock);
 * Every parameters are either string or number. Both are acceptable.
 */
/*:ja
 * @plugindesc イベントの位置や向きを、他のイベントを考慮して決定します。
 * @author 神無月サスケ
 *
 * @help
 * プラグインコマンドか、「移動ルートの設定」の「スクリプト」で設定します。
 * ■プラグインコマンド
 * StandTo <EventA> <EventT> <Distance>
 * : <EventA> を <EventT> の前方 <Distance> の距離に <EventT> の方を向いて
 *    立たせます。距離が負の値の場合、後方に立ちます。
 * - <EventA>,<EventT> : イベントIDの数値、または V10 のようにVを付けた変数ID、
 *  またはイベント名で指定します。
 *  p または player という文字列にすると、プレイヤーが対象になります。
 *  t または this にすると、このイベントが対象になります。
 * - <Distance> : 距離を数値で入れるか、V20のように、20番の変数の値、といった
 *  指定や、変数名での指定も可能です。
 * 例：
 * StandTo 伽椰子 p 2  // 伽椰子という名前のイベントがプレイヤーの２歩後ろに
 *                     // 立ちます。
 * StandTo V10 V5 V2   // 変数10番のIDのイベントが、変数5番のイベントの、
 *                     // 変数2番の値の歩数だけ後ろに立ちます。
 *
 * StandRev <EventA> <EventT> <Distance>
 * : StandTo とほぼ同様で、<EventA>が逆の方向を向きます。
 *
 * StandBy <EventA> <EventT> [<deltaX> <deltaY> <Direction>]
 * : <EventA> を <EventT> から (<deltaX>, <deltaY>) の距離に置き、
 *   <Direction> の方向を向かせます。
 * - <deltaX>, <deltaY>, <Direction> を省略した時は 0 となります。
 * - <Direction> は以下のような値が設定可能です:
 *   2,4,6,8 または d,l,r,u : 順に下、左、右、上。
 *   10 or to : <EventT> の方を向きます(TOward)。
 *   11 or op : <EventT> の逆の方を向きます。(OPposit)。
 *   12 or fw : <EventT> の向きと同じ方向を向きます(ForWard)。
 *   13 or bw : <EventT> の向きと逆を向きます(BackWard).
 *
 * Stand <EventA> <EventT> [<DeltaX> <DeltaY> <Direction> <Interlock>]
 * : フルモードです。
 * : <EventA> を <EventT> から (<deltaX>, <deltaY>) の距離に置き、
 *   <Direction> の方向を向かせます。
 *   ここで、<Interlock> が 0 の時は、StandBy と一緒です。
 *   <Interlock> が 1 の時は、(<DeltaX>, <DeltaY>) は、<EventT> の向きによって
 *   回転されます。
 * 例：
 * Stand 貞子 p V1 V2 to 1 // 貞子という名のイベントが、プレイヤーから
 * // (変数1の値, 変数2の値)の距離にプレイヤーの向きを考慮した座標に立ちます。
 *
 * ■プラグインコマンド：追加 Ver1.1
 * SetStandBy <EventA> <reviseX> <reviseY> [<regionID>]
 * - StandByなどのイベントで設定した場所が移動不能の場所だった場合、
 *  移動可能な場所への場所変更(補正)を行うコマンドです。
 * - 設定はイベント毎に、コマンド実行前に行う必要があります。
 * - <reviseX> <reviseY>: X, Y 座標のそれぞれの補正方法です。
 *   near  : <EventT>に近い方へ通行可能なマスを見つけます。
 *   away  : <EventT>から遠い方へ通行可能なマスを見つけます。
 *   reach : <EventT>に到達可能なマスのうち一番<EventA>に近いマスを見つけます。
 *   default (reset などでも可。省略時も適用) : 特に補正を行わない
 * 例：
 * なお、移動不能マス■にイベントＡが来たときの位置イメージは以下の通り
 * 　　　■　　aw■■Ａ■nr　■　■rc　　　　　Ｔ
 * - <regionID> は、回避するマスをリージョンIDにします。
 * - 頭にVを付けると変数のIDの値になります。
 * - 最後に+を付けると、リージョンIDと通行不可能なマス両方を避けます。
 * 例：
 * 15 リージョンID15番を避ける。通行不可能なマスはOK。
 * 15+ リージョンID15番と通行不可能なマスを避ける。
 *
 * ■移動ルートの「スクリプト」からの呼び出し：
 * this.standTo(eventA, eventT, distance);
 * this.standRev(eventA, eventT, distance);
 * this.standBy(eventA, eventT [, x, y, dir]);
 * this.stand(eventA, eventT [, x, y, dir, interlock]);
 * それぞれのパラメータは対応するプラグインコマンドと同じですが、
 * 数字も文字列で指定可能です（内部では数値も文字列に変換して処理を行います）。
 */

(function() {
  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    var event = this._eventId ? $gameMap.event(this._eventId) : $gamePlayer;
    if (command === 'StandTo') {
      event.standTo(args[0], args[1], args[2]);
    } else if (command === 'StandRev') {
      event.standRev(args[0], args[1], args[2]);
    } else if (command === 'StandBy') {
      event.standBy(args[0], args[1], args[2], args[3], args[4]);
    } else if (command === 'Stand') {
      event.stand(args[0], args[1], args[2], args[3], args[4], args[5]);
    } else if (command === 'SetStandBy') {
      event.setStandBy(args[0], args[1], args[2], args[3]);
    }
  };

  //
  // routine for process parameters
  //
  var getEventWhoseNameIs = function (name) {
    var arr = $gameMap.events().filter(function (event) {
      return event.event().name === name;
    });
    return arr[0];
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

  var getDistanceFromParam = function (param) {
    param = String(param || '0');
    var result;
    if (result = (/^(\-?[0-9]+)$/).exec(param)) {
      return Number(result[1]);
    } else if (result = (/^V([0-9]+)$/i).exec(param)) {
      return $gameVariables.value(Number(result[1]));
    } else {
      var id = getVariableIdWhoseNameIs(param);
      return $gameVariables.value(id);
    }
  };

  var setDirection = function(evSbj, evOrg, dirParam) {
    dirParam = String(dirParam || '0');
    switch(dirParam) {
    case '2':
    case 'd':
      evSbj.setDirection(2);
      break;
    case '4':
    case 'l':
      evSbj.setDirection(4);
      break;
    case '6':
    case 'r':
      evSbj.setDirection(6);
      break;
    case '8':
    case 'u':
      evSbj.setDirection(8);
      break;
    case '10':
    case 'to':
      evSbj.turnTowardCharacter(evOrg);
      break;
    case '11':
    case 'op':
      evSbj.turnAwayFromCharacter(evOrg);
      break;
    case '12':
    case 'fw':
      evSbj.setDirection(evOrg.direction());
      break;
    case '13':
    case 'bw':
      evSbj.setDirection(10 - evOrg.direction());
      break;
    }
  };

   var rotatedX = function (dir, dx, dy) {
    switch (dir) {
    case 2:
      return dx;
    case 4:
      return -dy;
    case 6:
      return dy;
    case 8:
      return -dx;
    }
    return 0;
  };

   var rotatedY = function (dir, dx, dy) {
    switch (dir) {
    case 2:
      return dy;
    case 4:
      return dx;
    case 6:
      return -dx;
    case 8:
      return -dy;
    }
    return 0;
  };

  //
  // routine to judge whether it can put the event there
  //
  var isDispassableTilesOfAooni = function(tileId) {
    // black space at outside of the wall. 
    // at default, those tiles are passable.
    return tileId >= 3200 && tileId <= 3247;
  };

  var checkPassageForAnyDirection = function(x, y) {
    var flags = $gameMap.tilesetFlags();
    var tiles = $gameMap.allTiles(x, y);
   var passableFlag = 0;
    for (var i = 0; i < tiles.length; i++) {
      var flag = flags[tiles[i]];
      if (isDispassableTilesOfAooni(tiles[i])) {
        return false;
      }
      if ((flag & 0x10) !== 0) {  // [*] No effect on passage
        continue;
      }
      passableFlag |= (flag & 0x0f);
    }
    return passableFlag !== 0x0f;
  };

  var canSetEvent = function(x, y, info) {
    if (info.regionId && $gameMap.regionId(x, y) === info.regionId) {
      return false;
    }
    return info.regionOnly || checkPassageForAnyDirection(x, y);
  };

  //
  // routine to judge the position is appropriate to put event
  //
  var isNearTheScreen = function(x, y) {
    var gw = Graphics.width;
    var gh = Graphics.height;
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    var px = $gameMap.adjustX(x) * tw + tw / 2 - gw / 2;
    var py = $gameMap.adjustY(y) * th + th / 2 - gh / 2;
    return px >= -gw && px <= gw && py >= -gh && py <= gh;
  };

  var mapPositionIsValid = function(x, y) {
    return $gameMap.isValid($gameMap.roundX(x), $gameMap.roundY(y));
  };

  var isTooFarFromTargetEvent = function(x, y) {
    return !isNearTheScreen(x, y) || !mapPositionIsValid(x, y);
  };

  //
  // routine to avoid unmovable position
  //
  var reviseDeltaX2 = function (evSbj, evOrg, deltaX2, deltaY2) {
    var info = evSbj.standByInfo;
    if (!info) {
      return deltaX2;
    }
    var x, y;
    switch (info.reviseXway) {
    case 'away':
      var sgn = deltaX2 >= 0 ? 1 : -1;
      for (var i = deltaX2 * sgn; true; i++){
        x = evOrg.x + i * sgn;
        y = evOrg.y + deltaY2;
        if (isTooFarFromTargetEvent(x, y)) {
          return i * sgn;
        }
        if (canSetEvent(x, y, info)) {
          return i * sgn;
        }
      }
      break;
    case 'near':
      var sgn = deltaX2 > 0 ? 1 : -1;
      for (var i = deltaX2 * sgn; i > 0; i--){
        x = evOrg.x + i * sgn;
        y = evOrg.y + deltaY2;
        console.log(x, y, canSetEvent(x, y, info));
        if (canSetEvent(x, y, info)) {
          return i * sgn;
        }
      }
      return 0;
    case 'reach':
      var sgn = deltaX2 >= 0 ? 1 : -1;
      for (var i = 1; i <= deltaX2 * sgn; i++) {
        x = evOrg.x + i * sgn;
        y = evOrg.y + deltaY2;
        if (!canSetEvent(x, y, info)) {
          return (i - 1) * sgn;
        }
      }
      return deltaX2;
    default:
      return deltaX2;
    }
  };

  var reviseDeltaY2 = function (evSbj, evOrg, deltaX2, deltaY2) {
    var info = evSbj.standByInfo;
    if (!info) {
      return deltaY2;
    }
    var x, y;
    switch (info.reviseYway) {
    case 'away':
      var sgn = deltaY2 >= 0 ? 1 : -1;
      for (var i = deltaY2 * sgn; true; i++){
        x = evOrg.x + deltaX2;
        y = evOrg.y + i * sgn;
        if (isTooFarFromTargetEvent(x, y)) {
          return i * sgn;
        }
        if (canSetEvent(x, y, info)) {
          return i * sgn;
        }
      }
      break;
    case 'near':
      var sgn = deltaY2 > 0 ? 1 : -1;
      for (var i = deltaY2 * sgn; i > 0; i--){
        x = evOrg.x + deltaX2;
        y = evOrg.y + i * sgn;
        if (canSetEvent(x, y, info)) {
          return i * sgn;
        }
      }
      return 0;
    case 'reach':
      var sgn = deltaY2 >= 0 ? 1 : -1;
      for (var i = 1; i <= deltaY2 * sgn; i++) {
        x = evOrg.x + deltaX2;
        y = evOrg.y + i * sgn;
        if (!canSetEvent(x, y, info)) {
          return (i - 1) * sgn;
        }
      }
      return deltaY2;
    default:
      return deltaY2;
    }
  };

  //
  // main functions
  //
  // note: any parameters may be string or undefined that is called from
  // plugin command.
  Game_Character.prototype.stand = function (evA, evT, x, y, dir, interlock) {
    var thisId = (this instanceof Game_Event) ? this.eventId() : -1;
    var evOrg = getEventFromParam(evT, thisId);
    var evSbj = getEventFromParam(evA, thisId);
    if (!evOrg || !evSbj) {
      return;
    }
    var deltaX, deltaY;
    var deltaX2 = deltaX = getDistanceFromParam(x);
    var deltaY2 = deltaY = getDistanceFromParam(y);
    if (!!Number(interlock)) {
      deltaX2 = rotatedX(evOrg.direction(), deltaX, deltaY);
      deltaY2 = rotatedY(evOrg.direction(), deltaX, deltaY);
    }
    deltaX2 = reviseDeltaX2(evSbj, evOrg, deltaX2, deltaY2);
    deltaY2 = reviseDeltaY2(evSbj, evOrg, deltaX2, deltaY2);
    evSbj.locate($gameMap.roundX(evOrg.x + deltaX2),
     $gameMap.roundY(evOrg.y + deltaY2));
    setDirection(evSbj, evOrg, dir);
  };

  Game_Character.prototype.standTo = function(evA, evT, distance) {
    this.stand(evA, evT, 0, distance, 'to', 1);
  };

  Game_Character.prototype.standRev = function(evA, evT, distance) {
    this.stand(evA, evT, 0, distance, 'op', 1);
  };

  Game_Character.prototype.standBy = function(evA, evT, x, y, dir) {
    this.stand(evA, evT, x, y, dir, 0);
  };

  //
  // setting function
  //
  var setRegionIdFromParam = function (param, info) {
    param = String(param || '');
    var reg;
    if (reg = (/^(V?)([0-9]+)(\+?)$/i).exec(param)) {
      info.regionId = reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
      info.regionOnly = !reg[3];
    }
  };

  Game_Character.prototype.setStandBy = function(evA, revX, revY, regionId) {
    var thisId = (this instanceof Game_Event) ? this.eventId() : -1;
    var evSbj = getEventFromParam(evA, thisId);
    var info = evSbj.standByInfo = {};
    setRegionIdFromParam(regionId, info);
    info.reviseXway = revX;
    info.reviseYway = revY;
  };

})();
