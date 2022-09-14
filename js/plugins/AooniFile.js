//=============================================================================
// AooniFile.js
//=============================================================================

/*:
 * @plugindesc Aooni save file manipulate routine
 * @author Sasuke KANNAZUKI
 *
 * @param Escape Succession VarID
 * @desc the variable ID that saves current escape sucsession number.
 * @default 78
 *
 * @param Max Escape Succession VarID
 * @desc the variable ID that saves longest escape sucsession number.
 * @default 79
 *
 * @param Gameover Number VarID
 * @desc the variable ID that saves gameover number.
 * @default 80
 *
 * @help
 * plugin commands:
 * AooniFile escape      call when player escape successfully from Aooni.
 * AooniFile gameover    call when player is caught by Aooni(=gameover).
 *
 * summary:
 * At Aooni gameplay, it counts the number of gameover.
 * To implement the feature, save data will be automatically overwritten
 * when it's gameover.
 *
 * This plugin provides several manipulate routines to save data.
 */
/*:ja
 * @plugindesc 青鬼MVセーブデータ操作ルーチン
 * @author 神無月サスケ
 *
 * @param Escape Succession VarID
 * @desc 現在の連続逃亡成功回数をあらわす変数IDです
 * @default 78
 *
 * @param Max Escape Succession VarID
 * @desc これまでの最長連続成功回数をあらわす変数IDです
 * @default 79
 *
 * @param Gameover Number VarID
 * @desc ゲームオーバーの回数をあらわす変数IDです
 * @default 80
 *
 *
 * @help 
 * プラグインコマンド：
 * AooniFile escape       逃亡成功時に呼び出してください
 * AooniFile gameover     逃亡失敗（ゲームオーバー）時に呼び出してください
 *
 * 概要：
 * 青鬼でゲームオーバーの際などにセーブデータを上書きします。
 * これは、「何回ゲームオーバーにならずに逃げるのに成功したか」といったデータを
 * 取得する上で必須となります。
 *
 * このプラグインでは、これらの情報取得に必要なセーブデータの操作ルーチンを
 * 提供します。
 *
 * 仕様：
 * ゲームオーバーになった際、セーブしたデータをプラグインコマンドにより
 * 強制的に上書きします。
 * ゲームオーバー回数を増やし、連続逃走成功回数をゼロにします。
 * 最後にロードまたはセーブしたデータが上書きの対象になります。
 *
 */

(function() {

  // process parameters
  var parameters = PluginManager.parameters('AooniFile');
  var escapeSuccVarID = Number(parameters['Escape Succession VarID'] || 78);
  var maxEscapeSuccVarID = Number(parameters['Max Escape Succession VarID'] ||
   79);
  var gameoverNumVarID =  Number(parameters['Gameover Number VarID'] || 80);

  // scope variables
  var $anotherFileRW = false;
  var $testSystem = null;
  var $testScreen = null;
  var $testTimer = null;
  var $testSwitches = null;
  var $testSelfSwitches = null;
  var $testActors = null;
  var $testParty = null;
  var $testMap = null;
  var $testPlayer = null;
  DataManager.loadedSavedataID = null;

  // --------------------------------------
  // process plugin command
  // --------------------------------------
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'AooniFile') {
      switch(args[0]) {
      case 'escape':
        DataManager.onEscapeSuccess();
        break;
      case 'gameover':
        DataManager.onGameover();
        break;
      }
    }
  };

  // --------------------------------------
  // add new attribute "aooniPlayID", for each play, make different number.
  // --------------------------------------

  var _DataManager_setupNewGame = DataManager.setupNewGame;
  DataManager.setupNewGame = function() {
    _DataManager_setupNewGame.call(this);
    $gameSystem.makeUniquePlayID();
  };

  Game_System.prototype.makeUniquePlayID = function() {
    this.aooniPlayID = Date.now();
    $gameVariables.setValue(escapeSuccVarID, 0);
    $gameVariables.setValue(maxEscapeSuccVarID, 0);
    $gameVariables.setValue(gameoverNumVarID, 0);
  };

  //
  // for compatibility to older version save data
  //
  DataManager.hasUniquePlayID = function() {
    return !!$gameSystem.aooniPlayID;
  };

  var _DataManager_loadGame = DataManager.loadGame;
  DataManager.loadGame = function(savefileId) {
    var success = _DataManager_loadGame.call(this, savefileId);
    if (success && !this.hasUniquePlayID()) {
      $gameSystem.makeUniquePlayID();
      this.saveGame(savefileId);
    }
    if(success) {
      DataManager.loadedSavedataID = savefileId;
    }
    return success;
  };

  // --------------------------------------
  // Escape Success Routine
  // --------------------------------------
  // note: this function is called by event command 'Script'.
  DataManager.onEscapeSuccess = function() {
    var escTimes = $gameVariables.value(escapeSuccVarID);
    $gameVariables.setValue(escapeSuccVarID, ++escTimes);
    var maxEscTimes = $gameVariables.value(maxEscapeSuccVarID);
    if (escTimes > maxEscTimes) {
      $gameVariables.setValue(maxEscapeSuccVarID, escTimes);
    }
  };

  // --------------------------------------
  // Escape Failure (Gameover) Routine
  // --------------------------------------
  // note: this function is called by event command 'Script'.
  DataManager.onGameover = function() {
    var savefileId = DataManager._lastAccessedId;
    var loadedfileID = DataManager.loadedSavedataID;
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo && globalInfo[savefileId]) {
      if(globalInfo[savefileId].aooniPlayID === $gameSystem.aooniPlayID) {
        this.forceOverWriteGameOver(savefileId);
      }
      //if(loadedfileID && savefileId != loadedfileID) {
      //  this.forceOverWriteGameOver(loadedfileID);
      //}
    }
  };

  // --------------------------------------
  // Force overwrite save data routine (at game over)
  // --------------------------------------

  DataManager.forceOverWriteGameOver = function(savefileId) {
    $anotherFileRW = true;
    if(this.loadGame(savefileId)) {
      $testVariables.setValue(escapeSuccVarID, 0);
      $testVariables.setValue(gameoverNumVarID,
       $testVariables.value(gameoverNumVarID) + 1);
      this.saveGame(savefileId);
      this.cleanAnotherData();
    }
    $anotherFileRW = false;
  };

  var _DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function() {
    if($anotherFileRW) {
      $testSystem        = new Game_System();
      $testScreen        = new Game_Screen();
      $testTimer         = new Game_Timer();
      $testSwitches      = new Game_Switches();
      $testVariables     = new Game_Variables();
      $testSelfSwitches  = new Game_SelfSwitches();
      $testActors        = new Game_Actors();
      $testParty         = new Game_Party();
      $testMap           = new Game_Map();
      $testPlayer        = new Game_Player();
    } else {
      _DataManager_createGameObjects.call(this);
    }
  };

  var _DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function() {
    if ($anotherFileRW) {
      var contents = {};
      contents.system       = $testSystem;
      contents.screen       = $testScreen;
      contents.timer        = $testTimer;
      contents.switches     = $testSwitches;
      contents.variables    = $testVariables;
      contents.selfSwitches = $testSelfSwitches;
      contents.actors       = $testActors;
      contents.party        = $testParty;
      contents.map          = $testMap;
      contents.player       = $testPlayer;
      return contents;
    } else {
      return _DataManager_makeSaveContents.call(this);
    }
  };

  var _DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    if ($anotherFileRW) {
      $testSystem        = contents.system;
      $testScreen        = contents.screen;
      $testTimer         = contents.timer;
      $testSwitches      = contents.switches;
      $testVariables     = contents.variables;
      $testSelfSwitches  = contents.selfSwitches;
      $testActors        = contents.actors;
      $testParty         = contents.party;
      $testMap           = contents.map;
      $testPlayer        = contents.player;
    } else {
      _DataManager_extractSaveContents.call(this, contents);
    }
  };

  DataManager.cleanAnotherData = function() {
    $testSystem        = null;
    $testScreen        = null;
    $testTimer         = null;
    $testSwitches      = null;
    $testVariables     = null;
    $testSelfSwitches  = null;
    $testActors        = null;
    $testParty         = null;
    $testMap           = null;
    $testPlayer        = null;
  };

  // --------------------------------------
  // add new attribute 'aooniPlayID' to save header
  // --------------------------------------

  var _DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
  DataManager.makeSavefileInfo = function() {
    var info = {};
    if ($anotherFileRW) {
      info.globalId   = this._globalId;
      info.title      = $dataSystem.gameTitle;
      info.characters = $testParty.charactersForSavefile();
      info.faces      = $testParty.facesForSavefile();
      info.playtime   = $testSystem.playtimeText();
      info.timestamp  = Date.now();
    } else {
      info = _DataManager_makeSavefileInfo.call(this);
    }
    info.aooniPlayID = $gameSystem.aooniPlayID;
    return info;
  };

  var _Game_System_playtime = Game_System.prototype.playtime;
  Game_System.prototype.playtime = function() {
    if($anotherFileRW) {
      return Math.floor(this._framesOnSave / 60);
    } else {
      return _Game_System_playtime.call(this);
    }
  };

})();
