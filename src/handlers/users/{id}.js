'use strict';
var connection = require('../../../db');

module.exports = {
  get_users_id: function(req, res) {
    var id = req.params.id;

    connection.query(
      `SELECT * FROM users
      WHERE id = ${id}`, function (error, results) {
        let newUser = results.map(function(row) {
          return {
            id: row.id,
            firstName: row.first_name,
            email: row.email,
            registrationDate: row.registration_date,
            role: row.role
          }
        })
        return res.status(200).send(newUser);
      }
    )
  },

  get_users_id_orders: function (req, res) {
    // return res.status(200).send('ok');

    let userId = req.params.id;

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
    let getOrdersSql = 'SELECT * FROM orders LEFT JOIN schedules ON orders.schedule_id_fk_o = schedules.schedule_id LEFT JOIN users ON orders.consumer_id_fk_o = users.id WHERE consumer_id_fk_o = ?;';
    let getOrdersQueryOptions = {
      sql: getOrdersSql,
      values: [userId],
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
              hasWaiver: row.schedules.has_waiver,
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

  },

  delete_users_id: function (req, res) {
    // rather than deleting users, replace their info with a placeholder
    // this ensures that past orders, etc won't be adversely affected, other than the user info being replaced
    console.log('put called: ', req.body);
    let postQuery = {
      first_name: 'User deleted',
      email: 'Email deleted',
      role: `${req.body.role}`
    };
    let userId = req.params.id;
    connection.query(
      `UPDATE users 
      SET ? 
      WHERE id = ?;`,
      [postQuery, userId],
      function (err, result) {
        if (err) {
          console.log('error in update user:', err);
          return res.status(500).send('error:', err);
        } else {
          console.log('user updated: ', result);
          console.log('postQuery: ', postQuery);
          return res.status(200).send(result);
        }
      } 
    );
  },

  get_location_notification: function (req, res) {
    var userId = req.params.id;
    connection.query(
      `SELECT * FROM location_notifications
      WHERE user_id = ${userId}`, function (error, results) {
        let locationNotifications = results.map(function(row) {
          return {
            id: row.id,
            city: row.city,
            province: row.province,
            lat: row.latitude,
            lng: row.longitude,
            dateAdded: row.date_added
          }
        })
        return res.status(200).send(locationNotifications);
      }
    )
  },

  post_location_notification: function (req, res) {
    let postQuery = {
      user_id: `${req.params.id}`,
      city: `${req.body.city}`,
      province: `${req.body.province}`,
      latitude: `${req.body.lat}`,
      longitude: `${req.body.lng}`,
      date_added: `${req.body.dateAdded}`
    };
    connection.query(
      `INSERT INTO location_notifications SET ?`,
      postQuery,
      function(err, result) {
        if (err) {
          console.log('error in create location_notifications:', err);
          res.send('error:', err);
        } else {
          console.log('location_notifications created: ', result);
          return res.status(200).send(result);
        }
      }
    );
    console.log('post new location: ', req.body);
  },

  delete_location_notification: function (req, res) {
    connection.query(
      `DELETE FROM location_notifications
      WHERE id = ?;`,
      [req.params.locationNotificationId],
      function (err, result) {
        if (err) {
          console.log('error in delete location_notifications:', err);
          res.status(500).send('error:', err);
        } else {
          console.log('location_notification deleted: ', result);
          return res.status(200).send(result);
        }
      } 
    )
    console.log('delete location: ', req.body);
    console.log('delete location user id: ', req.params.id);
    console.log('delete location notif id: ', req.params.locationNotificationId);
  }

};
  