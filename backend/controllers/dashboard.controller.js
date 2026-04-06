import Transaction from "../models/transaction.model.js"

const getSummary = async (req, res) => {
    try {
        const totalIncomeResult = await Transaction.aggregate([
            { $match: { type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        const totalExpenseResult = await Transaction.aggregate([
            { $match: { type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        const totalIncome = totalIncomeResult[0]?.total || 0
        const totalExpense = totalExpenseResult[0]?.total || 0
        const netBalance = totalIncome - totalExpense

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                netBalance,
                status: netBalance >= 0 ? "profit" : "loss"
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

const getCategoryBreakdown = async (req, res) => {
    try {
        const { type } = req.query

        let match = {}
        if (type) {
            match.type = type
        }

        const categoryBreakdown = await Transaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { total: -1 } },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    total: 1,
                    count: 1
                }
            }
        ])

        res.status(200).json({
            success: true,
            data: categoryBreakdown
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

const getMonthlyTrends = async (req, res) => {
    try {
        const monthlyTrends = await Transaction.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $group: {
                    _id: {
                        year: "$_id.year",
                        month: "$_id.month"
                    },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0]
                        }
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0]
                        }
                    }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    income: 1,
                    expense: 1,
                    net: { $subtract: ["$income", "$expense"] },
                    status: {
                        $cond: [
                            { $gte: [{ $subtract: ["$income", "$expense"] }, 0] },
                            "profit",
                            "loss"
                        ]
                    }
                }
            }
        ])

        res.status(200).json({
            success: true,
            data: monthlyTrends
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

const getRecentTransactions = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5

        const recentTransactions = await Transaction.find()
            .populate("createdBy", "name email")
            .sort({ date: -1 })
            .limit(limit)

        res.status(200).json({
            success: true,
            data: recentTransactions
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
    getSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
    getRecentTransactions
}