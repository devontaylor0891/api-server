'use strict';
var connection = require('../../db');

module.exports = {
  get_orders: function(req, res) {

    // create an array to hold our completed results
    let ordersArray;

    // build a query inside a promise, this will return the rows from the query
    function promisedQuery(sql) { 
      return new Promise ((resolve, reject) => {
        console.log('query: ', sql);
        connection.query(sql, function(err, rows) {
          if ( err ) {
            return reject( err );
          }
          resolve( rows );
        })
      });
    };

    // build the queries
    let getOrdersSql = 'SELECT * FROM orders LEFT JOIN producers ON orders.producer_id_fk_o = producers.producer_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id;';
    let getOrdersQueryOptions = {
      sql: getOrdersSql,
      nestTables: true
    };
    let getProductsSql = 'SELECT * FROM product_order_quantities LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id WHERE product_order_quantities.order_id_fk_pok IN (values)';
    let getProductsQueryOptions = {
      sql: getProductsSql,
      values: [],
      nestTables: true
    };
    let ordersReceived, productsReceived, results;

    // then call the promisedQuery and pass the queries into it
    promisedQuery(getOrdersQueryOptions)
      .then(rows => {
        // do stuff with the returned rows from the first query
        ordersReceived = rows;
        console.log('orders received: ', ordersReceived.length);
        // retreive the orderId and assign to the values in the getProductsQueryOptions
        for (let i = 0; i < ordersReceived.length; i++) {
          let orderId = ordersReceived[i].orders.order_id;
          console.log('id: ', orderId);
          getProductsQueryOptions.values.push(orderId);
        }
        console.log('product options: ', getProductsQueryOptions);
        // call the promisedQuery again
        return promisedQuery(getProductsQueryOptions);
      })
      .then(rows => {
        // do stuff with the rows from that query
        productsReceived = rows;
        console.log('prodcuts received: ', productsReceived.length);
        ordersArray = ordersReceived;
        ordersArray.push(productsReceived);
        return res.status(200).send(ordersArray);
      // })
      // .then(rows => {
      //   // build the final objects
      //   ordersArray = rows;
      //   // send the results
        
      }).catch(err => {
        return res.status(500).send(err);
      });

    // connection.query('SELECT * FROM orders LEFT JOIN producers ON orders.producer_id_fk_o = producers.producer_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id; SELECT * FROM product_order_quantities LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id WHERE product_order_quantities.order_id_fk_pok = 15', function (error, results, fields) {
    //   if (error) throw error;
    //   // `results` is an array with one element for every statement in the query:
    //   console.log('order: ', results[0]); // [{1: 1}]
    //   console.log('product info: ', results[1]); // [{2: 2}]
    //   return res.status(200).send(results);
    // });


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



    // var sqlString = 'SELECT * FROM orders LEFT JOIN producers ON orders.producer_id_fk_o = producers.producer_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id;';
    // // var sqlString = 'SELECT * FROM orders LEFT JOIN producers ON orders.producer_id_fk_o = producers.producer_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id LEFT JOIN product_order_quantities ON orders.order_id = product_order_quantities.order_id_fk_pok LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id';
    // var options = {sql: sqlString, nestTables: true, values: [1]};
    // connection.query(
    //   options,
    //   function (error, ordersResult) {
    //     let orders = ordersResult.map(function (row) {
    //       let newRow = {
    //         order: row,
    //         products: null
    //       }
    //       return newRow;
    //     });
    //     // console.log('orders: ', orders);
    //     // return res.status(200).send(orders);

    //     // build new object
    //     let ordersArray = orders;
    //     // loop through each order
    //     for (let i = 0; i < ordersArray.length; i++) {
    //       let orderId = ordersArray[i].order.orders.order_id;
    //       let productsSqlString = 'SELECT * FROM product_order_quantities LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id WHERE product_order_quantities.order_id_fk_pok = ?';
    //       let productsOptions = {sql: productsSqlString, nestTables: true, values: [orderId]}; 
    //       // run the query to pull in the product info
    //       connection.query(
    //         productsOptions,
    //         function (error, productsResults) {
    //           // console.log('product results: ', productsResults);
    //           let productResults = productsResults.map( function (row) {
    //             return row;
    //           });
    //           // console.log('products: ', productResults);
    //           //  ordersArray.orders[i].products = productResults;
    //           ordersArray[i].products = productResults;
    //           console.log('order: ', ordersArray[i]);
    //         }
    //       );
          
    //     };
        
    //     return res.status(200).send(ordersArray);
    //   }
    // )
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
