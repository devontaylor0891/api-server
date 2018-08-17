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
};
  