import {Request, Response, NextFunction} from "express";
import { FlowController } from "../controllers/FlowController";

export class Routes { 
    
    public flowController: FlowController = new FlowController() 
    
    public routes(app): void {   
        
        // helper api to check server heartbeat
        app.route('/')
        .get((req: Request, res: Response) => {            
            res.status(200).send({
                message: 'Server APIs are UP !!!'
            })
        })

        app.route('/flow')
        .get(this.flowController.getAllFlows)
        .post(this.flowController.addNewFlow);

        app.route('/flow/:flowId')
        .get(this.flowController.getFlow);
        // put to update basic flow attributes
        // delete to delete flow by id

        app.route('/flow/node')
        .put(this.flowController.updateNode)
        .post(this.flowController.addNode)
        .delete(this.flowController.deleteNode);
        
    }
}