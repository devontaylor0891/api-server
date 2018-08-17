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
      WHERE user_id_fk_products = ${userId}`, 
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
            producerId: row.producer_id_fk_products
          }
        });
        return res.status(200).send(products);
      }
    )
  },
  get_producer_id_schedules: function(req, res) {
    let userId = req.params.id;
    connection.query(
      `SELECT * FROM schedules
      WHERE user_id_fk_schedules = ${userId}`,
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
    connection.query(
      `SELECT * FROM orders
      WHERE producer_id_fk_orders = ${producerId}`,
      function (error, ordersResult) {
        // let schedules = schedulesResult.map(function(row) {
        //   return {
        //     id: row.schedule_id,
        //     producerId: row.producer_id_fk_s,
        //     userId: row.user_id_fk_schedules,
        //     type: row.schedule_type,
        //     description: row.description,
        //     startDateTime: row.start_date_time,
        //     endDateTime: row.end_date_time,
        //     hasFee: row.has_fee,
        //     hasWiaver: row.has_waiver,
        //     latitude: row.latitude,
        //     longitude: row.longitude,
        //     city: row.city,
        //     province: row.province,
        //     orderDeadline: row.order_deadline,
        //     address: row.address,
        //     fee: row.fee,
        //     feeWaiver: row.fee_waiver
        //   }
        // });
        console.log('producer orders: ', ordersResult);
        return res.status(200).send(ordersResult);
      }
    )
  }
};
