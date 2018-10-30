'use strict';
var _ = require('lodash');
var connection = require('../../db');
var ScheduleById = require('./schedules/{id}');
let lambda = require('./lambda/functions');

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
    let lambdaScheduleInfo = {
      schedule: {
        producerId: req.body.producerId,
        producerName: req.body.producerName,
        scheduleId: null,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime,
        type: req.body.type,
        description: req.body.description,
        city: req.body.city,
        province: req.body.province,
        latitude: req.body.latitude,
        longitude: req.body.longitude
      },
      userList: []
    };
    // return res.send(201);
    let postQuery = {
      producer_id_fk_s: `${req.body.producerId}`,
      schedule_type: `${req.body.type}`,
      description: `${req.body.description}`,
      start_date_time: `${req.body.startDateTime}`,
      end_date_time: `${req.body.endDateTime}`,
      has_fee: `${req.body.hasFee}`,
      has_waiver: `${req.body.hasWiaver}`,
      latitude: `${req.body.latitude}`,
      longitude: `${req.body.longitude}`,
      city: `${req.body.city}`,
      province: `${req.body.province}`,
      order_deadline: `${req.body.orderDeadline}`,
      address: `${req.body.address}`,
      fee: `${req.body.fee}`,
      fee_waiver: `${req.body.feeWaiver}`,
      user_id_fk_schedules: `${req.body.userId}`
    };
    console.log('postQuery: ', postQuery);
    connection.query(
      `INSERT INTO schedules SET ?`,
      postQuery,
      function(err, result) {
        if (err) {
          console.log('error in create sched:', err);
          res.send('error:', err);
        } else {
          console.log('sched created: ', result);
          lambda.location_notification(lambdaScheduleInfo);
          return res.status(200).send(result);
        }
      }
    )
  },

  get_schedules_id: function(req, res) {
    ScheduleById.get_schedules_id(req, res);
  },

  delete_schedules_id: function(req, res) {
    ScheduleById.delete_schedules_id(req, res);
  },

  put_schedules_id: function(req, res) {
    ScheduleById.put_schedules_id(req, res);
  }

};