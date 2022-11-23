import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';
import cors from 'cors';
import dotenv from 'dotenv';
import http from "http"
import { initSQLPostgres } from './src/services/sql.services.js'
import workerActivity from './src/routes/workerActivity.routes.js'
import projectRequest from './src/routes/projectRequest.routes.js'
import activity from './src/routes/activity.routes.js'
import project from './src/routes/project.routes.js'
import auth from './src/routes/auth.routes.js'
import user from './src/routes/user.routes.js'
import s3 from './src/routes/s3.routes.js'
import task from './src/routes/task.routes.js'
import safetyReport from './src/routes/safetyReport.routes.js'

const __dirname = path.resolve();
dotenv.config({ path: __dirname + '/server/.env' });
const PORT = process.env.PORT || 9093;
let app = express();
app.use(cors());

app.use(bodyParser.json({ limit: '250mb' }));

initSQLPostgres()

app.use("/api/workerActivity", workerActivity);
app.use("/api/projectRequest", projectRequest);
app.use("/api/activity", activity);
app.use("/api/project", project);
app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/task", task);
app.use("/api/safetyReport", safetyReport);
app.use("/api/s3", s3);

app.use(express.static(path.join(__dirname, 'client', 'dist')));
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
  })
} else {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/public/index.html'));
  })
}

const httpServer = http.createServer(app);

var server = httpServer
server.listen(PORT, () => { console.log(`Server listening on port ${PORT} 1`) });
server.timeout = 60 * 10 * 1000