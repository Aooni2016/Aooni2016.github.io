//=============================================================================
// AndAppAchievement.js
//=============================================================================
/*:ja
 * @plugindesc アチーブメント機能のプラグインです。
 * @author DeNA
 *
 * @help
 *
 * プラグインコマンド:
 *   AndAppAchievement update <type>
 *
 */
(function() {
    var parameters = PluginManager.parameters('AndAppAchievement');
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'AndAppAchievement') {
            switch (args[0]) {
                case 'update':
                    AndAppAchievementPlugin.update(args[1]);
                    break;
            }
        }
    };
})();
