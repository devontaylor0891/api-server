'use strict';
var connection = require('../../../db');

module.exports = {
  get_producers_id: function(req, res) {
    var producerId = req.params.id;
    console.log("producerId", producerId);

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
        console.log('producer Results: ', producer);
        return res.status(200).send(producer);
      }
    )
  },
  put_producers_id: function(req, res) {
    console.log('put producer called, id: ', req.params.id);
    return res.status(201);
  },
  get_producer_id_products: function(req, res) {
    let userId = req.params.id;
    connection.query(
      `SELECT 
      products.product_id,
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
        console.log('productsResults: ', productsResult);
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
            isObsolete: row.is_obsolete
          }
        });
        return res.status(200).send(products);
      }
      // `SELECT * FROM products
      // WHERE user_id_fk_products = ${userId}`, 
      // function (error, productsResult) {
      //   console.log('productsResults: ', productsResult);
      //   let products = productsResult.map(function(row) {
      //     return {
      //       id: row.product_id,
      //       name: row.name,
      //       description: row.description,
      //       image: row.image,
      //       pricePerUnit: row.pricePerUnit,
      //       unit: row.unit,
      //       unitsPer: row.unitsPer,
      //       category: row.category,
      //       subcategory: row.subcategory,
      //       dateAdded: row.date_added,
      //       qtyAvailable: row.qty_available,
      //       qtyPending: row.qty_pending,
      //       qtyAccepted: row.qty_accepted,
      //       qtyCompleted: row.qty_completed,
      //       isObsolete: row.is_obsolete
      //     }
      //   });
      //   return res.status(200).send(products);
      // }
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
  }
};
