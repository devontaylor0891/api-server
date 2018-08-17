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
  post_orders: function (req, res) {
    let postQuery = {
      producer_id_fk_o: `${req.body.id}`,
      consumer_id_fk_o: `${req.body.id}`,
      schedule_id_fk_o: `${req.body.id}`,
      product_quantities_id_fk_o: `${req.body.id}`,
      producer_comment: `${req.body.id}`,
      consumer_comment: `${req.body.id}`,
      delivery_address: `${req.body.id}`,
      delivery_fee: `${req.body.id}`,
      created_date: `${req.body.id}`,
      order_status: `${req.body.id}`,
      order_value: `${req.body.id}`,
      incomplete_reason: `${req.body.id}`
    };
    console.log('post new order: ', postQuery);
    connection.query(
      'INSERT INTO orders SET ?',
      postQuery,
      function(err, result) {
        if (err) {
          res.send('error:', err);
        } else {
          return res.status(200).send('result');
        }
      }
    )
  }
};
