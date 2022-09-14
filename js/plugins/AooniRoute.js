//=============================================================================
// AooniRoute.js
//=============================================================================

/*:
 * @plugindesc Aooni Library for route decision at Event
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * 
 * This plugin is (only) for Aooni MV Version.
 * This plugin provides Aooni's route decision module.
 * The module is called by map events by event command 'Script'.
 *
 * note: At original version, the function of the module is implemented
 * by event command, but it is very complicated.
 * So this version, implemented by script, to be easier to understand.
 */

/*:ja
 * @plugindesc 青鬼用ライブラリ(イベントのルート決定用)
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * 
 * 青鬼を移植するにあたって、必要な要素をプラグイン化したもののひとつです。
 * このプラグインでは、青鬼のルート設定のための変数を操作する関数を集めた
 * モジュールを提供します。
 * 各マップの並列イベントから呼び出されます。
 * 
 * note:この機能はオリジナルではイベントコマンドで実装されていましたが、
 * 処理が複雑なため、スクリプト化されたものです。
 */


  // AooniRoute module
  // This is the static class for this plugin.
  //
  function AooniRoute() {
    throw new Error('This is a static class');
  }

  // note: variables value means following at the most case
  // (with some exceptions).
  // 0: approach to player(normal)
  // 1: up, 2:right, 3:down, 4:left

  //
  // Map #001 Library (at 1F)
  //
  AooniRoute.map001 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 7; // library compensation (Toshokan Hosei)
    if (px <= 7 && py <= 6) {
      if (x <= 7 && y >= 7 && y <= 13) {
        $gameVariables.setValue(varId, 2);
      } else if (x <= 5 && y >= 19) {
        $gameVariables.setValue(varId, 2);
      } else if (x == 8 && y >= 7) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 7 && py >= 7 && py <= 10) {
      if (x <= 7 && y == 6) {
        $gameVariables.setValue(varId, 2);
      } else if (x <= 7 && y == 11) {
        $gameVariables.setValue(varId, 2);
      } else if (x <= 5 && y >= 19) {
        $gameVariables.setValue(varId, 2);
      } else if (x == 8 && y == 6) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 8 && y == 11) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 7 && py >= 11 && py <= 13) {
      if (x <= 7 && y <= 10) {
        $gameVariables.setValue(varId, 2);
      } else if (x <= 5 && y >= 19) {
        $gameVariables.setValue(varId, 2);
      } else if (x == 8 && y <= 10) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 6 && y == 19) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 7 && py >= 19) {
      if (x <= 7 && y <= 10) {
        $gameVariables.setValue(varId, 2);
      } else if (x <= 5 && y <= 13) {
        $gameVariables.setValue(varId, 2);
      } else if (x == 8 && y <= 10) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 6 && y <= 13) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 12 && py <= 6) {
      if (x >= 12 && (y == 7 || y == 11)) {
        $gameVariables.setValue(varId, 4);
      } else if (x >= 9 && (y == 14 || y == 18)) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 11 && y >= 7 && y <= 13) {
        $gameVariables.setValue(varId, 1);
      } else if (x == 8 && y >= 14) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 12 && py <= 10) {
      if (x >= 12 && y == 6) {
        $gameVariables.setValue(varId, 4);
      } else if (x >= 12 && y == 11) {
        $gameVariables.setValue(varId, 4);
      } else if (x >= 9 && (y == 14 || y == 18)) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 11 && y == 6) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 11 && y >= 11 && y <= 13) {
        $gameVariables.setValue(varId, 1);
      } else if (x == 8 && y >= 14) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 9 && py >= 11 && py <= 13) {
      if (x >= 12 && (y == 6 || y ==10)) {
        $gameVariables.setValue(varId, 4);
      } else if (x >= 9 && (y == 14 || y == 18)) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 11 && y <= 10) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 8 && y >= 14) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 9 && py >= 14 && py <= 17) {
      if (x >= 12 && (y == 6 || y == 10)) {
        $gameVariables.setValue(varId, 4);
      } else if (x >= 9 && (y == 13 || y == 18)) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 11 && y <= 12) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 8 && y == 13) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 8 && y >= 18) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 9 && py >= 18) {
      if (x >= 12 && (y == 6 || y == 10)) {
        $gameVariables.setValue(varId, 4);
      } else if (x >= 9 && (y == 13 || y == 17)) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 11 && y <= 12) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 8 && y <= 17) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #028 Restroom (at 1F)
  // value: 1:left, 2:down
  //
  AooniRoute.map028 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 3; // restroom compensation (Toire Hosei)
    if (px >= 9 && py >= 9) {
      if (x >= 9 && y == 5) {
        $gameVariables.setValue(varId, 1);
      } else if (x == 8 && y == 5) {
        $gameVariables.setValue(varId, 2);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #011 Kitchen (at 1F)
  //
  AooniRoute.map011 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 14; // kitchen compensation (Daidokoro Hosei)
    if (px >= 12 && py >= 6 && py <= 10) {
      if (x <= 7 && y <= 10) {
        $gameVariables.setValue(varId, 3);
      } else if (x <= 8 && y == 11) {
        $gameVariables.setValue(varId, 2);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 12 && py >= 14 && py <= 15) {
      if (x == 10 && y >= 14 && y <= 15) {
        $gameVariables.setValue(varId, 1);
      } else if (x == 10 && y == 13) {
        $gameVariables.setValue(varId, 2);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 10 && py >= 14 && py <= 15) {
      if(x == 12 && y >= 14 && y <= 15) {
        $gameVariables.setValue(varId, 1);
      } else if (x == 12 && y == 13) {
        $gameVariables.setValue(varId, 4);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #007 Astoreroom (at 1F)
  //
  AooniRoute.map007 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 17; // astoreroom compensation (Mono-oki Hosei)
    if (px == 14 && py <= 10) {
      if (x == 14 && y == 12) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 13 && y == 12) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px == 14 && py >= 12) {
      if (x == 14 && y == 10) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 13 && y == 10) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 13 && py == 11) {
      if (x == 15 && y == 11) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 15 && y == 12) {
        $gameVariables.setValue(varId, 4);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 15 && py == 11) {
      if (x == 13 && y == 11) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 13 && y == 12) {
        $gameVariables.setValue(varId, 2);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #012 Jail in the house(Zashiki-rou) (at 1F)
  // value: 1:to(7,10) 2:up 3:to(7,8) 4:down
  //
  AooniRoute.map012page2 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 41; // jail compensation (Rouya Hosei)
    if (y >= 10) {
      if (py <= 8) {
        if (x == 7 && y == 10) {
          $gameVariables.setValue(varId, 2);
        } else {
          $gameVariables.setValue(varId, 1);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (y <= 8) {
      if (py >= 10) {
        if(x == 7 && y == 8) {
          $gameVariables.setValue(varId, 4);
        } else {
          $gameVariables.setValue(varId, 3);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  AooniRoute.map012page4 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 41; // jail compensation (Rouya Hosei)
    if (py <= 8) {
      if (y >= 10) {
        if (x == 7) {
          if (y == 10) {
            $gameVariables.setValue(varId, 3);
            if(!$gameSwitches.value(24)){ // door not opened
              // open the door
              $gameSwitches.setValue(24, true);
              AudioManager.playSe({name:'027-Door04', volume:100, pitch:100});
            }
          } else {
            $gameVariables.setValue(varId, 3);
          }
        } else {
          $gameVariables.setValue(varId, 1);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (py >= 10) {
      if (y <= 8) {
        if(x <= 7) {
          if(y == 8) {
            $gameVariables.setValue(varId, 1);
            if(!$gameSwitches.value(24)){ // door not opened
              // open the door
              $gameSwitches.setValue(24, true);
              AudioManager.playSe({name:'027-Door04', volume:100, pitch:100});
            }
          } else {
            $gameVariables.setValue(varId, 1);
          }
        } else {
          $gameVariables.setValue(varId, 3);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #013 2F
  //
  AooniRoute.map013 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 18; // 2F compensation (2F Hosei)
    if (px >= 10 && px <= 11 && py == 6) {
      if (x == 9 && y == 6) {
        $gameVariables.setValue(varId, 1);
      } else if (x == 9 && y == 5) {
        $gameVariables.setValue(varId, 2);
      } else if (y == 14) {
        if (x > 9) {
          $gameVariables.setValue(varId, 4);
        } else if (x < 9) {
          $gameVariables.setValue(varId, 2);
        } else { // x == 9
          $gameVariables.setValue(varId, 1);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 7 && py <= 5) {
      if (x <= 7 && y == 14) {
        $gameVariables.setValue(varId, 2);
      } else if (x == 8 && y == 14) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 7 && py >= 14) {
      if (x <= 7 && y == 5) {
        $gameVariables.setValue(varId, 2);
      } else if (x == 8 && y == 5) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 10 && py <= 5) {
      if (x >= 10 && y == 14) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 9 && y == 14) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 10 && py >= 14) {
      if (x >= 10 && y == 5) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 9 && y == 5) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #025 Child room (2F)
  //
  AooniRoute.map025 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 19; // Child room compensation (Kodomo beya Hosei)
    if (px == 5 && py >= 10) {
      if(x == 8 && y >= 10) {
        $gameVariables.setValue(varId, 1);
      } else if (x == 8 && y == 9) {
        $gameVariables.setValue(varId, 4);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #008 Piano (2F)
  //
  AooniRoute.map008 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 40; // Piano compensation (Piano Hosei)
    if (y == 7) {
      if (x >= 9 && x <= 10) {
        if(px >= 9 && px <= 10 && py >= 8) {
          $gameVariables.setValue(varId, 2);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (x == 11) {
        if (px >= 9 && px <= 10 && py >= 8) {
          $gameVariables.setValue(varId, 3);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (y == 8) {
      if (x == 8) {
        if (px >= 10 && py == 8) {
          $gameVariables.setValue(varId, 3);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (x == 11) {
        if (px <= 8 && py == 8) {
          $gameVariables.setValue(varId, 3);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (y == 9) {
      if (x == 8) {
        if (px >= 9 && px <= 10 && py <= 7) {
          $gameVariables.setValue(varId, 1);
        } else if (px >= 10 && py == 8) {
          $gameVariables.setValue(varId, 2);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (x >= 9 && x <= 10) {
        if (px >= 9 && px <= 10 && py <= 7) {
          $gameVariables.setValue(varId, 4);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (x == 11) {
        if (px <= 8 && py == 8) {
          $gameVariables.setValue(varId, 4);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (y == 4) { // added by Sasuke KANNAZUKI
      if (x == 11 && px >= 12) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #017 Basement
  //
  AooniRoute.map017 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 21; // Basement compensation (Chikashitsu Hosei)
    if (px >= 10) {
      if (py <= 9) {
        if (x >= 10 && (y == 11 || y == 16)) {
          $gameVariables.setValue(varId, 4);
        } else if (x == 9 && (y == 11 || y == 16)) {
          $gameVariables.setValue(varId, 1);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (py >= 11 && py <= 14) {
        if (x >= 10 && (y == 9 || y == 16)) {
          $gameVariables.setValue(varId, 4);
        } else if (x == 9 && y == 9) {
          $gameVariables.setValue(varId, 3);
        } else if (x == 9 && y == 16) {
          $gameVariables.setValue(varId, 1);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (py >= 16) {
        if (x >= 10 && (y == 9 || y == 14)) {
          $gameVariables.setValue(varId, 4);
        } else if (x == 9 && (y == 9 || y == 14)) {
          $gameVariables.setValue(varId, 3);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #018 Basement Jail
  // value: 1:to(16,9) 2:to(16,11)
  //
  AooniRoute.map018 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 41; // jail compensation (Rouya Hosei)
    if (y >= 11) {
      if (py <= 9) {
        if (x == 16 && y == 11) {
          $gameVariables.setValue(varId, 1);
          if (!$gameSwitches.value(37)) { // door not opened
            // open the door
            $gameSwitches.setValue(37, true);
            AudioManager.playSe({name:'027-Door04', volume:100, pitch:100});
          }
        } else {
          $gameVariables.setValue(varId, 2);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (y <= 9) {
      if (py >= 11) {
        if (x == 16 && y == 9) {
          $gameVariables.setValue(varId, 2);
          if (!$gameSwitches.value(37)) { // door not opened
            // open the door
            $gameSwitches.setValue(37, true);
            AudioManager.playSe({name:'027-Door04', volume:100, pitch:100});
          }
        } else {
          $gameVariables.setValue(varId, 1);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  // --------------------------------------------
  //  2nd House (Bekkan)
  // --------------------------------------------

  //
  // Map #045 Astoreroom (2nd House)
  //
  AooniRoute.map045 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 17; // astoreroom compensation (Mono-oki Hosei)
    if (px == 13 && py <= 13) {
      if (x == 13 && y == 15) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 12 && y == 15) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px == 13 && py >= 15) {
      if (x == 13 && y == 13) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 12 && y == 13) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 12 && py == 14) {
      if(x == 14 && y == 14) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 14 && y == 15) {
        $gameVariables.setValue(varId, 4);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 14 && py == 14) {
      if (x == 12 && y == 14) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 12 && y == 15) {
        $gameVariables.setValue(varId, 2);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #046 Upper side
  //
  AooniRoute.map046 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 7; // library compensation (Toshokan Hosei)
    if (y == 9) {
      if (x == 4) {
        $gameVariables.setValue(varId, 1);
      } else if (x == 15) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (y == 8) {
      if (px >= 9) {
        if (x == 4) {
          $gameVariables.setValue(varId, 2);
        } else if (x == 15) {
          $gameVariables.setValue(varId, 4);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #047 2nd floor
  //
  AooniRoute.map047 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 17; // astoreroom compensation (Mono-oki Hosei)
    if (x >= 10 && x <= 11 && y >= 13) {
      if (py <= 12) {
        $gameVariables.setValue(varId, 2);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (x == 12 && y >= 13) {
      if (py <= 6) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (x == 12 && y >= 6 && y <= 11) {
      if (px <= 8) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (x == 12 && y == 5) {
      if (px <= 8) {
        $gameVariables.setValue(varId, 4);
      } else if (px >= 11) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (x <= 11 && y <= 5) {
      if (py >= 9) {
        $gameVariables.setValue(varId, 2);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #056 dining room (2nd floor)
  //
  AooniRoute.map056 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 21; // Basement compensation (Chikashitsu Hosei)
    if (py >= 6) {
      if (px <= 8) {
        if (x >= 13 && y >= 7) {
          $gameVariables.setValue(varId, 1);
        } else if (x >= 8 && y == 6) {
          $gameVariables.setValue(varId, 4);
        } else if (x == 7 && y == 6) {
          $gameVariables.setValue(varId, 3);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (px >= 12) {
        if (x <= 7 && y >= 7) {
          $gameVariables.setValue(varId, 1);
        } else if (x <= 12 && y == 6) {
          $gameVariables.setValue(varId, 2);
        } else if (x == 13 && y == 6) {
          $gameVariables.setValue(varId, 3);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #052 3rd floor
  //
  AooniRoute.map052 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 17; // astoreroom compensation (Mono-oki Hosei)
    if (x == 9 && y >= 6) {
      if (px <= 8) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (x == 9 && y == 5) {
      if (px <= 8) {
        $gameVariables.setValue(varId, 4);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #059 room at 3rd floor
  //
  AooniRoute.map059 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 17; // astoreroom compensation (Mono-oki Hosei)
    if (px == 9 && py <= 9) {
      if (x == 9 && y == 11) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 8 && y == 11) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px == 9 && py >= 11) {
      if (x == 9 && y == 9) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 8 && y == 9) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 8 && py == 10) {
      if (x == 10 && y == 10) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 10 && y == 11) {
        $gameVariables.setValue(varId, 4);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 10 && py == 9) {
      if (x == 8 && y == 10) {
        $gameVariables.setValue(varId, 3);
      } else if (x == 8 && y == 11) {
        $gameVariables.setValue(varId, 2);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #002 corridor at basement
  //
  AooniRoute.map002 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 7; // library compensation (Toshokan Hosei)
    if (x == 11 && y == 13) {
      $gameVariables.setValue(varId, 1);
    } else if (x == 11 && y == 12) {
      if (py >= 13) {
        $gameVariables.setValue(varId, 2);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #039 basement jail
  //
  AooniRoute.map039 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 41; // jail compensation (Rouya Hosei)
    if (y >= 21) {
      if (py <= 19) {
        if (x == 15 && y == 21) {
          $gameVariables.setValue(varId, 1);
          if(!$gameSwitches.value(131)) { // door not opened
            // open the door
            $gameSwitches.setValue(131, true);
            AudioManager.playSe({name:'027-Door04', volume:100, pitch:100});
          }
        } else {
          $gameVariables.setValue(varId, 2);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (y <= 19) {
      if (py >= 21) {
        if (x == 15 && y == 19) {
          $gameVariables.setValue(varId, 2);
          if(!$gameSwitches.value(131)) { // door not opened
            // open the door
            $gameSwitches.setValue(131, true);
            AudioManager.playSe({name:'027-Door04', volume:100, pitch:100});
          }
        } else {
          $gameVariables.setValue(varId, 1);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  // --------------------------------------------
  //  Outdoor (2nd House to 3rd House)
  // --------------------------------------------

  //
  // Map #048 Outdoor 2
  //
  AooniRoute.map048 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 7; // library compensation (Toshokan Hosei)
    if (px == 5 && py >= 20 && py <= 23) {
      if (x == 5 && y == 14) {
        $gameVariables.setValue(varId, 2);
      } else if (x == 6 && y == 14) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  // --------------------------------------------
  //  3rd House (Haikyo)
  // --------------------------------------------

  //
  // Map #049 1st floor
  //
  AooniRoute.map049 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 7; // library compensation (Toshokan Hosei)
    if (x == 7 && y == 8) {
      if (px >= 7) {
        $gameVariables.setValue(varId, 4);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (x == 6 && y == 8) {
      if(px >= 7) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px == 21 && py == 16) {
      if (x == 21 && y == 18) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 20 && y == 18) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px == 21 && py == 18) {
      if (x == 21 && y == 16) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 20 && y == 16) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #058 Church (1st floor)
  //
  AooniRoute.map058 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 7; // library compensation (Toshokan Hosei)
    if (px <= 8) {
      if (py <= 7) {
        if (x <= 8) {
          if (x == 7 && y == 8) {
            $gameVariables.setValue(varId, 1);
          } else if (x == 8 && y == 8) {
            $gameVariables.setValue(varId, 4);
          } else if ([11,13,15].contains(y)) {
            $gameVariables.setValue(varId, 2);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 9) {
          if (y >= 10 && y <= 14) {
            $gameVariables.setValue(varId, 1);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 13) {
          if (y <= 7) {
            $gameVariables.setValue(varId, 3);
          } else if (y == 8) {
            $gameVariables.setValue(varId, 4);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (py >= 8 && py <= 9) {
        if (x <= 8) {
          if ([11,13,15].contains(y)) {
            $gameVariables.setValue(varId, 2);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 9) {
          if (y >= 10 && y <= 15) {
            $gameVariables.setValue(varId, 1);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (py == 11) {
        if (x <= 8) {
          if ([9,13,15].contains(y)) {
            $gameVariables.setValue(varId, 2);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 9) {
          if (y >= 9 && y <= 10) {
            $gameVariables.setValue(varId, 3);
          } else if (y >= 12) {
            $gameVariables.setValue(varId, 1);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (py == 13) {
        if (x <= 8) {
          if ([9,11,15].contains(y)) {
            $gameVariables.setValue(varId, 2);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 9) {
          if (y <= 12) {
            $gameVariables.setValue(varId, 3);
          } else if (y >= 14) {
            $gameVariables.setValue(varId, 1);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (py >= 15) {
        if (x <= 8) {
          if ([9,11,13].contains(y)) {
            $gameVariables.setValue(varId, 2);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 9) {
          if (y <= 14) {
            $gameVariables.setValue(varId, 3);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 12) {
      if (py <= 7) {
        if (x >= 12) {
          if (x == 13 && y == 8) {
            $gameVariables.setValue(varId, 1);
          } else if (x == 12 && y == 8) {
            $gameVariables.setValue(varId, 2);
          } else if ([11,13,15].contains(y)) {
            $gameVariables.setValue(varId, 4);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 11) {
          if (y >= 10 && y <= 14) {
            $gameVariables.setValue(varId, 1);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 7) {
          if (y <= 7) {
            $gameVariables.setValue(varId, 3);
          } else if (y == 8) {
            $gameVariables.setValue(varId, 2);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (py >= 8 && py <= 9) {
        if (x >= 12) {
          if ([11,13,15].contains(y)) {
            $gameVariables.setValue(varId, 4);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 11) {
          if (y >= 10 && y <= 15) {
            $gameVariables.setValue(varId, 1);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (py == 11) {
        if (x >= 12) {
          if ([9,13,15].contains(y)) {
            $gameVariables.setValue(varId, 4);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 11) {
          if (y >= 9 && y <= 10) {
            $gameVariables.setValue(varId, 3);
          } else if (y >= 12) {
            $gameVariables.setValue(varId, 1);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (py == 13) {
        if (x >= 12) {
          if ([9,11,15].contains(y)) {
            $gameVariables.setValue(varId, 4);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 11) {
          if (y <= 12) {
            $gameVariables.setValue(varId, 3);
          } else if (y >= 14) {
            $gameVariables.setValue(varId, 1);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (py >= 15) {
        if (x >= 12) {
          if ([9,11,13].contains(y)) {
            $gameVariables.setValue(varId, 4);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 11) {
          if (y <= 14) {
            $gameVariables.setValue(varId, 3);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #050 2nd floor
  //
  AooniRoute.map050 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 7; // library compensation (Toshokan Hosei)
    if (px <= 3 && py == 6) {
      if (x == 4 && y == 6) {
        $gameVariables.setValue(varId, 1);
      } else if (x == 4 && y == 5) {
        $gameVariables.setValue(varId, 4);
      } else if (x <= 3 && y == 13) {
        $gameVariables.setValue(varId, 2);
      } else if (x == 4 && y == 13) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 3 && py <= 5) {
      if (x <= 3 && y == 13) {
        $gameVariables.setValue(varId, 2);
      } else if (x == 4 && y == 13) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 3 && py >= 13) {
      if (x <= 3 && y == 5) {
        $gameVariables.setValue(varId, 2);
      } else if (x == 4 && y == 5) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #062 study (2nd floor)
  //
  AooniRoute.map062 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 7; // library compensation (Toshokan Hosei)
    if (py <= 7) {
      if (px <= 4) {
        if (x == 14 && y == 7) {
          $gameVariables.setValue(varId, 3);
        } else if (x == 14 && y == 8) {
          $gameVariables.setValue(varId, 4);
        } else if (x <= 4) {
          if (y == 9 || y == 13) {
            $gameVariables.setValue(varId, 2);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else if (x == 5) {
          if (y >= 9) {
            $gameVariables.setValue(varId, 1);
          } else {
            $gameVariables.setValue(varId, 0);
          }
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (px <= 7) {
        if (x == 14 && y <= 7) {
          $gameVariables.setValue(varId, 3);
        } else if (x == 14 && y == 8) {
          $gameVariables.setValue(varId, 4);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (px >= 14) {
        if (x == 7 && y == 7) {
          $gameVariables.setValue(varId, 3);
        } else if (x == 7 && y == 8) {
          $gameVariables.setValue(varId, 2);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 4 && py <= 8) {
      if (x <= 4) {
        if (y == 9 || y == 13) {
          $gameVariables.setValue(varId, 2);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (x == 5) {
        if (y >= 9) {
          $gameVariables.setValue(varId, 1);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 4 && py >= 9 && py <= 12) {
      if (x <= 4) {
        if (y == 8 || y == 13) {
          $gameVariables.setValue(varId, 2);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (x == 5) {
        if (y <= 8) {
          $gameVariables.setValue(varId, 3);
        } else if (y >= 13) {
          $gameVariables.setValue(varId, 1);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px <= 4 && py >= 13) {
      if (x <= 4) {
        if (y == 8 || y == 12) {
          $gameVariables.setValue(varId, 2);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else if (x == 5) {
        if (y <= 12) {
          $gameVariables.setValue(varId, 3);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #044 basement jail
  //
  AooniRoute.map044 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 7; // library compensation (Toshokan Hosei)
    if (px >= 15) {
      if (x == 14) {
        if (y == 16) {
          $gameVariables.setValue(varId, 3);
        } else if (y == 17) {
          $gameVariables.setValue(varId, 2);
        } else {
          $gameVariables.setValue(varId, 0);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (x == 16) {
      if (y == 16) {
        $gameVariables.setValue(varId, 3);
      } else if (y == 17) {
        $gameVariables.setValue(varId, 4);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #068 Aooni Zoo
  // value: 1:to(17,3) 2:to(17,5)
  // note: this routine is used by 2 events.
  //
  AooniRoute.map068 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 41; // jail compensation (Rouya Hosei)
    if (py <= 3) {
      if (y >= 4) {
        if (x == 17) {
          if (y == 5) {
            $gameVariables.setValue(varId, 1);
            if(!$gameSwitches.value(149)){ // door not opened
              // open the door
              $gameSwitches.setValue(149, true);
              AudioManager.playSe({name:'027-Door04', volume:100, pitch:100});
            }
          } else {
            $gameVariables.setValue(varId, 1);
          }
        } else {
          $gameVariables.setValue(varId, 2);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (py >= 5) {
      if (y <= 4) {
        if (x == 17) {
          if (y == 3) {
            $gameVariables.setValue(varId, 2);
            if(!$gameSwitches.value(149)){ // door not opened
              // open the door
              $gameSwitches.setValue(149, true);
              AudioManager.playSe({name:'027-Door04', volume:100, pitch:100});
            }
          } else {
            $gameVariables.setValue(varId, 2);
          }
        } else {
          $gameVariables.setValue(varId, 1);
        }
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // Map #074 a room at right down
  //
  AooniRoute.map074 = function(eventId) {
    var x = $gameMap.event(eventId).x;
    var y = $gameMap.event(eventId).y;
    var px = $gamePlayer.x;
    var py = $gamePlayer.y;
    var varId = 7; // library compensation (Toshokan Hosei)
    if (px <= 13 && py == 13) {
      if (x == 15 && y == 13) {
        $gameVariables.setValue(varId, 1);
      } else if (x == 15 && y == 12) {
        $gameVariables.setValue(varId, 4);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px == 14 && py <= 12) {
      if (x == 14 && y == 14) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 13 && y == 14) {
        $gameVariables.setValue(varId, 1);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px >= 15 && py == 13) {
      if (x == 13 && y == 13) {
        $gameVariables.setValue(varId, 1);
      } else if (x == 13 && y == 12) {
        $gameVariables.setValue(varId, 2);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else if (px == 14 && py >= 14) {
      if (x == 14 && y <= 12) {
        $gameVariables.setValue(varId, 4);
      } else if (x == 13 && y == 12) {
        $gameVariables.setValue(varId, 3);
      } else {
        $gameVariables.setValue(varId, 0);
      }
    } else {
      $gameVariables.setValue(varId, 0);
    }
  };
