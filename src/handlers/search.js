'use strict';
var connection = require('../../db');

module.exports = {
  get_search: function(req, res) {

    console.log('search Results req: ', req.body);
    // get the search parameters
    let distance = req.body.radius;
    // let distance = 150;
    let latitude = req.body.latitude;
    // let latitude = 50.1436;
    let longitude = req.body.longitude;
    // let longitude = -101.6668;
    let maxlat, maxlng, minlat, minlng;

    // Converts from degrees to radians.
    Math.radians = function(degrees) {
      return degrees * Math.PI / 180;
    };
    
    // Converts from radians to degrees.
    Math.degrees = function(radians) {
      return radians * 180 / Math.PI;
    };

    // set other parameters (from https://coderwall.com/p/otkscg/geographic-searches-within-a-certain-distance)
    // earth's radius in km = ~6371
    let earthRadius = 6371;

    // latitude boundaries
    maxlat = latitude + Math.degrees(distance / earthRadius);
    minlat = latitude - Math.degrees(distance / earthRadius);

    // longitude boundaries (longitude gets smaller when latitude increases)
    maxlng = longitude + Math.degrees(distance / earthRadius / Math.cos(Math.radians(latitude)));
    minlng = longitude - Math.degrees(distance / earthRadius / Math.cos(Math.radians(latitude)));
    console.log('lat: ', latitude)
    console.log('lng: ', longitude);
    console.log('maxlat: ', maxlat);
    console.log('maxlng: ', maxlng);
    console.log('minlat: ', minlat);
    console.log('minlng: ', minlng);

    // build a query inside a promise, this will return the rows from the query
    function promisedQuery(sql) { 
      console.log('query: ', sql);
      return new Promise ((resolve, reject) => {
        connection.query(sql, function(err, rows) {
          if ( err ) {
            console.log('error: ', err);
            return reject( err );
          }
          console.log('success');
          resolve( rows );
        })
      });
    };

    // build the required queries
    // let getSchedulesSql = 'SELECT * FROM schedules WHERE order_deadline >= NOW() AND latitude BETWEEN (?) AND (?) AND longitude BETWEEN (?) AND (?);';
    let getSchedulesSql = 'SELECT schedules.*, producers.name FROM schedules JOIN producers ON schedules.producer_id_fk_s = producers.producer_id WHERE order_deadline >= NOW() AND schedules.latitude BETWEEN (?) AND (?) AND schedules.longitude BETWEEN (?) AND (?);';
    let getSchedulesQueryOptions = {
      sql: getSchedulesSql,
      values: [minlat, maxlat, minlng, maxlng],
      nestTables: true
    };

    // let producersValuesLength: ' + new Array(values.length + 1).join('?,').slice(0, -1) + '
    let producerValues = 0;
    let getProducersSql = 'SELECT * FROM producers LEFT JOIN users ON producers.user_id = users.id WHERE producer_id IN (' + new Array(producerValues + 1).join('?,').slice(0, -1) + ')';
    let getProducersQueryOptions = {
      sql: getProducersSql,
      values: null,
      nestTables: true
    };

    let getProductsSql = 'SELECT products.product_id, products.producer_id_fk_products, products.name AS productName, products.description, products.image, products.pricePerUnit, products.unit, products.unitsPer, products.category, products.subcategory, products.date_added, products.qty_available, products.qty_pending, products.qty_accepted, products.qty_completed, products.is_obsolete, producers.user_id AS pId, producers.name AS pName FROM products LEFT JOIN producers ON products.producer_id_fk_products = producers.producer_id WHERE producer_id_fk_products IN (?) AND qty_available > 0;';
    let getProductsQueryOptions = {
      sql: getProductsSql,
      values: null
    };

    // create the variables needed
    let schedulesReceived, producersReceived, productsReceived;
    let producerIds;
    let searchResultsObject = {
      schedules: [],
      producers: [],
      products: []
    };

    // then call the promisedQuery and pass the queries into it
    // ************ SCHEDULES ***********
    promisedQuery(getSchedulesQueryOptions)
      .then(rows => {
        // if no scheds are found
        if (rows.length === 0) {
          let zeroResults = {};
          return res.status(200).send(zeroResults);
        } else {
          // do stuff with the returned rows
          // console.log('row:', rows);
          schedulesReceived = rows.map(function(row) {
            // console.log('scheds: ', row);
            return {
              id: row.schedules.schedule_id,
              producerId: row.schedules.producer_id_fk_s,
              userId: row.schedules.user_id_fk_schedules,
              type: row.schedules.schedule_type,
              description: row.schedules.description,
              startDateTime: row.schedules.start_date_time,
              endDateTime: row.schedules.end_date_time,
              hasFee: row.schedules.has_fee,
              hasWiaver: row.schedules.has_waiver,
              latitude: row.schedules.latitude,
              longitude: row.schedules.longitude,
              city: row.schedules.city,
              province: row.schedules.province,
              orderDeadline: row.schedules.order_deadline,
              address: row.schedules.address,
              fee: row.schedules.fee,
              feeWaiver: row.schedules.fee_waiver,
              producerName: row.producers.name
            }
          });
          // assign to searchResults
          searchResultsObject.schedules = schedulesReceived;
          // console.log('sched received: ', schedulesReceived);
          // for(let i = 0; i < searchResultsObject.schedules.length; i++) {
          //   console.log('producerid: ', searchResultsObject.schedules[i].producerId);
          // };
          // create an array of producer Ids from the scheds;
          let producerIdArray = schedulesReceived.map((schedule) => {
            return schedule.producerId
          });
          // pull out duplicates
          producerIds = producerIdArray.filter((v, i, a) => a.indexOf(v) === i); 
          console.log('filtered pids: ', producerIds);
          producerValues = producerIds.length();
          console.log('producervalues: ', producerValues);
          // call the query again to get producers
          getProducersQueryOptions.values = producerIds.slice(0);
          // ************ PRODUCERS ***********
          return promisedQuery(getProducersQueryOptions);
        }
      })
      .then((rows) => {
        producersReceived = rows.map(function(row) {
          console.log('producerRecd id: ', row.producers.producer_id);
          return {
            id: row.producers.user_id,
            producerId: row.producers.producer_id,
            name: row.producers.name,
            location: row.producers.location,
            province: row.producers.province,
            longitude: row.producers.longitude,
            latitude: row.producers.latitude,
            status: row.producers.status,
            address: row.producers.address,
            description: row.producers.description,
            logoUrl: row.producers.logoUrl,
            firstName: row.producers.first_name,
            email: row.producers.email,
            registrationDate: row.producers.registration_date
          }
        });
        // assign to producersArray
        searchResultsObject.producers = producersReceived;
        // call the query again to get producers
        getProductsQueryOptions.values = producerIds.join();
        // ************ PRODUCERS ***********
        return promisedQuery(getProductsQueryOptions);
      })
      .then((rows) => {
        productsReceived = rows.map(function(row) {
          // console.log('row: ', row);
          // console.log('products: ', row.products);
          return {
            id: row.product_id,
            name: row.productName,
            description: row.description,
            image: row.image,
            pricePerUnit: row.pricePerUnit,
            unit: row.unit,
            unitsPer: row.unitsPer,
            category: row.category,
            subcategory: row.subcategory,
            producer: {
              id: row.pId,
              name: row.pName
            },
            dateAdded: row.date_added,
            qtyAvailable: row.qty_available,
            qtyPending: row.qty_pending,
            qtyAccepted: row.qty_accepted,
            qtyCompleted: row.qty_completed,
            isObsolete: row.is_obsolete,
            producerId: row.producer_id_fk_products
          }
        })
        // assign to productsArray
        searchResultsObject.products = productsReceived;
        return res.status(200).send(searchResultsObject);
      }).catch(err => {
        return res.status(500).send(err);
      });

 
  },
};
