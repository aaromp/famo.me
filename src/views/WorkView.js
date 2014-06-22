define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var EventHandler  = require('famous/core/EventHandler');
    var ModifierChain = require('famous/modifiers/ModifierChain');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Draginator    = require('Draginator');
    var LayoutView    = require('views/LayoutView');
    var RenderController = require('famous/views/RenderController');

    function WorkView() {
        View.apply(this, arguments);
        this.numLayouts = 0;
        this.layouts = {};

        _createRenderController.call(this);
        _setListeners.call(this);
    }

    WorkView.prototype = Object.create(View.prototype);
    WorkView.prototype.constructor = WorkView;
    WorkView.prototype.toggleHeader = function() {
        this.header = !this.header;
    };

    WorkView.prototype.toggleFooter = function() {
        this.footer = !this.footer;
    };

    WorkView.prototype.createLayoutView = function() {
        this.numLayouts++;

        var layoutView = new LayoutView();
        layoutView.linkTo(this.layouts, this.numLayouts);
        layoutView.addLayout();

        this.add(layoutView);

        this._eventOutput.pipe(layoutView._eventInput);
        layoutView._eventOutput.pipe(this._eventInput);

        this._eventOutput.emit('deselect');
        this._eventOutput.emit('select', layoutView);
    };

    WorkView.prototype.getLayouts = function() {
        return this.layouts;
    };

    WorkView.DEFAULT_OPTIONS = {
        // center: [0.5, 0.5],
        // dimensions: [100, 200],
        // color: '#FFFFF5',
        // grid: {
        //     width: 960,
        //     height: 600,
        //     dimensions: [6, 8],
        //     cellSize: [120, 120] // Dominates dimensions
        // }
    };

    function _createGrid() {
        this.grid = new SceneGrid(this.options.grid);
        // this.gridModifier = new StateModifier({
        //     origin: [0.5, 0.5],
        //     align: [0.5, 0.5],
        //     size: [this.options.grid.width, this.options.grid.height]
        // });

        // this.gridNode = this.add(this.gridModifier).add(this.grid);
        this.add(this.grid);
    }

    function _createRenderController() {
        var renderController = new RenderController();
        this.add(renderController);
    }

    function _createWorkSurface() {
        var workSurface = new Surface({
            size: this.options.dimensions,
            properties: {
                backgroundColor: this.options.color
            }
        });

        var workSurfaceModifier = new StateModifier({
            origin: this.options.center,
            align: this.options.center
        });

        this.add(workSurfaceModifier).add(workSurface);
    }

    function _setListeners() {
        this._eventInput.on('deselectRest', function() {
            this._eventOutput.emit('deselect');
        }.bind(this));

        window.onkeydown = function(event) {
            if (event.keyIdentifier === 'U+004E') {
                this.createLayoutView();
            }
        }.bind(this);

        this._eventInput.on('createNewLayout', function() {
            console.log('creating a new layout');
            console.log(this);
            this.createLayoutView();
        }.bind(this));

        this._eventInput.on('allowCreation', function() {
            window.onkeydown = function(event) {
                if (event.keyIdentifier === 'U+004E') {
                    this.createLayoutView();
                };
            }.bind(this);
        }.bind(this));
    }

    module.exports = WorkView;
});
