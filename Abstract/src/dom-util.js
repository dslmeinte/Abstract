/**
 * Util singleton to help with DOM interaction (on top of jQuery).
 */

Abstract.Util = {};

Abstract.Util.Dom = function() {

	/**
	 * @return The first HTML element upwards having the prescribed CSS class.
	 *			This may equal the given element itself.
	 */
	function firstUp (_element, cssClass) {
		var element = $(_element);
		if( element.hasClass(cssClass) ) {
			return element;
		}
		element = element.parents('.' + cssClass);
		if( element.length > 0 ) {
			return element.first();
		}
		return undefined;
	}

	/**
	 * @return Checks whether the given jQuery object which is supposed to wrap
	 *         exactly one DOM element and a given HTML DOM element (with the
	 *         arguments in that order!) represent the same node.
	 */
	function checkSame (jQueryObj, domElt) {
		return jQueryObj[0].isSameNode(domElt);
	}

	return {
		'firstUp':		firstUp,
		'checkSame':	checkSame
	};

}();

