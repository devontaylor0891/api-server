'use strict';
var _ = require('lodash');
var connection = require('../../db');
var ScheduleById = require('./schedules/{id}');

module.exports = {

  get_schedules: function(req, res) {
    connection.query(
      `SELECT * FROM schedules`, function (error, schedulesResult) {
        return res.status(200).send(schedulesResult);
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