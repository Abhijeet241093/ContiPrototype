import express from "express"
import bodyParser  from "body-parser"
import dotenv  from "dotenv"
import path from 'path'
import cors from"cors"
import http from"http"

//import ppe from"./src/routes/ppe.routes.js" 

import helmet from"./src/routes/helmet.routes.js"
import healthcheck from"./src/routes/healthcheck.routes.js"

const __dirname = path.resolve();
const app = express();
app.use(cors());
dotenv.config({ path: __dirname + "./.env" });
app.use(bodyParser.json({ limit: "900mb" }));
const port = process.env.PORT || 9112;

//app.use("/helmet", helmet); 

app.use("/helmet", helmet);
app.use("/healthcheck", healthcheck);

const httpServer = http.createServer(app);
var server = httpServer;
server.listen(port, () => {
   console.log(`Server listening on port ${port} 1`);
});
server.timeout = 60 * 10 * 1000;
