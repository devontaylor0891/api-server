'use strict';
var connection = require('../../../db');

module.exports = {
  get_schedules_id: function(req, res) {
    var id = req.params.id;

    connection.query(
      `SELECT * FROM schedules
      WHERE schedule_id = ${id}`, function (error, results) {
        let schedule = results.map(function(row) {
          return {
            id: row.schedule_id,
            producerId: row.producer_id_fk,
            type: row.schedule_type,
            description: row.description,
            startDateTime: row.start_date_time,
            endDateTime: row.end_date_time,
            hasFee: row.has_fee,
            hasWaiver: row.has_waiver,
            latitude: row.latitude,
            longitude: row.longitude,
            city: row.city,
            province: row.province,
            orderDeadline: row.order_deadline,
            address: row.address,
            fee: row.fee,
            feeWaiver: row.fee_waiver
          }
        })
        return res.status(200).send(schedule);
      }
    )
  },

  put_schedules_id: function (req, res) {
    console.log('put schedule called: ', req.body);
    let postQuery = {
      producer_id_fk_s: `${req.body.producerId}`,
      schedule_type: `${req.body.type}`,
      description: `${req.body.description}`,
      start_date_time: `${req.body.startDateTime}`,
      end_date_time: `${req.body.endDateTime}`,
      has_fee: `${req.body.hasFee}`,
      has_waiver: `${req.body.hasWaiver}`,
      latitude: `${req.body.latitude}`,
      longitude: `${req.body.longitude}`,
      city: `${req.body.city}`,
      province: `${req.body.province}`,
      order_deadline: `${req.body.orderDeadline}`,
      address: `${req.body.address}`,
      fee: `${req.body.fee}`,
      fee_waiver: `${req.body.feeWaiver}`
    };
    console.log('postQuery: ', postQuery);
    let scheduleId = req.params.id;
    connection.query(
      `UPDATE schedules 
      SET ?
      WHERE schedule_id = ?;`,
      [postQuery, scheduleId],
      function (err, result) {
        if (err) {
          console.log('error in update sched:', err);
          return res.status(500).send('error:', err);
        } else {
          console.log('sched updated: ', result);
          return res.status(200).send(result);
        }
      } 
    )
  },

  delete_schedules_id: function (req, res) {
    console.log('req.body.sched: ', req.body);
    res.status(200).send('some text');
        // build the new 'deleted' product
    // let deletedSchedule = {
    //   user_id_fk_products: `${req.body.userId}`,
    //   product_id: `${req.params.id}`,
    //   name: 'DELETED',
    //   description: 'DELETED',
    //   image: 'DELETED',
    //   pricePerUnit: 0,
    //   unit: 'DELETED',
    //   unitsPer: 0,
    //   category: 'DELETED',
    //   subcategory: 'DELETED',
    //   date_added: 'DELETED',
    //   qty_available: 0,
    //   qty_pending: 0,
    //   qty_accepted: 0,
    //   qty_completed: `${req.body.qtyCompleted}`,
    //   is_obsolete: `${req.body.isObsolete}`,
    //   schedule_list: null,
    //   producer_id_fk_products: `${req.body.producerId}`
    // };
    // req.body.isObsolete = req.body.isObsolete ? 1 : 0;
    // let productId = req.params.id;
    // connection.query(
    //   `UPDATE products 
    //   SET ?
    //   WHERE product_id = ?;`,
    //   [deletedSchedule, productId],
    //   function (err, result) {
    //     if (err) {
    //       console.log('error in delete product:', err);
    //       res.status(500).send('error:', err);
    //     } else {
    //       console.log('product deleted: ', result);
    //       return res.status(200).send(result);
    //     }
    //   } 
    // )
  }
};
  