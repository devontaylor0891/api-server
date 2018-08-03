'use strict';
var connection = require('../../../db');

module.exports = {
  get_products_id: function(req, res) {
    var productId = req.params.id;
    console.log("productId", productId);
    connection.query(
      // `SELECT * FROM products
      // WHERE product_id = ${productId}`,
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
      WHERE product_id = ${productId}`,
      function (error, productResult) {
        let product = productResult.map(function(row) {
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
        return res.status(200).send(product);
      }
    )

//     connection.query(`
//       SELECT pt.*,
//       c.name AS category_name,
//       sc.name AS subcategory_name
//       FROM products pt
//         LEFT JOIN category c
//           ON pt.category_id = c.id
//         LEFT JOIN subcategory sc
//           ON pt.subcategory_id = sc.id
//         WHERE pt.id = ${productId}`,
//       function (error, productResults) {
//       if (productResults.length === 0) {
//         res.status(404).send({ message: "Product not found"});
//         return;
//       }
//       var product = {
//         id: productResults[0].id,
//         name: productResults[0].name,
//         description: productResults[0].description,
//         image: productResults[0].image,
//         pricePerUnit: productResults[0].price,
//         unit: productResults[0].unit,
//         unitsPer: '3',
//         category: productResults[0].category_name,
//         subcategory: productResults[0].subcategory_name,
//         qtyAvailable: productResults[0].quantity_avaliable,
//         qtyPending: productResults[0].quantity_pending,
//         qtyAccepted: productResults[0].quantity_accepted,
//         qtyCompleted: productResults[0].quantity_completed,
//         isObsolete: false,
//         dateAdded: "2017-12-02T01:00:00.000Z",
//         scheduleList: [ 798, 799 ], // delete me in future
//       };
// console.log("productResults[0].producer_id", productResults[0].producer_id);
//       connection.query(`
//         SELECT pd.*,
//         u.first_name AS producer_first_name,
//         u.email AS producer_email,
//         u.registration_date AS producer_registration_date
//         FROM producers pd
//           LEFT JOIN users u
//             on pd.user_id = u.id
//         WHERE pd.id = ${productResults[0].producer_id}`, function (error, producerResults) {
//           console.log("producerResults", producerResults);
//         const producer = {
//           id: producerResults[0].id,
//           name: producerResults[0].name,
//           location: producerResults[0].city,
//           province: "SK",
//           description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?", // producers dont have descriptions in the database - do you acutally use this
//           email: producerResults[0].producer_email,
//           logoUrl: "farm-logo-2.png",
//           longitude: producerResults[0].latitude,
//           latitude: producerResults[0].longitude,
//           firstName: producerResults[0].producer_first_name,
//           registrationDate: producerResults[0].producer_registration_date,
//           status: "active",
//           productList: [
//             88
//           ],
//           scheduleList: [
//             798,
//             799
//           ]
//         };
//         product.producer = producer;
//         res.status(200).send(product);
//       });
//     });
  },

  put_products_id: function (req, res) {
    console.log('put product called: ', req.body);
    let postQuery = {
      producer_id_fk_products: `${req.body.producerId}`,
      name: `${req.body.name}`,
      description: `${req.body.description}`,
      image: `${req.body.image}`,
      pricePerUnit: `${req.body.pricePerUnit}`,
      unit: `${req.body.unit}`,
      unitsPer: `${req.body.unitsPer}`,
      category: `${req.body.category}`,
      subcategory: `${req.body.subcategory}`,
      date_added: `${req.body.dateAdded}`,
      qty_available: `${req.body.qtyAvailable}`,
      qty_pending: `${req.body.qtyPending}`,
      qty_accepted: `${req.body.qtyAccepted}`,
      qty_completed: `${req.body.qtyCompleted}`,
      is_obsolete: `${req.body.isObsolete}`
    };
    let productId = req.params.id;
    connection.query(
      `UPDATE products 
      SET ?,
      WHERE product_id = ?;`,
      [postQuery, productId],
      function (err, result) {
        if (err) {
          console.log('error in update product:', err);
          res.status(500).send('error:', err);
        } else {
          console.log('product updated: ', result);
          console.log('postQuery: ', postQuery);
          return res.status(200).send(result);
        }
      } 
    )
  },

  patch_products_id: function (req, res) {
    console.log('patch product called: ', req.params, req.body);
    return res.send(201);
  }

};
  