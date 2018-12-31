import * as mongoose from 'mongoose';
import { FlowSchema } from '../models/Flow';
import { Request, Response } from 'express';
import { INode, IFlowNodes } from '../interfaces/IFlowNodes';
import constants from '../config/constants';


const Flow = mongoose.model('Flow', FlowSchema);

export class FlowController{

    public addNewFlow = (req: Request, res: Response): void => {
        let newFlow = new Flow(req.body);
        newFlow.save().then((flow) => {
            res.json(flow);
        })
        .catch((err) => {
            res.send(err);
        });
    }

    public getAllFlows = (req: Request, res: Response): void => {
        Flow.find({}).then((flows) => {
            res.json(flows);
        })
        .catch((err) => {
            res.send(err);
        });
    }

    public getFlow = (req: Request, res: Response): void => {
        if(!this.validateRequestParams(req)){
            res.send({
                message: "Invalid Request Flow ID"
            });
            return;
        }
        Flow.findById(req.params.flowId).then((flow) => {
            res.json(flow);
        })
        .catch((err) => {
            res.send(err)
        });
    }

    public addNode = (req: Request, res: Response): void => {
        let { flowId, node } = req.body;
        if(!this.validateFlowId(flowId) || !this.validateNode(node)){
            res.send({
                message: "Invalid request"
            });
            return;
        };

        /* node is present. create an id. 
           This saves us extra query to find the id of the latest node added, needed in case of updating parent node
        */
        node._id = new mongoose.Types.ObjectId();
        // check is this a root node. just add it to the list of nodes
        if(node.parentId === constants.ROOT_PARENT_ID){
            Flow.findByIdAndUpdate(flowId, 
                { $push : { nodes : node }, lastChanged: new Date() }, 
                { 'new': true }
            ).then((flow) => {
                res.json(flow);
            })
            .catch((err) => {
                res.send(err);
            })
        }        
        else{
            /* This is a child node, add to the list of nodes and update corresponding parent node to add child in the list of children.
               NOT maintaining transactions - hence we shall save node first and then update corresponding parent node
               because in other case, node will be added as child but if create node DB call fails, it will result in Null Pointers
               but by saving node first even if updating parent children list fails, we don't have inconsistent data and just a 
               dangling node object wont do much harm. Error will be returned to user to try again.
            */

            let addNodePromise = new Promise((resolve, reject) => {
                Flow.findByIdAndUpdate(flowId, 
                    { $push : { nodes : node }, lastChanged: new Date()}, 
                    { 'new': true }
                ).then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });                    
            });
            addNodePromise.then(() => {
                Flow.findOneAndUpdate({ _id: flowId, "nodes._id": node.parentId}, 
                    { $push : {"nodes.$.children": node._id}, lastChanged: new Date()},
                    { 'new': true }
                ).then((flow) => {
                    res.json(flow);
                })
                .catch((err) => {
                    res.send(err);
                });                
            })
            .catch((err) => {
                res.send(err);
            });
        }
    }

    public updateNode = (req: Request, res: Response): void => {
        let { flowId, node } = req.body;
        if(!this.validateFlowId(flowId) || !this.validateNode(node)){
            res.send({
                message: "Invalid request"
            });
            return;
        };

        /* check if the updated data does not change the parentId or children array
           changing parent ID and children should be handled through 2 operations - 
           first delete the node and then add it as a child to other parent
        */
        let nodePromise = new Promise((resolve, reject) => {
            Flow.findOne({ "_id": flowId, "nodes._id": node._id}, 
                {_id: 0, 'nodes.$': 1}
            ).then((resultNode: IFlowNodes) => {
                console.log(resultNode.nodes[0].children);
                console.log(node.children);
                if(!resultNode || resultNode.nodes[0].parentId != node.parentId || !this.checkEquals(resultNode.nodes[0].children, node.children) ) {
                    reject( { message: "Cannot modify parentId or children of a node" } );
                }
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
        });

        nodePromise.then(() => {
            Flow.findOneAndUpdate( {_id: flowId, "nodes._id": node._id },
                { $set: { "nodes.$": node }, lastChanged: new Date() },
                { 'new': true}
            ).then((flow) => {
                res.json(flow);
            })
            .catch((err) => {
                res.send(err);
            });
        })
        .catch((err) => {
            res.send(err);
        })
    }

    public deleteNode = (req: Request, res: Response): void => {
        let { flowId, node } = req.body;
        if(!this.validateFlowId(flowId) || !this.validateNode(node)){
            res.send({
                message: "Invalid request"
            });
            return;
        };

        // if parentId is Root Parent, then there is no further parent to modify
        let query = this.getQuery(flowId, node);        

        /*
            since not maintaining transactions, first delete references to this node as child in all parent nodes
            then delete this node and all children nodes 
            this helps in preventing any null pointers in case commit fails in between
        */        
        let updateParentPromise = new Promise((resolve, reject) => {
            Flow.findOneAndUpdate(query,
                { $pull: { 'nodes.$.children': node._id }, lastChanged: new Date()},
                { 'new': true }
            ).then(() => {
                resolve();
            })
            .catch((err) =>{
                reject(err);
            });
        });
        updateParentPromise.then(() => {
            let deleteArray = [node._id, ...node.children];
            Flow.findOneAndUpdate({ _id: flowId}, 
                { $pull: { nodes: { _id: { $in: deleteArray}}}, lastChanged: new Date()}
            ).then((flow) => {
                res.json(flow);
            })
            .catch((err) => {
                res.send(err);
            });               
        })
        .catch((err) => {
            res.send(err);
        })
    }


    /* ***********  HELPER METHODS  ************** */
    private validateNode = (node: Object): Boolean => {
        if(!node || Object.keys(node).length == 0){
            return false;
        }
        return true;
    }

    private validateFlowId = (flowId: String): Boolean => {
        if(!flowId){
            return false;
        }
        return true;
    }

    private validateRequestParams = (req: Request): Boolean => {
        if(!req.params.flowId){
            return false;
        }
        return true;
    }

    private checkEquals = (nodeA: [String], nodeB: [String]): Boolean => {
        if((nodeA.length === nodeB.length) && (nodeA.every((element, index)=> element === nodeB[index]))) {
            return true;
        }
        return false;
    }

    private getQuery = (flowId: String, node: INode): Object => {
        return node.parentId === constants.ROOT_PARENT_ID ? 
            { _id: flowId, 'nodes.parentId': node.parentId } : { _id: flowId, 'nodes._id': node.parentId };        
    }
}