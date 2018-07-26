// var users = require('./src/handlers/users');
// var producers = require('./src/handlers/producers');
// var categories = require('./src/handlers/categories');
// var products = require('./src/handlers/products');
// var schedules = require('./src/handlers/schedules');
// var search = require('./src/handlers/search');
// var express = require('express');

// var router = express.Router();

// router.route('/users').get(users.get_users); // GET all users
// router.route('/users').post(users.post_users); // CREATE a new user
// router.route('/users/:id').get(users.get_users_id); // GET a single user
// router.route('/users/auth/:id').get(users.get_users_auth_id); // GET a single user by auth0 id
// router.route('/users/:id').put(users.put_users_id); // UPDATE a user
// router.route('/users/:id/orders').get(users.get_users_id_orders);
// // BODY: array of products (object with id and qty)
// router.route('/users/:id/orders').post(users.post_users_id_orders);

// router.route('/producers').get(producers.get_producers);
// router.route('/producers/:id').get(producers.get_producers_id); // will have products in it and have schedules
// router.route('/producers/:id').put(producers.put_producer_id);
// router.route('/producers/:id/products').post(producers.post_producer_id_products);
// router.route('/producers/:id/old-products').get(producers.get_producers_id_old_products);
// router.route('/producers/:id/schedules').post(producers.post_producers_id_schedules);

// router.route('/schedules').get(schedules.get_schedules);
// router.route('/schedules/:id').delete(schedules.delete_schedules_id);
// router.route('/schedules/:id').put(schedules.put_schedules_id);

// router.route('/categories').get(categories.get_categories);

// router.route('/products').get(products.get_products);
// router.route('/products/:id').get(products.get_products_id); // will have producer's info
// router.route('/products/:id').put(products.put_products_id);

// router.route('/searchResults').get(search.get_search);


// module.exports = router;

var users = require('./src/handlers/users');
var producers = require('./src/handlers/producers');
var categories = require('./src/handlers/categories');
var products = require('./src/handlers/products');
var schedules = require('./src/handlers/schedules');
var search = require('./src/handlers/search');
var orders = require('./src/handlers/orders');
var express = require('express');

var router = express.Router();

router.route('/users').get(users.get_users); // GET all users - ADMIN DASH ONLY
router.route('/users').post(users.post_users); // CREATE a new user
router.route('/users/:id').get(users.get_users_id); // GET a single user
router.route('/users/auth/:id').get(users.get_users_auth_id); // GET a single user by auth0 id
router.route('/users/:id').put(users.put_users_id);
router.route('/users/:id/orders').get(users.get_users_id_orders);
// router.route('/users/:id/orders').post(users.post_users_id_orders);

router.route('/producers').get(producers.get_producers);
router.route('/producers').post(producers.post_producers);
router.route('/producers/:id').get(producers.get_producers_id);
router.route('/producers/:id').put(producers.put_producer_id);
router.route('/producersProducts/:id').get(producers.get_producer_id_products);
router.route('/producers/:id/products').post(producers.post_producer_id_products);
router.route('/producersSchedules/:id').get(producers.get_producer_id_schedules);
// router.route('/producers/:id/orders').get(producer.get_producer_id_orders);

router.route('/schedules').get(schedules.get_schedules); // ADMIN DASH ONLY
router.route('/schedules').post(schedules.post_schedules);
router.route('/schedules/:id').delete(schedules.delete_schedules_id);
router.route('/schedules/:id').put(schedules.put_schedules_id);

router.route('/products').get(products.get_products); // ADMIN DASH ONLY
router.route('/products/:id').get(products.get_products_id);
router.route('/products/:id').put(products.put_products_id);
router.route('/products/:id').delete(products.delete_products_id);

router.route('/orders').get(orders.get_orders); // ADMIN DASH ONLY

router.route('/searchResults').get(search.get_search);


module.exports = router;