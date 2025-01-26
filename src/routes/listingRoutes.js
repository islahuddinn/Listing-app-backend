const express = require("express");
const listingController = require("../controllers/listingController");
const fileUpload = require("express-fileupload");
const router = express.Router();

router.use(fileUpload());

router.post("/create", listingController.createListing);
router.get("/", listingController.getListings);
router.put("/:id", listingController.updateListing);
router.delete("/:id", listingController.deleteListing);

module.exports = router;
