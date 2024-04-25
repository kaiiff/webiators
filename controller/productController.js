const Joi = require("joi");
const slugify = require("slugify");
const {
  insert__into_product,
  insert_product_images,
  insert_product_category,
  insert_into_product_price,

  get_product_details_by_id,
  update_product,
  update_product_category,
  update_product_price,
  update_product_images,
  delete_product_images,
  fetch_slug_data,
  get_product_details_by_slug_and_id,
  delete_product_by_id,
} = require("../models/productModel");

exports.add_product = async (req, res) => {
  try {
    const user_id = req.user;

    const {
      product_name,
      product_description,
      product_category,
      product_price,
    } = req.body;

    // Validate using Joi
    const commonSchema = Joi.object({
      product_name: Joi.string().required(),

      product_description: Joi.string().required(),
      product_category: Joi.string().required(),
      product_price: Joi.number().required(),
    });

    const commonValidationResult = commonSchema.validate({
      product_name,
      product_description,
      product_category,
      product_price,
    });

    if (commonValidationResult.error) {
      const errorMessage = commonValidationResult.error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.json({
        message: commonValidationResult.error.details[0].message,
        error: errorMessage,
        missingParams: commonValidationResult.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      console.log("Product Name:", product_name);
      const newSlug = slugify(product_name).toLowerCase();

      // Insert common data into product
      const productData = {
        user_id,
        product_name,
        product_description,
        slug: newSlug,
      };

      const productResult = await insert__into_product(productData);
      const product_id = productResult.insertId;

      // Insert images
      let filename = "";
      if (req.files) {
        const file = req.files;
        console.log("request files==>>>", file);
        var productImage = [];
        for (let i = 0; i < file.length; i++) {
          productImage.push(req.files[i].filename);
        }
      }
      console.log("product_image==>>>", productImage);

      await Promise.all(
        productImage.map(async (item) => {
          let imageData = {
            product_image: item,
            product_id: product_id,
          };

          const insertImageResult = await insert_product_images(imageData);
        })
      );

      const categoryData = {
        product_id,
        product_category,
      };

      const insertCategoryResult = await insert_product_category(categoryData);

      const productPrice = {
        product_id,
        product_price,
      };

      const insertIntoPrice = await insert_into_product_price(productPrice);

      // Fetch product details
      const productDetails = await get_product_details_by_id(product_id);

      productDetails.forEach((product) => {
        product.product_images = product.product_images.split(",");
      });

      return res.json({
        success: true,
        message: "Product added successfully!",
        status: 200,
        data: productDetails,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.update_product_data = async (req, res) => {
  try {
    const { product_id } = req.params;
    const {
      product_name,
      product_description,
      product_category,
      product_price,
    } = req.body;

    
    const commonSchema = Joi.object({
      product_name: Joi.string().required(),
      product_description: Joi.string().required(),
      product_category: Joi.string().required(),
      product_price: Joi.number().required(),
    });

    const commonValidationResult = commonSchema.validate({
      product_name,
      product_description,
      product_category,
      product_price,
    });

    if (commonValidationResult.error) {
      const errorMessage = commonValidationResult.error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({
        message: commonValidationResult.error.details[0].message,
        error: errorMessage,
        missingParams: commonValidationResult.error.details[0].message,
        success: false,
      });
    } else {
      const slug = slugify(product_name).toLowerCase();

      // Update product data
      const productData = {
        product_name,
        product_description,
        slug: slug,
      };

      await update_product(product_id, productData);

      // Update product category
      const categoryData = {
        product_category,
      };
      await update_product_category(product_id, categoryData);

      // Update product price
      const priceData = {
        product_price,
      };
      await update_product_price(product_id, priceData);

      // fetch product details
      const productDetails = await get_product_details_by_id(product_id);

      productDetails.forEach((product) => {
        product.product_images = product.product_images.split(",");
      });

      return res.status(200).json({
        success: true,
        message: "Product updated successfully!",
        data: productDetails,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      error: error,
    });
  }
};

exports.update__product_images = async (req, res) => {
  try {
    const { product_id, image_id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded.",
      });
    }

    await delete_product_images(image_id, product_id);

    const productImages = req.files.map((file) => file.filename);

    await update_product_images(product_id, productImages);

    return res.status(200).json({
      success: true,
      message: "Product images updated successfully!",
      data: productImages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      error: error.message,
    });
  }
};

exports.get_product_by_slug = async (req, res) => {
  try {
    const { slug } = req.params;

    const slugData = await fetch_slug_data(slug);
    const product_id = slugData[0].id;
    console.log("product_id==>>", product_id);

    const fetchData = await get_product_details_by_slug_and_id(
      slug,
      product_id
    );

    fetchData.forEach((product) => {
      product.product_images = product.product_images.split(",");
    });

    return res.json({
      success: true,
      status: 200,
      message: "Data fetch successfully!",
      details: fetchData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      error: error.message,
    });
  }
};

exports.get_product_by_id = async (req, res) => {
  try {
    const { product_id } = req.params;

    const fetchData = await get_product_details_by_id(product_id);

    fetchData.forEach((product) => {
      product.product_images = product.product_images.split(",");
    });

    return res.json({
      success: true,
      status: 200,
      message: `Data fetch by given id successfully!`,
      details: fetchData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      error: error.message,
    });
  }
};

exports.delete_product = async (req, res) => {
  const { product_id } = req.params;

  let deletedProduct = await delete_product_by_id(product_id);
  console.log("deletedProduct==>>>", deletedProduct);

  return res.json({
    success: true,
    status: 200,
    message: "Product deleted successfully",
  });
};
