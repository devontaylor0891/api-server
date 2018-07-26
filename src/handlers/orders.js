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
  }
};
