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
                _linearGradientDegreeGauge : null,
                _linearGradienDegreeValue : null,
                _radialGradientDegreeGauge : null,
                _radialGradienDegreeValue : null,
                _gradientShape : null,
                _gradientSize : null,
                _xPosRadial : null,
                _yPosRadial : null,

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
                    this._radialGradienDegreeValue = 180;
                    this._gradientShape = "circle";
                    this._gradientSize = "closest-side";
                    this._xPosRadial = 375;
                    this._yPosRadial = 125;

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
                    var genericGradient = "";
                    var nonVendorGradient = "";
                    var standardDegeree = 0; // the new standard uses different directions for degrees

                    var background = "\t background-image: ";
                    var colorStops = "";

                    this._gradientStore.query(function (object)
                    {
                        colorStops = colorStops + ", " + object.currentColor + " " + object.currentPos + "%";

                    });

                    if (this._gradientType === "linear-gradient" || this._gradientType === "repeating-linear-gradient")
                    {

                        standardDegeree = this._linearGradienDegreeValue + 90;
                        standardDegeree = this._linearGradienDegreeValue; // the non vendor prefix deg is different
                        // from the vendor prefixed ones argh!
                        // http://stackoverflow.com/questions/12868704/why-did-firefox-16-change-the-direction-of-my-linear-gradients

                        genericGradient =
                            this._gradientType + "( " + this._linearGradienDegreeValue + "deg " + colorStops;
                        // nonVendorGradient = this._gradientType + "( " + standardDegeree + "deg " + colorStops;

                        // remove the non-vendor prefixed one for now as it uses deg differently
                        // var styleRules = background + "-moz-" + genericGradient + background + "-webkit-" +
                        // genericGradient + background + "-o-" + genericGradient + background + "-ms-" +
                        // genericGradient +
                        // background + nonVendorGradient;
                    }
                    else
                    {
                        if (this._gradientShape === "circleNoDegreeSupport")
                        {
                            genericGradient =
                                this._gradientType + "( " + this._xPosRadial + "px " + this._yPosRadial + "px "
                                    + this._radialGradienDegreeValue + "deg, " + this._gradientShape + " "
                                    + this._gradientSize + " " + colorStops;
                            // nonVendorGradient = this._gradientType + "( " + standardDegeree + "deg " + colorStops;
                        }
                        else
                        {
                            genericGradient =
                                this._gradientType + "( " + this._xPosRadial + "px " + this._yPosRadial + "px, "
                                    + this._gradientShape + " " + this._gradientSize + " " + colorStops;
                        }

                    }
                    genericGradient = genericGradient + ");\r"
                    // nonVendorGradient = nonVendorGradient + ");\r"

                    var styleRules =
                        background + "-moz-" + genericGradient + background + "-webkit-" + genericGradient + background
                            + "-o-" + genericGradient + background + "-ms-" + genericGradient;

                    this.gradientSlider.updateStylePreview(styleRules);

                },

                _setUpGauges : function ()
                {

                    this._createLinearGradientDegreeGauge();
                    this._createRadialGradientDegreeGauge();

                },

                _createLinearGradientDegreeGauge : function ()
                {
                    this._linearGradientDegreeGauge =
                        this._createGradientDegreeGauge(dom.byId("CircularGaugeLinearGradientDegree"));

                    this._linearGradientDegreeGauge.startup();

                    aspect.after(this._linearGradientDegreeGauge, "onValueChanged", lang.hitch(this, function ()
                    {
                        this._linearGradienDegreeValue = this._linearGradientDegreeGauge.value;

                        this._createCss();

                    }), true);

                },

                _createRadialGradientDegreeGauge : function ()
                {
                    this._radialGradientDegreeGauge =
                        this._createGradientDegreeGauge(dom.byId("CircularGaugeRadialGradientDegree"));

                    this._radialGradientDegreeGauge.startup();

                    aspect.after(this._radialGradientDegreeGauge, "onValueChanged", lang.hitch(this, function ()
                    {
                        this._radialGradienDegreeValue = this._radialGradientDegreeGauge.value;

                        this._createCss();

                    }), true);

                },

                _createGradientDegreeGauge : function (domNode)
                {
                    return new GlossyCircularGauge({
                        background : [
                            255,
                            255,
                            255,
                            0
                        ],
                        title : 'Degrees',
                        "class" : "glossyGauge",
                        width : 180,
                        height : 180,
                        min : 0,
                        max : 360,
                        value : 180,
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
                    array.forEach(eventObject.handels, function (dndObject, i)
                    {
                        var currentColor = domAttr.get(dndObject.handle, "data-color");
                        var currentPos = domAttr.get(dndObject.handle, "data-pos");
                        this._updateModel({
                            id : i,
                            currentColor : currentColor,
                            currentPos : currentPos
                        });

                    }, this);

                    this._createCss();

                },

                _updateModel : function (gradientValuesObject)
                {
                    this._gradientStore.put(gradientValuesObject); // store the object with the given identity

                },

                _onGradientTypeChange : function (e)
                {
                    if (e.currentTarget.value === "linear-gradient"
                        || e.currentTarget.value === "repeating-linear-gradient")
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

                    this._createCss();

                },

                _onGradientShapeChange : function (e)
                {
                    if (e.currentTarget.value === "ellipse")
                    {
                        domClass.add(this.circularGaugeRadialGradientDegreeContainer, "noDisplay");
                    }
                    else
                    {
                        // domClass.remove(this.circularGaugeRadialGradientDegreeContainer, "noDisplay");
                        domClass.add(this.circularGaugeRadialGradientDegreeContainer, "noDisplay");

                    }

                    this._gradientShape = e.currentTarget.value;

                    this._createCss();

                },

                _onGradientSizeChange : function (e)
                {
                    this._gradientSize = e.currentTarget.value;

                    this._createCss();

                },

                _onxPosRadialChange : function (e)
                {
                    this._xPosRadial = e.currentTarget.value;

                    this._createCss();

                },

                _onyPosRadialChange : function (e)
                {
                    this._yPosRadial = e.currentTarget.value;

                    this._createCss();

                },

                _onPosRadialKeyDown : function (e)
                {

                    var currentValue = Number(e.currentTarget.value);
                    var newValue = currentValue;

                    if (e.keyCode === 38)
                    {
                        // add
                        newValue = newValue + 1;

                    }
                    else if (e.keyCode === 40)
                    {
                        // subtract
                        if (newValue > 0)
                        {
                            newValue = newValue - 1;
                        }
                        else
                        {
                            return;
                        }

                    }

                    e.currentTarget.value = "" + newValue;

                    // update the class prop
                    this["_" + e.currentTarget.id] = "" + newValue;

                    // update the css
                    this._createCss();
                }

            });

        return GradientDesigner;

    });
