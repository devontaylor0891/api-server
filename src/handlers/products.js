'use strict';
var connection = require('../../db');
var Product = require('./products/{id}');

module.exports = {
  get_products: function(req, res) {
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
      ON products.producer_id_fk_products = producers.producer_id`, 
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
            isObsolete: row.is_obsolete
          }
        });
        return res.status(200).send(products);
      }
      // `SELECT * FROM products`, function (error, productsResult) {
      //       return res.status(200).send(productsResult);
      //     }
    )
    // connection.query(
    //   `SELECT * FROM products`, function (error, productsResult) {
    //     return res.status(200).send(productsResult);
    //   }
    // )
    // connection.query(`
    // SELECT pt.*,
    //   c.name AS category_name,
    //   sc.name AS subcategory_name,
    //   pd.name AS producer_name,
    //   pd.city AS producer_city,
    //   pd.phone_number AS producer_phone_number,
    //   pd.latitude AS producer_latitude,
    //   pd.longitude AS producer_longitude,
    //   u.first_name AS producer_first_name,
    //   u.email AS producer_email,
    //   u.registration_date AS producer_registration_date
    //   FROM products pt
    //     LEFT JOIN category c
    //       ON pt.category_id = c.id
    //     LEFT JOIN subcategory sc
    //       ON pt.subcategory_id = sc.id
    //     LEFT JOIN producers pd
    //       on pt.producer_id = pd.id
    //     LEFT JOIN users u
    //       on pd.user_id = u.id`, function (error, results) {
    //   if (results.length === 0) {
    //     res.status(404).send({ message: "Products not found"});
    //     return;
    //   }
    //   var products = results.map(function(row, index) {
    //     return {
    //       id: row.id,
    //       name: row.name,
    //       description: row.description,
    //       image: row.image,
    //       pricePerUnit: row.price,
    //       unit: row.unit,
    //       unitsPer: '1',
    //       category: row.category_name,
    //       subcategory: row.subcategory_name,
    //       qtyAvailable: row.quantity_avaliable,
    //       qtyPending: row.quantity_pending,
    //       qtyAccepted: row.quantity_accepted,
    //       qtyCompleted: row.quantity_completed,
    //       isObsolete: false,
    //       dateAdded: "2017-12-02T01:00:00.000Z",
    //       scheduleList: [ 798, 799 ], // delete me in future
    //       producer: {
    //         id: row.producer_id,
    //         name: row.producer_name,
    //         location: row.producer_city,
    //         province: "SK",
    //         description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    //         email: row.producer_email,
    //         logoUrl: "farm-logo-2.png",
    //         latitude: row.producer_latitude,
    //         longitude: row.producer_longitude,
    //         firstName: row.producer_first_name,
    //         registrationDate: row.producer_registration_date,
    //         status: "active",
    //         productList: [
    //           88
    //         ],
    //         scheduleList: [
    //           798,
    //           799
    //         ]
    //       },
    //     }
    //   });
    //   res.status(200).send(products);
    // });
  },

  post_products: function (req, res) {
    console.log('new product body: ', req.body);
    let postQuery = {
      user_id_fk_products: `${req.body.producer.id}`,
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
      qty_pending: 0,
      qty_accepted: 0,
      qty_completed: 0,
      is_obsolete: `${req.body.isObsolete}`,
      schedule_list: 0,
      producer_id_fk_products: `${req.body.producerId}`
    };
    console.log('postQuery: ', postQuery);
    connection.query(
      `INSERT INTO products SET ?`,
      postQuery,
      function(err, result) {
        if (err) {
          console.log('error in create product:', err);
          res.send('error:', err);
        } else {
          console.log('product created: ', result);
          return res.status(200).send(result);
        }
      }
    )
  },

  get_products_id: function(req, res) {
    Product.get_products_id(req, res);
  },

  put_products_id: function(req, res) {
    Product.put_products_id(req, res);
  },

  patch_products_id: function (req, res) {
    Product.patch_products_id(req, res);
  },

  delete_products_id: function(req, res) {
    Product.delete_products_id(req, res);
  }
};
