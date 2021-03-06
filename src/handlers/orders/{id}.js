'use strict';
var connection = require('../../../db');
let lambda = require('../lambda/functions');

module.exports = {

    put_orders_id: function (req, res) {
        console.log('put order called: ', req.body);
        let postQuery = {
            producer_id_fk_o: `${req.body.chosenSchedule.producerId}`,
            consumer_id_fk_o: `${req.body.consumer.id}`,
            schedule_id_fk_o: `${req.body.chosenSchedule.id}`,
            producer_comment: `${req.body.orderDetails.producerComment}`,
            consumer_comment: `${req.body.orderDetails.consumerComment}`,
            delivery_address: `${req.body.orderDetails.deliveryAddress}`,
            delivery_fee: `${req.body.orderDetails.deliveryFee}`,
            created_date: `${req.body.orderDetails.createdDate}`,
            order_status: `${req.body.orderDetails.orderStatus}`,
            order_value: `${req.body.orderDetails.orderValue}`,
            incomplete_reason: `${req.body.orderDetails.incompleteReason}`
        };
        console.log('postQuery: ', postQuery);
        let orderId = req.params.id;
            connection.query(
                `UPDATE orders 
                SET ?
                WHERE order_id = ?;`,
                [postQuery, orderId],
                function (err, result) {
                    if (err) {
                        console.log('error in update order:', err);
                        return res.status(500).send('error:', err);
                    } else {
                        console.log('order updated: ', result);
                        if (req.body.orderDetails.orderStatus === 'accepted') {
                            lambda.order_accepted_notification(req, res);
                            return res.status(200).send(result);
                        } else if (req.body.orderDetails.orderStatus === 'denied') {
                            lambda.order_denied_notification(req, res);
                            return res.status(200).send(result);
                        } else {
                          return res.status(200).send(result);
                        }
                    }
                } 
        )
    },

    delete_orders_id: function (req, res) {
        console.log('delete order id: ', req.params.id);
        let orderId = req.params.id;
        let productOrderQty;
        let product = [];

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
        let getProductOrderQuantitiesSql = 'SELECT * FROM product_order_quantities WHERE order_id_fk_pok = ?';
        let getProductOrderQuantitiesQueryOptions = {
            sql: getProductOrderQuantitiesSql,
            values: [orderId],
            nestTables: true
        };
        let deleteProductOrderQuantitiesSql = 'DELETE FROM product_order_quantities WHERE order_id_fk_pok = ?';
        let deleteProductOrderQuantitiesQueryOptions = {
            sql: deleteProductOrderQuantitiesSql,
            values: [orderId]
        };
        let deleteOrderSql = 'DELETE FROM orders WHERE order_id = ?';
        let deleteOrderQueryOptions = {
            sql: deleteOrderSql,
            values: [orderId]
        };

        // then call the promisedQuery and pass the queries into it
        // ************ PRODUCT ORDER QTYS ***********
        promisedQuery(getProductOrderQuantitiesQueryOptions)
        .then(rows => {
            rows.forEach(function(row) {
                let productId = row.product_order_quantities.product_id_fk_pok;
                let productQuantity = row.product_order_quantities.quantity;
                connection.query(
                    `UPDATE products 
                    SET 
                    qty_available = qty_available + ?,
                    qty_pending = qty_pending - ?
                    WHERE product_id = ?;`,
                    [productQuantity, productQuantity, productId],
                    function (err, result) {
                        if (err) {
                            console.log('error in update product:', err);
                            res.status(500).send('error:', err);
                        } else {
                            console.log('product updated: ', result);
                            return result;
                        }
                    } 
                )
            })
            // then delete the product order qtys
            return promisedQuery(deleteProductOrderQuantitiesQueryOptions);
        })
        .then(rows => {
            // then delete the order itself
            // console.log(rows);
            return promisedQuery(deleteOrderQueryOptions);
        })
        .then(rows => {
            return res.status(200).send(rows);
        }).catch(err => {
            return res.status(500).send(err);
        });
        // call lambda function to inform producer
    }

};