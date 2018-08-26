'use strict';
var _ = require('lodash');
var connection = require('../../db');
var ScheduleById = require('./schedules/{id}');

module.exports = {

  get_schedules: function(req, res) {
    connection.query(
      `SELECT * FROM schedules`, function (error, schedulesResult) {
        let schedules = schedulesResult.map(function(row) {
          return {
            id: row.schedule_id,
            producerId: row.producer_id_fk_s,
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
  },

  post_schedules: function (req, res) {
    // return res.send(201);
    console.log('new schedule body: ', req.body);
    return res.send(201);
    // let postQuery = {
    //   user_id_fk_products: `${req.body.producer.id}`,
    //   name: `${req.body.name}`,
    //   description: `${req.body.description}`,
    //   image: `${req.body.image}`,
    //   pricePerUnit: `${req.body.pricePerUnit}`,
    //   unit: `${req.body.unit}`,
    //   unitsPer: `${req.body.unitsPer}`,
    //   category: `${req.body.category}`,
    //   subcategory: `${req.body.subcategory}`,
    //   date_added: `${req.body.dateAdded}`,
    //   qty_available: `${req.body.qtyAvailable}`,
    //   qty_pending: 0,
    //   qty_accepted: 0,
    //   qty_completed: 0,
    //   is_obsolete: `${req.body.isObsolete}`,
    //   schedule_list: 0,
    //   producer_id_fk_products: `${req.body.producerId}`
    // };
    // console.log('postQuery: ', postQuery);
    // connection.query(
    //   `INSERT INTO schedules SET ?`,
    //   postQuery,
    //   function(err, result) {
    //     if (err) {
    //       console.log('error in create sched:', err);
    //       res.send('error:', err);
    //     } else {
    //       console.log('sched created: ', result);
    //       return res.status(200).send(result);
    //     }
    //   }
    // )
  },

  get_schedules_id: function(req, res) {
    ScheduleById.get_schedules_id(req, res);
  },

  delete_schedules_id: function(req, res) {
    return res.send(202);
  },

  put_schedules_id: function(req, res) {
    return res.send(201);
  }

};