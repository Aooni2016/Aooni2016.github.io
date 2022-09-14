//=============================================================================
// AndAppCapture.js
//=============================================================================
/*:ja
 * @plugindesc 録画機能のプラグインです。
 * @author DeNA
 *
 * @help
 *
 * プラグインコマンド:
 *   AndAppCapture start     # 録画開始
 *   AndAppCapture finish    # 録画終了
 *
 */
(function() {
    var parameters = PluginManager.parameters('AndAppCapture');
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'AndAppCapture') {
            switch (args[0]) {
                case 'start':
                    AndAppCapturerPlugin.start();
                    break;
                case 'finish':
                    AndAppCapturerPlugin.finish(args[1]);
                    break;
            }
        }
    };
 
})();
