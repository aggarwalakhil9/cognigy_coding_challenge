import * as mongoose from 'mongoose';
import constants from '../config/constants';

const Schema = mongoose.Schema;

export const NodeSchema = new Schema({
    parentId: {
        type: String,
        default: constants.ROOT_PARENT_ID
    },
    sort: {
        type: Number
    },
    type: {
        type: String
    },
    data: {
        type: Object
    },
    children: {
        type: [String]
    }
});