//=============================================================================
// SelectDispFollowers.js
//=============================================================================
/*:
 * @plugindesc select display actors at map follower.
 * @author Sasuke KANNAZUKI
 *
 * @param Switch ID
 * @desc this plugin works either when the value is true or the ID is 0.
 * @default 0
 *
 * @help This plugin does not provide plugin commands.
 * 
 * Actor Note:
 *   <displayFollow>  // display actors as follower only with this notation
 *     top actor(= player) displays always.
 */
/*:ja
 * @plugindesc 隊列歩行で表示するアクターを限定します
 * @author 神無月サスケ
 *
 * @param Switch ID
 * @desc スイッチの値がONの時機能します。IDが0の場合、常に機能します。
 * @default 0
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * 
 * アクターのメモ:
 *   <displayFollow>  // この記述があるアクターのみ隊列歩行で表示します。
 *     // 先頭のアクターは記述にかかわらず、必ず表示します。
 */

(function() {
  //
  // process parameters
  //
  var parameters = PluginManager.parameters('SelectDispFollowers');
  var switchID = Number(parameters['Switch ID'] || 0);

  var displayOnlyImportantFollowers = function() {
    return !switchID || $gameSwitches.value(switchID);
  };

  //
  // when switch condition changes, refresh followers.
  //
  var _Game_Followers_initialize = Game_Followers.prototype.initialize;
  Game_Followers.prototype.initialize = function() {
    _Game_Followers_initialize.call(this);
    this._selectFollower = displayOnlyImportantFollowers();
  };

  var _Game_Followers_update = Game_Followers.prototype.update;
  Game_Followers.prototype.update = function() {
    if (this._selectFollower !== displayOnlyImportantFollowers()) {
      this.refresh();
      this._selectFollower = displayOnlyImportantFollowers();
    }
    _Game_Followers_update.call(this);
  };

  //
  // choose display follower
  //
  var _Game_Follower_actor = Game_Follower.prototype.actor;
  Game_Follower.prototype.actor = function() {
    if (displayOnlyImportantFollowers()) {
      var memberIndex = 0;
      var members = $gameParty.members();
      for (var i = 1; i < members.length; i++) {
        if (members[i].actor().meta.displayFollow) {
          if (++memberIndex === this._memberIndex) {
            return members[i];
          }
        }
      }
      return null;
    } else {
      return _Game_Follower_actor.call(this);
    }
  };

})();
