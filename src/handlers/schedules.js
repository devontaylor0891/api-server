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

  get_schedules_id: function(req, res) {
    ScheduleById.get_schedules_id(req, res);
  },

  delete_schedules_id: function(req, res) {
    return res.send(202);
  },

  put_schedules_id: function(req, res) {
    return res.send(201);
  },

};