require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 
const UserPurchaseProperty = require('../models/userPurchaseProperty');
const PaymentTransaction = require('../models/paymentTransaction');
const PropertyData = require('../models/propertyData');
const Agent = require('../models/agentAccount');
 
 exports.createPurchase = async (req, res) => {
  const { userId, propertyId, amount } = req.body;
 
  try {
    const newPurchase = new UserPurchaseProperty({
      userId,
      propertyId,
      amount,
      status: 'pending'
    });
 
    await newPurchase.save();
    res.status(201).json({ purchaseId: newPurchase._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create purchase' });
  }
};
exports.createPayment = async (req, res) => {
  const { purchaseId, token } = req.body;
  try {
    const purchase = await UserPurchaseProperty.findById(purchaseId)
      .populate('userId propertyId');
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    if (purchase.status !== 'pending') return res.status(400).json({ message: 'Payment already processed' });
 
    const property = purchase.propertyId;
    const user = purchase.userId;
    const agent = await Agent.findById(property.userId);
    if (!agent || !agent.AccountNo) {
      return res.status(400).json({ message: 'Agent Stripe account not found' });
    }
 
    const amount = purchase.amount * 100;
    const agentShare = amount * 0.7;
    const ownerShare = amount * 0.3;
 
    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
source: token.id,
      description: `Property Purchase: ${property._id}`,
receipt_email: user.email,
    });
 
    await stripe.transfers.create({
      amount: agentShare,
      currency: 'usd',
      destination: agent.AccountNo,
transfer_group: charge.id,
    });
 
    // Update Purchase
purchase.transactionId = charge.id;
    purchase.status = 'completed';
 
    try {
      await purchase.save();
    } catch (saveError) {
      console.error('Failed to update purchase:', saveError);
      return res.status(500).json({ message: 'Failed to update purchase after payment' });
    }
 
    // Save Payment Transaction
    const transaction = new PaymentTransaction({
      agentId: property.userId,
      userId: user._id,
      propertyId: property._id,
transactionId: charge.id,
      totalAmount: amount / 100,
      agentShare: agentShare / 100,
      ownerShare: ownerShare / 100,
      status: 'completed',
    });
 
    try {
      await transaction.save();
    } catch (transactionSaveError) {
      console.error('Failed to save payment transaction:', transactionSaveError);
      return res.status(500).json({ message: 'Failed to save payment transaction' });
    }
 
    res.status(200).json({ message: 'Payment successful', charge, transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment failed' });
  }
};
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await PaymentTransaction.find()
      .populate('agentId', 'First_Name Last_Name Email')
      .populate('userId', 'First_Name Last_Name Email')
      .populate('propertyId', 'Property_Name Property_Price Property_Type')
      .sort({ createdAt: -1 });

    res.status(200).json({ data: transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await PaymentTransaction.findById(req.params.id)
      .populate('agentId', 'First_Name Last_Name Email')
      .populate('userId', 'First_Name Last_Name Email')
      .populate('propertyId', 'Property_Name Property_Price Property_Type');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ data: transaction });
  } catch (err) {
    console.error('Error fetching transaction:', err);
    res.status(500).json({ message: 'Failed to fetch transaction' });
  }
};

// Create new transaction
exports.createTransaction = async (req, res) => {
  try {
    const {
      agentId,
      userId,
      propertyId,
      totalAmount,
      transactionId
    } = req.body;

    // Calculate shares
    const agentShare = totalAmount * 0.7; // 70%
    const ownerShare = totalAmount * 0.3; // 30%

    const newTransaction = new PaymentTransaction({
      agentId,
      userId,
      propertyId,
      transactionId,
      totalAmount,
      agentShare,
      ownerShare,
      status: 'completed'
    });

    const savedTransaction = await newTransaction.save();

    // Populate the saved transaction with related data
    const populatedTransaction = await PaymentTransaction.findById(savedTransaction._id)
      .populate('agentId', 'First_Name Last_Name Email')
      .populate('userId', 'First_Name Last_Name Email')
      .populate('propertyId', 'Property_Name Property_Price Property_Type');

    res.status(201).json({ data: populatedTransaction });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
};
 