var users = require('./src/handlers/users');
var producers = require('./src/handlers/producers');
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
router.route('/usersOrders/:id').get(users.get_users_id_orders);

router.route('/producers').get(producers.get_producers);
router.route('/producers').post(producers.post_producers);
router.route('/producers/:id').get(producers.get_producers_id);
router.route('/producers/:id').put(producers.put_producer_id);
router.route('/producersProducts/:id').get(producers.get_producer_id_products);
router.route('/producersSchedules/:id').get(producers.get_producer_id_schedules);
router.route('/producersFutureSchedules/:id').get(producers.get_producer_id_future_schedules);
router.route('/producersOrders/:id').get(producers.get_producer_id_orders);

router.route('/products').get(products.get_products); // ADMIN DASH ONLY
router.route('/products').post(products.post_products);
router.route('/products/:id').get(products.get_products_id);
router.route('/products/:id').put(products.put_products_id);
router.route('/products/:id').delete(products.delete_products_id);

router.route('/schedules').get(schedules.get_schedules); // ADMIN DASH ONLY
router.route('/schedules').post(schedules.post_schedules);
router.route('/schedules/:id').delete(schedules.delete_schedules_id);
router.route('/schedules/:id').put(schedules.put_schedules_id);

router.route('/orders').get(orders.get_orders); // ADMIN DASH ONLY
router.route('/orders').post(orders.post_order);
router.route('/ordersBySchedule/:id').get(orders.get_orders_by_schedule_id);

router.route('/searchResults').get(search.get_search);


module.exports = router;