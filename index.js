const express = require("express");
const mysql = require("mysql2");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3001;

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  database: process.env.DB_DATABASE || "personal_info",
});

app.get("/user", function (req, res, next) {
  connection.query("SELECT * FROM personal_info", function (err, results) {
    if (err) {
      console.error("Error get data personal info:", err);
      res.status(500).json({ error: "Error get personal info" });
    } else {
      console.log("Get data successful");
      res.json(results);
    }
  });
});

app.get("/user/:StudentID", function (req, res, next) {
  const StudentID = req.params.StudentID;
  connection.query(
    "SELECT * FROM personal_info WHERE StudentID = ?",
    [StudentID],
    function (err, results) {
      if (err) {
        console.error("Error get data personal info:", err);
        res.status(500).json({ error: "Error get personal info" });
      } else {
        console.log(`Get data ${StudentID} successful`);
        res.json(results);
      }
    }
  );
});

app.post("/user", function (req, res, next) {
  connection.query(
    "INSERT INTO `personal_info`(`StudentID`, `Firstname`, `Lastname`, `DOB`, `Mobilephone`) VALUES (?,?,?,?,?)",
    [
      req.body.StudentID,
      req.body.Firstname,
      req.body.Lastname,
      req.body.DOB,
      req.body.Mobilephone,
    ],
    function (err, results) {
      if (err) {
        console.error("Error inserting user:", err);
        res.status(500).json({ error: "Error inserting user" });
      } else {
        console.log("Insert successful");
        res.json(results);
      }
    }
  );
});

app.put("/user", function (req, res, next) {
  connection.query(
    "UPDATE `personal_info` SET `Firstname` = ?, `Lastname` = ? , `DOB` = ? , `Mobilephone` = ? WHERE StudentID = ?",
    [
      req.body.Firstname,
      req.body.Lastname,
      req.body.DOB,
      req.body.Mobilephone,
      req.body.StudentID,
    ],
    function (err, results) {
      if (err) {
        console.error("Error update user:", err);
        res.status(500).json({ error: "Error update user" });
      } else {
        console.log("Update successful");
        res.json(results);
      }
    }
  );
});

app.delete("/user/:StudentID", function (req, res, next) {
  const StudentID = req.params.StudentID;
  connection.query(
    "DELETE FROM `personal_info` WHERE StudentID = ?",
    [StudentID],
    function (err, results) {
      if (err) {
        console.error("Error remove user:", err);
        res.status(500).json({ error: "Error remove user" });
      } else {
        console.log("Remove " + StudentID + " successful");
        res.json(results);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
