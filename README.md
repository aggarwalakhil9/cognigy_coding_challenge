# Coding challenge
## Introduction
This is a node.js based web application for performing basic CRUD operations for flow editor nodes. 
``index.ts`` is the starting point of the application, which instantiates an ``Express`` application which connects to ``MongoDB`` based on the connection config defined in ``config/config.ts``.

## Installation

### Requirements
1. MongoDB server should be up
2. Node.JS (version > 8.x. Developer testing on version > 10.x but should be backward compatible)
3. npm (version > 6.x, but should be backward compatible)

### Procedure
1. ```npm install```
2. Run the dev server ```npm run dev```
3. Run in production ```npm run prod```

## Testing
``assets`` folder contains a postman collection ``Cognigy.postman_collection.json``. Import this collection in ``postman`` to perform basic CRUD operations on the flow nodes.

## Model Schema
A sample flow would look like as below. Some property fields are ignored for simplicity purpose. Flow contains an array of all nodes participating in this flow. Each node contains Id reference to all other children nodes.

```typescript
{
    "_id" : ObjectId("5c2903274a75e087505de81d"),
    "createdAt" : 1546102718000.0,
    "lastChanged" : 1546102818000.0,
    "img" : "image url",
    "name" : "Flow 1",
    "version" : 1,
    "draft" : false,
    "createdBy" : "aggaak",
    "lastChangedBy" : "aggaak",
    "nodes" : [ 
        {
            "parentId" : "",
            "children" : [ 
                "5c29033d4a75e087505de81f", 
                "5c2903444a75e087505de821"
            ],
            "_id" : ObjectId("5c2903274a75e087505de81e"),
            "sort" : 1,
            "type" : "cognigy",
            "data" : {
                "function" : "once"
            }
        }, 
        {
            "parentId" : "5c2903274a75e087505de81e",
            "children" : [],
            "_id" : ObjectId("5c29033d4a75e087505de81f"),
            "sort" : 1,
            "type" : "once",
            "data" : {
                "function" : ""
            }
        }, 
        {
            "parentId" : "5c2903274a75e087505de81e",
            "children" : [],
            "_id" : ObjectId("5c2903444a75e087505de821"),
            "sort" : 1,
            "type" : "if",
            "data" : {
                "function" : ""
            }
        }
    ],
    "__v" : 0
}
```

## API details
API details and logic is incorporated as part of code comments alongwith the code.