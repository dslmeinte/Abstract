$(document).ready(function() {

	var messageBox = $('#messageBox');

	$(window).click(function(event) {
		handleClick(event);
		// make event.preventDefault() depend on whether the event is recognized
	});
	
	$(window).keydown(function(event) {
		handleKeydown(event);
		// make event.preventDefault() depend on whether the event is recognized
	});

	function handleClick(event) {
		var target = event.target;
		var element = firstUp(target, 'abstract_widget');
		if( element ) {
			messageBox.text("click: widget.id=" + element.attr('id'));
		} else {
			if( firstUp(target, 'abstract_editor') ) {
				messageBox.text("click, but not in the context of a widget");
			} else {
				messageBox.text("clicked outside of editor");
			}
		}
	}

	function handleKeydown(event) {
		messageBox.text("keydown, keyCode=" + event.keyCode);
	}

	/**
	 * @returns The first element upwards having the prescribed CSS class. This
	 *          may equal the given element itself!
	 */
	function firstUp(_element, cssClass) {
		var element = $(_element);
		if( element.hasClass(cssClass) ) {
			return element;
		}
		element = element.parent('.' + cssClass);
		if( element.length === 1 ) {
			return element;
		}
		return null;
	}


});
