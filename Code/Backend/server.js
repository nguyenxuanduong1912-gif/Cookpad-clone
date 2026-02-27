const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const database = require("./Config/database");
const router = require("./Routers/Client/index.router");
const routerAdmin = require("./Routers/Admin/index.router");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
const port = process.env.PORT;
// Kết nối với database
database.connect();
router(app);
routerAdmin(app);
app.listen(port);
