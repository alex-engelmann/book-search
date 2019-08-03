const router = require("express").Router();
const bookRoutes = require("./savedbooks");

// Book routes
router.use("/savedbooks", bookRoutes);

module.exports = router;
