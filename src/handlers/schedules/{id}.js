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
    // get has fee and has waiver values
    let hasFeeVal = req.body.hasFee;
    let hasWaiverVal = req.body.hasWaiver;
    if (!hasFeeVal) {
      let postQuery = {
        producer_id_fk_s: `${req.body.producerId}`,
        schedule_type: `${req.body.type}`,
        description: `${req.body.description}`,
        start_date_time: `${req.body.startDateTime}`,
        end_date_time: `${req.body.endDateTime}`,
        has_fee: false,
        has_waiver: false,
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
    } else if (hasFee && hasWaiver) {
      let postQuery = {
        producer_id_fk_s: `${req.body.producerId}`,
        schedule_type: `${req.body.type}`,
        description: `${req.body.description}`,
        start_date_time: `${req.body.startDateTime}`,
        end_date_time: `${req.body.endDateTime}`,
        has_fee: true,
        has_waiver: true,
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
    } else {
      let postQuery = {
        producer_id_fk_s: `${req.body.producerId}`,
        schedule_type: `${req.body.type}`,
        description: `${req.body.description}`,
        start_date_time: `${req.body.startDateTime}`,
        end_date_time: `${req.body.endDateTime}`,
        has_fee: true,
        has_waiver: false,
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
    }
    
  },

  delete_schedules_id: function (req, res) {
    connection.query(
      `DELETE FROM schedules
      WHERE schedule_id = ?;`,
      [req.params.id],
      function (err, result) {
        if (err) {
          console.log('error in delete sched:', err);
          res.status(500).send('error:', err);
        } else {
          console.log('sched deleted: ', result);
          return res.status(200).send(result);
        }
      } 
    )
  }
};
  