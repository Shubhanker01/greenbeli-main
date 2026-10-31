const router = require('express').Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { standardLimit, burstLimit, publicSubmitLimit } = require("../middleware/rateLimit");

const {
    createProposal,
    getAllProposals,
    getProposalById,
    updateProposal,
    deleteProposal
} = require('../controllers/proposals');


router.post('/', burstLimit, publicSubmitLimit, createProposal);
router.get('/', requireAuth, getAllProposals);
router.get('/getproposalById/:id', requireAuth, getProposalById);
router.get('/:id', requireAuth, getProposalById);
router.put('/:id', standardLimit, requireAuth, updateProposal);
router.delete('/:id', standardLimit, requireAuth, deleteProposal);


module.exports = router;