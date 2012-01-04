define(["dojo/_base/declare", // declare
"dijit/_Widget", "dojox/dtl/_Templated", "dojo/_base/array", // array.forEach
"dojo/dnd/move", "dojo/_base/event", // event.stop
"dojo/_base/fx", // fx.animateProperty
"dojo/dom-geometry", // domGeometry.position
"dojo/dom-style", // domStyle.getComputedStyle
"dojo/keys", // keys.DOWN_ARROW keys.END keys.HOME keys.LEFT_ARROW keys.PAGE_DOWN keys.PAGE_UP keys.RIGHT_ARROW keys.UP_ARROW
"dojo/_base/lang", // lang.hitch
"dojo/_base/sniff", // has("ie") has("mozilla")
"dojo/dnd/Moveable", // Moveable
"dojo/dnd/Mover", // Mover Mover.prototype.destroy.apply
"dojo/query", // query
"dijit/registry", // registry.findWidgets
"dijit/focus", // focus.focus()
"dijit/typematic", 
"dijit/form/Button", 
"dijit/form/_FormValueWidget", 
"dijit/_Container", 
"dojo/_base/connect", 
"dojo/number", 
"dojo/dom-construct", 
"dojo/_base/window", 
"dojo/dom-class",
"dojo/dom-attr"], 
function(declare, _Widget, _Templated, array, move, event, fx, domGeometry, domStyle, keys, lang, has, Moveable, Mover, query, registry, focus, typematic, Button, _FormValueWidget, _Container, connect, number, domConstruct, win, domClass, domAttr) {

	/*=====
	var _Widget = dijit._Widget;
	var _TemplatedMixin = dijit._TemplatedMixin;
	=====*/

	// module:
	//		dijit/form/HorizontalRule
	// summary:
	//		Hash marks for `dijit.form.HorizontalSlider`


	var gradientSlider = declare("dvia.widgets.gradientDesigner.gradientSlider.GradientSlider", [_Widget, _Templated], {

		_dijitTemplateCompat : true,
		widgetsInTemplate : true,
		default1 : null,
		default2 : null,
		focusedNode : null,
		_newHandel : null,
		handles : [],
		colorPickerActive: false,
		currentColor: "#fff",
		gradientDirection: "top",
		vendorPrefixs: ["-moz-linear-gradient", "-webkit-linear-gradient", "-o-linear-gradient", "-ms-linear-gradient", "linear-gradient"],
		previewStylesNode: null,
		
		//templateString : template,

		templateString : dojo.cache("dvia.widgets.gradientDesigner.gradientSlider", "html/gradientSlider.html"),

		// ef : dojo.fx.easing["quadInOut"],

		//Any initialization code would go here in the constructor. dijit._Widget and
		//dijit._Templated do not have parameters in their constructors, so
		//there wouldn't be any multiple-inheritance complications
		//if you were to include some paramters here.
		constructor : function() {
			console.debug("1. in gradientSlider constructor");
			//this.ef = dojo.fx.easing["quadInOut"];
			this.previewStylesNode = dojo.place("<style></style>", dojo.body());


		},
		//Inherited from dijit._Widget and called just before template
		//instantiation in buildRendering. This method is especially useful
		//for manipulating the template before it becomes visible.
		postMixInProperties : function() {
			console.debug("2. in gradientSlider postMixInProperties");
			// this.render();

		},
		//You can override this method to manipulate widget once it is
		//placed in the UI, but be warned that any child widgets contained
		//in it may not be ready yet.
		postCreate : function() {
			console.debug("3. in gradientSlider postCreate");

			this.startup();

		},
		//Called after the widget's children and all other widgets on the
		//page have been created. Provides an opportunity to manipulate child
		//widgets before they're displayed.
		startup : function() {
			console.debug("4. in gradientSlider startup");

			// this._getCurrentTile();

		},
		_onKeyPress : function(/*Event*/e) {
			// console.debug("AAA");
			if(this.disabled || this.readOnly || e.altKey || e.ctrlKey || e.metaKey) {
				return;
			}
			switch(e.charOrCode) {
				case keys.RIGHT_ARROW:
					this.shift(1, evt.charOrCode);
					break;
				case keys.LEFT_ARROW:
					this.shift(-1, evt.charOrCode);
					break;
				default:
					return;
			}
			event.stop(e);
		},
		_onHandleClick : function(e) {
			// console.debug("handle clicked", e.target.id);
			this.focusedNode = e.target;

			if(this.disabled || this.readOnly) {
				return;
			}
			if(!has("ie")) {
				// make sure you get focus when dragging the handle
				// (but don't do on IE because it causes a flicker on mouse up (due to blur then focus)
				//focus.focus(this.default1.domNode);
			}
			event.stop(e);
		},
		_onMouseMove : function(mover, leftTop) {
			//console.debug("mouse moved mover", mover);
			// console.debug("mouse moved leftTop", leftTop);
			var handelLeft = (leftTop.l / 8) - 2;
			var handelValueDisplay = dojo.query(".handleValue", mover.node)[0];
			//console.debug("mouse moved update value", handelValueDisplay);
			var currentPosition = dojo.number.round(handelLeft);
			handelValueDisplay.innerHTML = currentPosition;
			// console.debug("mouse moved handelLeft", dojo.number.round(handelLeft));
			domAttr.set(mover.node, "data-pos", currentPosition);
			
			// whats it's index in the array so i can update it's object pos property
			var currentHandleIndex = domAttr.get(mover.node, "data-index");
			// console.debug("xxx this handles index is ", currentHandleIndex);

			this.handles[currentHandleIndex].pos = currentPosition;
			
			// mover.pos = currentPosition;
			
			
			
			this.createGradientFromHandles();


		},
		_onMouseUp : function(e) {
			// console.debug("mouse up", e);

		},
		init : function() {
			console.debug("gradientSlider init");
			// make the default left handle draggable
			this.default1 = new dojo.dnd.move.parentConstrainedMoveable(this.default1, {
				area : "content",
				within : true
			});
			// attach to the dnd onMove event
			connect.connect(this.default1, "onMove", this, "_onMouseMove");
			// make it the current focus
			this.focusedNode = this.default1;

			// make the default right handle draggable
			this.default2 = new dojo.dnd.move.parentConstrainedMoveable(this.default2, {
				area : "content",
				within : true
			});

			this.moveHandel(this.default2, 812);

			// attach to the dnd onMove event
			connect.connect(this.default2, "onMove", this, "_onMouseMove");
			
			// set their colors
			domAttr.set(this.default1.node, "data-color", "#fff");
			domStyle.set(this.default1.node, "backgroundColor", "#fff");
			domAttr.set(this.default1.node, "data-pos", "0");

			domAttr.set(this.default2.node, "data-color", "#000");
			domStyle.set(this.default2.node, "backgroundColor", "#000");
			domAttr.set(this.default2.node, "data-pos", "100");

			this.default1.pos = 0;
			this.default2.pos = 100;

			// collect all our handles in an array
			this.handles.push(this.default1);
			this.handles.push(this.default2);

			this.createGradientFromHandles();
			dojo.subscribe("/dnd/move/stop", this, "updateCodePreview");
			this.updateCodePreview();

			// console.debug("all our handles", this.handles);
		},
		shift : function(dir, key) {
			// console.debug("shift dir", dir);
			// console.debug("shift key", key);
		},
		moveHandel : function(handel, leftPos) {

			domStyle.set(handel.node, "left", leftPos + "px");

			// console.debug("moveHandel left", domStyle.get(handel.node, "left"));
			// console.debug("moveHandel left", leftPos);

		},
		_onSliderClick : function(e) {
			// console.debug("Slider Click", e.clientX);
			// console.debug("Focus Node", this.focusedNode);

			if(this.colorPickerActive) {
				// console.debug("colorPickerActive",this.colorPickerActive)
				return;
			}else{
				// console.debug("colorPickerActive",this.colorPickerActive)
			}

			// get a reference to my clone node
			var n = query(".clone", this.sliderBar)[0];

			// create 1 clone of this node and append it to the sliderBar
			var myClone = domConstruct.place(lang.clone(n), this.sliderBar);
			this.focusedNode = myClone;


			// make it moveable
			var handel = new dojo.dnd.move.parentConstrainedMoveable(myClone, {
				area : "content",
				within : true
			});

			// position it
			this.moveHandel(handel, e.clientX - 10);

			var handelValueDisplay = dojo.query(".handleValue", myClone)[0];
			var currentPos = dojo.number.round((e.clientX / 8) - 5);
			handelValueDisplay.innerHTML = currentPos;

			// attach to the dnd onMove event
			connect.connect(handel, "onMove", this, "_onMouseMove");
			
			// attach to the dom onclick event
			connect.connect(myClone, "onclick", this, "_onHandleClick");

			// attach to the dom ondblclick event
			connect.connect(myClone, "ondblclick", this, "_onDblClick");

			// how many handles do we have already
			var currentHandleIndex = this.handles.length;
			// console.debug("we have this many handles", currentHandleIndex);
			
			domAttr.set(myClone, "data-index", currentHandleIndex);
			domAttr.set(myClone, "data-pos", currentPos);
			domAttr.set(myClone, "data-color", this.currentColor);

// 			this.colorPicker.domNode.value = this.currentColor;
			domStyle.set(myClone, "backgroundColor", this.currentColor);
			handel.pos = currentPos;
			// add our new handles to the hands array
			this.handles.push(handel);
			// console.debug("all our handles", this.handles);

			this.createGradientFromHandles();
			this.updateCodePreview();
			// reveal the new node in the UI
			domClass.remove(myClone, "clone");

			// console.debug("here is the clone", myClone);

		},
		
		_onDblClick: function(e) {
			// console.debug("dbl click", e);
			// if altKe remove this handle
			if(e.altKey){
				this.removeThisHandle(e.target);
				return;
			}
			
			// this.colorPicker.value = this.currentColor;
			
			var targetHandle = e.target;
			this.focusedNode = targetHandle;
			// this.colorPicker.value = domAttr.get(this.focusedNode, "data-color");
			var currentColor = domAttr.get(this.focusedNode, "data-color");
			// this.colorPicker.set("value", currentColor);
			// console.debug("xxx current handles color ", currentColor)
			this.colorPicker.setColor(currentColor);

			var targetHandleLeftPosition = domStyle.get(targetHandle, "left");
			// move it off of the handle
			targetHandleLeftPosition = targetHandleLeftPosition + 20;
			// domStyle.set(handel.node, "left", leftPos + "px");
			// console.debug("dbl click target left pos ", targetHandleLeftPosition);
			
			// show colorPicker at target postion
			// console.debug("colorPicker", this.colorPicker.domNode)
			
			domStyle.set(this.colorPicker.domNode, "left", targetHandleLeftPosition + "px");
			domStyle.set(this.closeColorPickerX, "left", targetHandleLeftPosition + 292 + "px");
			
			// console.debug("this.closeColorPickerX",this.closeColorPickerX);
			domClass.toggle(this.closeColorPickerX, "hide");
			domClass.toggle(this.colorPicker.domNode, "hide");
			
			if(domClass.contains(this.colorPicker.domNode, "hide")){
				// alert("has")
				this.colorPickerActive = false;
			}else{
				this.colorPickerActive = true;
			}
		},
		
		_onCloseColorPicker: function(e) {
			this._closeColorPicker();
								event.stop(e);

		},
		
		_closeColorPicker: function(){
			domClass.toggle(this.colorPicker.domNode, "hide");
			domClass.toggle(this.closeColorPickerX, "hide");
			this.colorPickerActive = false;

		},
		
		removeThisHandle: function(handle){
			// console.debug("remove this handle",handle);
			var handleIndex = domAttr.get(handle, "data-index");
			this._removeHandleFromList(handleIndex);
			// console.debug("remove this handleIndex",handleIndex);
			
			domConstruct.destroy(handle);

			
			
		},
		
		_removeHandleFromList: function(handleIndex){
			this.handles.splice(handleIndex, 1);
			var handlesLength = this.handles.length;
			for(var i=0; i<handlesLength; i++){
				var handle = this.handles[i].node;
				domAttr.set(handle, "data-index", i);
				// console.debug("current handle in list ", handle);
			}
			
			// console.debug("handles", this.handles);
			this.createGradientFromHandles();
			this.updateCodePreview();
		},
		
		_onColorPickerChange: function(colorValue){
			// console.debug("colorPicker value changed ",colorValue);
			// console.debug("update this nodes color ",this.focusedNode);
			domAttr.set(this.focusedNode, "data-color", colorValue);
			domStyle.set(this.focusedNode, "backgroundColor", colorValue);
			this.currentColor = colorValue;
			this.createGradientFromHandles();
			this.updateCodePreview();

		},
		
		
		createGradientFromHandles: function(){
			
			// sort by pos
			
			this.handles.sort(function(a, b){
			 return a.pos-b.pos
			})

			
			var handlesLength = this.handles.length;
			var colorStops = "";
			for(var i=0; i<handlesLength; i++){
				var handle = this.handles[i].node;
				domAttr.set(handle, "data-index", i);
				var currentColor = domAttr.get(handle, "data-color");
				var currentPos = domAttr.get(handle, "data-pos");
				// console.debug("current handle in list ", handle);
				// console.debug("current handle color ", currentColor);
				// console.debug("current handle pos ", currentPos);
				colorStops += currentColor + " " + currentPos + "%";
				var nextIndex = i + 1;
				if(nextIndex<handlesLength){
					colorStops += ", ";
				}
				
			}
			
			var newGradientRule = "(" + this.gradientDirection + ", " + colorStops + ")";
			// console.debug("colorStops ", colorStops);
			// console.debug("newGradientRule ", newGradientRule);
			
			this.styleRule = ".gradientPreview { \r";
			
			var vendorPrefixsLength = this.vendorPrefixs.length;
			for(var i = 0; i<vendorPrefixsLength; i++){
				this.styleRule += "  background: " +  this.vendorPrefixs[i] + newGradientRule + ";\r";
			}
			
			this.styleRule += "}\r";
			// domConstruct.empty(this.gradientPreviewStyle);
			// this.gradientPreviewStyle.innerHTML = "";
			// this.gradientPreviewStyle.innerHTML = this.styleRule;
			this.previewStylesNode.innerHTML = "";
			this.previewStylesNode.innerHTML = this.styleRule;
		},
		
		updateCodePreview: function() {
			var codePreview = dojo.query(".prettyprint")[0];
			console.debug("codePreview", codePreview);
			// var currentPosition = dojo.number.round(handelLeft);
			codePreview.innerHTML = this.styleRule;
			prettyPrint();

		}

	});

	return gradientSlider;
	


});
