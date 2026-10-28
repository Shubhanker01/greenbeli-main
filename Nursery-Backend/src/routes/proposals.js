const router = require('express').Router();
const { requireAuth } = require("../middleware/authMiddleware");

const {
    createProposal,
    getAllProposals,
    getProposalById,
    updateProposal,
    deleteProposal
} = require('../controllers/proposals');


router.post('/', createProposal);
router.get('/', requireAuth, getAllProposals);
router.get('/getproposalById/:id', requireAuth, getProposalById);
router.get('/:id', requireAuth, getProposalById);
router.put('/:id', requireAuth, updateProposal);
router.delete('/:id', requireAuth, deleteProposal);


module.exports = router;