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
                    lambda.order_accepted_notification(req, res);
                    return res.status(200).send(result);
                    }
                } 
        )
    }
};