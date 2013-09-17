var Example1Data = {	// TODO  move to new (function() { ... })() style to make using local&closure var's easier

	metaModelJSON: [
	{
		metaMetaType : 'Class',
		name : 'Object',
		features : [
			{
				name: 'name',
				kind: 'attribute',
				required: true,
				manyValued: false,
				type: 'String'
			},
            {
				name : 'subObjects',
				kind: 'containment',
				manyValued: true,
				type: 'SubObject',
				annotations: [ '_view' ]
			}
		]
	},
	{
		metaMetaType: 'Class',
		name: 'SubObject',
		features : [ {
			name: 'name',
			kind: 'attribute',
			required: true,
			manyValued: false,
			type: 'String'
		} ]
	}
	],

	modelJSON: [
 		{
 			metaType: 'Object',
 			settings: {
 				name: 'foo',
 				subObjects: [
 				             {
 				            	 metaType: 'SubObject',
 				            	 settings: { name: 'bar' }
 				             }
 				            ]
 			}
 		}
 	],
/*
 * , {
 *  _annotation: 'view',
 *  	value: { foldOpen: true }
 * }
 * 
 * But how will the annotation value of a single-valued feature be serialized (lack of array)?
 */
 			/*
 			 * , _annotationValues: {
 			 * 		'@subObjects': {
 			 * 			view: { foldOpen: true }
 			 * 		}
 			 * }
 			 * 
 			 * or
 			 * 
 			 * , '_@nnotations': {
 			 * 		'_features': {
 			 * 			'subObjects': {
 			 * 				'view': { 'foldOpen': true }
 			 * 			}
 			 * 		}
 			 *		//, class annotation values here
 			 * }
 			 */

 	templates: {
		objectTemplates: {
			'Object': function(mObject) {
						var outerGroup = new Abstract.Widgets.Layout.VerticalGroup();
						var nameSubGroup = new Abstract.Widgets.Layout.HorizontalGroup();
						outerGroup.append(nameSubGroup);
						var nameFeature = mObject.metaType.features['name'];
						nameSubGroup.append(new Abstract.Widgets.Layout.PlainTextWidget({ text: "Object" }));
						nameSubGroup.append(new Abstract.Widgets.Impl.EditableTextWidget({ 'mObject': mObject, 'feature': nameFeature }));
						var subObjectsFeature = mObject.metaType.features['subObjects'];
						var subObjectsOuterGroup = new Abstract.Widgets.Layout.VerticalGroup({
							collapsible: true,
							'mObject': mObject,		// have to pass this explicitly since collapsedStateCallback will be called outside of the closure's context
							collapsedStateCallback: function(open) {
								var setting = this.mObject.get(subObjectsFeature);
								var view = setting.getAnnotation('_view');
								if( !view ) {
									view = {};
								}
								view.foldOpen = open;
								setting.setAnnotation('_view');
							}
						});
						outerGroup.append(subObjectsOuterGroup);
						// TODO  only make this appear if #subObjects > 0:
						subObjectsOuterGroup.append(new Abstract.Widgets.Layout.PlainTextWidget({ text: "Sub objects:" }));
						var subObjectsInnerGroup = new Abstract.Widgets.Layout.VerticalGroup();
						subObjectsOuterGroup.append(subObjectsInnerGroup, false);
						var renderedSubObjects = this.renderWidgetForValue(mObject.get(subObjectsFeature), subObjectsFeature);
						$(renderedSubObjects).each(function() { subObjectsInnerGroup.append(this); });
						return outerGroup;
					},
			'SubObject': function(mObject) {
							var group = new Abstract.Widgets.Layout.HorizontalGroup();
							var feature = mObject.metaType.features['name'];
							group.append(new Abstract.Widgets.Layout.PlainTextWidget({ text: "Sub object" }));
							group.append(new Abstract.Widgets.Impl.EditableTextWidget({ 'mObject': mObject, 'feature': feature }));
							return group;
						}
		},

		featureTemplates: {
			'Object' : {
				'subObjects' : function(value, feature) {
									var renderObject = this;
									return value.map(function(val) {
										return renderObject.renderWidgetForInstance(val);
									});
								}
			}
		}
 	}

};
