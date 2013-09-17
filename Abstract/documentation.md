# Documentation: Abstract

Abstract is the rewrite-from-scratch of the Concrete Model Editor. This document captures my thoughts on that rewrite.

## Motivation

The current state of Concrete relies on Prototype (although that dependency is removable) and on the fact that it is DOM-centered and not model-centered. This coupling is undesirable in general and in particular makes adding behavior to the language which requires introspection of the model (such as validation and scoping) more difficult.

## Roadmap

The Concrete editor, as used in the WDW, is fed by essentially two classes of languages (== meta models + behavior + styling): one class having the LDL as sole occupant and the other class with all the user-definied languages. It's prudent to first use the re-written Concrete editor only for one of these classes - preferably for the LDL, as the direct need is greater (because of validation and scoping) there and there's less variance to contend with.

At first, we can be directly inspired by the existing Concrete implementation for implementing widgets.

### Research

- Create an editor pane and make sure all events on it are captured - *done*
- Implement an example visualization (programmatically/statically) - *done*
- Implement a simple textual value widget with which you can edit the value - *1/2 done*
- Also create horizontal and vertical container widgets - *done* modulo appropriate styling
- Implement a simple state machine for the editor (edit state, commit/cancel edit, etc.).
- Integrate the editor's behavior (state, selection, etc.) with that.
- ...

## Naming and IP

Since this would essentially constitute a rewrite from scratch, it's no problem retaining the rights and safe-guarding the intellectual property - i.e., not releasing it as open source. In that respect, a new name would be in order - e.g., "the *Abstract* model editor", to emphasize that we're not working against the DOM anymore?


## Architecture

The rewritten Concrete editor takes a description of
- a meta model/abstract syntax,
- a model, conforming to the meta model, to edit,
- additional behavior (validation, scoping and such),
- a visualization (or more than one!),
and renders a window for editing the given model.

Internally, it decouples the model from its visualization and the editor behavior. The editor pane itself contains a visualization of the model in terms of *widgets* and acts as a giant state machine driven by user inputs/events. The editor is responsible for the following:
- it renders and manages the visualization,
- it captures events and passes some of these along to the widgets in the visualization,
- it handles callbacks from the widgets to alter the model (and triggers a repaint of the widgets where necessary),
- it triggers (re-)validation and visualizes the errors (in a visualization-independent manner).

The model is mutable but transactionally so, through commands issued by the widget through callbacks.

### Widgets

(I renamed this concept from *element* to *widget* to avoid confusion/collision with both model and HTML elements.)

_Widgets_ are elements of the visualization. They are essentially "inert" w.r.t. the model and concern themselves with visualization and possibly editing, only.

Various properties:
- Widgets render a certain part of the visualization (which may be independent of any particular model element, but can be associated to, e.g., a reference). The editor maintains a mapping between model elements and widgets and vice versa.
- Some widgets also acts as an edit widget to edit content (usually of an atomic nature). The editor explicitly switches between these modes.
- Composite widgets can act as container for other widgets - this is roughly comparable to the HTML div and span tags.
- Widgets don't handle events themselves but are required to pass these along (or better: refrain from any event handling and relying on the editor capturing all events within the editor pane) to the editor. Instead, widgets get passed certain events they subscribe to in case of the widget being in editing mode.
- Some widgets require knowledge of the model: computational closures are explicitly passed to the widget upon entering editing mode.
- Widgets should correspond (more-or-less canonically) to layout-specific concepts in the LDL. Instances of these concepts should be stylable in a more directed manner than some abstraction and simplification of CSS.
- Widgets can be selectable (at most one across the entire model) iff they correspond to an object, a feature (attribute or cross-reference) or a value thereof in the modal. (Not sure where to place the responsibilities here...)
- Widgets can have certain properties (with associated state, stored under the appropriate annotation): *"model-corresponding"* (it corresponds to an object, a feature or a value and is selectable), composable (it can act as container for other widgets), foldable/collapsable (collapsed), draggable (position), scalable (size - minimum size determined elsewhere), variable visualization (display variant type).
- Widgets have a way of communicating back that their (singular) contents has changed or that a new model element should be added (in-place).

The editor is the only component which is allowed to capture events (i.e., add an event handler). It then determines the type of the event (mouse click versus keypress etc.), determines whether it needs to do something itself (such as save, or highlighting a section of the model) or whether an widget is targeted by the event and would need to process the event.
After that, the editor checks with the widget whether it understands the event and needs to process it. The widget receives callbacks to signal back content changes if it should go into edit-mode.


#### Widgets' interface

**TODO**  describe the interface of widgets by going over Concrete's <tt>editor.js</tt>

It's probably desirable to have a separate DSL (for internal use) to describe all widgets with, possibly even containing literal JS code (as the JS plugin doesn't help that much...) so:
- the JS code can be entirely generated;
- we can map the widgets to a template part of the LDL.

