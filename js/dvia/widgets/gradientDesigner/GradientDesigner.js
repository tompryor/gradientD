/*
 Copyright (c) 2011 Tom Pryor - dvia.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

define(
    [
        "dojo/_base/declare", // declare
        "dojo/dom",
        "dijit/_Widget",
        "dojox/dtl/_Templated",
        "dojo/on",
        "dojo/dom-attr",
        "dojo/_base/array", // array.forEach
        "dojo/store/Memory",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dijit/registry",
        "dojo/aspect",
        "dojox/gauges/GlossyCircularGauge",
        "dvia/widgets/gradientDesigner/gradientSlider/GradientSlider"
    ],
    function (declare, dom, _Widget, _Templated, on, domAttr, array, Memory, lang, domClass, registry, aspect, GlossyCircularGauge)
    {

        /*
         * ===== var _Widget = dijit._Widget; var _TemplatedMixin = dijit._TemplatedMixin; =====
         */

        // module:
        // dijit/form/HorizontalRule
        // summary:
        // Hash marks for `dijit.form.HorizontalSlider`
        var GradientDesigner =
            declare("dvia.widgets.gradientDesigner.GradientDesigner", [
                _Widget,
                _Templated
            ], {
                _linearGradienDegreeGauge : null,
                _linearGradienDegreeValue : null,
                _gradientType : null,
                _gradientStore : null,
                _eventHandels : null,
                _dijitTemplateCompat : true,
                widgetsInTemplate : true,
                templateString : dojo.cache("dvia.widgets.gradientDesigner", "html/gradientDesigner.html"),
                _started : false,

                // ef : dojo.fx.easing["quadInOut"],

                // Any initialization code would go here in the constructor. dijit._Widget and
                // dijit._Templated do not have parameters in their constructors, so
                // there wouldn't be any multiple-inheritance complications
                // if you were to include some paramters here.
                constructor : function ()
                {
                    console.debug("1. in GradientDesigner constructor");
                    this._eventHandels = [];
                    // Create our model
                    this._gradientStore = new Memory({
                        data : []
                    });
                    this._linearGradienDegreeValue = 180;

                    this._gradientType = "linear-gradient";
                    // this.ef = dojo.fx.easing["quadInOut"];

                },
                
                // Inherited from dijit._Widget and called just before template
                // instantiation in buildRendering. This method is especially useful
                // for manipulating the template before it becomes visible.
                postMixInProperties : function ()
                {
                    console.debug("2. in GradientDesigner postMixInProperties");
                    // this.render();

                },
                
                // You can override this method to manipulate widget once it is
                // placed in the UI, but be warned that any child widgets contained
                // in it may not be ready yet.
                postCreate : function ()
                {
                    console.debug("3. in GradientDesigner postCreate");
                    // this.startup();

                },
                
                // Called after the widget's children and all other widgets on the
                // page have been created. Provides an opportunity to manipulate child
                // widgets before they're displayed.
                startup : function ()
                {
                    if (this._started)
                    {
                        return;
                    }
                    this._started = true;
                    console.debug("4. in GradientDesigner startup");
                    this.gradientSlider.startup();

                    this._setUpEventHandles();

                    this._setUpGauges();

                    this.gradientSlider.createGradientFromHandles();

                },

                _createCss : function ()
                {
                    // console.debug("GradientDesigner#_createCss: ");
                    // console.debug("GradientDesigner#_createCss: _linearGradienDegreeValue",
                    // this._linearGradienDegreeValue)
                    // console.debug("GradientDesigner#_createCss: _gradientType", this._gradientType)
//                     console.debug("GradientDesigner#_createCss: _gradientStore", this._gradientStore)

                    var genericGradient = "";
                    var background = "\t background: "
                    var colorStops = "";
                    
                    
                    
                    this._gradientStore.query(function(object){
                        // return object.id > 1;
//                         console.debug("GradientDesigner#_createCss: _gradientStore object",object);
                         
                         colorStops = colorStops + ", " + object.currentColor + " " + object.currentPos + "%"

                        
                    }) // Pass a function to do more complex querying


                    if (this._gradientType === "linear-gradient")
                    {

                        genericGradient = this._gradientType + "( " + this._linearGradienDegreeValue + "deg " + colorStops;
                    }
                    genericGradient = genericGradient + ");\r"
                    
//                    console.debug("GradientDesigner#_createCss: moz generic Gradient" + "-moz-" + genericGradient);
//                    console.debug("GradientDesigner#_createCss: webkit generic Gradient" + "-webkit-" + genericGradient);
//                    console.debug("GradientDesigner#_createCss: opera generic Gradient" + "-o-" + genericGradient);
//                    console.debug("GradientDesigner#_createCss: microsoft generic Gradient" + "-ms-" + genericGradient);
//                    console.debug("GradientDesigner#_createCss: generic Gradient", genericGradient);

                    var styleRules = background + "-moz-" + genericGradient + background + "-webkit-" + genericGradient + background + "-o-" + genericGradient + background + "-ms-" + genericGradient + background + genericGradient;
                    
                    this.gradientSlider.updateStylePreview(styleRules);


                },

                _setUpGauges : function ()
                {

                    this._createLinearGradienDegreeGauge()

                },

                _createLinearGradienDegreeGauge : function ()
                {
                    this._linearGradienDegreeGauge =
                        this._createGradienDegreeGauge(dom.byId("CircularGaugeLinearGradientDegree"));

                    this._linearGradienDegreeGauge.startup();

                    aspect.after(this._linearGradienDegreeGauge, "onValueChanged", lang.hitch(this, function ()
                    {
                        this._linearGradienDegreeValue = this._linearGradienDegreeGauge.value;

                        this._createCss();

                    }), true);

                },

                _createGradienDegreeGauge : function (domNode)
                {
                    return new GlossyCircularGauge({
                        background : [
                            255,
                            255,
                            255,
                            0
                        ],
                        title : 'Degrees',
                        id : "glossyGauge",
                        width : 180,
                        height : 180,
                        min : 0,
                        max : 360,
                        value: 180,
                        majorTicksInterval : 90,
                        minorTicksInterval : 45
                    }, domNode);
                },

                _setUpEventHandles : function ()
                {

                    this._eventHandels.push(on(this.gradientSlider, "createGradientFromHandles", lang.hitch(this,
                        "onCreateGradientFromHandles")));

                },

                onCreateGradientFromHandles : function (eventObject)
                {
                    // console.debug("GradientDesigner: handle event onCreateGradientFromHandles", handels)
                    array.forEach(eventObject.handels, function (dndObject, i)
                    {
                        // this.myMethod(item);
//                         console.debug("GradientDesigner#onCreateGradientFromHandles: handle", dndObject.handle)

                        var currentColor = domAttr.get(dndObject.handle, "data-color");
                        var currentPos = domAttr.get(dndObject.handle, "data-pos");
                        this.updateModel({
                            id : i,
                            currentColor : currentColor,
                            currentPos : currentPos
                        });

                    }, this);

                    this._createCss();

                },

                updateModel : function (gradientValuesObject)
                {
                    // console.debug("GradientDesigner: updateModel", gradientValuesObject)
                    this._gradientStore.put(gradientValuesObject); // store the object with the given identity
                    // console.debug("GradientDesigner#updateModel: _gradientStore", this._gradientStore)

                },

                onGradientTypeChange : function (e)
                {
                    // console.debug("GradientDesigner#onGradientTypeChange: event", e)
                    // console.debug("GradientDesigner#onGradientTypeChange: currentTarget", e.currentTarget)
                    // console.debug("GradientDesigner#onGradientTypeChange: value", e.currentTarget.value)
                    if (e.currentTarget.value === "linear-gradient")
                    {
                        domClass.add(this.radialGradient, "noDisplay");
                        domClass.remove(this.linearGradient, "noDisplay");
                    }
                    else
                    {
                        domClass.remove(this.radialGradient, "noDisplay");
                        domClass.add(this.linearGradient, "noDisplay");
                    }

                    this._gradientType = e.currentTarget.value;
                    this._gradientType = "linear-gradient";

                    this._createCss();

                }

            });

        return GradientDesigner;

    });
