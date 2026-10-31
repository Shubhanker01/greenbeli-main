const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");
const { standardLimit } = require("../middleware/rateLimit");
const { getRegisteredCustomers, createAdminCustomer, deleteAdminCustomer, updateAdminCustomer } = require("../controllers/customerController");

router.get("/", requireAuth, getRegisteredCustomers);
router.post("/", standardLimit, requireAuth, createAdminCustomer);
router.delete("/:id", standardLimit, requireAuth, deleteAdminCustomer);
router.put("/:id", standardLimit, requireAuth, updateAdminCustomer);

module.exports = router