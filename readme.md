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
    - > [JWT - website](https://jwt.io/)
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
// method - generate JWT token
  getJWTToken: async function () {
    JWT.sign({ _id: this._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRY,
    });
  },
```

- add method - generateForgotPasswordToken and expiry

```
// method - generate forgot password token
generateForgotPasswordToken: function () {
// generating random token string
const forgotToken = crypto.randomBytes(20).toString("hex");

// encrypting string generated by crypto
this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

//  time for token to expire - 20min here
this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

// don't forgot to return - forgotToken
return forgotToken;
},
```

15. Create product schema -

    > [goto file - src/models/product.schema.js](src/models/product.schema.js)

16. Create order Schema alongwith orderStatus -

- > [goto file - src/models/order.schema.js](src/models/order.schema.js)
- > [goto file - src/utils/orderStatus.js](src/utils/orderStatus.js)

**note** - there is multiple websites for make models(they can be paid) like - moon modeler (datensen.com)

17. Create coupon schema -

    > [goto file - src/models/coupon.schema.js](src/models/coupon.schema.js)

18. Create asynchandler - which is an HOF with try catch(for run to all DB things) -
    > [goto file - src/service/asyncHandler.js](src/service/asyncHandler.js)

```
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export default asyncHandler;
```

19. Added function for customError -

    > [got file - src/utils/customError.js](src/utils/customError.js)

20. we need to configure express for different methods and data to use -
    > [goto - src/app.js](src/app.js) , because this configurations added under that

- different type of data like - json (this method is given by express)
  `app.use(express.json());`

- urlEncode method - (for accepting urlencoded data)
  `app.use(express.urlencoded({ extended: true }));`

- CORS configure - (for cross origin resource sharing)

  > - [goto - CORS-npm](https://www.npmjs.com/package/cors)

- `app.use(cors())`

- cookie parser - with this package we can access users browsers cookies

  > [goto - cookie-parser-npm](https://www.npmjs.com/package/cookie-parser)

- `app.use(cookieParser());`

20. Started Controller methods from here - **signup** -

    > [goto signup - src/controllers/auth.controller.js](src/controllers/auth.controller.js)

21. **login** -

    > [goto - src/controllers/auth.controller.js](src/controllers/auth.controller.js)

22. **signout** -

    > [goto - src/controllers/auth.controller.js](src/controllers/auth.controller.js)

23. **logout** -

    > [goto - src/controllers/auth.controller.js](src/controllers/auth.controller.js)

24. **getProfile** -

    > [goto - src/controllers/auth.controller.js](src/controllers/auth.controller.js)

25. Middlewares - for authentication - isLoggedIn , authorize

    > [goto - src/middlewares/auth.middleware.js](src/middlewares/auth.middleware.js)

26. Controllers for collection - create, update, delete, get, getAll

    > [goto - src/controllers/collection.controler.js](src/controllers/collection.controler.js)

27. Moving for uploading other file types rather than text or json (image, video, pdf etc)

- > [S3 - npm(aws-sdk)](https://www.npmjs.com/package/aws-sdk)
- > [Coudinary - website](https://cloudinary.com/documentation/node_image_and_video_upload)

28. S3 - configuration (.env s3 secret and bucket added)

- > [s3-config.js](src/config/s3.config.js)
- > [config updated](src/config/index.js)
- > [.env added secret and bucket](.env)

29. Create image upload service -
    > [goto - src/service/imageUpload.js](src/service/imageUpload.js)

30. 

-
-
-
-

-
