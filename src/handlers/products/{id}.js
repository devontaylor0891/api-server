'use strict';
var connection = require('../../../db');

module.exports = {
  get_products_id: function(req, res) {
    var productId = req.params.id;
    connection.query(
      // `SELECT * FROM products
      // WHERE product_id = ${productId}`,
      `SELECT 
      products.product_id,
      products.producer_id_fk_products,
      products.name AS productName,
      products.description,
      products.image,
      products.pricePerUnit,
      products.unit,
      products.unitsPer,
      products.category,
      products.subcategory,
      products.date_added,
      products.qty_available,
      products.qty_pending,
      products.qty_accepted,
      products.qty_completed,
      products.is_obsolete,
      producers.user_id AS pId,
      producers.name AS pName 
      FROM products
      LEFT JOIN producers 
      ON products.producer_id_fk_products = producers.producer_id
      WHERE product_id = ${productId}`,
      function (error, productResult) {
        let product = productResult.map(function(row) {
          return {
            id: row.product_id,
            name: row.productName,
            description: row.description,
            image: row.image,
            pricePerUnit: row.pricePerUnit,
            unit: row.unit,
            unitsPer: row.unitsPer,
            category: row.category,
            subcategory: row.subcategory,
            producer: {
              id: row.pId,
              name: row.pName
            },
            dateAdded: row.date_added,
            qtyAvailable: row.qty_available,
            qtyPending: row.qty_pending,
            qtyAccepted: row.qty_accepted,
            qtyCompleted: row.qty_completed,
            isObsolete: row.is_obsolete,
            producerId: row.producer_id_fk_products
          }
        });
        console.log('product returned: ', product);
        return res.status(200).send(product);
      }
    )

  },

  put_products_id: function (req, res) {
    // convertBooleanToTinyInt = function(bool) {
    //   bool ? 1 : 0
    // };
    req.body.isObsolete = req.body.isObsolete ? 1 : 0;
    console.log('put product called: ', req.body);

    let postQuery = {
      user_id_fk_products: `${req.body.userId}`,
      product_id: `${req.params.id}`,
      name: `${req.body.name}`,
      description: `${req.body.description}`,
      image: `${req.body.image}`,
      pricePerUnit: `${req.body.pricePerUnit}`,
      unit: `${req.body.unit}`,
      unitsPer: `${req.body.unitsPer}`,
      category: `${req.body.category}`,
      subcategory: `${req.body.subcategory}`,
      date_added: `${req.body.dateAdded}`,
      qty_available: `${req.body.qtyAvailable}`,
      qty_pending: `${req.body.qtyPending}`,
      qty_accepted: `${req.body.qtyAccepted}`,
      qty_completed: `${req.body.qtyCompleted}`,
      is_obsolete: `${req.body.isObsolete}`,
      schedule_list: `${req.body.scheduleList}`,
      producer_id_fk_products: `${req.body.producerId}`
    };
    console.log('postQuery: ', postQuery);
    let productId = req.params.id;
    connection.query(
      `UPDATE products 
      SET ?
      WHERE product_id = ?;`,
      [postQuery, productId],
      function (err, result) {
        if (err) {
          console.log('error in update product:', err);
          res.status(500).send('error:', err);
        } else {
          console.log('product updated: ', result);
          return res.status(200).send(result);
        }
      } 
    )
  },

  delete_products_id: function (req, res) {
    console.log('delete products: ', req.body);
    return res.status(200).send(req.body.id);
  }

};
  