const User = require('../models/user');
const UserType = require('../models/UserType');
const UserPurchaseProperty = require('../models/userPurchaseProperty');

exports.getAllLocalUsers = async (req, res) => {
    try {
        const localUserType = await UserType.findOne({ user_type_name: 'local' });
        if (!localUserType) {
            return res.status(404).json({ message: 'Local user type not found' });
        }

        const localUsers = await User.find({ user_type_id: localUserType._id })
            .select('-Password')
            .lean();

        const usersWithProperties = await Promise.all(localUsers.map(async (user) => {
            const purchasedProperties = await UserPurchaseProperty.find({
                userId: user._id,
                status: 'completed'
            })
            .populate({
                path: 'propertyId',
                populate: [
                    { path: 'categoryId', select: 'name' },
                    { path: 'stateId', select: 'name' },
                    { path: 'cityId', select: 'name' }
                ]
            })
            .lean();

            return {
                ...user,
                purchasedProperties,
                totalPurchases: purchasedProperties.length,
                totalSpent: purchasedProperties.reduce((sum, prop) => sum + prop.amount, 0)
            };
        }));

        res.json(usersWithProperties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLocalUserById = async (req, res) => {
    try {
        const localUserType = await UserType.findOne({ user_type_name: 'local' });
        const user = await User.findOne({
            _id: req.params.id,
            user_type_id: localUserType._id
        }).select('-Password');

        if (!user) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const purchasedProperties = await UserPurchaseProperty.find({
            userId: user._id,
            status: 'completed'
        })
        .populate({
            path: 'propertyId',
            populate: [
                { path: 'categoryId', select: 'name' },
                { path: 'stateId', select: 'name' },
                { path: 'cityId', select: 'name' }
            ]
        })
        .lean();

        const totalSpent = purchasedProperties.reduce((sum, prop) => sum + prop.amount, 0);

        res.json({
            user,
            purchasedProperties,
            totalPurchases: purchasedProperties.length,
            totalSpent
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};