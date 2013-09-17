/**
 * Documentation: see README.md.
 */

Abstract.Editor = function(metaModelJSON, modelJSON, templates, editorElement, logger, widgetInControlLogElt) {

	var metaModel = jsmf.meta.createMetaModelFromJSON(metaModelJSON);
	var modelResource = jsmf.model.Factory.createMResource(modelJSON, metaModel,
		{
			reportError: function(msg) { logger.error(msg); }
		});

	this.start = function() {

		doFullRender();

		new Abstract.EventHandler({
			leftMouseClick:		handleLeftMouseClick,
			typing:				handleTyping,
			specialKeyPress:	handleSpecialKeyPress,
			specialKeyDown:		function(eventLiteral, originalEvent) { /* do nothing (for now) */ }
		}, logger).observeWindow();

	};

	function logInfo(message) {
		log(message, 'info');
	}

	function logError(message) {
		log(message, 'error');
	}

	function logDebug(message) {
		log(message, 'debug');
	}

	function log(message, type) {
		if( typeof(logger) !== undefined && logger[type] !== undefined ) {
			logger[type].call(logger, message);
		}
	}


	/*
	 * +-------------------+
	 * | state and control |
	 * +-------------------+
	 */

	var widgetInControl = null;

	function setInControl(widget) {
		if( widget !== widgetInControl ) {
			if( widgetInControl ) {
				logInfo("unfocusing widget: id=" + widgetInControl.htmlElt().attr('id'));
				widgetInControl.unfocus();
			}
			widgetInControl = widget;
			if( widgetInControlLogElt ) {
				widgetInControlLogElt.text(widget ? Abstract.Widgets.Base.id(widget) : "none");
			}
		}
	}


	/*
	 * +----------------------------------+
	 * | event handling: left mouse click |
	 * +----------------------------------+
	 */

	function handleLeftMouseClick(event) {
		var target = event.target;
		var htmlElement = Abstract.Util.Dom.firstUp(target, 'abstract_widget');
		if( htmlElement ) {
			var widget = Abstract.Widgets.Base.widgetById(htmlElement.attr('id'));
			if( widget ) {
				dispatchOnLeftMouseClick(event, widget);
			} else {
				logError("clicked but couldn't find widget attached to HTML element");
			}
		} else {	// clicked outside of editor pane or outside of the bounding box (of the HTML element) of any widget
			logInfo("clicked outside of the bounding box (of the HTML element) of any widget");
			setInControl(null);
		}
	}

	function dispatchOnLeftMouseClick(event, widget) {
		var action = widget.actionForLeftMouseClick(event);
		logInfo("clicked widget: id=" + widget.htmlElt().attr('id') + ", type=" + widget.typeName() + ", associated-action=" + action);
		logInfo("dispatching action=" + action + " to widget with id=" + Abstract.Widgets.Base.id(widget) + " for left mouse click");
		switch(action) {
			case 'nil':			return;
			case 'focus':		unfocusAndExecute(widget, action);	return;
			case 'enterEdit':	unfocusAndExecute(widget, action);	return;
			case 'exitEdit':	widget.exitEdit(event); return;
			case 'finishEdit':	widget.finishEdit(event); return;
			case 'bubbleUp':	{
				if( widget.parent() ) {
					dispatchOnLeftMouseClick(event, widget.parent());
					return;
				}
				throw new Error("bubbleUp-action attempted by a widget without parent");
				// JSHint annotation below prevents the following warning: Expected a 'break' statement before 'case'
			}
			/* falls through */
			case 'collapse':	widget.collapse(event); return;
			case 'expand':		widget.expand(event); return;
			default: throw new Error("invalid/unhandled action (literal): " + action);
		}
	}


	/*
	 * +------------------------+
	 * | event handling: typing |
	 * +------------------------+
	 */

	function handleTyping(character) {
		if( !widgetInControl ) return;

		var widget = widgetInControl;
		var action = widgetInControl.actionForTyping(character);
		logInfo("dispatching action=" + action + " to widget with id=" + Abstract.Widgets.Base.id(widget) + " for typing of '" + character + "'");
		switch(action) {
			case 'input':	widget.input(character); return;
			case 'nil':		return;
			default: throw new Error("invalid/unhandled action (literal): " + action);
		}
	}


	/*
	 * +-----------------------------------+
	 * | event handling: special key press |
	 * +-----------------------------------+
	 */

	function handleSpecialKeyPress(eventLiteral, originalEvent) {
//		var eventType = Abstract.EventTypes.SpecialKeyPress[eventLiteral];
		if( eventLiteral === 'meta-s' ) {
			logInfo("initiating save action (unimplemented)...");
			logDebug(JSON.stringify(modelResource.toJSON()));
			return;
		}

		if( !widgetInControl ) return;

		var action = widgetInControl.actionForSpecialKeyPress(eventLiteral, originalEvent);
		execute(widgetInControl, action);
	}


	/*
	 * +---------------+
	 * | miscellaneous |
	 * +---------------+
	 * 
	 * (concerning widgets)
	 */

	function unfocusAndExecute(widget, action) {
		setInControl(widget);
		execute(widget, action);
	}

	function execute(widget, action) {
		if( !widget[action] ) {
			throw new Error("widget of type " + widget.typeName() + " has no function (handle) for action=" + action);
		}
		widget[action].call(widget);
	} 


	/*
	 * +-----------+
	 * | rendering |
	 * +-----------+
	 */

	function doFullRender() {
		// TODO  clear editorElement (.clear() is not a jQuery function...)
		editorElement.append(
			modelResource.contents.map(function(mObject) { return renderWidgetForInstance(mObject).htmlElt(); })
		);
	}

	/**
	 * Object which serves as an interface for being able to do recursive rendering.
	 */
	var renderObject = {
		renderWidgetForInstance: function(mObject) {
			return renderWidgetForInstance(mObject);
		},
		renderWidgetForValue: function(value, feature) {
			return renderWidgetForValue(value, feature);
		}
	};

	function renderWidgetForInstance(mObject) {
		var className = mObject.metaType.name;
		var template = templates.objectTemplates[className];
		if( !template ) throw new Error("no renderer defined for instances of " + className);
		return template.call(renderObject, mObject);
	}

	function renderWidgetForValue(value, feature) {
		var template = templates.featureTemplates[feature.containingClass.name][feature.name];
		if( !template ) throw new Error("no renderer defined for feature " + feature.toString() );
		return template.call(renderObject, value, feature);
	}

};

