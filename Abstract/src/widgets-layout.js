/**
 * Collection of layout-oriented (and mostly static) widgets.
 * 
 * (c) 2012-2013 Meinte Boersma (DslConsultancy.com)
 */

Abstract.Widgets.Layout = {};

/**
 * A plain (i.e., non-editable) text, transported as {@code data.text}.
 */
Abstract.Widgets.Layout.PlainTextWidget = function(data) {

	var span = $('<span>');
	span.text(data.text);

	this.htmlElt = function() {
		return span;
	};

	Abstract.Widgets.Base.AbstractWidget.call(this, "PlainTextWidget", data);

	this.actionForLeftMouseClick = function(event) {
		return 'bubbleUp';	// let parent get focus
	};

};
oo.util.extend(Abstract.Widgets.Base.AbstractWidget, Abstract.Widgets.Layout.PlainTextWidget);

/**
 * <em>Groups</em> of (a collection of) widgets.
 * <p>
 * The collection is supposed to be fixed: you can <b>append</b> widgets
 * once but can't remove them. Note that you'll have to manage lists
 * through some other widget.
 * <p>
 * These groups exhibit folding.
 */
Abstract.Widgets.Layout.AbstractGroup = function(widgetTypeName, data, containerTagName) {

	// TODO  bind collapsed state with/from annotation

	var outerContainer = $('<' + containerTagName + '>');
	outerContainer.addClass('abstract_' + widgetTypeName);

	var collapsible = ( data && !!data.collapsible );
	var collapsedStateCallback = ( data && data.collapsedStateCallback ) || function(state) { /* do nothing (sentinel impl.) */ };
	var foldOpen = true;
	function setFoldOpen(state) {
		foldOpen = state;
		collapsedStateCallback.call(data, state);	// call the function in the context of its defining object
	}
	setFoldOpen(true);

	var foldButton = $('<span>');
	foldButton.addClass('abstract_fold_open');
		// TODO  have fold depend on annotation (value)
	if( collapsible ) {
		outerContainer.append(foldButton);
	}

	var uncollapsibleContainer = $('<' + containerTagName + '>');
	outerContainer.append(uncollapsibleContainer);

	var collapsibleContainer = $('<' + containerTagName + '>');
	outerContainer.append(collapsibleContainer);

	this.append = function(childWidget, alwaysVisible /* boolean: default=true */) {
		var visible = ( ( alwaysVisible === undefined ) || !!alwaysVisible );
		var targetContainer = ( visible ? uncollapsibleContainer : collapsibleContainer );
		targetContainer.append(childWidget.htmlElt());
		childWidget.setParent(this);
	};

	this.htmlElt = function() {
		return outerContainer;
	};

	Abstract.Widgets.Base.AbstractWidget.call(this, widgetTypeName, data);

	this.actionForLeftMouseClick = function(event) {
		if( collapsible && Abstract.Util.Dom.checkSame(foldButton, event.target) ) {
			return( foldOpen ? 'collapse' : 'expand' );
		}
		return 'focus';
	};

	this.collapse = function() {
		if( foldOpen ) {
			foldButton.removeClass('abstract_fold_open');
			foldButton.addClass('abstract_fold_closed');
			collapsibleContainer.addClass('abstract_invisible');
			setFoldOpen(false);
		} else {
			throw new Error("collapse called but already collapsed");
		}
	};

	this.expand = function() {
		if( !foldOpen ) {
			foldButton.removeClass('abstract_fold_closed');
			foldButton.addClass('abstract_fold_open');
			collapsibleContainer.removeClass('abstract_invisible');
			setFoldOpen(true);
		} else {
			throw new Error("expand called but already expanded");
		}
	};

};
oo.util.extend(Abstract.Widgets.Base.AbstractWidget, Abstract.Widgets.Layout.AbstractGroup);

Abstract.Widgets.Layout.HorizontalGroup = function(data) {
	Abstract.Widgets.Layout.AbstractGroup.call(this, "HorizontalGroup", data, 'span');
};
oo.util.extend(Abstract.Widgets.Layout.AbstractGroup, Abstract.Widgets.Layout.HorizontalGroup);


Abstract.Widgets.Layout.VerticalGroup = function(data) {
	Abstract.Widgets.Layout.AbstractGroup.call(this, "VerticalGroup", data, 'div');
};
oo.util.extend(Abstract.Widgets.Layout.AbstractGroup, Abstract.Widgets.Layout.VerticalGroup);

