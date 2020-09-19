import {Post} from "./entities/Post";
import {__password, __prod} from "./constants";
import {MikroORM} from "@mikro-orm/core";
import path from 'path'
import {User} from "./entities/User";

export default {
    entities: [Post, User],
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    dbName: 'thewall',
    type: 'postgresql',
    debug: !__prod,
    password: __password
} as Parameters<typeof MikroORM.init>[0]; // or as const at some point