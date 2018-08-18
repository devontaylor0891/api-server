'use strict';
var connection = require('../../db');

module.exports = {
  get_orders: function(req, res) {
    connection.query(
      `SELECT * FROM orders`,
      function (error, ordersResult) {
        let orders = ordersResult.map(function(row) 
          {
            return {
              id: row.order_id
            }
          }
        );
        return res.status(200).send(orders);
      }
    )
  },
  post_order: function (req, res) {
    let orderPostQuery = {
      producer_id_fk_o: `${req.body.id}`,
      consumer_id_fk_o: `${req.body.id}`,
      schedule_id_fk_o: `${req.body.id}`,
      producer_comment: `${req.body.id}`,
      consumer_comment: `${req.body.id}`,
      delivery_address: `${req.body.id}`,
      delivery_fee: `${req.body.id}`,
      created_date: `${req.body.id}`,
      order_status: `${req.body.id}`,
      order_value: `${req.body.id}`,
      incomplete_reason: `${req.body.id}`
    };
    let productQuantitiesPostQuery;
    console.log('post new order: ', orderPostQuery);
    connection.query(
      `INSERT INTO orders 
      SET ?`,
      orderPostQuery,
      function(err, result) {
        if (err) {
          res.send('error:', err);
        } else { // success
          // use result.insertId to add to other table
          // using a for loop to add to product_quantities table
          let productQuantities = req.body.orderDetails.productQuantities;
          for (let i = 0; i < productQuantities.length; i++) {
            // build query
            productQuantitiesPostQuery = {
              order_id_fk_pol: result.insertId,
              product_id_fk_pok: `${productQuantities[i].productId}`,
              quantity: `${productQuantities[i].orderQuantity}`
            };
            // run insert query
            connection.query(
              `INSERT INTO product_order_quantities
              SET ?`,
              productQuantitiesPostQuery,
              function (err, result) {
                if (err) {
                  res.send('error: ', err);
                } else {
                  return res.status(200).send(result);
                }
              }
            )
          } 
        }
      }
    )
  }
};
