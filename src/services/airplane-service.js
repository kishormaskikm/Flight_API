/*
- Controllers pass the request to the service.
- Services use repositories to interact with the database.
*/

const { StatusCodes } = require("http-status-codes")

const { AirplaneRepository } = require("../repositories/");
const AppError = require("../utils/errors/app-error");

const airplaneRepository = new AirplaneRepository();

async function createAirplane(data) {
  try {
    const airplane = await airplaneRepository.create(data);
    return airplane;
  } catch (error) {

    if(error.name == 'SequelizeValidationError'){
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      console.log(explanation);
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    throw error;
  }
}

async function getAirplanes(){
  try {
    const airplanes = await airplaneRepository.getAll();
    return airplanes;
  } catch (error) {
    throw new AppError('Cannot fetch a airplanes data', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getAirplane(id){
  try {
    const airplane = await airplaneRepository.get(id);
    return airplane;
  } catch (error) {
    if(error.statusCode == StatusCodes.NOT_FOUND){
      throw new AppError('The Airplane you requested is not prestent', error.statusCode);
    }
    throw new AppError('Cannot fetch a airplanes data', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function destroyAirplane(id){
  try {
    const response = await airplaneRepository.destroy(id);
    return response;
  } catch (error) {
    if(error.statusCode == StatusCodes.NOT_FOUND){
      throw new AppError('The Airplane you requested to delete is not prestent', error.statusCode);
    }
    throw new AppError('Cannot fetch a airplanes data', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function updateAirplane(id,data){
  try {
    const response = await airplaneRepository.update(id,data);
    return response;
  } catch (error) {
    if(error.statusCode == StatusCodes.NOT_FOUND){
      throw new AppError('The Airplane you requested to update is not prestent', error.statusCode);
    }
    throw new AppError('Cannot fetch a airplanes data', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports={
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane
}