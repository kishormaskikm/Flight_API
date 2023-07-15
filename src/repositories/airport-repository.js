const CrudRepository = require("./crud-repository");
const { Airport } = require("../models");
class AirportRepository extends CrudRepository {
  constructor() {
    super(Airport); // calling the constructor of the parent class
  }
}

module.exports = AirportRepository;
