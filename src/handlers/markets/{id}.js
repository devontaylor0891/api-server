'use strict';
var connection = require('../../../db');
var async = require('async');

module.exports = {
  get_markets_id: function(req, res) {
    console.log('get markets req: ', req.params.id);
    var marketId = req.params.id;
    connection.query(
      `SELECT * FROM markets
      LEFT JOIN users ON markets.user_id_fk = users.id
      WHERE user_id_fk = ${marketId}`, function (error, marketResult) {
        console.log('marketResult: ', marketResult);
        let market = marketResult.map(function(row) 
          {
            return {
              id: row.user_id,
              marketId: row.market_id,
              name: row.name,
              location: row.location,
              province: row.province,
              longitude: row.longitude,
              latitude: row.latitude,
              status: row.status,
              address: row.address,
              description: row.description,
              logoUrl: row.logoUrl,
              firstName: row.first_name,
              email: row.email,
              registrationDate: row.registration_date
            }
          }
        );
        return res.status(200).send(market);
      }
    )
  },

  put_markets_id: function(req, res) {
    console.log('put market params id: ', req.params.id);
    console.log('put market body: ', req.body);
    let postQuery = {
      name: `${req.body.name}`,
      description: `${req.body.description}`,
      logoUrl: `${req.body.logoUrl}`
    };
    let userId = req.params.id;
    connection.query(
      `SET SQL_SAFE_UPDATES=0;
      UPDATE markets 
      SET ? 
      WHERE user_id_fk = ?;
      SET SQL_SAFE_UPDATES=1;`,
      [postQuery, userId],
      function (err, result) {
        if (err) {
          res.status(500).send('error:', err);
        } else {
          return res.status(200).send(result);
        }
      } 
    )
  },

  get_market_id_locations: function(req, res) {
    let marketId = req.params.id;
    console.log('get market locations req.params.id: ', marketId);
    connection.query(
      `SELECT * FROM market_locations
      WHERE market_id_fk = ${marketId}`,
      function (error, locationsResult) {
        let locations = []
        if (locationsResult) {
          locations = locationsResult.map(function(row) {
            return {
              id: row.id,
              marketId: row.market_id_fk,
              latitude: row.latitude,
              longitude: row.longitude,
              description: row.description,
              city: row.city,
              province: row.province,
              address: row.address,
              timeframe: row.timeframe,
              locationName: row.location_name
            }
          });
        };
        return res.status(200).send(locations);
      }
    )
  },

  post_market_locations: function(req, res) {
    let postQuery = {
      market_id_fk: `${req.body.marketId}`,
      latitude: `${req.body.location.latitude}`,
      longitude: `${req.body.location.longitude}`,
      address: `${req.body.location.address}`,
      city: `${req.body.location.city}`,
      province: `${req.body.location.province}`,
      description: `${req.body.location.description}`,
      timeframe: `${req.body.location.timeframe}`,
      location_name: `${req.body.location.locationName}`
    };
    connection.query(
      `INSERT INTO market_locations SET ?`,
      postQuery,
      function (err, result) {
        if (err) {
          res.status(500).send(err);
        } else {
          return res.status(200).send(result);
        }
      }
    )
  },

  put_market_id_locations: function(req, res) {
    console.log('put market locations params id: ', req.params.id);
    console.log('put market locations body: ', req.body);
    let postQuery = {
      market_id_fk: `${req.body.marketId}`,
      location_name: `${req.body.locationName}`,
      description: `${req.body.description}`,
      latitude: `${req.body.latitude}`,
      longitude: `${req.body.longitude}`,
      address: `${req.body.address}`,
      city: `${req.body.city}`,
      province: `${req.body.province}`,
      timeframe: `${req.body.timeframe}`
    };
    let locationId = req.params.id;
    connection.query(
      `SET SQL_SAFE_UPDATES=0;
      UPDATE market_locations 
      SET ? 
      WHERE id = ?;
      SET SQL_SAFE_UPDATES=1;`,
      [postQuery, locationId],
      function (err, result) {
        if (err) {
          res.status(500).send(err);
        } else {
          return res.status(200).send(result);
        }
      } 
    )
  },

  get_market_id_schedules: function(req, res) {
    let marketId = req.params.id;
    console.log('get market scheds req.params.id: ', marketId);
    connection.query(
      `SELECT * FROM market_schedules
      WHERE market_id_fk_ms = ${marketId}`,
      function (error, schedulesResult) {
        let schedules = []
        if (schedulesResult) {
          schedules = schedulesResult.map(function(row) {
            return {
              id: row.market_schedule_id,
              marketId: row.market_id_fk_ms,
              userId: row.user_id_fk_schedules,
              type: row.market_schedule_type,
              description: row.description,
              startDateTime: row.start_date_time,
              endDateTime: row.end_date_time,
              readableDate: row.readable_date,
              hasFee: row.has_fee,
              hasWaiver: row.has_waiver,
              latitude: row.latitude,
              longitude: row.longitude,
              city: row.city,
              province: row.province,
              orderDeadline: row.order_deadline,
              address: row.address,
              fee: row.fee,
              feeWaiver: row.fee_waiver,
              producerSchedules: []
            }
          });
        };
        async.eachOfSeries(schedules, function(sched, index, innerCallback) {
          console.log('index of async: ', index);
          connection.query(
            `SELECT  msp.*, p.name
            from market_schedule_producer msp 
                INNER JOIN producers p
                ON msp.producer_id_fk_msp = p.producer_id
            WHERE market_schedule_id_fk_msp = ${sched.id}`,
            function (error, marketSchedulesProducerResult) {
              let producerScheds = [];
              if (marketSchedulesProducerResult) {
                producerScheds = marketSchedulesProducerResult.map(function(row) {
                  return {
                    producerSchedId: row.id,
                    scheduleId: row.schedule_id_fk_msp,
                    producerId: row.producer_id_fk_msp,
                    marketScheduleId: row.market_schedule_id_fk_msp,
                    producerName: row.name,
                  }
                });
                sched.producerSchedules = producerScheds;
              };
              if (error) {
                console.log('error: ', error);
                innerCallback(error, null);
              } else {
                console.log('producerScheds processed: ', producerScheds);
                innerCallback(null, null);
              }
            }
          )
        }, function(err, results) { // final callback executed when each of series is completed
          if(err){
            console.error(err);
          } else {
            console.log('all Pscheds added');
            return res.status(200).send(schedules);
          }
        });
      }
    )
  },

  put_market_id_schedules: function(req, res) {
    let scheduleId = req.params.id;
    console.log('put market sched params id: ', req.params.id);
    console.log('put market sched body: ', req.body);
    let postQuery = {
      market_schedule_id: `${scheduleId}`,
      market_schedule_type: `${req.body.type}`,
      description: `${req.body.description}`,
      start_date_time: `${req.body.startDateTime}`,
      end_date_time: `${req.body.endDateTime}`,
      readable_date: `${req.body.readableDate}`,
      has_fee: 0,
      has_waiver: 0,
      latitude: `${req.body.latitude}`,
      longitude: `${req.body.longitude}`,
      city: `${req.body.city}`,
      province: `${req.body.province}`,
      order_deadline: `${req.body.orderDeadline}`,
      address: `${req.body.address}`,
      fee: 0,
      fee_waiver: 0,
      market_id_fk_ms: `${req.body.marketId}`
    };
    connection.query(
      `SET SQL_SAFE_UPDATES=0;
      UPDATE market_schedules 
      SET ? 
      WHERE market_schedule_id = ?;
      SET SQL_SAFE_UPDATES=1;`,
      [postQuery, scheduleId],
      function (err, result) {
        if (err) {
          console.log('error: ', err);
          res.status(500).send(err);
        } else {
          return res.status(200).send(result);
        }
      } 
    )
  },
  
  delete_market_id_locations: function (req, res) {
    connection.query(
      `DELETE FROM market_locations
      WHERE id = ?;`,
      [req.params.id],
      function (err, result) {
        if (err) {
          console.log('error in delete market location:', err);
          res.status(500).send(err);
        } else {
          console.log('market location deleted: ', result);
          return res.status(200).send(result);
        }
      } 
    )
  }


  // get_market_id_future_schedules: function(req, res) {
  //   let userId = req.params.id;
  //   connection.query(
  //     `SELECT * FROM schedules
  //     WHERE 
  //     (user_id_fk_schedules = ${userId}
  //     AND 
  //     order_deadline >= NOW())`,
  //     function (error, schedulesResult) {
  //       let schedules = schedulesResult.map(function(row) {
  //         return {
  //           id: row.schedule_id,
  //           marketId: row.market_id_fk_s,
  //           userId: row.user_id_fk_schedules,
  //           type: row.schedule_type,
  //           description: row.description,
  //           startDateTime: row.start_date_time,
  //           endDateTime: row.end_date_time,
  //           hasFee: row.has_fee,
  //           hasWaiver: row.has_waiver,
  //           latitude: row.latitude,
  //           longitude: row.longitude,
  //           city: row.city,
  //           province: row.province,
  //           orderDeadline: row.order_deadline,
  //           address: row.address,
  //           fee: row.fee,
  //           feeWaiver: row.fee_waiver
  //         }
  //       });
  //       return res.status(200).send(schedules);
  //     }
  //   )
  // },

  // get_market_id_orders: function(req, res) {
  //   let marketId = req.params.id;

  //   function buildOrderArray(ordersArray, productsArray, marketsArray) {
  //     let formattedOrdersArray = [];
  //     let newOrder = {
  //       id: null,
  //       chosenSchedule: null,
  //       consumer: null,
  //       orderDetails: {
  //         productOrderQuantities: []
  //       },
  //       market: null,
  //       productList: null
  //     };
  //     // build each order object into a new array
  //     ordersArray.forEach(function (order) {
  //       // add the order info
  //       newOrder = order;
  //       // console.log('neworder id: ', newOrder.id);
  //       // add the market info
  //       let marketInfo = marketsArray.filter(market => market.marketId == newOrder.chosenSchedule.marketId);
  //       newOrder.market = marketInfo[0];
  //       // add the products info
  //       let productsInfo = productsArray.filter(products => products.orderId == newOrder.id);
  //       productsInfo.forEach(function (product) {
  //         // console.log('product: ', product);
  //         newOrder.orderDetails.productQuantities.push(product.productOrderQuantities);
  //         newOrder.productList.push(product.products);
  //         // console.log('newOrder.orderDetails.productQuantities: ', newOrder.orderDetails.productQuantities)
  //       });
  //       // push the new order to the formattedOrdersArray
  //       formattedOrdersArray.push(newOrder);
  //       // console.log('neworder: ', newOrder);
  //     });
  //     return formattedOrdersArray;
  //   };

  //   // create an array to hold our results
  //   let ordersObject = {
  //    orders: null,
  //    products: null,
  //    markets: null
  //   };
  //   // the var to hold the properly formatted orders to expose
  //   let formattedOrders;

  //   // build a query inside a promise, this will return the rows from the query
  //   function promisedQuery(sql) { 
  //     return new Promise ((resolve, reject) => {
  //       // console.log('query: ', sql);
  //       connection.query(sql, function(err, rows) {
  //         if ( err ) {
  //           return reject( err );
  //         }
  //         resolve( rows );
  //       })
  //     });
  //   };

  //   // build the queries
  //   // let getOrdersSql = 'SELECT * FROM orders LEFT JOIN markets ON orders.market_id_fk_o = markets.market_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id;';
  //   let getOrdersSql = 'SELECT * FROM orders LEFT JOIN schedules ON orders.schedule_id_fk_o = schedules.schedule_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id WHERE market_id_fk_o = ?;';
  //   let getOrdersQueryOptions = {
  //     sql: getOrdersSql,
  //     values: [marketId],
  //     nestTables: true
  //   };
  //   let getProductsSql = 'SELECT * FROM product_order_quantities LEFT JOIN products ON product_order_quantities.product_id_fk_pok = products.product_id WHERE product_order_quantities.order_id_fk_pok IN (?)';
  //   let getProductsQueryOptions = {
  //     sql: getProductsSql,
  //     values: [],
  //     nestTables: true
  //   };
  //   let getmarketsSql = 'SELECT * FROM markets LEFT JOIN users ON markets.user_id = users.id WHERE markets.market_id IN (?)';
  //   let getmarketsQueryOptions = {
  //     sql: getmarketsSql,
  //     values: [],
  //     nestTables: true
  //   };
  //   let ordersReceived, productsReceived, marketsReceived;
  //   let productValues = [];
  //   let marketValues = [];

  //   // then call the promisedQuery and pass the queries into it
  //   // ************ ORDERS ***********
  //   promisedQuery(getOrdersQueryOptions)
  //     .then(rows => {
  //       // do stuff with the returned rows from the first query
  //       // ordersReceived = rows;
  //       ordersReceived = rows.map(function(row) {
  //         return {
  //           // make this look like the order the front end needs
  //           id: row.orders.order_id,
  //           chosenSchedule: {
  //             id: row.schedules.schedule_id,
  //             marketId: row.schedules.market_id_fk_s,
  //             type: row.schedules.schedule_type,
  //             description: row.schedules.description,
  //             startDateTime: row.schedules.start_date_time,
  //             endDateTime: row.schedules.end_date_time,
  //             readableDate: row.schedules.readable_date,
  //             hasFee: row.schedules.has_fee,
  //             hasWaiver: row.schedules.has_waiver,
  //             latitude: row.schedules.latitude,
  //             longitude: row.schedules.longitude,
  //             city: row.schedules.city,
  //             province: row.schedules.province,
  //             orderDeadline: row.schedules.order_deadline,
  //             address: row.schedules.address,
  //             fee: row.schedules.fee,
  //             feeWaiver: row.schedules.fee_waiver
  //           },
  //           market: {
  //             id: row.orders.market_id_fk_o
  //           },
  //           consumer: {
  //             id: row.users.id,
  //             firstName: row.users.first_name,
  //             email: row.users.email,
  //             registrationDate: row.users.registration_date,
  //             role: row.users.role
  //           },
  //           productList: [],
  //           orderDetails: {
  //             productQuantities: [],
  //             consumerComment: row.orders.consumer_comment,
  //             consumerPhone: row.orders.consumer_phone,
  //             deliveryAddress: row.orders.delivery_address,
  //             deliveryFee: row.orders.delivery_fee,
  //             createdDate: row.orders.created_date,
  //             marketComment: row.orders.market_comment,
  //             orderStatus: row.orders.order_status,
  //             orderValue: row.orders.order_value,
  //             incompleteReason: row.orders.incomplete_reason
  //           }
  //         }
  //       })
  //       ordersObject.orders = ordersReceived;
  //       if (ordersObject.orders.length < 1) {
  //         return res.status(200).send([]);
  //       };
  //       // console.log('orders received: ', ordersReceived.length);
  //       // retreive the orderId and marketId and assign to the values in the getProductsQueryOptions, getmarketsQueryOptions
  //       for (let i = 0; i < ordersReceived.length; i++) {
  //         let orderId = ordersReceived[i].id;
  //         let marketId = ordersReceived[i].market.id;
  //         // console.log('id: ', orderId);
  //         productValues.push(orderId);
  //         marketValues.push(marketId);
  //       }
  //       getProductsQueryOptions.values = [productValues];
  //       // console.log('productQuery values: ', getProductsQueryOptions.values);
  //       // console.log('product options: ', getProductsQueryOptions);
  //       // call the promisedQuery again
  //       // ************ PRODUCTS ***********
  //       return promisedQuery(getProductsQueryOptions);
  //     })
  //     .then(rows => {
  //       // do stuff with the rows from that query
  //       productsReceived = rows.map(function(row) {
  //         return {
  //           orderId: row.product_order_quantities.order_id_fk_pok,
  //           productOrderQuantities: {
  //             id: row.product_order_quantities.product_order_quantities_id,
  //             productId: row.product_order_quantities.product_id_fk_pok,
  //             orderQuantity: row.product_order_quantities.quantity,
  //             orderValue: row.product_order_quantities.order_value
  //           },
  //           products: {
  //             id: row.products.product_id, 
  //             name: row.products.name, 
  //             description: row.products.description, 
  //             image: row.products.image, 
  //             pricePerUnit: row.products.pricePerUnit, 
  //             unit: row.products.unit, 
  //             unitsPer: row.products.unitsPer,
  //             category: row.products.category,
  //             subcategory: row.products.subcategory,
  //             dateAdded: row.products.date_added,
  //             qtyAvailable: row.products.qty_available, 
  //             qtyPending: row.products.qty_pending, 
  //             qtyAccepted: row.products.qty_accepted,
  //             qtyCompleted: row.products.qty_completed,
  //             isObsolete: row.products.is_obsolete,
  //             scheduleList: row.products.schedule_list
  //           }
  //         };
  //       });
  //       ordersObject.products = productsReceived;
  //       // console.log('prodcuts received: ', productsReceived.length);
  //       getmarketsQueryOptions.values = [marketValues];
  //       // console.log('market options: ', getmarketsQueryOptions);
  //       // call the promisedQuery again
  //     // ************ markets ***********
  //       return promisedQuery(getmarketsQueryOptions);
  //     })
  //     .then(rows => {
  //       marketsReceived = rows.map(function(row) {
  //         return {
  //           id: row.users.id,
  //           firstName: row.users.first_name,
  //           email: row.users.email,
  //           registrationDate: row.users.registration_date,
  //           marketId: row.markets.market_id,
  //           name: row.markets.name,
  //           location: row.markets.location,
  //           province: row.markets.province,
  //           longitude: row.markets.longitude,
  //           latitude: row.markets.latitude,
  //           status: row.markets.status,
  //           address: row.markets.address,
  //           description: row.markets.description,
  //           logoUrl: row.markets.logoUrl 
  //         };
  //       });
  //       ordersObject.markets = marketsReceived;
  //       // console.log('markets received: ', marketsReceived.length);
  //       // build the ordersObject properly
  //       formattedOrders = buildOrderArray(ordersObject.orders, ordersObject.products, ordersObject.markets);
  //       return res.status(200).send(formattedOrders);
  //     }).catch(err => {
  //       return res.status(500).send(err);
  //     });

  //   // connection.query(
  //   //   `SELECT * FROM orders
  //   //   WHERE market_id_fk_o = ${marketId}`,
  //   //   function (error, ordersResult) {
  //   //     // let schedules = schedulesResult.map(function(row) {
  //   //     //   return {
  //   //     //     id: row.schedule_id,
  //   //     //     marketId: row.market_id_fk_s,
  //   //     //     userId: row.user_id_fk_schedules,
  //   //     //     type: row.schedule_type,
  //   //     //     description: row.description,
  //   //     //     startDateTime: row.start_date_time,
  //   //     //     endDateTime: row.end_date_time,
  //   //     //     hasFee: row.has_fee,
  //   //     //     hasWaiver: row.has_waiver,
  //   //     //     latitude: row.latitude,
  //   //     //     longitude: row.longitude,
  //   //     //     city: row.city,
  //   //     //     province: row.province,
  //   //     //     orderDeadline: row.order_deadline,
  //   //     //     address: row.address,
  //   //     //     fee: row.fee,
  //   //     //     feeWaiver: row.fee_waiver
  //   //     //   }
  //   //     // });
  //   //     console.log('market orders: ', ordersResult);
  //   //     return res.status(200).send(ordersResult);
  //   //   }
  //   // )
  // },

  // delete_markets_id: function(req, res) {
  //   let postQuery = {
  //     name: 'DELETED',
  //     description: 'DELETED',
  //     logoUrl: 'DELETED',
  //     address: 'DELETED',
  //     location: 'DELETED',
  //     province: 'DELETED',
  //     latitude: 0,
  //     longitude: 0
  //   };
  //   let userId = req.params.id;
  //   connection.query(
  //     `SET SQL_SAFE_UPDATES=0;
  //     UPDATE markets 
  //     SET ? 
  //     WHERE user_id = ?;
  //     SET SQL_SAFE_UPDATES=1;`,
  //     [postQuery, userId],
  //     function (err, result) {
  //       if (err) {
  //         res.status(500).send('error:', err);
  //       } else {
  //         return res.status(200).send(result);
  //       }
  //     } 
  //   )
  // }

};
