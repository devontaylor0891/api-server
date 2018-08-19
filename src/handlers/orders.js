'use strict';
var connection = require('../../db');

module.exports = {
  get_orders: function(req, res) {
    // connection.query(
    //   `SELECT * FROM orders`,
    //   function (error, ordersResult) {
    //     let orders = ordersResult.map(function(row) 
    //       {
    //         return {
    //           id: row.order_id,
    //           chosenSchedule: {
    //             producerId: row.producer_id_fk_o,
    //           }
    //         }
    //       }
    //     );
    //     return res.status(200).send(orders);
    //   }
    // )
    var sqlString = 'SELECT * FROM orders LEFT JOIN producers ON orders.producer_id_fk_o = producers.producer_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id LEFT JOIN product_order_quantities ON orders.order_id = product_order_quantities.order_id_fk_pok LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id';
    var options = {sql: sqlString, nestTables: true, values: [1]};
  connection.query(
    options,
      function (error, ordersResult) {
        let orders = ordersResult.map(function (row) {
          let orderId = row.order.orders.order_id;
          let productsSqlString = 'SELECT * FROM product_order_quantities LEFT JOIN LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id WHERE product_order_quantities.order_id_fk_pok = ${orderId}';
          let productsOptions = {sql: productsSqlString, nestTables: true, values: [1]}; 
          connection.query(
            productsOptions,
            function(error, productsResults) {
              let results = productsResults.map(function (row) {
                return {
                  products: row
                }
              })
            }
          );
          return {
            order: row
          }
        });
        console.log('orders: ', orders);
        return res.status(200).send(orders);
      }
    )
  },
  post_order: function (req, res) {
    let orderPostQuery = {
      producer_id_fk_o: `${req.body.chosenSchedule.producerId}`,
      consumer_id_fk_o: `${req.body.consumer.id}`,
      schedule_id_fk_o: `${req.body.chosenSchedule.id}`,
      producer_comment: null,
      consumer_comment: `${req.body.orderDetails.consumerComment}`,
      delivery_address: `${req.body.orderDetails.deliveryAddress}`,
      delivery_fee: `${req.body.orderDetails.deliveryFee}`,
      created_date: `${req.body.orderDetails.createdDate}`,
      order_status: `${req.body.orderDetails.orderStatus}`,
      order_value: `${req.body.orderDetails.orderValue}`,
      incomplete_reason: null
    };
    let productQuantitiesPostQuery;
    console.log('post new order: ', orderPostQuery);
    connection.query(
      `INSERT INTO orders 
      SET ?`,
      orderPostQuery,
      function(err, result) {
        if (err) {
          res.status(500).send('error: ', err)
        } else { // success
          // use result.insertId to add to other table
          // using a for loop to add to product_quantities table
          console.log('result of post order: ', result)
          let productQuantities = req.body.orderDetails.productQuantities;
          for (let i = 0; i < productQuantities.length; i++) {
            // build query
            productQuantitiesPostQuery = {
              order_id_fk_pok: result.insertId,
              product_id_fk_pok: `${productQuantities[i].productId}`,
              quantity: `${productQuantities[i].orderQuantity}`
            };
            // run insert query
            console.log('product order qty query: ', productQuantitiesPostQuery);
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
