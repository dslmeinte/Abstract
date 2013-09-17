var LDLData = {

	metaModelJSON: [
    	{
    		"metaMetaType" : "Datatype",
    		"name" : "String"
    	},
    	{
    		"metaMetaType" : "Datatype",
    		"name" : "Boolean"
    	},
    	{
    		"metaMetaType" : "Datatype",
    		"name" : "Integer"
    	},
    	{
    		"metaMetaType" : "Datatype",
    		"name" : "Float"
    	},
    	{
    		"metaMetaType": "Class",
    		"name": "Abstract Syntax",
    		"features": [
     			{
    				"required": true,
    				"manyValued": false,
    				"name": "name",
    				"type": "String",
    				"kind": "attribute"
    			},
    			{
    				"required": false,
    				"manyValued": true,
    				"name": "classifiers",
    				"type": "Classifier",
    				"kind": "containment"
    			},
    			{
    				"manyValued": true,
    				"required": true,
    				"name": "root classes",
    				"type": "Class",
    				"kind": "reference"
    			}
    		],
    		annotations: [ "view" ]
    	},
    	{
    		"metaMetaType": "Enum",
    		"literals": [
    			"String",
    			"Boolean",
    			"Integer",
    			"Float"
    		],
    		"name": "Datatypes"
    	},
    	{
    		"abstract": true,
    		"metaMetaType": "Class",
    		"name": "Classifier",
    		"features": [
    			{
    				"required": true,
    				"name": "name",
    				"type": "String",
    				"kind": "attribute"
    			},
    			{
    				"required": false,
    				"name": "documentation",
    				"type": "String",
    				"kind": "attribute"
    			}
    		]
    	},
    	{
    		"metaMetaType": "Enum",
    		"literals": [
    			"named",
    			"optionally-named",
    			"documented",
    			"abstract"
    		],
    		"name": "Modifiers"
    	},
    	{
    		"metaMetaType": "Class",
    		"name": "Enum",
    		"features": [
    			{
    				"required": true,
    				"name": "literals",
    				"type": "Enum Literal",
    				"kind": "containment"
    			}
    		],
    		"superTypes": [ "Classifier" ]
    	},
    	{
    		"metaMetaType": "Class",
    		"name": "Enum Literal",
    		"features": [
    			{
    				"required": true,
    				"name": "name",
    				"type": "String",
    				"kind": "attribute"
    			},
    			{
    				"required": false,
    				"name": "documentation",
    				"type": "String",
    				"kind": "attribute"
    			}
    		]
    	},
    	{
    		"metaMetaType": "Class",
    		"name": "Class",
    		"features": [
    			{
    				"manyValued": true,
    				"required": false,
    				"name": "modifiers",
    				"type": "Modifiers",
    				"kind": "attribute"
    			},
    			{
    				"required": false,
    				"name": "sub type of",
    				"type": "Class",
    				"kind": "reference"
    			},
    			{
    				"required": false,
    				"name": "features",
    				"type": "Feature",
    				"kind": "containment"
    			}
    		],
    		"superTypes": [ "Classifier" ]
    	},
    	{
    		"abstract": true,
    		"metaMetaType": "Class",
    		"name": "Feature",
    		"features": [
    			{
    				"required": true,
    				"name": "name",
    				"type": "String",
    				"kind": "attribute"
    			},
    			{
    				"required": false,
    				"name": "required",
    				"type": "Boolean",
    				"kind": "attribute"
    			},
    			{
    				"required": false,
    				"name": "many",
    				"type": "Boolean",
    				"kind": "attribute"
    			},
    			{
    				"required": false,
    				"name": "documentation",
    				"type": "String",
    				"kind": "attribute"
    			}
    		]
    	},
    	{
    		"metaMetaType": "Class",
    		"name": "Attribute",
    		"features": [
    			{
    				"manyValued": false,
    				"required": true,
    				"name": "type",
    				"type": "Attribute Type Literal",
    				"kind": "containment"
    			}
    		],
    		"superTypes": [ "Feature" ]
    	},
    	{
    		"abstract": true,
    		"metaMetaType": "Class",
    		"name": "Attribute Type Literal"
    	},
    	{
    		"metaMetaType": "Class",
    		"name": "Datatype Reference",
    		"features": [
    			{
    				"required": true,
    				"name": "datatype",
    				"type": "Datatypes",
    				"kind": "attribute"
    			}
    		],
    		"superTypes": [ "Attribute Type Literal" ]
    	},
    	{
    		"metaMetaType": "Class",
    		"name": "Enumeration Reference",
    		"features": [
    			{
    				"required": true,
    				"name": "enum",
    				"type": "Enum",
    				"kind": "reference"
    			}
    		],
    		"superTypes": [ "Attribute Type Literal" ]
    	},
    	{
    		"abstract": true,
    		"metaMetaType": "Class",
    		"name": "Classifier-typed Feature",
    		"features": [
    			{
    				"required": true,
    				"name": "type",
    				"type": "Classifier",
    				"kind": "reference"
    			}
    		],
    		"superTypes": [ "Feature" ]
    	},
    	{
    		"metaMetaType": "Class",
    		"name": "Reference",
    		"superTypes": [ "Classifier-typed Feature" ]
    	},
    	{
    		"metaMetaType": "Class",
    		"name": "Containment",
    		"superTypes": [ "Classifier-typed Feature" ]
    	}
    ],
	modelJSON: [
    	{
    		metaType: "Abstract Syntax",
    		settings: {
    			name: "Example Language"
    		}
    		/*
    		 * , _annotationValues: {
    		 * 		view: { foldOpen: false }
    		 * }
    		 */
    	}
    ],
	templates: {
		objectTemplates: {
			'Abstract Syntax': function(mObject) {
					var group = new Abstract.Widgets.Layout.HorizontalGroup({ collapsible: true });
					group.append(new Abstract.Widgets.Layout.PlainTextWidget({ text: 'Abstract Syntax' }));
					group.append(new Abstract.Widgets.Impl.EditableTextWidget({ 'mObject': mObject, 'feature': mObject.metaType.features['name'] }), false);
					return group;
				}
		},
		featureTemplates: {
			
		}
	}

};

