const Organization = require('../models/Organization');
const User = require('../models/User');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Subscription = require('../models/Subscription');
const Student = require('../models/Student');

// @desc    Get system overview statistics
// @route   GET /api/superadmin/dashboard/stats
// @access  Private/SuperAdmin
exports.getStats = async (req, res) => {
    try {
        const totalOrganizations = await Organization.countDocuments();
        const totalAdminUsers = await User.countDocuments({ role: 'admin' });
        
        // Deriving active subscriptions and revenue directly from Organizations for better reliability
        const activeOrgs = await Organization.find({ status: 'Active' }).populate('planId');
        const activeSubscriptions = activeOrgs.length;
        const monthlyRevenue = activeOrgs.reduce((sum, org) => sum + (org.planId?.price || 0), 0);

        // Self-healing: Ensure active orgs have a subscription record for the current month
        for (const org of activeOrgs) {
            const hasSub = await Subscription.findOne({ organizationId: org._id });
            if (!hasSub && org.planId) {
                await Subscription.create({
                    organizationId: org._id,
                    planId: org.planId._id,
                    amount: org.planId.price,
                    status: 'Active',
                    billingDate: org.startDate || org.createdAt || new Date()
                });
            }
        }
        
        const latestOrganizations = await Organization.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .populate('planId', 'planName');

        // Get revenue history for last 12 months
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0);

        const revenueHistoryRaw = await Subscription.aggregate([
            {
                $match: {
                    billingDate: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$billingDate" },
                        month: { $month: "$billingDate" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format to ensure all 12 months are represented
        const revenueHistory = [];
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        
        let current = new Date(twelveMonthsAgo);
        for (let i = 0; i < 12; i++) {
            const m = current.getMonth() + 1;
            const y = current.getFullYear();
            
            const match = revenueHistoryRaw.find(r => r._id.month === m && r._id.year === y);
            revenueHistory.push({
                month: monthNames[current.getMonth()],
                revenue: match ? match.total : 0
            });
            
            current.setMonth(current.getMonth() + 1);
        }

        res.status(200).json({
            success: true,
            data: {
                totalOrganizations,
                totalAdminUsers,
                activeSubscriptions,
                monthlyRevenue,
                latestOrganizations,
                revenueHistory
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create organization and admin user
// @route   POST /api/superadmin/organizations
// @access  Private/SuperAdmin
exports.createOrganization = async (req, res) => {
    const { 
        organizationName, 
        adminName, 
        adminEmail, 
        adminPassword, 
        planId,
        phoneNumber,
        address,
        startDate,
        expireDate,
        planType 
    } = req.body;

    try {
        // Calculate Expiration Date
        const sDate = startDate ? new Date(startDate) : new Date();
        const eDate = new Date(sDate);
        if (planType === 'Yearly') {
            eDate.setFullYear(sDate.getFullYear() + 1);
        } else {
            eDate.setMonth(sDate.getMonth() + 1);
        }

        // Create Organization first (adminUserId will be added after user creation)
        const organization = await Organization.create({
            name: organizationName,
            planId,
            phoneNumber,
            address,
            startDate: sDate,
            expireDate: eDate,
            planType,
            status: 'Active'
        });

        // Create Admin User with the organizationId
        const adminUser = await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            organizationId: organization._id
        });

        // Link User back to Organization
        organization.adminUserId = adminUser._id;
        await organization.save();

        // Create initial Subscription record for revenue tracking
        const plan = await SubscriptionPlan.findById(planId);
        if (plan) {
            await Subscription.create({
                organizationId: organization._id,
                planId: plan._id,
                amount: plan.price,
                status: 'Active',
                billingDate: new Date()
            });
        }

        res.status(201).json({
            success: true,
            data: organization
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all organizations
// @route   GET /api/superadmin/organizations
// @access  Private/SuperAdmin
exports.getOrganizations = async (req, res) => {
    try {
        let organizations = await Organization.find()
            .populate('adminUserId', 'name email')
            .populate('planId', 'planName');

        // Dynamic Data Integrity: Fix missing expiration dates and fetch counts
        const updatedOrgs = await Promise.all(organizations.map(async (org) => {
            // Data integrity check for expireDate
            if (org.status === 'Active' && !org.expireDate) {
                const sDate = org.startDate || org.createdAt || new Date();
                const eDate = new Date(sDate);
                const type = org.planType || 'Monthly';
                
                if (type === 'Yearly') {
                    eDate.setFullYear(sDate.getFullYear() + 1);
                } else {
                    eDate.setMonth(sDate.getMonth() + 1);
                }
                
                org.expireDate = eDate;
                org.startDate = sDate;
                org.planType = type;
                await org.save();
            }

            // Fetch dynamic counts
            const staffCount = await User.countDocuments({ 
                organizationId: org._id, 
                role: 'staff' 
            });
            const studentCount = await Student.countDocuments({ 
                organizationId: org._id 
            });

            // Convert to object to add virtual properties
            const orgObj = org.toObject();
            orgObj.staffCount = staffCount;
            orgObj.studentCount = studentCount;

            return orgObj;
        }));

        res.status(200).json({ success: true, data: updatedOrgs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Manage plans
// @route   POST /api/superadmin/plans
// @access  Private/SuperAdmin
exports.createPlan = async (req, res) => {
    const { 
        planName, 
        price, 
        maxStudents, 
        features, 
        billingPeriod, 
        maxStaff, 
        isPopular 
    } = req.body;

    try {
        const plan = await SubscriptionPlan.create({
            planName,
            price,
            maxStudents,
            features,
            billingPeriod,
            maxStaff,
            isPopular
        });
        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find();
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }
        res.status(200).json({ success: true, message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update organization
// @route   PUT /api/superadmin/organizations/:id
// @access  Private/SuperAdmin
exports.updateOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!organization) {
            return res.status(404).json({ success: false, message: 'Organization not found' });
        }
        res.status(200).json({ success: true, data: organization });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete organization and its admin
// @route   DELETE /api/superadmin/organizations/:id
// @access  Private/SuperAdmin
exports.deleteOrganization = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ success: false, message: 'Organization not found' });
        }

        // Delete associated admin user
        if (organization.adminUserId) {
            await User.findByIdAndDelete(organization.adminUserId);
        }

        await Organization.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Organization and associated admin deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update organization status (Approve/Reject/Suspend)
// @route   PATCH /api/superadmin/organizations/:id/status
// @access  Private/SuperAdmin
exports.updateOrganizationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Active', 'Suspended', 'Pending', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ success: false, message: 'Organization not found' });
        }

        // If approving a pending organization or fixing an organization missing dates
        if ((status === 'Active' && organization.status === 'Pending') || (status === 'Active' && !organization.expireDate)) {
            const startDate = new Date();
            const expireDate = new Date();
            // Default to Monthly if planType is missing
            const type = organization.planType || 'Monthly';
            
            if (type === 'Yearly') {
                expireDate.setFullYear(startDate.getFullYear() + 1);
            } else {
                expireDate.setMonth(startDate.getMonth() + 1);
            }
            
            organization.status = 'Active';
            organization.startDate = startDate;
            organization.expireDate = expireDate;
            organization.planType = type;
            await organization.save();

            // Create Subscription record on approval
            const plan = await SubscriptionPlan.findById(organization.planId);
            if (plan) {
                await Subscription.create({
                    organizationId: organization._id,
                    planId: plan._id,
                    amount: plan.price,
                    status: 'Active',
                    billingDate: new Date()
                });
            }
        } else {
            organization.status = status;
            await organization.save();
        }

        res.status(200).json({ success: true, data: organization });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
