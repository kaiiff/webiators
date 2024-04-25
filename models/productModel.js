const db = require("../utils/db");

const baseurl = process.env.BASE_URL;

module.exports = {
  insert_product_category: async (data) => {
    return db.query(`insert into product_category set ?`, [data]);
  },

  insert__into_product: async (data) => {
    return db.query(`insert into product set ?`, [data]);
  },

  insert_into_product_price: async (data) => {
    return db.query(`insert into product_price set ?`, [data]);
  },

  insert_product_images: async (data) => {
    return db.query(`insert into product_images set ?`, [data]);
  },

  get_product_details_by_id: async (product_id) => {
    return db.query(`
    SELECT 
    p.id,
    p.user_id,
    p.product_name,
    p.product_description,
    p.slug,
    p.created_at,
    p.updated_at,
    pc.product_category,
    GROUP_CONCAT('${baseurl}/',pi.product_image) AS product_images,
    pp.product_price
FROM product p
LEFT JOIN product_category pc ON p.id = pc.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
LEFT JOIN product_price pp ON p.id = pp.product_id
WHERE p.id = '${product_id}'
GROUP BY p.id;
   `);
  },

  fetch_slug_data: async (slug) => {
    return db.query(`select * from product where slug = '${slug}'`);
  },

  get_product_details_by_slug_and_id: async (slug, product_id) => {
    return db.query(`
    SELECT 
    p.id,
    p.user_id,
    p.product_name,
    p.product_description,
    p.slug,
    p.created_at,
    p.updated_at,
    pc.product_category,
    GROUP_CONCAT('${baseurl}/',pi.product_image) AS product_images,
    pp.product_price
FROM product p
LEFT JOIN product_category pc ON p.id = pc.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
LEFT JOIN product_price pp ON p.id = pp.product_id
WHERE p.slug = '${slug}' AND p.id = '${product_id}'
GROUP BY p.id;
   `);
  },

  update_product: async (product_id, data) => {
    const updateFields = { ...data };
    return db.query(`UPDATE product SET ? WHERE id = ?`, [
      updateFields,
      product_id,
    ]);
  },

  update_product_category: async (product_id, data) => {
    const updateFields = { ...data };
    return db.query(`UPDATE product_category SET ? WHERE product_id = ?`, [
      updateFields,
      product_id,
    ]);
  },

  update_product_price: async (product_id, data) => {
    const updateFields = { ...data };
    return db.query(`UPDATE product_price SET ? WHERE product_id = ?`, [
      updateFields,
      product_id,
    ]);
  },

  delete_product_images: async (image_id, product_id) => {
    return db.query(
      "DELETE FROM product_images WHERE id=? AND product_id = ?",
      [image_id, product_id]
    );
  },

  update_product_images: async (product_id, newImage) => {
    await db.query(
      "INSERT INTO product_images (product_id, product_image) VALUES (?, ?)",
      [product_id, newImage]
    );
  },

  delete_product_by_id: async (product_id) => {
    try {
      await db.query(`DELETE FROM product WHERE id='${product_id}'`);
      await db.query(
        `DELETE FROM product_category WHERE product_id='${product_id}'`
      );
      await db.query(
        `DELETE FROM product_price WHERE product_id='${product_id}'`
      );
      await db.query(
        `DELETE FROM product_images WHERE product_id='${product_id}'`
      );
    } catch (error) {
      throw error;
    }
  },
};
