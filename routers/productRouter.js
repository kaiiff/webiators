const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const productImage = require("../middleware/product_image");
const {
  add_product,
  update_product_data,
  update__product_images,
  get_product_by_slug,
  get_product_by_id,
  delete_product_user,
  delete_product,
} = require("../controller/productController");
const { delete_user } = require("../models/productModel");

router.post("/add_product", productImage.array("files", 5), auth, add_product);
router.post("/update_product/:product_id", auth, update_product_data);
router.post(
  "/update_product_image/:product_id/:image_id",
  auth,
  productImage.array("files", 5),
  update__product_images
);
router.get("/get_product_by_slug/:slug", auth, get_product_by_slug);
router.get("/get_product_by_id/:product_id", auth, get_product_by_id);
router.delete("/delete_product/:product_id", auth, delete_product);

module.exports = router;
