A collection of abstract base "classes" for the widgets of the Abstract editor.

The ``Abstract.Widgets.Base`` object also takes care of maintaining a map id &rarr; widget for the benefit of look-up.
This is not really the right place, but is convenient for now.

Implementation code has to obey the following pattern:
<pre>
this.NewWidget = function(data) {

	this.htmlElt = function() {
		return ...;
	};

	...all non-overridden stuff...

	Abstract.Widgets.Base.AbstractWidget.call(this, "NewWidget", data);

	...all overridden stuff...

};
oo.util.extend(Abstract.Widgets.Base.AbstractWidget, Abstract.Widgets.Layout.NewWidget);
</pre>

## Interface (of variant nature) of widgets

Functions associated to the editor asking what the appropriate (associated) action for events (under polymorphism) would be.
Note that the names and signatures of these methods correspond 1-to-1 with those described for ``Abstract.EventHandler``.
* ``this.actionForLeftMouseClick(event : jQuery DOMEvent)``:	asks the widget what it wants to do with the given event
* ``this.actionForTyping(character : 1-character String)``:	ditto
* ``this.actionForSpecialKeyPress(eventLiteral : Abstract.EventTypes.SpecialKeyPress, originalEvent : jQuery DOMEvent)``:	ditto
* ``this.actionForSpecialKeyDown(eventLiteral : Abstract.EventTypes.SpecialKeyPress, originalEvent : jQuery DOMEvent)``:	ditto

Functions associated with performing the actions themselves.
Note that these correspond directly to actions.
* ``this.focus()``:		signals to the widget to visualize being focused
* ``this.enterEdit()``:	signals to the widget that it should enter edit mode
* ``this.exitEdit()``:	signals to the widget that editing should be broken off
* ``this.finishEdit()``:	signals to the widget that editing should be finished up
* ``this.input(character : 1-character String)``:	handle typing of 1 character

Also, we have the following function(s) in the interface:
* ``this.unfocus()``:	signals to the widget that it should yield focus and do required clean-up
 

## Enumeration of the possible responses for ``AbstractWidget#actionFor``:

* nil			<=> ignore + don't change state
* focus			<=> (re-)assign focus to this widget
* enterEdit		<=> enter edit state
* exitEdit		<=> exit edit state abnormally/prematurely
* finishEdit	<=> finish edit state normally/regularly
* input			<=> simple input (i.e., alphanumeric input)
* collapse		<=> collapse a visual element
* expand		<=> expand a visual element
* bubbleUp		<=> bubble event up
* custom		<=> do something custom...
* (navigation actions:)
* goRight
* goLeft
* goUp
* goDown
* goTreeUp
* goTreeDown

