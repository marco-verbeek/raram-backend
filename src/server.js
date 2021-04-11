const app = require("./index");

app.listen(process.env.PORT || 5000, () => {
    console.log("Server started on port " + (process.env.PORT || 5000))
});