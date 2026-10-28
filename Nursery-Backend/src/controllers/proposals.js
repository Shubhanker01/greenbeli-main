const Proposal = require('../models/proposals');

const createProposal = async (req, res) => {
    try {
        const {
            projectType,
            name,
            phone,
            email,
            estimatedBudget,
            spaceSize = "",
            requirements
        } = req.body;

        const proposal = await Proposal.create({
            projectType,
            name,
            phone,
            email,
            estimatedBudget,
            spaceSize,
            requirements
        });

        res.status(201).json({
            message: "Proposal request submitted successfully",
            proposal
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllProposals = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;

        const query = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        const proposals = await Proposal.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Proposal.countDocuments(query);

        res.json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            proposals
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProposalById = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id);

        if (!proposal) {
            return res.status(404).json({ message: "Proposal not found" });
        }

        res.status(200).json(proposal);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!proposal) {
            return res.status(404).json({ message: "Proposal not found" });
        }

        res.status(200).json({
            message: "Updated successfully",
            proposal
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findByIdAndDelete(req.params.id);

        if (!proposal) {
            return res.status(404).json({ message: "Proposal not found" });
        }

        res.status(200).json({
            message: "Deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createProposal,
    getAllProposals,
    getProposalById,
    updateProposal,
    deleteProposal,


};