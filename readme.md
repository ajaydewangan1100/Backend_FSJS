## All process goes here -

1. npm init

2. create -> _/src/appp.js_ & _/src/index.js_

3. npm i express mongoose dotenv

4. **.gitignore** -> create and also do git works (optional)

5. update _index.js_ -

   > goto - *https://mongoosejs.com/*
   > goto - *https://mongoosejs.com/docs/connections.html#error-handling*
   > mongoose connection

```
(async () => {
    try {
        await mongoose.connect('');
    } catch (err) {
        console.error("ERROR: ", err)
        throw err
    }
})()
```

6. check express is connected with mongoDB -

- > goto site - *http://expressjs.com/en/5x/api.html#app.onmount*
- > [coded - src/index.js](src/index.js)

```
app.on("error", (err) => {
    console.log("ERROR: ", err);
    throw err;
});

// listening here
const onListening = () => {
    console.log("Listening on port ", process.env.PORT);
};

app.listen(process.env.PORT, onListening);
```

7. create _.env_ -> for envirnment variables -

   > check .env

8. create _/src/config/index.js_ -> for configuration in one place and export that so we can use it anywhere on our project -

   > [Goto - src/config/index.js](src/config/index.js)

9. create _/src/utils/AuthRoles.js_ -> for user roles which we can access from anywhere

   > [goto - src/utils/AuthRoles.js](src/utils/authRoles.js)

10. create _/src/models/collection.schema.js_ -> for collection schema

    > [go to - /src/models/collection.schema.js](src/models/collection.schema.js)

11. create _/src/models/user.schema.js_ -> for **user schema**

    > [goto - /src/models/user.schema.js](src/models/user.schema.js)

12. encryption of password - install **bcryptjs** for encryption purpose -

- > [goto - npm bcrypt](https://www.npmjs.com/package/bcryptjs)
- > [go to code - src/models/user.schema.js](src/models/user.schema.js)

```
import bcrypt from "bcryptjs";
..
..
userSchema.pre("save", async function (params) {
  if (this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next()
});
```

13. Provide methods - for checking or updating things under DB before update or after update ->
    > [goto site for schema.prototype](<https://mongoosejs.com/docs/api/schema.html#Schema.prototype.method()>)

- Comparing password -

```
comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
```

14. Now we need to generate token if all things correct and password matched ->
    - > [goto - jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)
    - > Usage read docs - `jwt.sign(payload, secretOrPrivateKey, [options, callback])`

- add to _.env_

```
JWT_SECRET=mysecret
JWT_EXPIRY=7d
```

- update _src/config/index.js_ we need to use this values -

```
JWT_SECRET: process.env.JWT_SECRET || "mysecret",
JWT_EXPIRY: process.env.JWT_EXPIRY || "10d",
```

- update _src/models/user.schema.js_ add method for JWT -

```
import JWT from "jsonwebtoken"
import config from "../config/index"
import crypto from "crypto";
...
...

```

-
