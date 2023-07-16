/*
- Controllers pass the request to the service.
- Services use repositories to interact with the database.
*/

const { StatusCodes } = require("http-status-codes")

const { FlightRepository } = require("../repositories/");
const { Op } = require("sequelize");
const AppError = require("../utils/errors/app-error");

const flightRepository = new FlightRepository();

async function createFlight(data) {
  try {
    const flight = await flightRepository.create(data);
    return flight;
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    } else if (error.name == "SequelizeForeignKeyConstraintError") {
      let explanation = [];
      explanation.push(error.parent.sqlMessage);
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Cannot create a new Flight object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllFlights(query) {
  let customFilter = {};
  let sortFilter = [];
  const endingTripTime = " 23:59:00";
  // trips=MUM-DEL
  if(query.trips) {

     [departureAirportId, arrivalAirportId] = query.trips.split("-"); 
     customFilter.departureAirportId = departureAirportId;
     customFilter.arrivalAirportId = arrivalAirportId;
     // TODO: add a check that they are not same
  }
  if(query.price) {
      [minPrice, maxPrice] = query.price.split("-");
      customFilter.price = {
          [Op.between]: [minPrice, ((maxPrice == undefined) ? 20000: maxPrice)]
      }
  }
  if(query.travellers) {
      customFilter.totalSeats = {
          [Op.gte]: query.travellers
      }
  }
  if(query.tripDate) {
      customFilter.departureTime = {
          [Op.between]: [query.tripDate, query.tripDate + endingTripTime]
      }
  }
  if(query.sort) {
      const params = query.sort.split(',');
      const sortFilters = params.map((param) => param.split('_'));
      sortFilter = sortFilters
  }
  console.log(customFilter, sortFilter);
  try {
      const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
      return flights;
  } catch(error) {
      throw new AppError('Cannot fetch data of all the flights', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}


module.exports={
    createFlight,
    getAllFlights
}