/**
 * Documentation: see eventHandler.md.
 */

Abstract.EventHandler = function(handlerConfig, logger) {

	function logInfo(message) {
		if( typeof(logger) !== undefined && logger.info !== undefined ) {
			logger.info(message);
		}
	}


	/**
	 * Registers the required handlers through jQuery.
	 */
	this.observeWindow = function() {
		$(document).ready(function() {
			$(window).on({
				click:		function(event) { handleClick(event); },		// TODO  consider capturing mouse release instead <--> mouse drag events
				keypress:	function(event) { handleKeyPress(event); },
				keydown:	function(event) { handleKeyDown(event); }
			});
		});
		// Note that (e.g.) typing alphanumerics causes both keyDown- and keyPress-events.
	};


	var leftMouseClickHandler = handlerConfig.leftMouseClick;

	function handleClick(event) {
		// only left mouse click
		if( event.which !== 1 ) {
			return;
		}

		leftMouseClickHandler(event);
	}


	var typingHandler = handlerConfig.typing;
	var specialKeyPressHandler = handlerConfig.specialKeyPress;


	function handleKeyPress(event) {
		if( event.metaKey || event.altKey || event.ctrlKey) {
			return;		// ignore
		}

		var specialTypeLiteral = findKeyIn(Abstract.EventTypes.SpecialKeyPress, function(t) { return( !t.onKeyDownOnlyHack && t.keyCode === event.keyCode ); });
		if( specialTypeLiteral ) {
			if( specialTypeLiteral === 'enter') {
				return;		// handled by handleKeyDown
			}
			delegateSpecialKeyPress(specialTypeLiteral, event);
			return;
		}
		delegateTyping(String.fromCharCode(event.charCode));
		return;
	}

	function delegateTyping(character) {
		logInfo("typing-event occurred: '" + character + "'");
		typingHandler(character);
	}

	function delegateSpecialKeyPress(eventLiteral, originalEvent) {
		logInfo("special key press-event occurred: " + eventLiteral /* + " (type=" + originalEvent.type + ")"	// DEBUG */);
		specialKeyPressHandler(eventLiteral, originalEvent);
	}

	var specialKeyDownHandler = handlerConfig.specialKeyDown;

	function handleKeyDown(event) {
		if( event.metaKey || event.ctrlKey ) {
			var specialTypeLiteral = findKeyIn(Abstract.EventTypes.SpecialKeyPress, function(t) { return( !!t.meta && t.keyCode === event.keyCode ); });
			if( specialTypeLiteral ) {
				if( !!Abstract.EventTypes.SpecialKeyPress[specialTypeLiteral].preventDefault ) {
					event.preventDefault();
				}
				delegateSpecialKeyPress(specialTypeLiteral, event);
				return;
			}
			delegateSpecialKeyDown("meta", event);
			return;
		}
		if( event.altKey ) {
			delegateSpecialKeyDown("alt", event);
			return;
		}
		var specialTypeLiteral2 = findKeyIn(Abstract.EventTypes.SpecialKeyPress, function(t) { return( !t.meta && t.keyCode === event.keyCode ); });
		if( specialTypeLiteral2 ) {
			if( !!Abstract.EventTypes.SpecialKeyPress[specialTypeLiteral2].preventDefault ) {
				event.preventDefault();
			}
			delegateSpecialKeyPress(specialTypeLiteral2, event);
			return;
		}
	}

	function delegateSpecialKeyDown(eventLiteral, originalEvent) {
		logInfo("special key down-event occurred: " + eventLiteral);
		specialKeyDownHandler(null, eventLiteral, originalEvent);
	}

	function findKeyIn(map, testFunction) {
		var match = null;
		$.each(map, function(key, value) {
			if( testFunction(value) ) {
				match = key;
			}
		});
		return match;
	}

};


/**
 * Enumerations of event types (our particular abstraction), together with some
 * internal technical information on how to recognize these from "ordinary" JS
 * events.
 */
Abstract.EventTypes = {

	/**
	 * Enumeration of all types of special key presses.
	 */
	SpecialKeyPress: {
		backspace:	{ keyCode: 8, preventDefault: true },
		tab:		{ keyCode: 9, preventDefault: true },
		enter:		{ keyCode: 13 },
		escape:		{ keyCode: 27 },
		left:		{ keyCode: 37 },
		up:			{ keyCode: 38, preventDefault: true },
		right:		{ keyCode: 39, onKeyDownOnlyHack: true },	// keyDown => --> | keyPress ~ "'"
		down:		{ keyCode: 40, preventDefault: true  },
		insert:		{ keyCode: 45, onKeyDownOnlyHack: true  },	// keyDown => INS | keyPress ~ "-"
		'delete':	{ keyCode: 46 },
		'meta-s':	{ keyCode: 83, meta: true, preventDefault: true },
		'copy':		{ keyCode: 67, meta: true },
		'cut':		{ keyCode: 88, meta: true },
		'paste':	{ keyCode: 86, meta: true }
		// TODO  catch some more keyboard combinations (as they arise as being useful)
		// (Try and avoid alt-*, meta-alt-* &c. combinations as these are often non-standard and "nerdy".)
	}

};

