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


-
