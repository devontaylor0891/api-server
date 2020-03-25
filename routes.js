var users = require('./src/handlers/users');
var producers = require('./src/handlers/producers');
var markets = require('./src/handlers/markets');
var products = require('./src/handlers/products');
var schedules = require('./src/handlers/schedules');
var search = require('./src/handlers/search');
var orders = require('./src/handlers/orders');
var captcha = require('./src/handlers/captcha');
var images = require('./src/handlers/images/images');
var customUrl = require('./src/handlers/customUrl/customUrl');
var express = require('express');

var router = express.Router();

router.route('/users').get(users.get_users); // GET all users - ADMIN DASH ONLY
router.route('/users').post(users.post_users); // CREATE a new user
router.route('/users/:id').get(users.get_users_id); // GET a single user
router.route('/users/auth/:id').get(users.get_users_auth_id); // GET a single user by auth0 id
router.route('/users/:id').put(users.put_users_id);
router.route('/usersOrders/:id').get(users.get_users_id_orders);
router.route('/usersDelete/:id').put(users.delete_users_id); // mock DELETE single user
router.route('/users/:id/locationNotification/').get(users.get_location_notification);
router.route('/users/:id/locationNotification/').post(users.post_location_notification);
router.route('/users/:id/locationNotification/:locationNotificationId').delete(users.delete_location_notification);

router.route('/producers').get(producers.get_producers);
router.route('/producers').post(producers.post_producers);
router.route('/producers/:id').get(producers.get_producers_id);
router.route('/producers/:id').put(producers.put_producer_id);
router.route('/producersProducts/:id').get(producers.get_producer_id_products);
router.route('/producersSchedules/:id').get(producers.get_producer_id_schedules);
router.route('/producersFutureSchedules/:id').get(producers.get_producer_id_future_schedules);
router.route('/producersOrders/:id').get(producers.get_producer_id_orders);
router.route('/producersDelete/:id').put(producers.delete_producers_id);

router.route('/markets').post(markets.post_market);
router.route('/markets/:id').get(markets.get_markets_id);
router.route('/markets/:id').put(markets.put_markets_id);
router.route('/marketsLocations/:id').get(markets.get_market_id_locations);
router.route('/marketsSchedules/:id').get(markets.get_market_id_schedules);

router.route('/products').get(products.get_products); // ADMIN DASH ONLY
router.route('/products').post(products.post_products);
router.route('/products/:id').get(products.get_products_id);
router.route('/products/:id').put(products.put_products_id);
router.route('/productsDelete/:id').put(products.delete_products_id);

router.route('/schedules').get(schedules.get_schedules); // ADMIN DASH ONLY
router.route('/schedules').post(schedules.post_schedules);
router.route('/multiSchedules').post(schedules.post_multi_schedules);
router.route('/schedules/:id').put(schedules.put_schedules_id);
router.route('/schedules/:id').delete(schedules.delete_schedules_id);

router.route('/orders').get(orders.get_orders); // ADMIN DASH ONLY
router.route('/orders').post(orders.post_order);
router.route('/ordersBySchedule/:id').get(orders.get_orders_by_schedule_id);
router.route('/orders/:id').put(orders.put_orders_id);
router.route('/orders/:id').delete(orders.delete_orders_id);

router.route('/searchResults').post(search.get_search);

router.route('/captcha').post(captcha.post_captcha);

router.route('/presignedUrl').post(images.get_presigned_url);

router.route('/customUrl/:urlString').get(customUrl.resolve_custom_url);
router.route('/customUrl').post(customUrl.post_custom_url);
router.route('/customUrl/:id').put(customUrl.put_custom_url);
router.route('/customUrlFromId/:id').get(customUrl.get_custom_url);

module.exports = router;