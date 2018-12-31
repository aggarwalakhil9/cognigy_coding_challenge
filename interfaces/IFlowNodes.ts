import * as mongoose from 'mongoose';

export interface INode {
    parentId: String,
    children: [String],
    _id: mongoose.Schema.Types.ObjectId,
    sort: Number,
    type: String,
    data: Object
};

export interface IFlowNodes extends mongoose.Document {    
    nodes: [ INode ]
};
        
