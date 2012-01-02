
dojo.provide("dvia.widgets.gradientDesigner.GradientDesigner");

//Always require resources before you try to use them. We're requiring these
//two resources because they're part of our widget's inheritance hierarchy.
dojo.require("dijit._Widget");
dojo.require("dojox.dtl._Templated");
dojo.require("dojo.fx.easing");
dojo.require("dojo.NodeList-traverse");

dojo.declare("dvia.widgets.gradientDesigner.GradientDesigner", [dijit._Widget, dojox.dtl._Templated], {
	
	// Logging variables
	level: "ERROR",
	methodName: null, // Only used for tracing, may be left out
    toConsole: true,
    toServerLog: true,
		
	_dijitTemplateCompat : true,
	tiles : null,
	_currentTile : null,
	_targetTile : null,
	_direction : "forward",

	// this generate an error for some reason - when using dojo from google CDN, works fine when using a local copy of dojo!!!
	// templateString: '<div><input dojoAttachEvent="onkeyup: keyUp"/><ul>{% for item in items %}<li>{{ item }} ${oldRepl}</li>{% endfor %}</ul></div>'
	// templateString: '<div><input dojoAttachEvent="onkeyup: keyUp"/><ul>{% for item in items %}<li>{{ item }} - ${oldRepl}</li>{% endfor %}</ul></div>',
	templateString : dojo.cache("dvia.widgets.gradientDesigner", "html/gradientDesigner.html"),
	ef : dojo.fx.easing["quadInOut"],
	//Any initialization code would go here in the constructor. dijit._Widget and
	//dijit._Templated do not have parameters in their constructors, so
	//there wouldn't be any multiple-inheritance complications
	//if you were to include some paramters here.
	constructor : function() {
		console.debug("1. in DTLexternal constructor");
		//this.ef = dojo.fx.easing["quadInOut"];

	},
	//Inherited from dijit._Widget and called just before template
	//instantiation in buildRendering. This method is especially useful
	//for manipulating the template before it becomes visible.
	postMixInProperties : function() {
		console.debug("2. in DTLexternal postMixInProperties");
		// this.render();

	},
	//You can override this method to manipulate widget once it is
	//placed in the UI, but be warned that any child widgets contained
	//in it may not be ready yet.
	postCreate : function() {
		console.debug("3. in DTLexternal postCreate");
		this.startup();

	},
	//Called after the widget's children and all other widgets on the
	//page have been created. Provides an opportunity to manipulate child
	//widgets before they're displayed.
	startup : function() {
		console.debug("4. in DTLexternal startup");
		// this._getCurrentTile();

	}
});
