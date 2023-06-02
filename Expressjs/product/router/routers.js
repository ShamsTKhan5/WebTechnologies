const express = require("express");
const router = express.Router();
const connection = require("../db/dbconnect");

// Find all products
router.get("/products", function(req, resp) {
  connection.query("SELECT * FROM product", (err, data) => {
    if (err) {
      resp.status(500).send("No data found: " + JSON.stringify(err));
    } else {
      resp.render("index", { productdata: data });
    }
  });
});

// Display blank form to add a new product
router.get("/displayaddform", (req, resp) => {
  resp.render("add-product");
});

// Insert new product record in the database
router.post("/insertproduct", (req, resp) => {
  var pid = req.body.pid;
  var pname = req.body.pname;
  var price = req.body.price;
  connection.query(
    "INSERT INTO product (pid, pname, price) VALUES (?, ?, ?)",
    [pid, pname, price],
    (err, result) => {
      if (err) {
        resp.status(500).send("Data not added: " + JSON.stringify(err));
      } else {
        resp.redirect("/products");
      }
    }
  );
});

// Retrieve data of a product and display it in the form for updating
router.get("/edit/:pid", (req, resp) => {
  connection.query(
    "SELECT * FROM product WHERE pid = ?",
    [req.params.pid],
    (err, data) => {
      if (err) {
        resp.status(500).send("Data not found: " + JSON.stringify(err));
      } else {
        resp.render("update-product", { product: data[0] });
      }
    }
  );
});

// Update data in the table and go back to /products
router.post("/updateproduct", (req, resp) => {
  var pid = req.body.pid;
  var pname = req.body.pname;
  var price = req.body.price;
  connection.query(
    "UPDATE product SET pname = ?, price = ? WHERE pid = ?",
    [pname, price, pid],
    (err, result) => {
      if (err) {
        resp.status(500).send("Data not updated: " + JSON.stringify(err));
      } else {
        resp.redirect("/products");
      }
    }
  );
});

// Delete a product
router.get("/delete/:pid", (req, resp) => {
  connection.query(
    "DELETE FROM product WHERE pid = ?",
    [req.params.pid],
    (err, result) => {
      if (err) {
        resp.status(500).send("Data not deleted: " + JSON.stringify(err));
      } else {
        resp.redirect("/products");
      }
    }
  );
});

module.exports = router;
