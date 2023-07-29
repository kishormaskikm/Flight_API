const CrudRepository = require("./crud-repository");
const { Sequelize } = require("sequelize")
const { flight, city , Airport, Airplane  } = require("../models");
const db = require('../models');
const { addRowLockOnFlights } = require('./queries');
class FlightRepository extends CrudRepository {
  constructor() {
    super(flight); // calling the constructor of the parent class
  }

  async getAllFlights(filter, sort) {
    const response = await flight.findAll({
        where: filter,
        order: sort,
        include : [
          {
            model : Airplane,
            require : true,
            as : 'airplaneDetail'
          },
          {
            model : Airport,
            require: true,
            as: 'departureAirport',
            on: {
              col1 : Sequelize.where(Sequelize.col("Flight.departureAirportId"), "=", Sequelize.col("departureAirport.code"))
            },
            include: {
              model: city,
              required: true
            },
          },
          {
            model: Airport,
            required: true,
            as: 'arrivalAirport',
            on : {
                col1: Sequelize.where(Sequelize.col("Flight.arrivalAirportId"), "=", Sequelize.col("arrivalAirport.code"))
            },
            include: {
              model: city,
              required: true
            },
          }
        ]
    });
    return response;
  }

  async updateRemainingSeats(flightId, seats, dec = true) {
    const transaction = await db.sequelize.transaction();
        try {
            await db.sequelize.query(addRowLockOnFlights(flightId));
            const flights = await flight.findByPk(flightId);
            if(+dec) {
                await flights.decrement('totalSeats', {by: seats}, {transaction: transaction});
            } else {
                await flights.increment('totalSeats', {by: seats}, {transaction: transaction});
            }
            await transaction.commit();
            return flights;
        } catch(error) {
            await transaction.rollback();
            throw error;
        }
  }
}




module.exports = FlightRepository;
