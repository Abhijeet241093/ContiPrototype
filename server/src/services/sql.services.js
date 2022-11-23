import { Model } from "objection"
import Knex from "knex"
import config from "../config.js"
import path from 'path';

const __dirname = path.resolve();


const initSQLPostgres = async () => {
    let configRds = {
        client: "postgres",
        useNullAsDefault: true,
        connection: {
            host: config.aws.rds_host,
            user: config.aws.rds_user,
            password: config.aws.rds_password,
            database: config.aws.rds_name,
            port: config.aws.rds_port
        },
        pool: {
            min: 2,
            max: 10,
        },
    }
    const db = Knex(configRds);
    Model.knex(db);

 
    // process.on("SIGTERM", () => {
    //     db.destroy().then(() => {
    //         process.exit(0);
    //     });
    // });

    // await db.migrate.latest();
}

export { initSQLPostgres }
