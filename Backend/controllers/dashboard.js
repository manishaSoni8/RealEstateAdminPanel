const Property = require('../models/propertyData');
const State = require('../models/state');

// Get total properties count
exports.getTotalProperties = async (req, res) => {
  try {
    const total = await Property.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching total properties' });
  }
};

// Get properties by state
exports.getPropertiesByState = async (req, res) => {
  try {
    const stateData = await Property.aggregate([
      {
        $lookup: {
          from: 'states',
          localField: 'stateId',
          foreignField: '_id',
          as: 'state'
        }
      },
      {
        $unwind: '$state'
      },
      {
        $group: {
          _id: '$stateId',
          state: { $first: '$state.name' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          state: 1,
          count: 1,
          _id: 0
        }
      }
    ]);
    res.json(stateData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching state-wise properties' });
  }
};

// Get top 5 sold properties from last month
exports.getTopSoldProperties = async (req, res) => {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const topProperties = await Property.find({
      saleStatus: 'sold',
      updatedAt: { $gte: lastMonth }
    })
    .sort({ price: -1 })
    .limit(5)
    .populate('stateId', 'name')
    .populate('cityId', 'name');

    res.json(topProperties);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching top sold properties' });
  }
};

// Get total sales amount
exports.getTotalSales = async (req, res) => {
  try {
    const result = await Property.aggregate([
      {
        $match: { saleStatus: 'sold' }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$price' }
        }
      }
    ]);
    
    const totalSales = result.length > 0 ? result[0].total : 0;
    res.json({ total: totalSales });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching total sales' });
  }
};