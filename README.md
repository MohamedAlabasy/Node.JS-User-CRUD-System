<h1 align="center"> Node.JS User CRUD System </h1>

## Description:

Create routes for adding, retrieving, updating, and deleting users

## To run this project

`Step 1` : To use this project must install [Node.js](https://nodejs.org/en/) and [Mongodb](https://www.mongodb.com/try/download/community) Then Download the source code

```
git clone https://github.com/MohamedAlabasy/Node.JS-User-CRUD-System.git
```

`Step 2` : Enter the project file then install package

```
npm i --force
```

<h3 align="center">To help you understand the project</h3>

## Folder Structure

```bash
├── src
│   ├── controllers
│   │   └── auth-controller.ts => `for handel authentication function`
│   │
│   │
│   ├── interface
│   │   └── user-testing-case-data.interface.ts => `for user testing case data interface`
│   │
│   │
│   ├── middleware
│   │   ├── error-middleware.ts => `for error Middleware`
│   │   ├── morgan-middleware.ts => `for log url, method and statue of requests`
│   │   └── not-found-middleware.ts => `for not Found Middleware`
│   │
│   │
│   ├── models
│   │   └── user-schema.ts => `for handel user Schema`
│   │
│   │
│   ├── routes
│   │   ├── api
│   │   │   └── auth-router.ts => `for handel authentication route`
│   │   │   
│   │   └── routes.ts => `import all routes and exports it to index`
│   │
│   │
│   ├── tests => `for testing purposes`
│   │   ├── helpers
│   │   │   └── reporter.ts
│   │   └── indexSpec.ts => `for testing endpoint api`
│   │
│   │
│   ├── utilities
│   │   │── check-tokens.ts => `for Request check Tokens`
│   │   │── http-error.ts => `for send status with error`
│   │   └── validate-request.ts => `for validate Request`
│   │
│   │
│   └── index.ts => `to run the server`
└──
```

`Step 3` : To run project

```
node run start
```

`Step 4` : Open the browser and click : [http://localhost:8080](http://localhost:8080)

`Step 5` : Open [postman](https://www.postman.com/downloads/) and import : [API Collation](https://github.com/MohamedAlabasy/Node.JS-User-CRUD-System/blob/main/api_collection.json) You will find it in the project file.


`Step 6` : To run test case

```
node run test
```
<hr>

To run eslint to check error

```
npm run lint
```

To run eslint and auto fixed error

```
npm run lint:f
```

To compile the TS code

```
npm run build
```

To run the JS code

```
node dist/index.js
```

<hr>

Here are the [Command](https://github.com/MohamedAlabasy/Node.JS-Todo-List/blob/main/command.txt) that were used in the project, You will find it in the project file.
