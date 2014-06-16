define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ModifierChain = require('famous/modifiers/ModifierChain');

    var Draggable     = require('famous/modifiers/Draggable');

    var ToolView      = require('views/ToolView');

    function MenuView() {
        View.apply(this, arguments);
        
        var draggable = new Draggable();

        _createToolMenu.call(this, draggable);
        // _createSquareTool.call(this, draggable);
        // _createHeaderTool.call(this, draggable);
        _createFooterTool.call(this, draggable);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.DEFAULT_OPTIONS = {
        topOffset: 50
    };
    
    function _createToolMenu(draggable) {
        this.toolMenu = new Surface({
            size: [this.options.menuSize, undefined],
            properties: {
                backgroundColor: '#FFFFF5',
                zIndex: 1,
                boxShadow: "5px 5px 15px rgba(50, 50, 50, .5)",
                height: this.options.topOffset
            }
        });
                
        this.toolMenuModifier = new StateModifier({
            opacity: 0.25,
            transform: Transform.translate(0, 0, 1)
        });
        
        draggable.subscribe(this.toolMenu);

        this.add(this.toolMenuModifier).add(draggable).add(this.toolMenu);
    }
    
    function _createSquareTool(draggable) {
        this.squareToolView = new ToolView();
        this.squareToolViewModifier = new StateModifier({
            transform: Transform.translate(0, this.options.topOffset, 1),
            origin: [0.5, 0],
            align: [0.5, 0]
        });
        
        draggable.subscribe(this.squareToolView);
        this.add(this.squareToolViewModifier).add(draggable).add(this.squareToolView);
    }
    
    function _createHeaderTool(draggable) {
        this.headerToolView = new ToolView();
        this.headerToolViewModifier = new StateModifier({
            transform: Transform.translate(0, this.options.topOffset, 1),
            origin: [0.5, 0],
            align: [0.5, 0]
        });
        
        this.headerToolView.tool.setOptions({
            content: '⬒',
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            properties: {
                textAlign: 'center',
                fontSize: 40 + 'px'
            }
        });
        
        draggable.subscribe(this.headerToolView);
        this.add(this.headerToolViewModifier).add(draggable).add(this.headerToolView);
    }
    
    function _createFooterTool(draggable) {
        this.footerToolView = new ToolView();
        this.footerToolViewModifier = new StateModifier({
            transform: Transform.translate(0, this.options.topOffset, 1),
            origin: [0.5, 0],
            align: [0.5, 0]
        });
        
        this.footerToolView.tool.setOptions({
            content: '⬓',
            origin: [0.5, 0.5],
            align: [0.5, 0.5],
            properties: {
                textAlign: 'center',
                fontSize: 40 + 'px'
            }
        });
        
        draggable.subscribe(this.footerToolView);
        this.add(this.footerToolViewModifier).add(draggable).add(this.footerToolView);
    }

    module.exports = MenuView;
});