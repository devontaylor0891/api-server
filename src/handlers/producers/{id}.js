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
      `SELECT * from products
      WHERE user_id_fk_products = ${userId}`,
      function(error, productsResults) {
        return productsResults;
        console.log('get producer products called: ', productsResults);
        return res.status(200).send(productsResults);
      }
    )
  }
};
