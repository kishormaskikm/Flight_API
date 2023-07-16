/*
- Controllers pass the request to the service.
- Services use repositories to interact with the database.
*/

const { StatusCodes } = require("http-status-codes")

const { AirportRepository } = require("../repositories/");
const AppError = require("../utils/errors/app-error");

const airportRepository = new AirportRepository();

async function createAirport(data) {
  try {
    const airport = await airportRepository.create(data);
    return airport;
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
      "Cannot create a new Airport object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAirports(){
  try {
    const airports = await airportRepository.getAll();
    return airports;
  } catch (error) {
    throw new AppError('Cannot fetch a airport data', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getAirport(id){
  try {
    const airport = await airportRepository.get(id);
    return airport;
  } catch (error) {
    if(error.statusCode == StatusCodes.NOT_FOUND){
      throw new AppError('The Airplane you requested is not prestent', error.statusCode);
    }
    throw new AppError('Cannot fetch a airports data', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function destroyAirport(id){
  try {
    const response = await airportRepository.destroy(id);
    return response;
  } catch (error) {
    if(error.statusCode == StatusCodes.NOT_FOUND){
      throw new AppError('The Airport you requested to delete is not prestent', error.statusCode);
    }
    throw new AppError('Cannot fetch a Airports data', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

// async function updateAirport(id,data){
//   try {
//     const response = await airportRepository.update(id,data);
//     return response;
//   } catch (error) {
//     if(error.statusCode == StatusCodes.NOT_FOUND){
//       throw new AppError('The airport  you requested to update is not prestent', error.statusCode);
//     }
//     throw new AppError('Cannot fetch a airports data', StatusCodes.INTERNAL_SERVER_ERROR);
//   }
// }

module.exports={
    createAirport,
    getAirports,
    getAirport,
    destroyAirport,
    // updateAirport
}