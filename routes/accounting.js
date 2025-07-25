const router = require("express").Router();
const { accountingController: controller } = require("../controller");
const { multi_uploader } = require("../utils/multer");

router.post("/process", multi_uploader, controller.Process);
router.get("/records", controller.Records);

module.exports = router;