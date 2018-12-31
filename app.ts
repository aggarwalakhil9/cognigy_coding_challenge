import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/FlowRouter";
import * as mongoose from "mongoose";
import config from "./config/config";

class App {

    public app: express.Application;
    public flowRoutes: Routes = new Routes();
    public mongoUrl: string = config.DB_TYPE + "://" + config.DB_HOST + ":" + config.DB_PORT + "/" + config.DB_NAME;

    constructor() {
        this.app = express();
        this.config();        
        this.flowRoutes.routes(this.app);     
        this.mongoSetup();
    }

    private config(): void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private mongoSetup(): void{
        mongoose.connect(this.mongoUrl);
        let db = mongoose.connection;
        db.on('error', (err) => {
            console.error("Cannot connect to MongoDB. Check configurations: ", err);
            process.exit();
        })
    }
}

export default new App().app;