This module takes care of handling all events and dispatching them accordingly.

As such, it provides an abstraction over the regular HTML event model by mapping "regular" event types to event types which are aligned with the way the editor behaves.

Abstract event types:
* left mouse click (note that the right mouse click is ignored, for now: not everyone has it and its use tends to be somewhat "techy")
* typing events: regular alphanumeric keys and punctuation, including accents
* special keypress events: everything involving the ctrl/command- or alt/option-key, the arrow, function, enter, escape, backspace, delete and tab keys - excluding accents
* special keydown/-up events: used for highlighting references and such
* mouse drag events: *TBD*

These types are expressed by passing (singleton-like) objects to callbacks dedicated to that type.
These callbacks are configured through the constructor of ``Abstract.EventHandler`` which accepts
an object with the properties: leftMouseClick, specialKeyPress, specialKeyDown, typing, mouseDrag.
This effectively means that polymorphism of event(type)s is expressed through the "message port",
and that this type of polymorphism permeates to downstream clients of the events,
in particular the widgets (and their implied interface) with regards to determining which events they accept and consume.
This might look a bit cumbersome but it prevents that a single method/hook has to decode the event
(which isn't entirely as trivial as it is in Java/Xtend) and switch accordingly.

The event handler expects the following handlers (with corresponding signatures) to be passed to it:
* ``leftMouseClick(event : jQuery DOMEvent)``
* ``typing(character : 1-character String)``
* ``specialKeyPress(eventLiteral : Abstract.EventTypes.SpecialKeyPress, originalEvent : jQuery DOMEvent)``
* ``specialKeyDown(eventLiteral : "meta"/"alt", originalEvent : jQuery DOMEvent)``
* *not yet implemented:* ``mouseDrag(eventLiteral : ???, originalEvent : ???)``

The original event as a HtmlDOMEvent wrapped by jQuery, to be able to conditionally call
``#preventDefault()`` or ``#stopImmediatePropagation()`` &c. on it.

