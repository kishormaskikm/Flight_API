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

module.exports={
    createAirplane
}