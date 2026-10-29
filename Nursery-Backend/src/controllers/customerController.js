const User = require("../models/User");
const { supabaseAdmin } = require("../config/admin");

const getRegisteredCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, totalUsers] = await Promise.all([
            User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            User.countDocuments()
        ]);

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No registered customer"
            });
        }
        return res.status(200).json({
            success: true,
            count: users.length,
            total: totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            data: users
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching customers"
        });
    }
};

const createAdminCustomer = async (req, res) => {
    try {
        const name = typeof req.body?.name === "string" ? req.body.name.trim().slice(0, 80) : "";
        const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const password = typeof req.body?.password === "string" ? req.body.password : "";
        const phone = req.body?.phone || "";

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required" });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({ success: false, message: "Password must be 8-72 characters" });
        }

        // 1. Create user in Supabase with admin privileges & auto-confirmed email
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Bypass email verification since admin is creating it
            user_metadata: { full_name: name, phone }
        });

        if (authError) {
            return res.status(400).json({ success: false, message: authError.message });
        }

        const supabaseUserId = authData.user.id;
        // 3. Create the customer document directly in MongoDB
        const newCustomer = await User.create({
            supabaseId: supabaseUserId,
            name,
            email,
            phone: phone || null,
        });

        return res.status(201).json({
            success: true,
            message: "Customer created successfully by admin",
            data: newCustomer
        });

    } catch (error) {
        console.error("Create customer error:", error.message);
        return res.status(500).json({ success: false, message: "Server error while creating customer" });
    }
};

const deleteAdminCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Customer ID is required" });
        }

        // 1. Find the customer in MongoDB first to get their supabaseId
        const customer = await User.findById(id) || await User.findOne({ supabaseId: id });

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        // 2. If the user has a linked Supabase account, delete them from Supabase auth
        if (customer.supabaseId) {
            const { error: supabaseError } = await supabaseAdmin.auth.admin.deleteUser(customer.supabaseId);
            if (supabaseError) {
                console.error("Failed to delete user from Supabase:", supabaseError.message);
                // Continue with MongoDB deletion or return error depending on strictness
            }
        }

        // 3. Delete the customer record from MongoDB
        await User.findByIdAndDelete(customer._id);

        return res.status(200).json({
            success: true,
            message: "Customer successfully deleted from database and Supabase"
        });

    } catch (error) {
        console.error("Delete customer error:", error.message);
        return res.status(500).json({ success: false, message: "Server error while deleting customer" });
    }
};

const updateAdminCustomer = async (req, res) => {
    try {
        const { id } = req.params; // MongoDB _id
        const { name, email, phone, password } = req.body;

        // 1. Find customer in MongoDB
        const customer = await User.findById(id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        // 2. Prepare Supabase update payload if credentials/metadata changed
        const supabaseUpdates = {};
        if (email && email !== customer.email) supabaseUpdates.email = email;
        if (password && password.length >= 8) supabaseUpdates.password = password;
        if (name || phone) {
            supabaseUpdates.user_metadata = {
                full_name: name || customer.name,
                phone: phone !== undefined ? phone : customer.phone
            };
        }

        // 3. Update Supabase Auth user if there are changes and supabaseId exists
        if (customer.supabaseId && Object.keys(supabaseUpdates).length > 0) {
            const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
                customer.supabaseId,
                supabaseUpdates
            );
            if (authError) {
                return res.status(400).json({ success: false, message: authError.message });
            }
        }

        // 4. Update MongoDB user record
        if (name) customer.name = name.trim();
        if (email) customer.email = email.trim().toLowerCase();
        if (phone !== undefined) customer.phone = phone;

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: customer
        });

    } catch (error) {
        console.error("Update customer error:", error.message);
        return res.status(500).json({ success: false, message: "Server error while updating customer" });
    }
};



module.exports = {
    getRegisteredCustomers,
    createAdminCustomer,
    deleteAdminCustomer,
    updateAdminCustomer
}