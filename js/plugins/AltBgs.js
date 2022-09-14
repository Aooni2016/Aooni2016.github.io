//=============================================================================
// AltBgs.js
//=============================================================================

/*:
 * @plugindesc provides multiple bgs playing function independent from default.
 * @author Sasuke KANNAZUKI
 *
 * @help
 * This plugin enables multiple BGSs at one time.
 * The function is independent from default bgs module.
 *
 * Plugin Commands:
 * the parameters in brackets are omissible.
 * default value: <bgsID>=0 <volume>=90 <pitch>=100 <pan>=0
 *
 * AltBgs play <filename> [<bgsID> <volume> <pitch> <pan>]
 *  where <bgsID> is integer value 0 or positive.
 * ex.
 * AltBgs play Wind1 1 90 100 0
 * AltBgs play Wind1 2
 *
 * AltBgs stop [<bgsID>]
 * AltBgs stop all        // stop all alternative BGSes
 *
 * AltBgs fadeIn <filename> [<bgsId> <seconds> <volume> <pitch> <pan>]
 *  where <seconds> is the duration to fade in. default value is 4.
 *
 * AltBgs fadeOut [<bgsID> <seconds>]
 *  where <seconds> is the duration to fade out. default value is 10.
 * AltBgs fadeOut all [<seconds>]   // stop all alternatlve BGSes
 *
 * AltBgs save [<bgsID>]
 *
 * AltBgs replay [<bgsID>]
 *
 * AltBgs replayWithFadeIn [<bgsID> <seconds>]
 *  where <seconds> is the duration to fade in. default value is 4.
 *
 * AltBgs vol [<bgsID> <volNotation> <seconds>]
 * AltBgs vol all [<volNotation> <seconds>]
 *  change volume with fade in specified seconds.
 *  where <seconds> is the duration to fade. default value is 0.
 *  <volNotation> is available following notations:
 *   50, V16, 80%, 80p, V20%, V20p
 *   prefix V means variable number.
 *   postfix % or p is the percentage from current volume.
 *   default value is 100.
 *
 * Note: This plugin is not supported encrypted files.
 *
 * Copyright:
 * This plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */
/*:ja
 * @plugindesc システムと独立した複数のBGSを演奏可能にします
 * @author 神無月サスケ
 *
 * @help
 * このプラグインは複数のBGSを同時に再生可能にします。
 * これらのBGSの演奏は、システムのものとは独立しています。
 *
 * プラグインコマンド:
 * - 以下、[]で囲んだパラメータは省略可能です。
 *   省略時は以下のデフォルト値になります。
 *   <bgsID>=0 <音量>=90 <ピッチ>=100 <位相>=0
 * - ファイル名は拡張子をつけない形で指定します。
 * - <秒数>はコマンド毎にデフォルト値が異なりますが、0にはできません。
 *   0を指定した場合は、デフォルト値になります。
 *
 * AltBgs play <ファイル名> [<bgsID> <音量> <ピッチ> <位相>]
 * BGSを演奏します。
 * なお、<bgsID> は 0 以上の整数にしてください。
 * 例：
 * AltBgs play Wind1 1 90 100 0
 * AltBgs play Wind1 2
 *
 * AltBgs stop [<bgsID>]
 * BGSを停止します。
 * 
 * AltBgs stop all
 * 全てのBGSを停止します。システムのBGSは停止しません。
 *
 * AltBgs fadeIn <ファイル名> [<bgsId> <秒数> <音量> <ピッチ> <位相>]
 * BGSをフェードイン再生します。
 * ここで <秒数> を省略した時は 4秒になります。
 *
 * AltBgs fadeOut [<bgsId> <秒数>]
 * BGSをフェードアウトします。
 * ここで <秒数> を省略した時は 10秒になります。
 *
 * AltBgs fadeOut all [<seconds>]
 * 全てのBGSをフェードアウトします。システムのBGSはそのままです。
 * ここで <秒数> を省略した時は 10秒になります。
 *
 * AltBgs save [<bgsID>]
 * 現在のBGSを演奏箇所も含めて記憶します。
 *
 * AltBgs replay [<bgsID>]
 * BGSを記憶した箇所から再開します。
 *
 * AltBgs replayWithFadeIn [<bgsID> <秒数>]
 * BGSを記憶した箇所からフェードインしながら再開します。
 * ここで <秒数> を省略した時は 4秒になります。
 *
 * AltBgs vol [<bgsID> <音量記法> <秒数>]
 * AltBgs vol all [<音量記法> <秒数>]
 *  BGSの音量を<音量記法>で指定した音量に<秒数>でフェードします。
 *  <秒数>の省略時は0になり、即座に指定した音量になります。
 *  <音量記法> は、以下のような記述が可能です：
 *   50, V16, 80%, 80p, V20%, V20p
 *   頭にVを付けると、指定したIDの変数の値になります。
 *   最後に%かpを付けると、現在の音量を基準としたパーセントになります。
 *   省略時は100になります。
 *
 * 注意:
 * このプラグインは暗号化ファイルには対応していません。
 *
 * 著作権表示：
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function() {

  //
  // initialize variables
  //
  AudioManager._currentAltBgs = [];
  AudioManager._bgsAltBuffers = [];
  AudioManager._savedAltBgs = [];
  var $notResetAltBgs = false;

  var bgsFromParam = function(filename, args, index) {
    return {
      name: filename,
      volume: Number(args[index] || 90),
      pitch: Number(args[index + 1] || 100),
      pan: Number(args[index + 2] || 0)
    };
  };

  var bgsIdFromParam = function(strId) {
    return Number(strId) || 0;
  };

  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'AltBgs') {
      switch (args[0]) {
      case 'play':
        AudioManager.playAltBgs(bgsIdFromParam(args[2]),
         bgsFromParam(args[1], args, 3));
        break;
      case 'stop':
        if (args[1] === 'all') {
          AudioManager.stopAllAltBgs();
        } else {
          AudioManager.stopAltBgs(bgsIdFromParam(args[1]));
        }
        break;
      case 'fadeIn':
      case 'fadein':
        var bgs = bgsFromParam(args[1], args, 4);
        var id = bgsIdFromParam(args[2]);
        // bgs.volume = 0;
        AudioManager.playAltBgs(id, bgs);
        AudioManager.fadeInAltBgs(id, Number(args[3]) || 4);
        break;
      case 'fadeOut':
      case 'fadeout':
        if (args[1] === 'all') {
          AudioManager.fadeOutAllAltBgs(Number(args[2]) || 10);
        } else {
          AudioManager.fadeOutAltBgs(bgsIdFromParam(args[1]),
           Number(args[2]) || 10);
        }
        break;
      case 'save':
        var id = bgsIdFromParam(args[1]);
        AudioManager._savedAltBgs[id] = AudioManager.saveAltBgs(id);
        break;
      case 'replay':
        var id = bgsIdFromParam(args[1]);
        var bgs = AudioManager._savedAltBgs[id];
        if (bgs) {
          AudioManager.replayAltBgs(id, bgs);
        }
        break;
      case 'replayWithFadeIn':
        var id = bgsIdFromParam(args[1]);
        var bgs = AudioManager._savedAltBgs[id];
        if (bgs) {
          AudioManager.replayAltBgs(id, bgs, Number(args[2]) || 4);
        }
        break;
      case 'vol':
        if (args[1] === 'all') {
          AudioManager.setupFadeToAllAltBgs(args[2], Number(args[3] || 0));
        } else {
          var id = bgsIdFromParam(args[1]);
          var volume = getVolumeFromParam(id, args[2]);
          AudioManager.setupFadeToAltBgs(id, volume, Number(args[3] || 0));
        }
        break;
      }
    }
  };

  //
  // routine for each alternative bgs control
  //
  AudioManager.isCurrentAltBgs = function(index, bgs) {
    return (this._currentAltBgs[index] && this._bgsAltBuffers[index] &&
     this._currentAltBgs[index].name === bgs.name);
  };

  AudioManager.updateAltBgsParameters = function(index, bgs) {
    bgs = bgs || this._currentAltBgs[index];
    this.updateBufferParameters(this._bgsAltBuffers[index], this._bgsVolume,
     bgs);
  };

  AudioManager.updateCurrentAltBgs = function(index, bgs, pos) {
    this._currentAltBgs[index] = {
      name: bgs.name,
      volume: bgs.volume,
      pitch: bgs.pitch,
      pan: bgs.pan,
      pos: pos
    };
  };

  //
  // main routine
  //
  AudioManager.playAltBgs = function(index, bgs, pos) {
    if (this.isCurrentAltBgs(index, bgs)) {
      this.updateAltBgsParameters(index, bgs);
    } else {
      this.stopAltBgs(index);
      if (bgs.name) {
        this._bgsAltBuffers[index] = this.createBuffer('bgs', bgs.name);
        this.updateAltBgsParameters(index, bgs);
        this._bgsAltBuffers[index].play(true, pos || 0);
      }
    }
    this.updateCurrentAltBgs(index, bgs, pos);
  };

  AudioManager.stopAltBgs = function(index) {
    if (this._bgsAltBuffers[index]) {
      this._bgsAltBuffers[index].stop();
      this._bgsAltBuffers[index] = null;
      this._currentAltBgs[index] = null;
    }
  };

  AudioManager.fadeOutAltBgs = function(index, duration) {
    if (this._bgsAltBuffers[index] && this._currentAltBgs[index]) {
      this._bgsAltBuffers[index].fadeOut(duration);
      this._currentAltBgs[index] = null;
    }
  };

  AudioManager.fadeInAltBgs = function(index, duration) {
    if (this._bgsAltBuffers[index] && this._currentAltBgs[index]) {
      this._bgsAltBuffers[index].fadeIn(duration);
    }
  };

  AudioManager.saveAltBgs = function(index) {
    if (this._currentAltBgs[index]) {
      var bgs = this._currentAltBgs[index];
      return {
        name: bgs.name,
        volume: bgs.volume,
        pitch: bgs.pitch,
        pan: bgs.pan,
        pos: this._bgsAltBuffers[index] ? this._bgsAltBuffers[index].seek() : 0
      };
    } else {
      return null; //this.makeEmptyAudioObject();
    }
  };

  AudioManager.replayAltBgs = function(index, bgs, seconds) {
    if (this.isCurrentAltBgs(index, bgs)) {
      this.updateAltBgsParameters(index, bgs);
    } else {
      this.playAltBgs(index, bgs, bgs.pos);
      if (this._bgsAltBuffers[index]) {
        seconds = seconds || this._replayFadeTime;
        this._bgsAltBuffers[index].fadeIn(seconds);
      }
    }
  };

  //
  // set for all current alt BGSes.
  //
  AudioManager.playAllAltBgs = function(allBgs) {
    this._currentAltBgs = allBgs;
    for (var i = 0; i < allBgs.length; i++) {
      if (allBgs[i]) {
        this.playAltBgs(i, allBgs[i], allBgs[i].pos);
      }
    }
  };

  AudioManager.stopAllAltBgs = function() {
    var allBuffers = this._bgsAltBuffers;
    for (var i = 0; i < allBuffers.length; i++) {
      this.stopAltBgs(i);
    }
  };

  AudioManager.fadeOutAllAltBgs = function(duraton) {
    var allBuffers = this._bgsAltBuffers;
    for (var i = 0; i < allBuffers.length; i++) {
      this.fadeOutAltBgs(i, duration);
    }
  };

  AudioManager.saveAllAltBgs = function() {
    var allBgs = this._currentAltBgs;
    var bgsForSave = [];
    for (var i = 0; i < allBgs.length; i++) {
      bgsForSave[i] = this.saveAltBgs(i);
    }
    return bgsForSave;
  };

  AudioManager.replayAllAltBgs = function(allBgs) {
    this._currentAltBgs = allBgs;
    for (var i = 0; i < allBgs.length; i++) {
      if (allBgs[i]) {
        this.replayAltBgs(i, allBgs[i]);
      }
    }
  };

  //
  // call from various scenes
  //
  var _BattleManager_saveBgmAndBgs = BattleManager.saveBgmAndBgs;
  BattleManager.saveBgmAndBgs = function() {
    _BattleManager_saveBgmAndBgs.call(this);
    this._mapAltBgs = AudioManager.saveAllAltBgs();
  };

  var _BattleManager_replayBgmAndBgs = BattleManager.replayBgmAndBgs;
  BattleManager.replayBgmAndBgs = function() {
    _BattleManager_replayBgmAndBgs.call(this);
    if (this._mapAltBgs) {
      AudioManager.replayAllAltBgs(this._mapAltBgs);
    }
  };

  var _Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
  Game_System.prototype.onBeforeSave = function() {
    _Game_System_onBeforeSave.call(this);
    this._altBgsOnSave = AudioManager.saveAllAltBgs();
    this._altBgsRestored = AudioManager._savedAltBgs;
  };

  var _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function() {
    _Game_System_onAfterLoad.call(this);
    AudioManager.playAllAltBgs(this._altBgsOnSave || []);
    AudioManager._savedAltBgs = this._altBgsRestored || [];
  };

  //
  // rotuine for when master bgs volume is changed
  //
  AudioManager.updateAllAltBgsParameters = function() {
    var allBgs = this._currentAltBgs;
    for (var i = 0; i < allBgs.length; i++) {
      if (allBgs[i]) {
        this.updateAltBgsParameters(i);
      }
    }
  };

  Object.defineProperty(AudioManager, 'bgsVolume', {
    set: function(value) {
      this._bgsVolume = value;
      this.updateBgsParameters(this._currentBgs);
      // following 1 line is added.
      this.updateAllAltBgsParameters();
    }
  });

  //
  // stop bgs manipulation
  //
  var _AudioManager_stopBgs = AudioManager.stopBgs;
  AudioManager.stopBgs = function() {
    _AudioManager_stopBgs.call(this);
    if (!$notResetAltBgs) {
      this.stopAllAltBgs();
    }
  };

  var _AudioManager_playBgs = AudioManager.playBgs;
  AudioManager.playBgs = function(bgs, pos) {
    $notResetAltBgs = true;
    _AudioManager_playBgs.call(this, bgs, pos);
    $notResetAltBgs = false;
  };

  //
  // Volume control routine
  //
  var getVolumeFromParam = function(index, volStr) {
    var bgs = AudioManager._currentAltBgs[index];
    var reg = (/^(V?)([0-9]+)([%p]?)/i).exec(volStr);
    if (!bgs || !reg) {
      return 100;
    }
    var value = reg[1] ? $gameVariables.value(+reg[2]) : +reg[2];
    if (reg[3]) {
      value = bgs.volume * value / 100;
    }
    return value;
  };

  AudioManager.updateAltBgsVolume = function(index, volume) {
    var bgs = this._currentAltBgs[index];
    if (bgs && bgs.volume !== volume) {
      bgs.volume = volume;
      this.updateAltBgsParameters(index, bgs);
    }
  };

  AudioManager.updateAllAltBgsVolume = function(volStr) {
    var allBgs = this._currentAltBgs;
    for (var i = 0; i < allBgs.length; i++) {
      if (allBgs[i]) {
        this.updateAltBgsVolume(i, getVolumeFromParam(i, volStr));
      }
    }
  };

  AudioManager.setupFadeToAltBgs = function(index, volume, seconds) {
    if (!seconds) {
      this.updateAltBgsVolume(index, volume);
      return;
    }
    var bgs = this._currentAltBgs[index];
    if (bgs) {
      bgs.duration = bgs.maxDuration = seconds * 60;
      bgs.srcVolume = bgs.volume;
      bgs.destVolume = volume;
    }
  };

  AudioManager.setupFadeToAllAltBgs = function(volStr, seconds) {
    var allBgs = this._currentAltBgs;
    for (var i = 0; i < allBgs.length; i++) {
      if (allBgs[i]) {
        var volume = getVolumeFromParam(i, volStr);
        this.setupFadeToAltBgs(i, volume, seconds);
      }
    }
  };

  AudioManager.updateForAllAltBgs = function() {
    var allBgs = this._currentAltBgs;
    for (var i = 0; i < allBgs.length; i++) {
      if (allBgs[i] && allBgs[i].duration) {
        var bgs = allBgs[i];
        if (--bgs.duration === 0) {
          this.updateAltBgsVolume(i, bgs.destVolume);
          bgs.duration = bgs.maxDuration = bgs.srcVolume =
           bgs.destVolume = null;
        } else {
          var src = bgs.srcVolume;
          var dest = bgs.destVolume;
          var d = bgs.duration;
          var md = bgs.maxDuration;
          var volume = Math.round(src + (dest - src) * (md - d) / md);
          this.updateAltBgsVolume(i, volume);
        }
      }
    }
  };

  var _Scene_Base_update =Scene_Base.prototype.update;
  Scene_Base.prototype.update = function() {
    _Scene_Base_update.call(this);
    AudioManager.updateForAllAltBgs();
  };

})();
