dojo.provide("dvia.ExampleClass")

// dojo.require('dojo.Stateful');

dojo.declare("dvia.ExampleClass", [], {

	exampleProperty : null,

	constructor : function() {
		console.log("new ExampleClass Object Created");
		this.init();
	},
	
	init : function() {
		console.log("init called in ExampleClass");
	}
	
		

});
