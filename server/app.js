// import { ApolloServer } from "@apollo/server";
// import { GraphQLError } from "graphql";
// import { startStandaloneServer } from "@apollo/server/standalone";
// import md5 from "md5";
// import axios from "axios";
// // import redis from "redis";
// // const redis = require("redis");
// const client = redis.createClient();
// import bluebird from "bluebird";
// // const bluebird = require('bluebird');
// // bluebird.promisifyAll(redis.RedisClient.prototype);
// // bluebird.promisifyAll(redis.Multi.prototype);

// import { v4 as uuid } from "uuid"; //for generating _id's

// // const hgetallAsync = bluebird.promisify(client.hgetall).bind(client);
// // const hset = bluebird.promisify(client.hset).bind(client);

// const apiKey = "35fb10d097929be74585a6cb703cf5a1";
// const privateKey = "988e2738a0793a8a10e4fa74d2abfa76fd134541";

// // A schema is a collection of type definitions (hence "typeDefs")
// // that together define the "shape" of queries that are executed against
// // your data.
// const typeDefs = `#graphql

//   type Event {
//     id: ID!
//     image: String!
//     name: String!
//     description: String
//     location: String!
//     date: String!
//   }

//   type Query {
//     eventList(pageNum: Int, searchTerm: String): [Event]
//     getEvent(id: ID!): Event
//   }

//   type Mutation {
//     uploadEvent(
//       image: String!
//       location: String!
//       name: String!
//       date: String!
//       description: String
//     ): Location
//     updateEvent(
//       id: ID!
//       image: String!
//       name: String!
//       location: String!
//       date: String!
//       description: String
//     ): Location
//     deleteEvent(id: ID!): Location
//   } 
// `;
// // const getHash = async (hash) => {
// //   const hashData = await client.hgetallAsync(hash);
// //   console.log(hashData);
// //   return hashData;
// // };

// const test = (data) => console.log(data);
// const resolvers = {
//   Query: {
//     characterList: async (_, args) => {
//       const searchTerm = args.searchTerm;
//       if (searchTerm && searchTerm !== "") {
//         // const pageCache = await client.hgetAsync(["SEARCH", `${searchTerm}`]);
//         // if (pageCache) {
//         //   return JSON.parse(pageCache);
//         // }
//         const timeStamp = Date.now().toString();
//         const hash = md5(timeStamp+privateKey+apiKey);
//         const { data } = await axios.get(
//           `https://gateway.marvel.com/v1/public/characters?apikey=${apiKey}&hash=${hash}&ts=${timeStamp}&nameStartsWith=${searchTerm}`
//         );
//         const { results } = data?.data ?? data;
//         if (results.length === 0) {
//           throw new GraphQLError('No more characters in the list', {
//             extensions: {
//               code: 'PERSISTED_QUERY_NOT_FOUND',
//             },
//           });
//         }
//         const resultArr = results.map((result) => {
//           const resultObj = {};
//           resultObj.id = result.id.toString();
//           resultObj.name = result.name;
//           resultObj.location = result.location;
//           resultObj.date = result.date;
//           resultObj.description = result?.description && result.description.trim().length > 0 ? result.description : "No description available" ;
//           const imageData = result?.thumbnail?.path ? !result.thumbnail.path.includes("image_not_available") ? result.thumbnail.path : null : null;
//           resultObj.image = imageData ? imageData+"."+result.thumbnail.extension : "image_not_available";
//           return resultObj;
//         });
//         console.log(resultArr);
//         // await client.hset("SEARCH", `${searchTerm}`, JSON.stringify(resultArr));
//         return resultArr;
//       }
//       const pageNum = args.pageNum ?? "1";
//       // validate pagenum
//       if (!pageNum 
//         // || typeof pageNum != 'string' 
//       // || pageNum?.trim()?.length === 0 
//       || !Number.isInteger(Number(pageNum))
//       || parseInt(pageNum) < 1
//       || pageNum === "0") {
//         throw new GraphQLError("Invalid page number", {
//           extensions: {
//             code: 'BAD_USER_INPUT'
//           }
//         })
//       }
//       const pageSize = 20;

//       // const pageCache = await client.hgetAsync(["PAGE", `${pageNum}`]);
//       // if (pageCache) {
//       //   return JSON.parse(pageCache);
//       // }

//       const offset = (parseInt(pageNum) - 1)*pageSize;
//       const timeStamp = Date.now().toString();
//       const hash = md5(timeStamp+privateKey+apiKey);
//       const { data } = await axios.get(
//         `https://gateway.marvel.com/v1/public/characters?apikey=${apiKey}&hash=${hash}&ts=${timeStamp}&limit=${pageSize}&offset=${offset}`
//       );
//       const { results } = data?.data ?? data;
//       if (results.length === 0) {
//         throw new GraphQLError('No more characters in the list', {
//           status: 404,
//           extensions: {
//             code: 404,
//           },
//         });
//       }
//       const resultArr = results.map((result) => {
//         const resultObj = {};
//         resultObj.id = result.id.toString();
//         resultObj.name = result.name;
//         resultObj.location = result.location;
//         resultObj.date = result.date;
//         resultObj.description = result?.description && result.description.trim().length > 0 ? result.description : "No description available" ;
//         const imageData = result?.thumbnail?.path ? !result.thumbnail.path.includes("image_not_available") ? result.thumbnail.path : null : null;
//         resultObj.image = imageData ? imageData+"."+result.thumbnail.extension : "image_not_available";
//         return resultObj;
//       });
//       console.log(resultArr);
//       // await client.hset("PAGE", `${pageNum}`, JSON.stringify(resultArr));
//       return resultArr;
//     },
//     getCharacter: async (_, args) => {
//       const id = args.id.toString();
//       if (!id || id === "") {
//         throw new GraphQLError("Invalid ID", {
//           extensions: {
//             code: 'BAD_USER_INPUT'
//           }
//         })
//       }
//       // const pageCache = await client.hgetAsync(["CHARACTER", `${id}`]);
//       // if (pageCache) {
//       //   return JSON.parse(pageCache);
//       // }
//       // validate id
//       const timeStamp = Date.now().toString();
//       const hash = md5(timeStamp+privateKey+apiKey);
//       try {
//         const { data } = await axios.get(
//           `https://gateway.marvel.com/v1/public/characters/${id}?apikey=${apiKey}&hash=${hash}&ts=${timeStamp}`
//         );
//         console.log("DATA:", data);
//       } catch (err) {
//         console.log(err);
//         throw new GraphQLError(err, {
//           extensions: {
//             code: 404,
//           },
//         });
//       }
//       const { data } = await axios.get(
//         `https://gateway.marvel.com/v1/public/characters/${id}?apikey=${apiKey}&hash=${hash}&ts=${timeStamp}`
//       );
//       console.log("DATA:", data);
//       const { results } = data.data;
//       console.log(results);
//       if (results.length === 0) {
//         throw new GraphQLError('No such character found', {
//           status: 404,
//           extensions: {
//             code: 'PERSISTED_QUERY_NOT_FOUND',
//           },
//         });
//       }
//       const result = {
//         id: results[0].id.toString(),
//         name: results[0].name,
//         location: results[0].location,
//         date: results[0].date,
//         description: results[0]?.description && results[0].description.trim().length > 0 ? results[0].description : "No description available",
//       };
//       const imageData = results[0]?.thumbnail?.path ? !results[0].thumbnail.path.includes("image_not_available") ? results[0].thumbnail.path : null : null;
//       console.log(imageData);
//       result.image = imageData ? imageData+"."+results[0].thumbnail.extension : "image_not_available";
//       console.log(results[0], result);
//       // await client.hset("CHARACTER", `${id}`, JSON.stringify(result));
//       return result;
//     },
//   },
//   Mutation: {
//     uploadLocation: async (_, args) => {
//       const newLocation = {
//         ...args,
//         liked: false,
//         userPosted: true,
//         id: uuid(),
//       };
//       await client.hset(
//         `LOCATIONS`,
//         `${newLocation.id}`,
//         JSON.stringify(newLocation)
//       );
//       return newLocation;
//     },
//     updateLocation: async (_, args) => {
//       const locationToUpdate = await client.hgetAsync(
//         `LOCATIONS`,
//         `${args.id}`
//       );
//       const likedLocation = await client.hgetAsync(`LIKED`, `${args.id}`);
//       let newLocation = {
//         ...args,
//       };
//       if (args && !args.liked && likedLocation) {
//         newLocation = { ...args, ...JSON.parse(likedLocation), liked: false };
//         await client.hdel(`LIKED`, `${args.id}`);
//         if (locationToUpdate) {
//           newLocation = {
//             ...args,
//             ...JSON.parse(locationToUpdate),
//             liked: false,
//           };
//           await client.hset(
//             `LOCATIONS`,
//             `${args.id}`,
//             JSON.stringify({
//               ...args,
//               ...JSON.parse(locationToUpdate),
//               liked: false,
//             })
//           );
//         }
//       } else if (args && args.liked && !likedLocation) {
//         newLocation = { ...args, ...JSON.parse(likedLocation), liked: true };
//         await client.hset(
//           `LIKED`,
//           `${args.id}`,
//           JSON.stringify({ ...args, ...JSON.parse(likedLocation), liked: true })
//         );
//         if (locationToUpdate) {
//           newLocation = {
//             ...args,
//             ...JSON.parse(locationToUpdate),
//             liked: true,
//           };
//           await client.hset(
//             `LOCATIONS`,
//             `${args.id}`,
//             JSON.stringify({
//               ...args,
//               ...JSON.parse(locationToUpdate),
//               liked: true,
//             })
//           );
//         }
//       }
//       return newLocation;
//     },
//     deleteEvent: async (_, args) => {
//       const id = args.id;
      

      
//       // return await client.hgetall(`LOCATIONS`); // TODO: Fix hgetall logic
//     },
//   },
// };

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// });

// console.log(`🚀  Server ready at: ${url}`);

// Setup server, session and middleware here.
const express = require("express");
const session = require("express-session");
// const BodyParser = require("body-parser");
const configRoutes = require("./routes");

const app = express();
const qs = require("qs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// client.connect().then(() => {});

app.use(
  session({
    name: "authCookie",
    secret: "Our secrets are ours to keep",
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 6000000 },
  })
);

app.set("query parser", function (str) {
  return qs.parse(str, {
    /* custom options */
  });
});

// MIDDLEWARE GOES BELOW:
// app.use(async (req, res, next) => {
//   // let exists = await client.getAsync("SESSION");;
//   if (!req.session?.user) {
//     req.session.user = JSON.parse(exists);
//   }
//   next();
// });

// LOGGING MIDDLEWARE
// The fourth will apply to the entire application and will keep track
// of many times a particular URL has been requested, updating
// and logging with each request.
const urlsAccessed = {};

app.use(async (req, res, next) => {
  if (!urlsAccessed[req.originalUrl]) urlsAccessed[req.originalUrl] = 0;

  urlsAccessed[req.originalUrl]++;

  console.log(urlsAccessed);
  next();
});

// The third middleware will apply to the entire application and
// will log all request bodies if there is a request body
// (GET routes can/will just log an empty object for the request body).
// Do not log passwords from the request body if the request body
// contains a password field. You will also log the url path they
// are requesting, and the HTTP verb they are using to make the request
app.use(async (req, res, next) => {
  const { password, ...reqBody } = req?.body ?? {};
  const reqMeth = req?.method ?? null;
  const reqPath = req?.path ?? null;
  console.log(reqMeth, reqPath, reqBody);
  next();
});

// MIDDLEWARE

// AUTH MIDDLEWARE
// You will apply a middleware that will be applied to the
// POST, PUT and PATCH routes for the /events endpoint that will
// check if there is a logged in user, if there is not a user
// logged in, you will respond with the proper status code
// and display and error message. (A non-logged in user
// SHOULD be able to access the GET /events route)
app
  .route("/events/*")
  .post(async (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "The user is not logged in" });
    }
    next();
  })
  .put(async (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "The user is not logged in" });
    }
    next();
  })
  .patch(async (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "The user is not logged in" });
    }
    next();
  });
// MIDDLEWARE ENDS HERE

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
