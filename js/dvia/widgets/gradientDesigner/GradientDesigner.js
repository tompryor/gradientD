define(["dojo/_base/declare", // declare
"dijit/_Widget", "dojox/dtl/_Templated", "dojo/fx/easing", "dojo/NodeList-traverse", "dvia/widgets/gradientDesigner/gradientSlider/GradientSlider"], function(declare, _Widget, _Templated) {

	/*=====
	var _Widget = dijit._Widget;
	var _TemplatedMixin = dijit._TemplatedMixin;
	=====*/

	// module:
	//		dijit/form/HorizontalRule
	// summary:
	//		Hash marks for `dijit.form.HorizontalSlider`

	var GradientDesigner = declare("dvia.widgets.gradientDesigner.GradientDesigner", [_Widget, _Templated], {

		_dijitTemplateCompat : true,
		widgetsInTemplate : true,
		templateString : dojo.cache("dvia.widgets.gradientDesigner", "html/gradientDesigner.html"),
		//ef : dojo.fx.easing["quadInOut"],

		//Any initialization code would go here in the constructor. dijit._Widget and
		//dijit._Templated do not have parameters in their constructors, so
		//there wouldn't be any multiple-inheritance complications
		//if you were to include some paramters here.
		constructor : function() {
			console.debug("1. in GradientDesigner constructor");
			//this.ef = dojo.fx.easing["quadInOut"];

		},
		//Inherited from dijit._Widget and called just before template
		//instantiation in buildRendering. This method is especially useful
		//for manipulating the template before it becomes visible.
		postMixInProperties : function() {
			console.debug("2. in GradientDesigner postMixInProperties");
			// this.render();

		},
		//You can override this method to manipulate widget once it is
		//placed in the UI, but be warned that any child widgets contained
		//in it may not be ready yet.
		postCreate : function() {
			console.debug("3. in GradientDesigner postCreate");
			//this.startup();

		},
		//Called after the widget's children and all other widgets on the
		//page have been created. Provides an opportunity to manipulate child
		//widgets before they're displayed.
		startup : function() {
			console.debug("4. in GradientDesigner startup");
			this.gradientSlider.init();
			// this._getCurrentTile();

		}
	});

	return GradientDesigner;

});
