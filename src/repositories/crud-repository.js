/*
- Controllers don't directly talk to models.
- Services have business logic, so they don't directly talk to models.
- Repository talks to models.
*/
/*
Follow this Documentation : 

- https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
- https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
*/
const { StatusCodes } = require("http-status-codes")
const { Logger } = require("../config");
const AppError = require("../utils/errors/app-error");

class CrudRepository {
  constructor(model) {
    this.model = model;
  }
  async create(data) {
    const response = await this.model.create(data); // insert data query
    return response;
  }
  async destroy(data) {
    const response = await this.model.destroy({
      where: {
        id: data,
      },
    });
    if(!response){
      throw new AppError('Airplane not found',StatusCodes.NOT_FOUND)
    } // delete data query based on id.
    return response;
  }

  async get(data) {
    const response = await this.model.findByPk(data);
    if(!response){
      throw new AppError('Airplane not found',StatusCodes.NOT_FOUND)
    } // find data query based on Primary Key
    return response;

  }

  async getAll() {
    const response = await this.model.findAll(); // find all the data query
    return response;
  }
  async update(id, data) { // data -> {col: value, ....}
    const response = await this.model.update(data, {
        where: {
            id: id
        }
    })
    return response;
  }
}
module.exports = CrudRepository;


/* 
Extremely complex queries are not possible in Sequelize.
The better way is to write a raw query in Sequelize.

Follow this Documentation to write raw query in Sequelize:
- https://sequelize.org/docs/v6/core-concepts/raw-queries/

*/
