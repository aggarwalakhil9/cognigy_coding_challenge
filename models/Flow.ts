import * as mongoose from 'mongoose';
import { NodeSchema } from './Node';

const Schema = mongoose.Schema;

export const FlowSchema = new Schema({
    img: {
        type: String,
    },
    name: {
        type: String,
        required: 'Enter a name'
    },
    version: {
        type: Number
    },
    draft: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    createdBy: {
        type: String
    },
    lastChanged: {
        type: Date,
        default: new Date()
    },
    lastChangedBy: {
        type: String
    },
    nodes: {
        type: [NodeSchema]
    }
});

