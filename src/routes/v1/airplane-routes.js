const express = require("express");
const { AirplaneController } = require("../../controllers");
const { AirplaneMiddlewares } = require("../../middlewares");
const router = express.Router();

/*
method: POST
URL : /api/v1/airplanes/
*/
router.post("/", 
            AirplaneMiddlewares.validateCreateRequest,
            AirplaneController.createAirplane);

router.get("/", 
            AirplaneController.getAirplanes);

router.get('/:id', 
            AirplaneController.getAirplane);
/*
method: Delete
URL : /api/v1/airplanes/id
*/
router.delete('/:id', 
            AirplaneController.destroyAirplane);

/*
method: PATCH
URL : /api/v1/airplanes/id
*/
router.patch('/:id', 
            AirplaneController.updateAirplane);

module.exports = router;
