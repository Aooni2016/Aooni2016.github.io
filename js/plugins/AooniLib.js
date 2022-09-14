//=============================================================================
// AooniLib.js
//=============================================================================

/*:
 * @plugindesc Library for Aooni MV
 * @author Sasuke KANNAZUKI
 * 
 * @requiredAssets img/faces/comical1
 * @requiredAssets img/faces/N2
 * @requiredAssets img/characters/!$ao_cm
 * @requiredAssets img/characters/!$ao_cm_takeshi
 * @requiredAssets img/characters/!$ao_h
 * @requiredAssets img/characters/!$ao_mika
 * @requiredAssets img/characters/!$ao_takesi
 * @requiredAssets img/characters/!$ao_takurou
 * @requiredAssets img/characters/!$ao_hacka_zero_last
 * @requiredAssets img/characters/!$ao_hacka_zero_hair3
 * @requiredAssets img/characters/!$ao_hacka_zero_hair2
 * @requiredAssets audio/bgs/A5_16491
 * @requiredAssets audio/bgs/Darkness
 * @requiredAssets audio/bgs/Magic1
 * @requiredAssets audio/bgs/Phone
 * @requiredAssets audio/bgs/sdky_sadako2_short
 * @requiredAssets audio/bgs/sdky_sentakuki_washing
 *
 * @help This plugin does not provide plugin commands.
 * This plugin is (only) for Aooni MV Version.
 *
 */

/*:ja
 * @plugindesc 青鬼MV用ライブラリ
 * @author 神無月サスケ
 * 
 * @requiredAssets img/faces/comical1
 * @requiredAssets img/faces/N2
 * @requiredAssets img/characters/!$ao_cm
 * @requiredAssets img/characters/!$ao_cm_takeshi
 * @requiredAssets img/characters/!$ao_h
 * @requiredAssets img/characters/!$ao_mika
 * @requiredAssets img/characters/!$ao_takesi
 * @requiredAssets img/characters/!$ao_takurou 
 * @requiredAssets img/characters/!$ao_hacka_zero_last
 * @requiredAssets img/characters/!$ao_hacka_zero_hair3
 * @requiredAssets img/characters/!$ao_hacka_zero_hair2
 * @requiredAssets audio/bgs/A5_16491
 * @requiredAssets audio/bgs/Darkness
 * @requiredAssets audio/bgs/Magic1
 * @requiredAssets audio/bgs/Phone
 * @requiredAssets audio/bgs/sdky_sadako2_short
 * @requiredAssets audio/bgs/sdky_sentakuki_washing
 * 
 * @help このプラグインには、プラグインコマンドはありません。
 * 青鬼を移植するにあたって、必要な要素を集めたライブラリです。
 */

(function() {

  // ----------------------------------------
  // Main setting for Aooni
  // ----------------------------------------
  // Aooni module
  // This is the static class for this plugin.
  //
  function Aooni() {
    throw new Error('This is a static class');
  }

  //
  // RPG Maker XP is 40fps, while MV is 60fps. Adopt XP-like speed to MV.
  //
  Game_CharacterBase.prototype.distancePerFrame = function() {
    var base = Math.pow(2, this.realMoveSpeed()) * 4.0 / 3.0 / 256;
    return base * $gameSystem.speedPower();
  };

  //
  // At hackadoll mode, for beginners of Aooni, slow mode available.
  //
  var isSlowAooniMode = function() {
    return $gameSwitches.value(272);
  };

  //
  // regardless of the setting of the map, always dash is disabled.
  //
  Game_Map.prototype.isDashDisabled = function () {
    return true;
  };

  // ----------------------------------------
  // Check routine whether the event is Aooni
  // ----------------------------------------

  var checkAooniByEventName = function (eventName) {
    return /^青/.test(eventName);
  };

  var _Game_Event_initialize = Game_Event.prototype.initialize;
  Game_Event.prototype.initialize = function(mapId, eventId) {
    _Game_Event_initialize.call(this, mapId, eventId);
    this._isAooni = checkAooniByEventName(this.event().name);
    this._touchCount = 0;
  };

  Game_Event.prototype.isAooni = function() {
    if (this._isAooni == null) {
      this._isAooni = checkAooniByEventName(this.event().name);
    }
    return this._isAooni;
  };

  // ----------------------------------------
  // High Speed Mode
  // ----------------------------------------

  Game_System.prototype.speedPower = function() {
    return $gameSwitches.value(248) && !$gameMap.isEventRunning() ? 2 : 1;
  };

  var _Game_Timer_update = Game_Timer.prototype.update;
  Game_Timer.prototype.update = function(sceneActive) {
    for(var i = 0; i < $gameSystem.speedPower(); i++) {
      _Game_Timer_update.call(this, sceneActive);
    }
  };

  var _Game_Event_updateRoutineMove =
   Game_Event.prototype.updateRoutineMove;
  Game_Event.prototype.updateRoutineMove = function() {
    if (this.isAooni()) {
      for(var i = 1; i < $gameSystem.speedPower() ; i++) {
        if (this._waitCount > 0) {
          this._waitCount--;
        }
      }
    }
    _Game_Event_updateRoutineMove.call(this);
  };

  var _Game_Interpreter_updateWaitCount =
   Game_Interpreter.prototype.updateWaitCount;
  Game_Interpreter.prototype.updateWaitCount = function() {
    if(this._waitCount > 0 && $gameMap.event(this._eventId) &&
     $gameMap.event(this._eventId)._trigger === 4) {
      for(var i = 1; i < $gameSystem.speedPower() ; i++) {
        if (this._waitCount > 0) {
          this._waitCount--;
        }
      }
    }
    return _Game_Interpreter_updateWaitCount.call(this);
  };

  // ----------------------------------------
  // Aooni original RGSS routine
  // ----------------------------------------

  //
  // at menu window, display not face graphic but character graphic instead.
  //
  Window_MenuStatus.prototype.loadImages = function() {
    $gameParty.members().forEach(function(actor) {
      ImageManager.loadCharacter(actor.characterName());
    }, this);
  };

  Window_MenuStatus.prototype.drawItemImage = function(index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    this.changePaintOpacity(actor.isBattleMember());
    // note: actor id #6 is large character(transformed Takuro).
    this.drawActorCharacter(actor, rect.x + Window_Base._faceWidth / 2,
     rect.y + rect.height - (actor.actorId() !== 6 ? 40 : 0));
    // this.drawActorFace(actor, rect.x + 1, rect.y + 1, 144, rect.height - 2);
    this.changePaintOpacity(true);
  };

  //
  // the case when party member is more than 4, display all members
  // on menu screen and save window.
  // this assumes max member is 6.
  //
  Game_Party.prototype.battleMembers = function() {
    return this.allMembers();
  };

  Window_MenuStatus.prototype.numVisibleRows = function() {
    return Math.max(4, $gameParty.size());
  };

  //
  // change display face graphic by switch condition
  //
  Game_Message.prototype.faceName = function() {
    if (this._faceName === 'normal') {
      if ($gameSwitches.value(47)){ // face choice mode
        return this._faceName;
      } else if ($gameSwitches.value(76)){ // funny character mode
        return 'comical1';
      } else { // default mode
        return 'N2';
      }
    }
    return this._faceName;
  };

  //
  // not display timer unless specified switch is true.
  //
  Sprite_Timer.prototype.redraw = function() {
    var text = this.timerText();
    var width = this.bitmap.width;
    var height = this.bitmap.height;
    this.bitmap.clear();
    if($gameSwitches.value(43)) {
      this.bitmap.drawText(text, 0, 0, width, height, 'center');
    }
  };

  //
  // change Aooni character graphic by switch condition
  //
  var _Game_Event_setImage = Game_Event.prototype.setImage;
  Game_Event.prototype.setImage = function(characterName, characterIndex) {
    if (characterName === '!$ao') {
      if ($gameSwitches.value(246)) {    // Hackadoll mode
        if ($gameSwitches.value(87)) { // last
          characterName = '!$ao_hacka_zero_last';
        } else if ($gameSwitches.value(83)) { // after #3 is attacked his hear
          if ($gameSwitches.value(82)) {
            characterName = '!$ao_hacka_zero';
          } else {
            characterName = '!$ao_hacka_zero_hair3';
          }
        } else if ($gameSwitches.value(59)) { // after get key of 3F
          characterName = '!$ao_hacka_zero';
        } else if ($gameSwitches.value(78)) { // after #2 is attacked her hear
          characterName = '!$ao_hacka_zero_hair2';
        }
      } else if ($gameSwitches.value(76)) { // comical mode
        switch ($gameVariables.value(1)) {
        case 0:
          characterName = '!$ao_cm';
          break;
        case 1:
          characterName = '!$ao_cm_takeshi';
          break;
        }
      } else if ($gameSwitches.value(175)) { // fuwatty
        characterName = '!$ao_h';
      } else {
        switch ($gameVariables.value(1)) {  // transformed friend and another
        case 1:
          characterName = '!$ao_mika';
          break;
        case 2:
          characterName = '!$ao_takesi';
          break;
        case 3:
          characterName = '!$ao_takurou';
          break;
        case 4:
          characterName = '!$ao2_kiba';
          break;
        case 5:
          characterName = '!sdky_ao_actions2';	// for sadakaya mode
          characterIndex = 0;
          break;
        case 6:
          characterName = '!sdky_ao_actions2';	// for sadakaya mode
          characterIndex = 1;
          break;
        case 11:
          characterName = '!sdky_sadakayaoni';	// for sadakaya mode
          characterIndex = 0;
          break;
        case 12:
          characterName = '!sdky_sadakayaoni';	// for sadakaya mode
          characterIndex = 2;
          break;
        }
      }
    }
    _Game_Event_setImage.call(this, characterName, characterIndex);
  };

  // when Transfer Player, add 1 sec to timer count.
  var _Game_Interpreter_command201 = Game_Interpreter.prototype.command201;
  Game_Interpreter.prototype.command201 = function() {
    $gameTimer._frames += 60;
    return _Game_Interpreter_command201.call(this);
 };

  //
  // takurou transforms to Aooni when menu opened at specified condition.
  //
  Aooni.isTakurouTransform = function() {
    // not transformed yet and couldn't save him
    if(!$gameSwitches.value(180) && !$gameSwitches.value(234)) {
      // complete all pieces
      if($gameSwitches.value(168) && $gameSwitches.value(169) &&
       $gameSwitches.value(170)) {
        // in front of the picture
        if($gameMap.mapId() == 67 && $gamePlayer.x == 9 &&
         $gamePlayer.y == 14 && $gamePlayer.direction() == 2) {
          return true;
        }
      }
    }
    return false;
  };

  Aooni.processTakurouTransform = function() {
    if(Aooni.isTakurouTransform()){
      $gameVariables.setValue(1, 3);
      $gameSwitches.setValue(178, true);
      $gameParty.addActor(6);
      $gameParty.removeActor(5);
      AudioManager.playBgm({name:'horor-b', volume:100, pitch:100});
    }
  };

  var _Scene_Menu_create = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function() {
    Aooni.processTakurouTransform();
    _Scene_Menu_create.call(this);
  };

  var _Window_MenuCommand_areMainCommandsEnabled = 
   Window_MenuCommand.prototype.areMainCommandsEnabled;
  Window_MenuCommand.prototype.areMainCommandsEnabled = function() {
    // right eval is at Sadakaya mode, when Toshio joins to the party
    // and Tamao is excluded.
    if(Aooni.isTakurouTransform() || $gameVariables.value(100) == 410){
      return false;
    }
    return _Window_MenuCommand_areMainCommandsEnabled.call(this);
  };

  var _Window_MenuCommand_isOptionsEnabled = 
   Window_MenuCommand.prototype.isOptionsEnabled;
  Window_MenuCommand.prototype.isOptionsEnabled = function() {
    if(Aooni.isTakurouTransform()){
      return false;
    }
    return _Window_MenuCommand_isOptionsEnabled.call(this);
  };

  var _Window_MenuCommand_isSaveEnabled = 
   Window_MenuCommand.prototype.isSaveEnabled;
  Window_MenuCommand.prototype.isSaveEnabled = function() {
    if(Aooni.isTakurouTransform()){
      return false;
    }
    return _Window_MenuCommand_isSaveEnabled.call(this);
  };

  var _Window_MenuCommand_isGameEndEnabled = 
   Window_MenuCommand.prototype.isGameEndEnabled;
  Window_MenuCommand.prototype.isGameEndEnabled = function() {
    if(Aooni.isTakurouTransform()){
      return false;
    }
    return _Window_MenuCommand_isGameEndEnabled.call(this);
  };

  // ----------------------------------------
  // Aooni MV New features
  // ----------------------------------------

  //
  // Aooni cannot enter region #1.
  // (This is the original feature for MV)
  //
  var _Game_Event_isMapPassable = Game_Event.prototype.isMapPassable;
  Game_Event.prototype.isMapPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (this.isAooni() && $gameMap.regionId(x2, y2) === 1) {
      return false;
    }
    return _Game_Event_isMapPassable.call(this, x, y, d);
  };

  // ----------------------------------------
  // Utilitiy functions called from event commands
  // ----------------------------------------

  //
  // move toward specified position.
  // note:this function is called by custom move route in the event.
  //
  Game_Character.prototype.moveToward = function(x, y) {
    var sx = this.deltaXFrom(x);
    var sy = this.deltaYFrom(y);
    if (Math.abs(sx) > Math.abs(sy)) {
      this.moveStraight(sx > 0 ? 4 : 6);
      if (!this.isMovementSucceeded() && sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
      }
    } else if (sy !== 0) {
      this.moveStraight(sy > 0 ? 8 : 2);
      if (!this.isMovementSucceeded() && sx !== 0) {
        this.moveStraight(sx > 0 ? 4 : 6);
      }
    }
  };

  //
  // move toward specified event.
  // note:this function is called by custom move route in the event.
  //
  Game_Character.prototype.moveTowardEvent = function(eventId) {
    this.moveTowardCharacter($gameMap.event(eventId));
  };

  //
  // note:this function is called by event command 'Script'.
  //
  Game_Player.prototype.samePos = function(eventId) {
    var e = $gameMap.event(eventId);
    return this.x === e.x && this.y === e.y;
  };

  // 
  // Change event's image with specific grid.
  // note:this function is called by custom move route in the event.
  //
  Game_CharacterBase.prototype.setImageGrid = function(name, index, dir, pattern) {
    this.setImage(name, index);
    this.setGrid(dir, pattern);
  };

  // Change grid (dir and pattern) of the event's image
  // note:this function is called by custom move route in the event.
  // dir : 2=down, 4=left, 6=right, 8=up
  // pattern : 0,1, or 2.
  //
  Game_CharacterBase.prototype.setGrid = function(dir, pattern) {
    this._originalDirection = dir;
    this.setDirection(dir);
    this._originalPattern = pattern;
    this.setPattern(pattern);
  };

  // set self switch of this event.
  Game_CharacterBase.prototype.setSelfSw = function(letter, value) {
  };

  // call from Move Route -> Script.
  // - letter must be 'A', 'B', 'C' or 'D'. (must be capital)
  // - value must be true or false.
  // ex1. this.setSelfSw('A', true);
  // ex2. this.setSelfSw('B', false);
  Game_Event.prototype.setSelfSw = function(letter, value) {
    if (letter.match(/^[A-D]$/)) {
      var key = [$gameMap.mapId(), this._eventId, letter];
      $gameSelfSwitches.setValue(key, !!value);
    }
  };

  // ----------------------------------------
  // Aooni movement manipulate routines to recreate/refine XP version
  // ----------------------------------------

  Game_Event.prototype.moveTowardPlayer = function() {
    var sx = this.deltaXFrom($gamePlayer.x);
    var sy = this.deltaYFrom($gamePlayer.y);
    if (sx == 0 && sy == 0) {
      return;
    }
    var abs_sx = Math.abs(sx);
    var abs_sy = Math.abs(sy);
    if (abs_sx === abs_sy) {
      if (Math.randomInt(2) === 0) {
        abs_sx++;
      } else {
        abs_sy++;
      }
    }
    if (abs_sx > abs_sy) {
      this.moveStraight(sx > 0 ? 4 : 6);
      if (!this.isMovementSucceeded() && sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
      }
    } else {
      this.moveStraight(sy > 0 ? 8 : 2);
      if (!this.isMovementSucceeded() && sx !== 0) {
        this.moveStraight(sx > 0 ? 4 : 6);
      }
    }
    // when there's no room to move player (immortal mode only)
    if (this.isAooni() && $gameSwitches.value(150)) {
      if (!this.isMovementSucceeded() && this.isPlayerAdjacent()) {
        this._touchCount = this._touchCount || 0;
        if (++this._touchCount >= 6) {
          this.unlock();
          this.moveRandom();
          if (!this.isMovementSucceeded()) {
            this.unlock();
            this.moveAwayFromPlayer();
          }
        }
      }
    }
    if (this.isMovementSucceeded()) {
      this._touchCount = 0;
    }
  };

  Game_Event.prototype.isPlayerAdjacent = function() {
    var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
    var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
    return sx + sy <= 1;
  };

  //  after each Aooni step, stop several frames.
  // This is because without this, Aooni is too fast.
  //
  var _Game_Event_moveTowardPlayer = Game_Event.prototype.moveTowardPlayer;
  Game_Event.prototype.moveTowardPlayer = function() {
    _Game_Event_moveTowardPlayer.call(this);
    if (this.isAooni() && $gameSwitches.value(49)) {
      // at default, Aooni's wait count is 3 frames (this_waitCount + 1).
      // but sometimes the count is changed by plugin commands.
      this.aooniWaitCount = this.aooniWaitCount || 2;
      this._waitCount = this.aooniWaitCount;
      if (isSlowAooniMode()) {
        this._waitCount += 10;
      }
    }
  };

  var _Game_Event_moveStraight = Game_Event.prototype.moveStraight;
  Game_Event.prototype.moveStraight = function(d) {
    _Game_Event_moveStraight.call(this, d);
    if (this.isAooni() && $gameSwitches.value(49)) {
      this.aooniWaitCount = this.aooniWaitCount || 2;
      this._waitCount = this.aooniWaitCount;
      if (isSlowAooniMode()) {
        this._waitCount += 10;
      }
    }
  };

  //
  // sometimes Aooni's speed be special value specified by plugin commands.
  //
  var _Game_Event_setMoveSpeed = Game_Event.prototype.setMoveSpeed;
  Game_Event.prototype.setMoveSpeed = function(moveSpeed) {
    if (this.isAooni() && this._aooniMoveSpeed != null) {
      moveSpeed = this._moveSpeed = this._aooniMoveSpeed;
    }
    _Game_Event_setMoveSpeed.call(this, moveSpeed);
  };

  //
  // Aooni stops when map interpreter is running.
  //
  var _Game_Event_updateStop = Game_Event.prototype.updateStop;
  Game_Event.prototype.updateStop = function() {
    if (this.isAooni()) {
      if (this._locked) {
        this.resetStopCount();
      }
      Game_Character.prototype.updateStop.call(this);
      if ($gameMap.isEventRunning()) {
        // when another event is running, stop moving.
        // ex. when the player is inspecting treasure box or talking with NPC.
      } else if(SceneManager._scene._messageWindow.isOpen()) {
        // when state removed message is displaying, stop moving.
      } else {
            if (!this.isMoveRouteForcing()) {
          this.updateSelfMovement();
        }
      }
    } else {
      _Game_Event_updateStop.call(this);
    }
  };

  // ----------------------------------------
  // change options
  // ----------------------------------------

  var _Window_Options_updatePlacement =
   Window_Options.prototype.updatePlacement;
  Window_Options.prototype.updatePlacement = function() {
    _Window_Options_updatePlacement.call(this);
    if(SceneManager.isPreviousScene(Scene_Title)) {
      this.x += 40;
      this.y += 20;
      this.setBackgroundType(2);
    }
  };

  Window_Options.prototype.addGeneralOptions = function() {
    // dash is abolished!
    // this.addCommand(TextManager.alwaysDash, 'alwaysDash');
    this.addCommand(TextManager.commandRemember, 'commandRemember');
  };

  var doesDisplaySpecialOptions = function() {
    return !SceneManager.isPreviousScene(Scene_Title) &&
      !$gameSwitches.value(270);
  };

  var _Window_Options_makeCommandList =
   Window_Options.prototype.makeCommandList;
  Window_Options.prototype.makeCommandList = function() {
    if (doesDisplaySpecialOptions()) {
      // add common special options for any mode
      this.addCommand('むてき', 'immortal');
      this.addCommand('タイマー表示', 'timer');
      this.addCommand('倍速モード', 'quick');
      // add mode dependent options
      if ($gameSwitches.value(246)) { // hackadoll mode
        this.addCommand('頭の目隠し消去', 'eraseMosaic');
      } else if ($gameSwitches.value(76)) { //comical mode
        // no option to add.
      } else {  // normal mode
        this.addCommand('旧ver顔グラ', 'faceGraphic');
        this.addCommand('フワッティー', 'fuwatty');
      }
    }
    _Window_Options_makeCommandList.call(this);
  };

  var _Window_Options_getConfigValue = Window_Options.prototype.getConfigValue;
  Window_Options.prototype.getConfigValue = function(symbol) { 
    switch (symbol) {
    case 'immortal':
      return $gameSwitches.value(150);
    case 'timer':
      return $gameSwitches.value(43);
    case 'faceGraphic':
      return $gameSwitches.value(47);
    case 'fuwatty':
      return $gameSwitches.value(187);
    case 'quick':
      return $gameSwitches.value(248);
    case 'eraseMosaic':
      return $gameSwitches.value(247);
    default:
      return _Window_Options_getConfigValue.call(this, symbol);
    }
  };

  var _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
  Window_Options.prototype.setConfigValue = function(symbol, volume) {
    switch (symbol) {
    case 'immortal':
      return $gameSwitches.setValue(150, volume);
    case 'timer':
      return $gameSwitches.setValue(43, volume);
    case 'faceGraphic':
      return $gameSwitches.setValue(47, volume);
    case 'fuwatty':
      $gameVariables.setValue(42, volume ? 30 : 180);
      $gameVariables.setValue(43, volume ? 5 : 2);
      return $gameSwitches.setValue(187, volume);
    case 'quick':
      return $gameSwitches.setValue(248, volume);
    case 'eraseMosaic':
      if (volume) { // erase each Hackadoll icon's mosaic on bald head
        for (var i = 0; i < 4; i++) {
          if ($gameVariables.value(83 + i) === 48 + i) {
            $gameVariables.setValue(83 + i, 52 + i);
          }
        }
      } else { // put each hackadoll icon's mosaic on bald head
        for (var i = 0; i < 4; i++) { // change icon id of each Hackadoll
          if ($gameVariables.value(83 + i) === 52 + i) {
            $gameVariables.setValue(83 + i, 48 + i);
          }
        }
      }
      return $gameSwitches.setValue(247, volume);
    default:
      return _Window_Options_setConfigValue.call(this, symbol, volume);
    }
  };

  // ----------------------------------------
  // change menu
  // ----------------------------------------

  var __Scene_Menu_create = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function() {
    __Scene_Menu_create.call(this);
    this.createTimerWindow();
    this.createStepsWindow();
    this.createEscapeWindow();
    this.createMissionWindow();
  };

  var _Scene_Menu_start = Scene_Menu.prototype.start;
  Scene_Menu.prototype.start = function() {
    _Scene_Menu_start.call(this);
    this._timerWindow.refresh();
    this._stepsWindow.refresh();
  };

  // create timer window
  //
  function Window_Timer() {
    this.initialize.apply(this, arguments);
  }
  Window_Timer.prototype = Object.create(Window_Base.prototype);
  Window_Timer.prototype.constructor = Window_Timer;

  Window_Timer.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.width = width;
    this.playtimeText = null;
    this.refresh();
  };

  Window_Timer.prototype.refresh = function() {
    this.playtimeText = $gameSystem.playtimeText();
    this.contents.clear();
    this.changeTextColor(this.systemColor());
    this.drawText("プレイ時間", 4, 0, this.width - 32);
    this.resetTextColor();
    this.drawText(this.playtimeText, 0, 32, this.width, 'center');
  };

  Window_Timer.prototype.update = function() {
    if (this.playtimeText !== $gameSystem.playtimeText()){
      this.refresh();
    }
  };

  Scene_Menu.prototype.createTimerWindow = function() {
    var x = 0;
    var width = this._commandWindow.width;
    var height = 96;
    var y = Graphics.height - height - this._goldWindow.height;
    this._timerWindow = new Window_Timer(x, y, width, height);
    this.addWindow(this._timerWindow);
  };

  //
  // create step window
  //
  function Window_Steps() {
    this.initialize.apply(this, arguments);
  }
  Window_Steps.prototype = Object.create(Window_Base.prototype);
  Window_Steps.prototype.constructor = Window_Steps;

  Window_Steps.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.width = width;
    this.steps = null;
    this.refresh();
  };

  Window_Steps.prototype.refresh = function() {
    this.steps = $gameParty.steps();
    this.contents.clear();
    this.changeTextColor(this.systemColor());
    this.drawText("歩数", 4, 0, this.width - 32);
    this.resetTextColor();
    this.drawText(this.steps, 0, 32, this.width-64, 'right');
  };

  Window_Steps.prototype.update = function() {
    if (this.steps !== $gameParty.steps()){
      this.refresh();
    }
  };

  Scene_Menu.prototype.createStepsWindow = function() {
    var x = 0;
    var width = this._commandWindow.width;
    var height = 96;
    var y = this._timerWindow.y - height;
    this._stepsWindow = new Window_Steps(x, y, width, height);
    this.addWindow(this._stepsWindow);
  };

  //
  // escape success number windows
  //
  function Window_EscapeSuccess() {
    this.initialize.apply(this, arguments);
  }
  Window_EscapeSuccess.prototype = Object.create(Window_Base.prototype);
  Window_EscapeSuccess.prototype.constructor = Window_EscapeSuccess;

  Window_EscapeSuccess.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.width = width;
    this.escapeTimes = null;
    this.escapeMaxTimes = null;
    this.refresh();
  };

  Window_EscapeSuccess.prototype.refresh = function() {
    this.escapeTimes = $gameVariables.value(78);
    this.escapeMaxTimes = $gameVariables.value(79);
    this.contents.clear();
    this.changeTextColor(this.systemColor());
    this.drawText("連続逃げ切り", 4, 0, this.width - 32);
    this.drawText("現在", 0, 32, this.width-72);
    this.drawText("最大", 0, 62, this.width-72);
    this.drawText("回", 0, 32, this.width - 40 , 'right');
    this.drawText("回", 0, 62, this.width - 40 , 'right');
    this.resetTextColor();
    this.drawText(this.escapeTimes, 0, 32, this.width-72, 'right');
    this.drawText(this.escapeMaxTimes, 0, 62, this.width-72, 'right');
  };

  Scene_Menu.prototype.createEscapeWindow = function() {
    if (isSadakayaMode()) {
      return;
    }
    var x = 0;
    var width = this._commandWindow.width;
    var height = 128;
    var y = this._stepsWindow.y - height;
    this._escapeWindow = new Window_EscapeSuccess(x, y, width, height);
    this.addWindow(this._escapeWindow);
  };

  //
  // next mission display window (for Sadakaya mode only)
  //
  var isSadakayaMode = function () {
    return !!$gameVariables.value(100);
  };

  function Window_NextMission() {
    this.initialize.apply(this, arguments);
  }
  Window_NextMission.prototype = Object.create(Window_Base.prototype);
  Window_NextMission.prototype.constructor = Window_NextMission;

  Window_NextMission.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.width = width;
    this.refresh();
  };

  var MissionMsg = [
    [  0, "玄関に向かう"],
    [200, "台所でテレビと","ビデオデッキを入手"],
    [220, "ビデオデッキを","座敷牢へ"],
    [300, "テレビを見て","待機する"],
    [310, "屋敷の化け物を", "座敷牢へ誘導"],
    [380, "２階寝室へ"],
    [420, "俊雄を追いかけ", "階段を上がる"],
    [440, "伽椰子邸２階で", "珠緒を探す"],
    [450, "伽椰子邸１階で", "珠緒を探す"],
    [500, "青鬼の屋敷で", "珠緒を探す"],
    [520, "珠緒を探す", "浴室にいる……？"],
    [540, "館の電話を取る"],
    [600, "ひろしを探す", "伽椰子邸か……？"],
    [710, "玄関から", "脱出……？"],
    [720, "伽椰子邸２階に", "何かが……？"],
    [730, "屋根裏部屋を進む"],
    [740, "左側の本棚を探す"],
    [750, "右側の本棚を探す"],
    [760, "とにかく出口へ"]
  ];

  var getCurrentMission = function() {
    var msgs;
    for (var i = MissionMsg.length - 1; i >= 0; i--) {
      msgs = MissionMsg[i];
      if (msgs[0] <= $gameVariables.value(100)) {
        return msgs;
      }
    }
    return [-1, "エラー"];
  };

  Window_NextMission.prototype.refresh = function() {
    this.contents.clear();
    this.changeTextColor(this.systemColor());
    this.drawText("ミッション：", 4, 0, this.width - 48);
    this.resetTextColor();
    var msgs = getCurrentMission();
    this.drawText(msgs[1], 4, 32, this.width - 48);
    if (msgs[2]) {
      this.drawText(msgs[2], 4, 62, this.width - 48);
    }
  };

  Scene_Menu.prototype.createMissionWindow = function() {
    if (!isSadakayaMode()) {
      return;
    }
    var x = 0;
    var width = this._commandWindow.width;
    var height = 128;
    var y = this._stepsWindow.y - height;
    this._missionWindow = new Window_NextMission(x, y, width, height);
    this.addWindow(this._missionWindow);
  };

  //
  // shorten HP/MP gauge
  //
  Window_MenuStatus.prototype.drawActorSimpleStatus =
   function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
    var x2 = x + 240;
    //var x2 = x + 180;
    var width2 = Math.min(200, width - 180 - this.textPadding());
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x, y + lineHeight * 1);
    this.drawActorIcons(actor, x, y + lineHeight * 2);
    this.drawActorClass(actor, x2, y);
    this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
    this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
  };

  // ----------------------------------------
  // priority manipulation routine
  // ----------------------------------------

  //
  // at Sadakaya Mode, sometimes followers will be appear (cursing ghosts).
  // This function prevents follower become higher priority than player.
  // (ex. follower is at overpass position and player isn't,
  // at default, follower displays higher priority.)
  //
  Game_Follower.prototype.screenZ = function() {
    return Math.min($gamePlayer.screenZ(),
     Game_Character.prototype.screenZ.call(this));
  };

  //
  // set event over the overpass position(=5)
  //
  Game_Event.prototype.isHigherPriority = function() {
    if (this._higherPriority == null) {
      if (this.event().meta) {
        this._higherPriority = !!this.event().meta.high;
      } else { // event test mode from event command editor
        return false;
      }
    }
    return this._higherPriority;
  };

  Game_Event.prototype.screenZ = function() {
    return Game_Character.prototype.screenZ.call(this) +
     (this.isHigherPriority() ? 1 : 0);
  };

  // ----------------------------------------
  // fix bugs
  // ----------------------------------------
  var _Window_NumberInput_buttonY = Window_NumberInput.prototype.buttonY;
  Window_NumberInput.prototype.buttonY = function() {
    // 別館・地下室右
    if ($gameMap.mapId() === 27) {
      // without this, panel was hidden by the input button.
      return this.height + 8;
    }
    return _Window_NumberInput_buttonY.call(this);
  };

  //
  // at immortal mode, when player is caught by Aooni,
  // touch input doesn't work no longer at default.
  // this function is to prevent the error.
  // switch #271 is active when caught by Aooni at immortal mode.
  // This function force aooni to wait several frames, and player can move
  // at the moment.
  //
  var _Game_Event_update = Game_Event.prototype.update;
  Game_Event.prototype.update = function() {
    _Game_Event_update.call(this);
    if (this.isAooni() && $gameSwitches.value(271)) {
      this._waitCount = 20;
    }
  };

  var _Game_Map_updateEvents = Game_Map.prototype.updateEvents;
  Game_Map.prototype.updateEvents = function() {
    _Game_Map_updateEvents.call(this);
    $gameSwitches.setValue(271, false);
  };

  // ----------------------------------------
  // light weighting
  //-----------------------------------------

  var _Game_Switches_setValue = Game_Switches.prototype.setValue;
  Game_Switches.prototype.setValue = function(switchId, value) {
    if (this._data[switchId] === value) {
      return;
    }
    _Game_Switches_setValue.call(this, switchId, value);
  };

  var _Game_Variables_setValue = Game_Variables.prototype.setValue;
  Game_Variables.prototype.setValue = function(variableId, value) {
    if (this._data[variableId] === value) {
      return;
    }
    _Game_Variables_setValue.call(this, variableId, value);
  };

})();
