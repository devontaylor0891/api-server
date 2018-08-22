// 'use strict';
// var connection = require('../../db');

// module.exports = {
//   get_orders: function(req, res) {

//     // create an array to hold our completed results
//     let ordersArray = {
//      orders: null,
//      products: null
//     };

//     // build a query inside a promise, this will return the rows from the query
//     function promisedQuery(sql) { 
//       return new Promise ((resolve, reject) => {
//         console.log('query: ', sql);
//         connection.query(sql, function(err, rows) {
//           if ( err ) {
//             return reject( err );
//           }
//           resolve( rows );
//         })
//       });
//     };

//     // build the queries
//     let getOrdersSql = 'SELECT * FROM orders LEFT JOIN producers ON orders.producer_id_fk_o = producers.producer_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id;';
//     let getOrdersQueryOptions = {
//       sql: getOrdersSql,
//       nestTables: true
//     };
//     let getProductsSql = 'SELECT * FROM product_order_quantities LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id WHERE product_order_quantities.order_id_fk_pok IN (?)';
//     let getProductsQueryOptions = {
//       sql: getProductsSql,
//       values: [],
//       nestTables: true
//     };
//     let ordersReceived, productsReceived;
//     let values = [];

//     // then call the promisedQuery and pass the queries into it
//     promisedQuery(getOrdersQueryOptions)
//       .then(rows => {
//         // do stuff with the returned rows from the first query
//         ordersReceived = rows;
//         ordersArray.orders = ordersReceived;
//         console.log('orders received: ', ordersReceived.length);
//         // retreive the orderId and assign to the values in the getProductsQueryOptions
//         for (let i = 0; i < ordersReceived.length; i++) {
//           let orderId = ordersReceived[i].orders.order_id;
//           console.log('id: ', orderId);
//           values.push(orderId);
//         }
//         getProductsQueryOptions.values = [values];
//         console.log('product options: ', getProductsQueryOptions);
//         // call the promisedQuery again
//         return promisedQuery(getProductsQueryOptions);
//       })
//       .then(rows => {
//         // do stuff with the rows from that query
//         productsReceived = rows;
//         ordersArray.products = productsReceived;
//         console.log('prodcuts received: ', productsReceived.length);
//         return res.status(200).send(ordersArray);
//       }).catch(err => {
//         return res.status(500).send(err);
//       });

//     // connection.query('SELECT * FROM orders LEFT JOIN producers ON orders.producer_id_fk_o = producers.producer_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id; SELECT * FROM product_order_quantities LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id WHERE product_order_quantities.order_id_fk_pok = 15', function (error, results, fields) {
//     //   if (error) throw error;
//     //   // `results` is an array with one element for every statement in the query:
//     //   console.log('order: ', results[0]); // [{1: 1}]
//     //   console.log('product info: ', results[1]); // [{2: 2}]
//     //   return res.status(200).send(results);
//     // });


//     // connection.query(
//     //   `SELECT * FROM orders`,
//     //   function (error, ordersResult) {
//     //     let orders = ordersResult.map(function(row) 
//     //       {
//     //         return {
//     //           id: row.order_id,
//     //           chosenSchedule: {
//     //             producerId: row.producer_id_fk_o,
//     //           }
//     //         }
//     //       }
//     //     );
//     //     return res.status(200).send(orders);
//     //   }
//     // )



//     // var sqlString = 'SELECT * FROM orders LEFT JOIN producers ON orders.producer_id_fk_o = producers.producer_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id;';
//     // // var sqlString = 'SELECT * FROM orders LEFT JOIN producers ON orders.producer_id_fk_o = producers.producer_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id LEFT JOIN product_order_quantities ON orders.order_id = product_order_quantities.order_id_fk_pok LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id';
//     // var options = {sql: sqlString, nestTables: true, values: [1]};
//     // connection.query(
//     //   options,
//     //   function (error, ordersResult) {
//     //     let orders = ordersResult.map(function (row) {
//     //       let newRow = {
//     //         order: row,
//     //         products: null
//     //       }
//     //       return newRow;
//     //     });
//     //     // console.log('orders: ', orders);
//     //     // return res.status(200).send(orders);

//     //     // build new object
//     //     let ordersArray = orders;
//     //     // loop through each order
//     //     for (let i = 0; i < ordersArray.length; i++) {
//     //       let orderId = ordersArray[i].order.orders.order_id;
//     //       let productsSqlString = 'SELECT * FROM product_order_quantities LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id WHERE product_order_quantities.order_id_fk_pok = ?';
//     //       let productsOptions = {sql: productsSqlString, nestTables: true, values: [orderId]}; 
//     //       // run the query to pull in the product info
//     //       connection.query(
//     //         productsOptions,
//     //         function (error, productsResults) {
//     //           // console.log('product results: ', productsResults);
//     //           let productResults = productsResults.map( function (row) {
//     //             return row;
//     //           });
//     //           // console.log('products: ', productResults);
//     //           //  ordersArray.orders[i].products = productResults;
//     //           ordersArray[i].products = productResults;
//     //           console.log('order: ', ordersArray[i]);
//     //         }
//     //       );
          
//     //     };
        
//     //     return res.status(200).send(ordersArray);
//     //   }
//     // )
//   },
//   post_order: function (req, res) {
//     let orderPostQuery = {
//       producer_id_fk_o: `${req.body.chosenSchedule.producerId}`,
//       consumer_id_fk_o: `${req.body.consumer.id}`,
//       schedule_id_fk_o: `${req.body.chosenSchedule.id}`,
//       producer_comment: null,
//       consumer_comment: `${req.body.orderDetails.consumerComment}`,
//       delivery_address: `${req.body.orderDetails.deliveryAddress}`,
//       delivery_fee: `${req.body.orderDetails.deliveryFee}`,
//       created_date: `${req.body.orderDetails.createdDate}`,
//       order_status: `${req.body.orderDetails.orderStatus}`,
//       order_value: `${req.body.orderDetails.orderValue}`,
//       incomplete_reason: null
//     };
//     let productQuantitiesPostQuery;
//     console.log('post new order: ', orderPostQuery);
//     connection.query(
//       `INSERT INTO orders 
//       SET ?`,
//       orderPostQuery,
//       function(err, result) {
//         if (err) {
//           res.status(500).send('error: ', err)
//         } else { // success
//           // use result.insertId to add to other table
//           // using a for loop to add to product_quantities table
//           console.log('result of post order: ', result)
//           let productQuantities = req.body.orderDetails.productQuantities;
//           for (let i = 0; i < productQuantities.length; i++) {
//             // build query
//             productQuantitiesPostQuery = {
//               order_id_fk_pok: result.insertId,
//               product_id_fk_pok: `${productQuantities[i].productId}`,
//               quantity: `${productQuantities[i].orderQuantity}`
//             };
//             // run insert query
//             console.log('product order qty query: ', productQuantitiesPostQuery);
//             connection.query(
//               `INSERT INTO product_order_quantities
//               SET ?`,
//               productQuantitiesPostQuery,
//               function (err, result) {
//                 if (err) {
//                   res.send('error: ', err);
//                 } else {
//                   return res.status(200).send(result);
//                 }
//               }
//             )
//           } 
//        }
//       }
//     )
//   }
// };


'use strict';
var connection = require('../../db');

function buildOrderArray(ordersArray, productsArray, producersArray) {
  let formattedOrdersArray = [];
  let order = {
    chosenSchedule: null,
    consumer: null,
    orderDetails: null,
    producer: null,
    productList: null
  };
  // build each order object into a new array

  // loop through the products, and assign them to the appropriate order array

  // loop through the producers and assign them to the orders

};

module.exports = {
  get_orders: function(req, res) {

    // create an array to hold our results
    let ordersObject = {
     orders: null,
     products: null,
     producers: null
    };
    // the var to hold the properly formatted orders to expose
    let formattedOrders;

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
    // let getOrdersSql = 'SELECT * FROM orders LEFT JOIN producers ON orders.producer_id_fk_o = producers.producer_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id;';
    let getOrdersSql = 'SELECT * FROM orders LEFT JOIN schedules ON orders.schedule_id_fk_o = schedules.schedule_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id;';
    let getOrdersQueryOptions = {
      sql: getOrdersSql,
      nestTables: true
    };
    let getProductsSql = 'SELECT * FROM product_order_quantities LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id WHERE product_order_quantities.order_id_fk_pok IN (?)';
    let getProductsQueryOptions = {
      sql: getProductsSql,
      values: [],
      nestTables: true
    };
    let getProducersSql = 'SELECT * FROM producers LEFT JOIN users ON producers.user_id = users.id WHERE producers.producer_id IN (?)';
    let getProducersQueryOptions = {
      sql: getProducersSql,
      values: [],
      nestTables: true
    };
    let ordersReceived, productsReceived, producersReceived;
    let productValues = [];
    let producerValues = [];

    // then call the promisedQuery and pass the queries into it
    // ************ ORDERS ***********
    promisedQuery(getOrdersQueryOptions)
      .then(rows => {
        // do stuff with the returned rows from the first query
        // ordersReceived = rows;
        ordersReceived = rows.map(function(row) {
          return {
            // make this look like the order the front end needs
            id: row.orders.order_id,
            chosenSchedule: {
              id: row.schedules.schedule_id,
              producerId: row.schedules.producer_id_fk_s,
              type: row.schedules.schedule_type,
              description: row.schedules.description,
              startDateTime: row.schedules.start_date_time,
              endDateTime: row.schedules.end_date_time,
              hasFee: row.schedules.has_fee,
              hasWiaver: row.schedules.has_waiver,
              latitude: row.schedules.latitude,
              longitude: row.schedules.longitude,
              city: row.schedules.city,
              province: row.schedules.province,
              orderDeadline: row.schedules.order_deadline,
              address: row.schedules.address,
              fee: row.schedules.fee,
              feeWaiver: row.schedules.fee_waiver
            },
            producer: {
              id: row.orders.producer_id_fk_o
            },
            consumer: {
              id: row.users.id,
              firstName: row.users.first_name,
              email: row.users.email,
              registrationDate: row.users.registration_date,
              role: row.users.role
            },
            productList: {},
            orderDetails: {
              productQuantities: [],
              consumerComment: row.orders.consumer_comment,
              deliveryAddress: row.orders.delivery_address,
              deliveryFee: row.orders.delivery_fee,
              createdDate: row.orders.created_date,
              producerComment: row.orders.producer_comment,
              orderStatus: row.orders.order_status,
              orderValue: row.orders.order_value,
              incompleteReason: row.orders.incomplete_reason
            }
          }
        })
        ordersObject.orders = ordersReceived;
        console.log('orders received: ', ordersReceived.length);
        // retreive the orderId and producerId and assign to the values in the getProductsQueryOptions, getProducersQueryOptions
        for (let i = 0; i < ordersReceived.length; i++) {
          let orderId = ordersReceived[i].id;
          let producerId = ordersReceived[i].producer.id;
          console.log('id: ', orderId);
          productValues.push(orderId);
          producerValues.push(producerId);
        }
        getProductsQueryOptions.values = [productValues];
        console.log('product options: ', getProductsQueryOptions);
        // call the promisedQuery again
        // ************ PRODUCTS ***********
        return promisedQuery(getProductsQueryOptions);
      })
      .then(rows => {
        // do stuff with the rows from that query
        productsReceived = rows.map(function(row) {
          return {
            orderId: row.product_order_quantities.order_id_fk_pok,
            productOrderQuantities: {
              id: row.product_order_quantities.product_order_quantities_id,
              productId: row.product_order_quantities.product_id_fk_pok,
              orderQuantity: row.product_order_quantities.quantity,
            },
            products: {
              id: row.products.product_id, 
              name: row.products.name, 
              description: row.products.description, 
              image: row.products.image, 
              pricePerUnit: row.products.pricePerUnit, 
              unit: row.products.unit, 
              unitsPer: row.products.unitsPer,
              category: row.products.category,
              subcategory: row.products.subcategory,
              dateAdded: row.products.date_added,
              qtyAvailable: row.products.qty_available, 
              qtyPending: row.products.qty_pending, 
              qtyAccepted: row.products.qty_accepted,
              qtyCompleted: row.products.qty_completed,
              isObsolete: row.products.is_obsolete,
              scheduleList: row.products.schedule_list
            }
          };
        });
        ordersObject.products = productsReceived;
        console.log('prodcuts received: ', productsReceived.length);
        getProducersQueryOptions.values = [producerValues];
        console.log('producer options: ', getProducersQueryOptions);
        // call the promisedQuery again
      // ************ PRODUCERS ***********
        return promisedQuery(getProducersQueryOptions);
      })
      .then(rows => {
        producersReceived = rows.map(function(row) {
          return {
            id: row.users.id,
            firstName: row.users.first_name,
            email: row.users.email,
            registrationDate: row.users.registration_date,
            producerId: row.producers.producer_id,
            name: row.producers.name,
            location: row.producers.location,
            province: row.producers.province,
            longitude: row.producers.longitude,
            latitude: row.producers.latitude,
            status: row.producers.status,
            address: row.producers.address,
            description: row.producers.description,
            logoUrl: row.producers.logoUrl 
          };
        });
        ordersObject.producers = producersReceived;
        console.log('producers received: ', producersReceived.length);
        // build the ordersObject properly
        formattedOrders = this.buildOrderArray(ordersObject.orders, ordersObject.products, ordersO.producers);
        return res.status(200).send(formattedOrders);
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