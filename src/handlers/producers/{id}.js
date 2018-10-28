'use strict';
var connection = require('../../../db');

module.exports = {
  get_producers_id: function(req, res) {
    var producerId = req.params.id;
    connection.query(
      `SELECT * FROM producers
      LEFT JOIN users ON producers.user_id = users.id
      WHERE user_id = ${producerId}`, function (error, producerResult) {
        let producer = producerResult.map(function(row) 
          {
            return {
              id: row.user_id,
              producerId: row.producer_id,
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
        return res.status(200).send(producer);
      }
    )
  },

  put_producers_id: function(req, res) {
    let postQuery = {
      name: `${req.body.name}`,
      description: `${req.body.description}`,
      logoUrl: `${req.body.logoUrl}`,
      address: `${req.body.address}`,
      location: `${req.body.location}`,
      province: `${req.body.province}`,
      latitude: `${req.body.latitude}`,
      longitude: `${req.body.longitude}`
    };
    let userId = req.params.id;
    connection.query(
      `SET SQL_SAFE_UPDATES=0;
      UPDATE producers 
      SET ? 
      WHERE user_id = ?;
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

  get_producer_id_products: function(req, res) {
    let userId = req.params.id;
    connection.query(
      `SELECT 
      products.product_id,
      products.producer_id_fk_products,
      products.user_id_fk_products,
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
      WHERE user_id_fk_products = ${userId}
      AND products.name <> 'DELETED'`, 
      function (error, productsResult) {
        let products = productsResult.map(function(row) {
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
            producerId: row.producer_id_fk_products,
            userId: row.user_id_fk_products
          }
        });
        return res.status(200).send(products);
      }
    )
  },

  get_producer_id_schedules: function(req, res) {
    let userId = req.params.id;
    connection.query(
      `SELECT schedules.*,
      (SELECT COUNT(*) FROM orders WHERE schedule_id_fk_o = schedules.schedule_id) AS orderCount
      FROM schedules
      WHERE user_id_fk_schedules = ${userId}`,
      // `SELECT * FROM schedules
      // WHERE user_id_fk_schedules = ${userId}`,
      function (error, schedulesResult) {
        let schedules = schedulesResult.map(function(row) {
          return {
            id: row.schedule_id,
            producerId: row.producer_id_fk_s,
            userId: row.user_id_fk_schedules,
            type: row.schedule_type,
            description: row.description,
            startDateTime: row.start_date_time,
            endDateTime: row.end_date_time,
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
            orderCount: row.orderCount
          }
        });
        return res.status(200).send(schedules);
      }
    )
  },

  get_producer_id_future_schedules: function(req, res) {
    let userId = req.params.id;
    connection.query(
      `SELECT * FROM schedules
      WHERE 
      (user_id_fk_schedules = ${userId}
      AND 
      order_deadline >= NOW())`,
      function (error, schedulesResult) {
        let schedules = schedulesResult.map(function(row) {
          return {
            id: row.schedule_id,
            producerId: row.producer_id_fk_s,
            userId: row.user_id_fk_schedules,
            type: row.schedule_type,
            description: row.description,
            startDateTime: row.start_date_time,
            endDateTime: row.end_date_time,
            hasFee: row.has_fee,
            hasWiaver: row.has_waiver,
            latitude: row.latitude,
            longitude: row.longitude,
            city: row.city,
            province: row.province,
            orderDeadline: row.order_deadline,
            address: row.address,
            fee: row.fee,
            feeWaiver: row.fee_waiver
          }
        });
        return res.status(200).send(schedules);
      }
    )
  },

  get_producer_id_orders: function(req, res) {
    let producerId = req.params.id;

    function buildOrderArray(ordersArray, productsArray, producersArray) {
      let formattedOrdersArray = [];
      let newOrder = {
        id: null,
        chosenSchedule: null,
        consumer: null,
        orderDetails: {
          productOrderQuantities: []
        },
        producer: null,
        productList: null
      };
      // build each order object into a new array
      ordersArray.forEach(function (order) {
        // add the order info
        newOrder = order;
        console.log('neworder id: ', newOrder.id);
        // add the producer info
        let producerInfo = producersArray.filter(producer => producer.producerId == newOrder.chosenSchedule.producerId);
        newOrder.producer = producerInfo[0];
        // add the products info
        let productsInfo = productsArray.filter(products => products.orderId == newOrder.id);
        productsInfo.forEach(function (product) {
          console.log('product: ', product);
          newOrder.orderDetails.productQuantities.push(product.productOrderQuantities);
          newOrder.productList.push(product.products);
          // console.log('newOrder.orderDetails.productQuantities: ', newOrder.orderDetails.productQuantities)
        });
        // push the new order to the formattedOrdersArray
        formattedOrdersArray.push(newOrder);
        // console.log('neworder: ', newOrder);
      });
      return formattedOrdersArray;
    };

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
    let getOrdersSql = 'SELECT * FROM orders LEFT JOIN schedules ON orders.schedule_id_fk_o = schedules.schedule_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id WHERE producer_id_fk_o = ?;';
    let getOrdersQueryOptions = {
      sql: getOrdersSql,
      values: [producerId],
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
            productList: [],
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
        if (ordersObject.orders.length < 1) {
          return res.status(200).send([]);
        };
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
              orderValue: row.product_order_quantities.order_value
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
        formattedOrders = buildOrderArray(ordersObject.orders, ordersObject.products, ordersObject.producers);
        return res.status(200).send(formattedOrders);
      }).catch(err => {
        return res.status(500).send(err);
      });

    // connection.query(
    //   `SELECT * FROM orders
    //   WHERE producer_id_fk_o = ${producerId}`,
    //   function (error, ordersResult) {
    //     // let schedules = schedulesResult.map(function(row) {
    //     //   return {
    //     //     id: row.schedule_id,
    //     //     producerId: row.producer_id_fk_s,
    //     //     userId: row.user_id_fk_schedules,
    //     //     type: row.schedule_type,
    //     //     description: row.description,
    //     //     startDateTime: row.start_date_time,
    //     //     endDateTime: row.end_date_time,
    //     //     hasFee: row.has_fee,
    //     //     hasWiaver: row.has_waiver,
    //     //     latitude: row.latitude,
    //     //     longitude: row.longitude,
    //     //     city: row.city,
    //     //     province: row.province,
    //     //     orderDeadline: row.order_deadline,
    //     //     address: row.address,
    //     //     fee: row.fee,
    //     //     feeWaiver: row.fee_waiver
    //     //   }
    //     // });
    //     console.log('producer orders: ', ordersResult);
    //     return res.status(200).send(ordersResult);
    //   }
    // )
  },

  delete_producers_id: function(req, res) {
    let postQuery = {
      name: 'DELETED',
      description: 'DELETED',
      logoUrl: 'DELETED',
      address: 'DELETED',
      location: 'DELETED',
      province: 'DELETED',
      latitude: 0,
      longitude: 0
    };
    let userId = req.params.id;
    connection.query(
      `SET SQL_SAFE_UPDATES=0;
      UPDATE producers 
      SET ? 
      WHERE user_id = ?;
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
  }

};
