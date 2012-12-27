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

define([
    "dojo/_base/declare", // declare
    "dijit/_Widget",
    "dojox/dtl/_Templated",
    "dojo/fx/easing",
    "dojo/NodeList-traverse",
    "dvia/widgets/gradientDesigner/gradientSlider/GradientSlider"
], function (declare, _Widget, _Templated)
{

    /*
     * ===== var _Widget = dijit._Widget; var _TemplatedMixin = dijit._TemplatedMixin; =====
     */

    // module:
    // dijit/form/HorizontalRule
    // summary:
    // Hash marks for `dijit.form.HorizontalSlider`

    var GradientDesigner = declare("dvia.widgets.gradientDesigner.GradientDesigner", [
        _Widget,
        _Templated
    ], {

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
            // this._getCurrentTile();

        }
    });

    return GradientDesigner;

});
