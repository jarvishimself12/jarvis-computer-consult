const express = require("express");
const cors = require("cors");

require("dotenv").config();

const db = require("./db");

const app = express();

const PORT = 5000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", function (req, res) {

    res.json({
        message: "DC TECH & ART SERVICES backend is running."
    });

});


// ==========================================
// GET ALL PRODUCTS
// ==========================================

app.get("/api/products", async function (req, res) {

    try {

        const [products] = await db.query(
            "SELECT * FROM products"
        );

        console.log(
            products.length +
            " products retrieved from database."
        );

        res.json(products);

    } catch (error) {

        console.error(
            "Error retrieving products:",
            error.message
        );

        res.status(500).json({

            message: "Failed to retrieve products.",

            error: error.message

        });

    }

});


// ==========================================
// GET ONE PRODUCT
// ==========================================

app.get(
    "/api/products/:id",
    async function (req, res) {

        try {

            const id = req.params.id;

            const [products] =
                await db.query(
                    "SELECT * FROM products WHERE id = ?",
                    [id]
                );

            if (products.length === 0) {

                return res.status(404).json({

                    message: "Product not found."

                });

            }

            res.json(products[0]);

        } catch (error) {

            console.error(
                "Error retrieving product:",
                error.message
            );

            res.status(500).json({

                message:
                    "Failed to retrieve product.",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, function () {

    console.log(
        `DC TECH backend running at http://localhost:${PORT}`
    );

});