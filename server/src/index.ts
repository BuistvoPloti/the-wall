import "reflect-metadata"
import {MikroORM} from "@mikro-orm/core";
import microConfig from './mikro-orm.config'
import express from 'express'
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql'
import {HelloResolver} from "./resolvers/hello";
import {PostResolver} from "./resolvers/post";
import {UserResolver} from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis"
import {__prod} from "./constants";
import cors from "cors"

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  const app = express();

  const RedisStrore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));
  app.use(
    session({
      name: 'qid',
      store: new RedisStrore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 100 * 60 * 60 * 24 * 255 * 2,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod,
      },
      saveUninitialized: false,
      secret: "barabashik",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({req, res}) => ({em: orm.em, req, res})

  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(27033, () => {
    console.log('server is on!');
  })
};

main().catch((err) => {
  console.log(err);
});
