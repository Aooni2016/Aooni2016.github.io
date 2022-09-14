//=============================================================================
// DiscardImageFromCache.js (ver1.2)
//=============================================================================

/*:
 * @plugindesc discard images from cache explicitly by plugin command
 * @author Sasuke KANNAZUKI
 *
 * @help
 * At default system (so far MV 1.3.4), cached images are never eliminated,
 * and it is the cause of memory bloat.
 * This plugin enables explicit elimination of image in cache.
 *
 * note: This plugin is for MV 1.3.1 or later.
 *
 * 
 * Plugin Commands:
 * DiscardPicture <filename>
 * DiscardCharacter <filename>
 * DiscardParallax <filename>
 * DiscardTileset <filename>
 * DiscardTilesets <tileset ID>   // discard all images of the tileset ID.
 * Ex:
 * DiscardPicture Ghost    // discard Ghost.png at pictures folder.
 * DiscardTilesets 5   // discard all images of the tileset ID 5.
 */
/*:ja
 * @plugindesc プラグインコマンドで明示的に画像をキャッシュから削除出来ます。
 * @author 神無月サスケ
 *
 * @help
 * MV 1.3.4 現在、一度読み込まれた全ての画像はキャッシュにずっと残り、
 * 解放されません。これがメモリブロートの原因となっていました。
 * このプラグインは、プラグインコマンドでの画像削除を可能にします。
 *
 * Ver1.2追加点：
 * 画像をメモリから解放する際、画像のテクスチャを破棄するように追加。
 * これは liply_GC.js を参考にさせていただきました。
 * liply様に感謝いたします。
 * 
 * 注意: このプラグインは、MV 1.3.1 以降のバージョンでのみ有効です。
 *
 * プラグインコマンド:
 * DiscardPicture <filename>
 * DiscardCharacter <filename>
 * DiscardParallax <filename>
 * DiscardTileset <filename>
 * DiscardTilesets <tileset ID>   // <tileset ID>に属する全てのタイルセット画像
 * 例:
 * DiscardPicture Ghost    // pictures にある Ghost.png をキャッシュから削除
 * DiscardTilesets 5       // タイルセット5番で使用されている全てのタイル画像
 * 注意：
 * Aooni_A2 というタイルマップだけは削除しません。
 * これは、青鬼の中でほぼ全てのマップで使われているからです。
 */

(function() {

  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'DiscardPicture') {
      if (args[0]) {
        ImageManager.discardPicture(args[0]);
      }
    } else if (command === 'DiscardCharacter') {
      if (args[0]) {
        ImageManager.discardCharacter(args[0]);
      }
    } else if (command === 'DiscardTileset') {
      if (args[0]) {
        ImageManager.discardTileset(args[0]);
      }
    } else if (command === 'DiscardTilesets') {
      var id = Number(args[0] || 0);
      if (id) {
        ImageManager.discardTilesets(id);
      }
    } else if (command === 'DiscardParallax') {
      if (args[0]) {
        ImageManager.discardParallax(args[0]);
      }
    }
  };

  //
  // CacheMap
  //
  CacheMap.prototype.discardItem = function (key) {
    var entry = this._inner[key];
    if (entry) {
      entry.freeWithDestroyTexture();
      return true;
    }
    return false;
  };

  CacheEntry.prototype.freeWithDestroyTexture = function () {
    if (this.cached) {
      this.cached = false;
      var bitmap = this.cache._inner[this.key].item;
      delete this.cache._inner[this.key];
      // following from liply_GC.js
      bitmap.baseTexture.destroy();
      bitmap.baseTexture.hasLoaded = false;
      bitmap.canvas.width = 0;
    }
  };

  CacheMap.prototype.clearExceptSystem = function () {
    var oldCache = this._inner;
    var reg = new RegExp("^img/system/");
    for (var key in oldCache) {
      if (!reg.test(key)) {
        this._inner[key].freeWithDestroyTexture();
      }
    }
  };

  // overwritten
  CacheMap.prototype.clear = function () {
    var keys = Object.keys(this._inner);
    for (var i = 0; i < keys.length; i++) {
        this._inner[keys[i]].freeWithDestroyTexture();
    }
    clearBitmapPool();
  };

  //
  // ImageManager
  //
  ImageManager.discardPicture = function (filename, hue) {
    return this.discardBitmap('img/pictures/', filename, hue);
  };

  ImageManager.discardTileset = function (filename, hue) {
    if (filename === 'Aooni_A2') {
      return true;
    }
    return this.discardBitmap('img/tilesets/', filename, hue);
  };

  ImageManager.discardTilesets = function (tilesetId) {
    var tileset = $dataTilesets[tilesetId];
    if (tileset) {
      for (var i = 0; i < tileset.tilesetNames.length; i++) {
        this.discardTileset(tileset.tilesetNames[i]);
      }
    }
  };

  ImageManager.discardCharacter = function (filename, hue) {
    return this.discardBitmap('img/characters/', filename, hue);
  };

  ImageManager.discardParallax = function(filename, hue) {
    return this.discardBitmap('img/parallaxes/', filename, hue);
  };

  ImageManager.discardBitmap = function (folder, filename, hue) {
    if (filename) {
      var path = folder + encodeURIComponent(filename) + '.png';
      var key = path + ':' + (hue || 0);
      return this.cache.discardItem(key);
    }
    return false;
  };

  //
  // when back to title scene, clear the cache.
  //
  var _Scene_Title_create = Scene_Title.prototype.create;
  Scene_Title.prototype.create = function () {
    if (this.cache) {
      this.cache.clearExceptSystem();
    }
    _Scene_Title_create.call(this);
  };

  //
  // discard title graphics implicitly.
  //
  ImageManager.discardTitles = function () {
    this.discardBitmap('img/titles1/', $dataSystem.title1Name);
    this.discardBitmap('img/titles2/', $dataSystem.title2Name);
  };

  var _Scene_Title_commandNewGame = Scene_Title.prototype.commandNewGame;
  Scene_Title.prototype.commandNewGame = function () {
    ImageManager.discardTitles();
    _Scene_Title_commandNewGame.call(this);
  };

  var _Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
  Scene_Load.prototype.onLoadSuccess = function () {
    ImageManager.discardTitles();
    _Scene_Load_onLoadSuccess.call(this);
  };

  // ------------------------------------------------------------
  // routine to destroy texture (from liply_GC.js)
  // ------------------------------------------------------------

  //
  // routine for detach bitmap
  //
  function detachFromCache(bitmap){
    var cacheData = ImageManager.cache._inner;
    for(var key in cacheData){
      if(cacheData.hasOwnProperty(key)){
        var item = cacheData[key].item;
        if(bitmap === item){
          delete cacheData[key];
          break;
        }
      }
    }
  }

  function freeBitmap(bitmap){
    if(!bitmap)return;
    detachFromCache(bitmap);
    bitmap.baseTexture.destroy();
    bitmap.baseTexture.hasLoaded = false;
    bitmap.canvas.width = 0;
  }

  //
  // destroy Bitmap.snap texture
  //
  var SceneManager_snapForBackground = SceneManager.snapForBackground;
  SceneManager.snapForBackground = function() {
    if(this._backgroundBitmap){
      freeBitmap(this._backgroundBitmap);
      this._backgroundBitmap = null;
    }
    SceneManager_snapForBackground.call(this);
  };

  Bitmap.snap = function(stage) {
    var width = Graphics.width;
    var height = Graphics.height;
    var bitmap = new Bitmap(width, height);
    var context = bitmap._context;
    var renderTexture = PIXI.RenderTexture.create(width, height);
    if (stage) {
      Graphics._renderer.render(stage, renderTexture);
      stage.worldTransform.identity();
      var canvas = null;
      if (Graphics.isWebGL()) {
        canvas = Graphics._renderer.extract.canvas(renderTexture);
      } else {
        canvas = renderTexture.baseTexture._canvasRenderTarget.canvas;
      }
      context.drawImage(canvas, 0, 0);
    } else {
      //TODO: Ivan: what if stage is not present?
    }
    bitmap._setDirty();

    renderTexture.destroy();
    if(Graphics.isWebGL()){
      var textures = Graphics._renderer.textureManager._managedTextures;
      if(textures.indexOf(renderTexture) !== -1)
        textures.splice(textures.indexOf(renderTexture), 1);
    }
    return bitmap;
  };

  //
  // destroy tintTexture of Sprites
  //
  function cleanupTinter(target){
    if(target && target.children) {
      target.children.forEach(function (s){
        if(s._tintTexture) s._tintTexture.destroy();
          cleanupTinter(s);
      });
    }
  }

  function cleanupScene(scene){
    cleanupTinter(scene);
  }

  var beforeScene = null;
  function performCleanupIfChanged(newScene){
    if(beforeScene !== newScene){
      if(beforeScene) cleanupScene(beforeScene);
      beforeScene = newScene;
    }
  }

  var SceneManager_updateScene = SceneManager.updateScene;
  SceneManager.updateScene = function(){
    SceneManager_updateScene.call(this);
    performCleanupIfChanged(this._scene);
  };

  // ------------------------------------------------------------
  // routine to destroy uncached bitmap's texture
  // ------------------------------------------------------------

  var $settingWeatherBitmap = false;
  var _BitmapPool = [];

  var _Weather_createBitmaps = Weather.prototype._createBitmaps;
  Weather.prototype._createBitmaps = function() {
    $settingWeatherBitmap = true;
    _Weather_createBitmaps.call(this);
    $settingWeatherBitmap = false;
  };

  var _willBePutInCache = function (width, height) {
    // either called from ImageManager.loadBitmap or set empty bitmap.
    return width == null && height == null;
  };

  var _shouldNotInPool = function() {
    // set bitmap at first and should remain the bitmap.
    return $settingWeatherBitmap;
  };

  var _Bitmap_initialize = Bitmap.prototype.initialize;
  Bitmap.prototype.initialize = function(width, height) {
    var beInPool = !_willBePutInCache(width, height) && !_shouldNotInPool();
    _Bitmap_initialize.call(this, width, height);
    if (beInPool) {
      _BitmapPool.push(this);
    }
  };

  var clearBitmapPool = function () {
    for (var i = 0; i < _BitmapPool.length; i++) {
      var bitmap = _BitmapPool[i];
      // following from liply_GC.js
      bitmap.baseTexture.destroy();
      bitmap.baseTexture.hasLoaded = false;
      bitmap.canvas.width = 0;
    }
    _BitmapPool = [];
  };

  var _Scene_Base_terminate = Scene_Base.prototype.terminate;
  Scene_Base.prototype.terminate = function () {
    clearBitmapPool();
    _Scene_Base_terminate.call(this);
  };

})();
