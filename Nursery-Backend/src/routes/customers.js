const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/authMiddleware");

const { getRegisteredCustomers, createAdminCustomer, deleteAdminCustomer, updateAdminCustomer } = require("../controllers/customerController");

router.get("/", requireAuth, getRegisteredCustomers);
router.post("/", requireAuth, createAdminCustomer);
router.delete("/:id", requireAuth, deleteAdminCustomer);
router.put("/:id", requireAuth, updateAdminCustomer);

module.exports = router