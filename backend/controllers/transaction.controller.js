import Transaction from "../models/transaction.model.js"

const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body

    if (!amount || !type || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Amount, type, category and date are required"
      })
    }

    const transaction = await Transaction.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id
    })

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

const getAllTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query

    let filter = {}

    if (type) {
      filter.type = type
    }

    if (category) {
      filter.category = category
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    const transactions = await Transaction.find(filter)
      .populate("createdBy", "name email role")
      .sort({ date: -1 })

    res.status(200).json({
      success: true,
      total: transactions.length,
      transactions
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("createdBy", "name email role")

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      })
    }

    res.status(200).json({
      success: true,
      transaction
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

const updateTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body

    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      })
    }

    if (amount) transaction.amount = amount
    if (type) transaction.type = type
    if (category) transaction.category = category
    if (date) transaction.date = date
    if (notes) transaction.notes = notes

    await transaction.save()

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      })
    }

    await Transaction.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully"
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    })
  }
}

export {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
}