const multer = require("multer");

const storage = multer.memoryStorage();

const multi_uploader = multer({
  storage: storage,
}).fields([
  { name: "bank_transactions", maxCount: 1 },
  { name: "rules", maxCount: 1 },
]);

module.exports = {
  multi_uploader,
};
