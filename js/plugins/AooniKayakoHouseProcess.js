//=============================================================================
// AooniKayakoHouseProcess.js
//=============================================================================

/*:
 * @plugindesc At Aooni Sadako vs Kayako Mode, set blackout pictures
 * @author Sasuke KANNAZUKI
 *
 * @requiredAssets img/pictures/sdky_cover2F_bedroom2
 * @requiredAssets img/pictures/sdky_cover2F_bedroom
 * @requiredAssets img/pictures/sdky_cover2F_studyroom
 * @requiredAssets img/pictures/sdky_cover1F_living
 * @requiredAssets img/pictures/sdky_cover1F_dining
 * @requiredAssets img/pictures/sdky_cover1F_closet
 * @requiredAssets img/pictures/sdky_cover1F_bathroom
 * @requiredAssets img/pictures/sdky_cover1F_bathroom2
 * @requiredAssets img/pictures/sdky_cover1F_toilet
 * @requiredAssets img/pictures/sdky_cover1F_toilet2
 *
 * @help
 * This plugin is for Sadako vs. Kayako mode of Aooni.
 * At the map of Kayako's house (1st and 2nd floor), several shadows appear.
 * This plugin interlocks the picture the scroll of map.
 * 
 * Plugin Commands:
 * AooniKayakoHouseProcess preload // preload pictures in cache.
 * AooniKayakoHouseProcess 1    // set shadows for 1st floor
 * AooniKayakoHouseProcess 2    // set shadows for 2nd floor
 * AooniKayakoHouseProcess 0    // reset shadows. call when get out of the house.
 * AooniKayakoHouseProcess X    // reset shadows and discard pictures from memory.
 *   // call when finally exit from the house.
 * AooniKayakoHouseProcess hide 4  // hide picture #4.
 * AooniKayakoHouseProcess appear 4  // appear picture #4.
 * **NOTE**
 * This plugin requires InterlockPicuture.js and DiscardImageFromCache.js.
 * Put those plugins over the list of plugin lists of this.
 */
/*:ja
 * @plugindesc 青鬼「貞子vs伽椰子モード」で伽椰子邸のピクチャを設定します。
 * @author 神無月サスケ
 *
 * @requiredAssets img/pictures/sdky_cover2F_bedroom2
 * @requiredAssets img/pictures/sdky_cover2F_bedroom
 * @requiredAssets img/pictures/sdky_cover2F_studyroom
 * @requiredAssets img/pictures/sdky_cover1F_living
 * @requiredAssets img/pictures/sdky_cover1F_dining
 * @requiredAssets img/pictures/sdky_cover1F_closet
 * @requiredAssets img/pictures/sdky_cover1F_bathroom
 * @requiredAssets img/pictures/sdky_cover1F_bathroom2
 * @requiredAssets img/pictures/sdky_cover1F_toilet
 * @requiredAssets img/pictures/sdky_cover1F_toilet2
 *
 * @help
 * このプラグインは青鬼「貞子vs伽椰子モード」用のものです。
 * 伽椰子邸の１階と２階では、影がピクチャで表示されます。
 * このプラグインは、影をマップ移動に適切に連動させます。
 * 
 * プラグインコマンド:
 * AooniKayakoHouseProcess preload // 画像を先読みします。
 *   // 必要に応じてこの後コモンイベント「画像読み込み待ち」を呼び出して下さい
 * AooniKayakoHouseProcess 1    // 伽椰子邸１階初期化時に呼び出してください。
 * AooniKayakoHouseProcess 2    // 伽椰子邸２階初期化時に呼び出してください。
 * AooniKayakoHouseProcess 0    // 伽椰子邸から出る時に呼び出してください。
 * AooniKayakoHouseProcess X    // 伽椰子邸から出て二度と（または当分）
 *     // 戻らない時に呼び出してください。
 *     // 画像をキャッシュメモリからクリアします。
 * 
 * AooniKayakoHouseProcess hide 4  // ピクチャ4番の不透明度を0にします。
 * AooniKayakoHouseProcess appear 4  // ピクチャ4番の不透明度を255にします。
 * 注意：このプラグインは InterlockPicuture.js と DiscardImageFromCache.js を
 * 必要とします。
 */
(function() {
  //
  // process plugin commands
  //
  var _Game_Interpreter_pluginCommand =
   Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'AooniKayakoHouseProcess') {
      switch (args[0]) {
      case 'preload':
        loadPicturesToCache();
        break;
      case '0':
        resetKayakoHouse();
        break;
      case '1':
        set1stFloor();
        break;
      case '2':
        set2ndFloor();
        break;
      case 'X':
        resetKayakoHouse();
        discardPicturesFromCache();
        break;
      case 'appear':
        appearPicture((Number(args[1]) || 0), (Number(args[2]) || 20));
        break;
      case 'hide':
        hidePicture(Number(args[1]) || 0, (Number(args[2]) || 20));
        break;
      }
    }
  };

  //
  // picture main settings
  // [picturename , x, y] : where (x, y) 's origin is (0, 0).
  //
  var shadowPictureInfo = [ null,
    ['sdky_cover2F_bedroom2' ,  408, 1080],
    ['sdky_cover2F_bedroom'  ,  408,  648],
    ['sdky_cover2F_studyroom',  268,   72],
    null,   // #4 is reserved for 2F.
    ['sdky_cover1F_living'   , 1080,  312],
    ['sdky_cover1F_dining'   ,  408,  792],
    ['sdky_cover1F_closet'   ,  792, 1224],
    ['sdky_cover1F_bathroom' ,  504, 1224],
    ['sdky_cover1F_bathroom2',  504, 1464],
    ['sdky_cover1F_toilet'   ,  456, 1656],
    ['sdky_cover1F_toilet2'  ,  648, 1656],
    null,   // #12 is reserved for 1F.
    null,   // #13 is reserved for 1F.
    null    // #14 is reserved for 1F.
  ];

  var adjustX = function (x) {
    return x + $gameMap.adjustX(0) * $gameMap.tileWidth();
  };

  var adjustY = function (y) {
    return y + $gameMap.adjustY(0) * $gameMap.tileHeight();
  };

  //
  // manipulate picture cache in ImageManager.
  //
  var loadPicturesToCache = function() {
    for (var i = 1; i <= 14; i++) {
      var info = shadowPictureInfo[i];
      if (info) {
        ImageManager.loadPicture(info[0]);
      }
    }
  };

  var discardPicturesFromCache = function () {
    for (var i = 1; i <= 14; i++) {
      var info = shadowPictureInfo[i];
      if (info) {
        ImageManager.discardPicture(info[0]);
      }
    }
  };

  //
  // initial settings
  //
  var set2ndFloor = function () {
    for (var i = 1; i <= 4; i++) {
      var info = shadowPictureInfo[i];
      if (info) {
        $gameScreen.showPicture(i, info[0], 0, adjustX(info[1]),
         adjustY(info[2]), 100, 100, 255, 0);
        $gameScreen.setPictureInterlock(i, 1);
      }
    }
    for (i = 5; i <= 14; i++) {
      $gameScreen.setPictureInterlock(i, 0);
      $gameScreen.erasePicture(i);
    }
  };

  var set1stFloor = function () {
    for (var i = 1; i <= 4; i++) {
      $gameScreen.setPictureInterlock(i, 0);
      $gameScreen.erasePicture(i);
    }
    for (i = 5; i <= 14; i++) {
      var info = shadowPictureInfo[i];
      if (info) {
        $gameScreen.showPicture(i, info[0], 0, adjustX(info[1]),
         adjustY(info[2]), 100, 100, 255, 0);
        $gameScreen.setPictureInterlock(i, 1);
      }
    }
  };

  //
  // reset process
  //
  var resetKayakoHouse = function () {
    for (var i = 1; i <= 14; i++) {
      $gameScreen.setPictureInterlock(i, 0);
      $gameScreen.erasePicture(i);
    }
  };

  //
  // hide and appear by changing opacity
  //
  var hidePicture = function (pictureId, frame) {
    var picture = $gameScreen.picture(pictureId);
    var info = shadowPictureInfo[pictureId];
    if (picture && info) {
      $gameScreen.setPictureInterlock(pictureId, 0);
      picture.move(0, adjustX(info[1]), adjustY(info[2]), 100, 100,
       0, 0, frame);
      $gameScreen.setPictureInterlock(pictureId, 1);
    }
  };

  var appearPicture = function (pictureId, frame) {
    var picture = $gameScreen.picture(pictureId);
    var info = shadowPictureInfo[pictureId];
    if (picture && info) {
      $gameScreen.setPictureInterlock(pictureId, 0);
      picture.move(0, adjustX(info[1]), adjustY(info[2]), 100, 100,
       255, 0, frame);
      $gameScreen.setPictureInterlock(pictureId, 1);
    }
  };

})();
