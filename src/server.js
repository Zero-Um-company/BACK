const router = require("./routes/router");
const { printRoutes } = require("./utils/routeUtils");
const app = require('./app');
require('dotenv').config();


app.use("/", router);

printRoutes(router);

const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT || 3000, () => console.log('Server Online: ' + process.env.PORT || 3000))
