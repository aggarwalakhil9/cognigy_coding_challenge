# Coding challenge
## Introduction
The current directory contains this ``README.md`` file as well as a folder called ``assets``. The ``assets`` folder contains files that are necessary to work on the coding challenge. Please have a careful look into these files - they contain anything necessary for you to solve the problem.

## The problem
The ``flow.json`` (you can find it in the ./assets folder!) contains data of a real document from a COGNIGY.AI installation. It is a document that stores all information about a flow. It contains things like ``intents``, ``states``, default ``context`` as well as a ``json`` field.

The ``json`` field contains a nested, tree-like structure that represents a conversation-tree, which users of our software can normally edit in a pure graphical way using our so called ``Flow Editor``. You can also find a screenshot of what the flow looks like, if you would open it in our ``Flow Editor`` (have a look at ``./assets/flow-structure-graphical.png``).

Since the following problem only deals with the ``json`` field of the ``flow.json``, you can find a more readable copy of this field in a separate file called ``flow-structure.json``. Please have a look at this file, now.

You will recognize, that it essentially contains a nested data-structure of ``nodes``. These are the individual flow nodes you might already know from the ``Flow Editor``. Every ``node`` essentially has the following data format:
```typescript
{
    "id": string, // unique-id within the flows json
    "sort": number,   // defines the order for sibling elements
    "type": string, // type of node
    "collapsed": boolean, // stores the collapsed info of children
    "data": Object, // data specific to this node
    "children": [] // children attached to this node, every child has the same data-structure than the whole object described here
}
```

The main problem we have with this data structure is, that we need to recursively parse the whole tree (the whole ``json`` field of a flow) when we e.g. want to ``insert`` a new node. We also need this recursive operation for ``delete`` and ``update`` operations on nodes. Parsing larger flows in this recursive manner, especially on a shared environment, is a heavy operation/

## The idea
We want to migrate our data-model for storing these ``trees`` (aka ``nodes``) so that they get stored in a flat list within a ``flow`` vs. storing them in a ``nested structure``. The idea looks like:
```typescript
{
    ..., // some properties omited (have a look at flow.json)
    nodes: [
        {
            "id": string,
            "sort": number,
            "type": string,
            "data": Object,
            "children": ...
        }
    ]
}
```

The challenge is, that we of course still need to deal with the ``children``. We want to be able to ``update``, ``add`` and ``delete`` nodes by just executing 'simple' database queries, instead of loading the whole flow, parsing it recursively, update an object in memory and storing it back to the database.

## Your challenge
Build a small node-application based on:
- modern Node.JS (node 10)
- express
- mongoose
- Typescript

Build a very thin application that connects to a ``MongoDB`` on startup and exposes a ``RESTful`` API to ``add``, ``update`` and ``delete`` those nested ``nodes`` within ``flow`` document (see ``flow.json``). Please do not overcomplicate the problem and its code! Keep it as simple as possible. There is e.g. no need to be able to create a ``flow`` or update ``other fields`` of a flow! The API should really only be able to fulfil the job of managing ``nodes``.

We want to see, whether you can come-up with a solution to store the ``nodes`` within the described new structure. Try to write ``efficient database-queries`` (e.g. use the $pull operator!) that allows you to update/add/delete these nodes within the ``tree`` of nodes. Please don't forget the ``parent <-> children`` relation! You can add additional fields to the data-schema of a ``node`` if necessary.

Store youre code within a ``GIT`` repository and put your code in ``GitHub``! Send us a link to your solution on ``GitHub`` via email.

## What we will have a look at
We will inspect the following things:
- is your solution fully functional?
- does your solution contain all the necessary information another developer needs to get started? (e.g. README.md file?)
- code-quality
- indentation
- naming of files, functions, classes etc
- comments and their quality