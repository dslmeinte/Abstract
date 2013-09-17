/**
 * Documentation: see widgets-base.md
 */

// pre-create the objects for the module(s):
Abstract.Widgets = {};

Abstract.Widgets.Base = function() {	// singleton

	/**
	 * Management of all widgets created.
	 * <p>
	 * <em>Note</em> that this shouldn't really be here (at least, naming-wise),
	 * but currently it's the most convenient place to do this as it ensures
	 * proper containment is handled in the base constructor.
	 */

	var widgetId = 0;

	var allWidgets = {};

	function widgetById(id) {
		return allWidgets[id];
	}

	function registerWidget(widget) {
		widgetId++;
		widget.htmlElt().attr('id', widgetId);
		/*
		 * Note: HTML4.01 had rules for the 'id' attribute, such as starting with a letter.
		 * HTML5 dispensed with that, but keep this in mind in view of cross-browser compatibility.
		 */
		allWidgets[widgetId] = widget;
	}

	function removeById(id) {
		allWidgets[id] = undefined;
	}

	function id(widget) {
		var id_ = null;
		$.each(allWidgets, function(key, value) {
			if( value === widget ) {
				id_ = key;
			}
		});
		return id_;
	}


	/**
	 * An <em>abstract widget</em> which takes care of some boilerplate.
	 */
	function AbstractWidget(widgetTypeName, data) {

		// sanity checks:
		if( typeof(widgetTypeName) !== 'string' ) {
			throw new Error("widget must provide a (string-typed) type name");
		}
		if( !(typeof(data) === 'undefined' || typeof(data) === 'object') ) {
			throw new Error("(non-null) data argument to widget of type " + widgetTypeName + " is not object-typed");
		}
		if( !this.htmlElt ) {
			throw new Error("widget of type " + widgetTypeName + " must expose an htmlElt function");
		}

		this.typeName = function() {
			return widgetTypeName;
		};

		var treeParent = null;

		this.parent = function() {
			return treeParent;
		};

		this.setParent = function(treeParent_) {
			if( !(treeParent_ && treeParent_ instanceof Abstract.Widgets.Base.AbstractWidget) ) {
				throw new Error("parent must be a widget");
			}
			treeParent = treeParent_;
		};

		var elt = this.htmlElt();
		elt.addClass('abstract_widget');
		registerWidget(this);

		if( data ) {
			if( data.css ) {
				elt.css(data.css);
			}
			if( data.cssClassNames ) {
				elt.addClass(data.cssClassNames);
			}
		}

		this.actionForLeftMouseClick = function(event) {
			return 'focus';
		};

		this.actionForTyping = function(event) {
			return 'nil';
		};

		this.actionForSpecialKeyPress = function(eventLiteral) {
			return 'nil';
		};

		this.actionForSpecialKeyDown = function(eventLiteral) {
			return 'nil';
		};

		this.focus = function() {
			this.htmlElt().addClass('abstract_selected');
		};

		this.unfocus = function() {
			this.htmlElt().removeClass('abstract_selected');
		};

	}

	return {
		'widgetById':		widgetById,
		'removeById':		removeById,
		'id':				id,
		'AbstractWidget':	AbstractWidget
	};

}();

