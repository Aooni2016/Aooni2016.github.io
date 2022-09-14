//=============================================================================
// ConfigureRootElement.js
// Version: 1.0.0
//----------------------------------------------------------------------------
// Copyright (c) 2016 DeNA
// RPGMV 1.0.0
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc v1.00 任意のroot要素にゲーム本体の要素を追加できるようにするpluginです
 * @author DeNA
 *
 * @param ---General---
 * @default
 *
 * @param Root Element Id
 * @default
 * 
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * 
 * このpluginはgameの要素を追加するroot要素を指定できます。
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.00:
 * - Finished plugin!
 */
//=============================================================================

(function() {
    //-----------------------------------------------------------------------------
    // setup

    var Parameters = PluginManager.parameters('ConfigureRootElement');
    var RootElementId = String(Parameters['Root Element Id']);
    var GAME_ROOT_ELEMENT_NODE_KEY = 'ConfigureRootElement_Root_Element_Node_Key';
    try {
        if (RootElementId) {
            PluginManager.setParameters(GAME_ROOT_ELEMENT_NODE_KEY, document.getElementById(RootElementId));
        } else if (!(PluginManager.parameters(GAME_ROOT_ELEMENT_NODE_KEY) instanceof HTMLElement)) {
            PluginManager.setParameters(GAME_ROOT_ELEMENT_NODE_KEY, document.body);
        }
    } catch (e) {
        console.info('Caution! set default root element, document.body.');
        PluginManager.setParameters(GAME_ROOT_ELEMENT_NODE_KEY, document.body);
    }
 
    //-----------------------------------------------------------------------------
    // override Graphics

    /**
     * Converts an x coordinate on the page to the corresponding
     * x coordinate on the canvas area.
     *
     * @static
     * @method pageToCanvasX
     * @param {Number} x The x coordinate on the page to be converted
     * @return {Number} The x coordinate on the canvas area
     */
    Graphics.pageToCanvasX = function(x) {
        if (this._canvas) {
            var left = this._canvas.getBoundingClientRect().left;
            return Math.round((x - left) / this._realScale);
        } else {
            return 0;
        }
    };

    /**
     * @static
     * @method _createErrorPrinter
     * @private
     */
    Graphics._createErrorPrinter = function() {
        this._errorPrinter = document.createElement('p');
        this._errorPrinter.id = 'ErrorPrinter';
        this._updateErrorPrinter();
        PluginManager.parameters(GAME_ROOT_ELEMENT_NODE_KEY).appendChild(this._errorPrinter);
    };
 
    /**
     * @static
     * @method _createCanvas
     * @private
     */
    Graphics._createCanvas = function() {
        this._canvas = document.createElement('canvas');
        this._canvas.id = 'GameCanvas';
        this._updateCanvas();
        PluginManager.parameters(GAME_ROOT_ELEMENT_NODE_KEY).appendChild(this._canvas);
    };

    /**
     * @static
     * @method _createVideo
     * @private
     */
    Graphics._createVideo = function() {
        this._video = document.createElement('video');
        this._video.id = 'GameVideo';
        this._video.style.opacity = 0;
        this._updateVideo();
        PluginManager.parameters(GAME_ROOT_ELEMENT_NODE_KEY).appendChild(this._video);
    };

    /**
     * @static
     * @method _createUpperCanvas
     * @private
     */
    Graphics._createUpperCanvas = function() {
        this._upperCanvas = document.createElement('canvas');
        this._upperCanvas.id = 'UpperCanvas';
        this._updateUpperCanvas();
        PluginManager.parameters(GAME_ROOT_ELEMENT_NODE_KEY).appendChild(this._upperCanvas);
    };

    /**
     * @static
     * @method _createModeBox
     * @private
     */
    Graphics._createModeBox = function() {
        var box = document.createElement('div');
        box.id = 'modeTextBack';
        box.style.position = 'absolute';
        box.style.left = '5px';
        box.style.top = '5px';
        box.style.width = '119px';
        box.style.height = '58px';
        box.style.background = 'rgba(0,0,0,0.2)';
        box.style.zIndex = 9;
        box.style.opacity = 0;

        var text = document.createElement('div');
        text.id = 'modeText';
        text.style.position = 'absolute';
        text.style.left = '0px';
        text.style.top = '41px';
        text.style.width = '119px';
        text.style.fontSize = '12px';
        text.style.fontFamily = 'monospace';
        text.style.color = 'white';
        text.style.textAlign = 'center';
        text.style.textShadow = '1px 1px 0 rgba(0,0,0,0.5)';
        text.innerHTML = this.isWebGL() ? 'WebGL mode' : 'Canvas mode';

        PluginManager.parameters(GAME_ROOT_ELEMENT_NODE_KEY).appendChild(box);
        box.appendChild(text);

        this._modeBox = box;
    };

    /**
     * @static
     * @method _createFontLoader
     * @param {String} name
     * @private
     */
    Graphics._createFontLoader = function(name) {
        var div = document.createElement('div');
        var text = document.createTextNode('.');
        div.style.fontFamily = name;
        div.style.fontSize = '0px';
        div.style.color = 'transparent';
        div.style.position = 'absolute';
        div.style.margin = 'auto';
        div.style.top = '0px';
        div.style.left = '0px';
        div.style.width = '1px';
        div.style.height = '1px';
        div.appendChild(text);
        PluginManager.parameters(GAME_ROOT_ELEMENT_NODE_KEY).appendChild(div);
    };

    /**
     * @static
     * @method _disableTextSelection
     * @private
     */
    Graphics._disableTextSelection = function() {
        var body = PluginManager.parameters(GAME_ROOT_ELEMENT_NODE_KEY);
        body.style.userSelect = 'none';
        body.style.webkitUserSelect = 'none';
        body.style.msUserSelect = 'none';
        body.style.mozUserSelect = 'none';
    };

    /**
     * @static
     * @method _disableContextMenu
     * @private
     */
    Graphics._disableContextMenu = function() {
        var elements = PluginManager.parameters(GAME_ROOT_ELEMENT_NODE_KEY).getElementsByTagName('*');
        var oncontextmenu = function() { return false; };
        for (var i = 0; i < elements.length; i++) {
            elements[i].oncontextmenu = oncontextmenu;
        }
    };

    /**
     * @static
     * @method _requestFullScreen
     * @private
     */
    Graphics._requestFullScreen = function() {
        var element = PluginManager.parameters(GAME_ROOT_ELEMENT_NODE_KEY);
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };
})();
