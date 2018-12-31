import app from "./app";
import config from "./config/config";

app.listen(config.APP_PORT, () => {
    console.log('Express server listening on port ' + config.APP_PORT);
})