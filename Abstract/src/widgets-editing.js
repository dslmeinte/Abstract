/**
 * Collection of editing-oriented, dynamic widgets
 */

Abstract.Widgets.Impl = {};
// TODO  rename to a more suitably-named sub module


/**
 * An editable text widget, associated to a (String-typed)
 * {@link jsmf.meta.Feature} (transported as {@code data.feature}) of a
 * {@link jsmf.model.MObject} (transported as {@code data.mObject}).
 */
Abstract.Widgets.Impl.EditableTextWidget = function(data) {

	var mObject = data.mObject;
	var feature = data.feature;
	var currentValue = (mObject && mObject.get(feature)) || data.text || "";
		// TODO  remove explicit check and fall-back option later - just for prototypes...


	// visual components:

	var totalSpan = $('<span>');

	var staticSpan = $('<span>');
	staticSpan.text(currentValue);
	totalSpan.append(staticSpan);

	var editField = $('<input type="text">');
	editField.hide();
	totalSpan.append(editField);

	this.htmlElt = function() {
		return totalSpan;
	};

	Abstract.Widgets.Base.AbstractWidget.call(this, "EditableTextWidget", data);


	// state control:

	var inEdit = false;

	this.enterEdit = function(event) {
		inEdit = true;
		staticSpan.hide();
		editField.val(currentValue);
		editField.show();
		editField.focus();
		editField.select();
	};

	this.exitEdit = function(event) {
		editField.hide();
		staticSpan.show();
		inEdit = false;
	};

	this.finishEdit = function(event) {
		this.exitEdit();
		currentValue = editField.val();
		staticSpan.text(currentValue);
		mObject.set(feature, currentValue);
	};

	this.actionForLeftMouseClick = function(event) {
		if( inEdit ) {
			return 'nil';
		}
		if( Abstract.Util.Dom.checkSame(staticSpan, event.target) ) {
			return 'enterEdit';
		}
		return 'nil';
	};

	this.actionForTyping = function() {
		return 'nil';	// let the usual input field gobble up the input
	};

	this.actionForSpecialKeyPress = function(eventLiteral, originalEvent) {
		switch(eventLiteral) {
			case 'enter':	return 'finishEdit';
			case 'escape':	return 'exitEdit';
			case 'tab':		return 'goRight';
			default:		return 'nil';
		}
	};

	this.unfocus = function() {
		this.finishEdit();
	};

	this.goRight = function() {
		this.finishEdit();
		// TODO  find next child and focus that
	};

};
oo.util.extend(Abstract.Widgets.Base.AbstractWidget, Abstract.Widgets.Impl.EditableTextWidget);

