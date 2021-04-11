const express = require('express')
const Income = require('../models/income')
const Expense = require('../models/expense')
const auth = require('../middleware/auth')

const router = express.Router()

// get total of a day
// GET total?date=12-April-2021
// GET total?month=April-2021
// GET total?year=2021 (not working for year route)
router.get('/total', auth, async(req, res) => {
    if (req.query.date) {
        const date = req.query.date

        var allIncomes = []
        var allExpenses = []
        var totalIncomeAmount = 0
        var totalExpenseAmount = 0

        try {
            const incomes = await Income.find({ date: date, owner: req.user._id })
            const expenses = await Expense.find({ date: date, owner: req.user._id })

            for (var i = 0; i < incomes.length; i++) {
                totalIncomeAmount = totalIncomeAmount + incomes[i].incomeAmount

                allIncomes.push({
                    incomeName: incomes[i].incomeName,
                    incomeAmount: incomes[i].incomeAmount
                })
            }
            for (var i = 0; i < expenses.length; i++) {
                totalExpenseAmount = totalExpenseAmount + expenses[i].expenseAmount

                allExpenses.push({
                    expenseName: expenses[i].expenseName,
                    expenseAmount: expenses[i].expenseAmount
                })
            }

            const total = totalIncomeAmount - totalExpenseAmount
            res.send({
                allIncomes,
                Total_Income: totalIncomeAmount,
                allExpenses,
                Total_Expense: totalExpenseAmount,
                Total: total
            })
        } catch (error) {
            res.send({
                error
            })
        }
    } else if (req.query.month) {
        var allIncomes = []
        var allExpenses = []
        var totalIncomeAmount = 0
        var totalExpenseAmount = 0
        var total = 0

        const month_and_year = req.query.month.split('-')
        const month = month_and_year[0]
        const year = month_and_year[1]

        if (month === 'April' || month === 'June' || month === 'September' || month === 'November') {
            const duration = 30

            for (var day = 1; day < duration + 1; day++) {
                if (day.length === 1) {
                    day = '0' + day
                }
                const date = day + '-' + month + '-' + year

                try {
                    const incomes = await Income.find({ date: date, owner: req.user._id })
                    const expenses = await Expense.find({ date: date, owner: req.user._id })

                    for (var i = 0; i < incomes.length; i++) {
                        totalIncomeAmount = totalIncomeAmount + incomes[i].incomeAmount

                        allIncomes.push({
                            date: incomes[i].date,
                            incomeName: incomes[i].incomeName,
                            incomeAmount: incomes[i].incomeAmount
                        })
                    }
                    for (var i = 0; i < expenses.length; i++) {
                        totalExpenseAmount = totalExpenseAmount + expenses[i].expenseAmount

                        allExpenses.push({
                            date: expenses[i].date,
                            expenseName: expenses[i].expenseName,
                            expenseAmount: expenses[i].expenseAmount
                        })
                    }

                    total = totalIncomeAmount - totalExpenseAmount
                } catch (error) {
                    res.send({
                        error
                    })
                    break
                }
            }
            res.send({
                allIncomes,
                Total_Income: totalIncomeAmount,
                allExpenses,
                Total_Expense: totalExpenseAmount,
                Total: total
            })
        } else if (month === 'January' || month === 'March' || month === 'May' || month === 'July' || month === 'August' || month === 'October' || month === 'December') {
            const duration = 31

            for (var day = 1; day < duration + 1; day++) {
                if (day.length === 1) {
                    day = '0' + day
                }
                const date = day + '-' + month + '-' + year

                try {
                    const incomes = await Income.find({ date: date, owner: req.user._id })
                    const expenses = await Expense.find({ date: date, owner: req.user._id })

                    for (var i = 0; i < incomes.length; i++) {
                        totalIncomeAmount = totalIncomeAmount + incomes[i].incomeAmount

                        allIncomes.push({
                            date: incomes[i].date,
                            incomeName: incomes[i].incomeName,
                            incomeAmount: incomes[i].incomeAmount
                        })
                    }
                    for (var i = 0; i < expenses.length; i++) {
                        totalExpenseAmount = totalExpenseAmount + expenses[i].expenseAmount

                        allExpenses.push({
                            date: expenses[i].date,
                            expenseName: expenses[i].expenseName,
                            expenseAmount: expenses[i].expenseAmount
                        })
                    }

                    total = totalIncomeAmount - totalExpenseAmount
                } catch (error) {
                    res.send({
                        error
                    })
                    break
                }
            }
            res.send({
                allIncomes,
                Total_Income: totalIncomeAmount,
                allExpenses,
                Total_Expense: totalExpenseAmount,
                Total: total
            })
        } else if (month === 'February') {
            // it is not for leap year
            const duration = 28

            for (var day = 1; day < duration + 1; day++) {
                if (day.length === 1) {
                    day = '0' + day
                }
                const date = day + '-' + month + '-' + year

                try {
                    const incomes = await Income.find({ date: date, owner: req.user._id })
                    const expenses = await Expense.find({ date: date, owner: req.user._id })

                    for (var i = 0; i < incomes.length; i++) {
                        totalIncomeAmount = totalIncomeAmount + incomes[i].incomeAmount

                        allIncomes.push({
                            date: incomes[i].date,
                            incomeName: incomes[i].incomeName,
                            incomeAmount: incomes[i].incomeAmount
                        })
                    }
                    for (var i = 0; i < expenses.length; i++) {
                        totalExpenseAmount = totalExpenseAmount + expenses[i].expenseAmount

                        allExpenses.push({
                            date: expenses[i].date,
                            expenseName: expenses[i].expenseName,
                            expenseAmount: expenses[i].expenseAmount
                        })
                    }

                    total = totalIncomeAmount - totalExpenseAmount
                } catch (error) {
                    res.send({
                        error
                    })
                    break
                }
            }
            res.send({
                allIncomes,
                Total_Income: totalIncomeAmount,
                allExpenses,
                Total_Expense: totalExpenseAmount,
                Total: total
            })
        }
    } else {
        var allIncomes = []
        var allExpenses = []
        var totalIncomeAmount = 0
        var totalExpenseAmount = 0

        try {
            const incomes = await Income.find({ owner: req.user._id })
            const expenses = await Expense.find({ owner: req.user._id })
                // console.log(incomes.length, expenses.length)

            for (var i = 0; i < incomes.length; i++) {
                totalIncomeAmount = totalIncomeAmount + incomes[i].incomeAmount

                allIncomes.push({
                    date: incomes[i].date,
                    incomeName: incomes[i].incomeName,
                    incomeAmount: incomes[i].incomeAmount
                })
            }
            for (var i = 0; i < expenses.length; i++) {
                totalExpenseAmount = totalExpenseAmount + expenses[i].expenseAmount

                allExpenses.push({
                    date: expenses[i].date,
                    expenseName: expenses[i].expenseName,
                    expenseAmount: expenses[i].expenseAmount
                })
            }

            const total = totalIncomeAmount - totalExpenseAmount
            res.send({
                allIncomes,
                Total_Income: totalIncomeAmount,
                allExpenses,
                Total_Expense: totalExpenseAmount,
                Total: total
            })
        } catch (error) {
            res.send({
                error
            })
        }
    }
    // } else if (req.query.year) {
    //     var allIncomes = []
    //     var allExpenses = []
    //     var totalIncomeAmount = 0
    //     var totalExpenseAmount = 0
    //     var total = 0

    //     const year = req.query.year

    //     const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    //     for (var i = 0; i < allMonths.length; i++) {
    //         console.log(allMonths[i])
    //         if (allMonths[i] === 'April' || allMonths[i] === 'June' || allMonths[i] === 'September' || allMonths[i] === 'November') {
    //             const duration = 30

    //             for (var day = 1; day < duration + 1; day++) {
    //                 if (day.length === 1) {
    //                     day = '0' + day
    //                 }
    //                 const date = day + '-' + allMonths[i] + '-' + year

    //                 try {
    //                     const incomes = await Income.find({ date: date, owner: req.user._id })
    //                     const expenses = await Expense.find({ date: date, owner: req.user._id })

    //                     for (var i = 0; i < incomes.length; i++) {
    //                         totalIncomeAmount = totalIncomeAmount + incomes[i].incomeAmount

    //                         allIncomes.push({
    //                             date: incomes[i].date,
    //                             incomeName: incomes[i].incomeName,
    //                             incomeAmount: incomes[i].incomeAmount
    //                         })
    //                     }
    //                     for (var i = 0; i < expenses.length; i++) {
    //                         totalExpenseAmount = totalExpenseAmount + expenses[i].expenseAmount

    //                         allExpenses.push({
    //                             date: expenses[i].date,
    //                             expenseName: expenses[i].expenseName,
    //                             expenseAmount: expenses[i].expenseAmount
    //                         })
    //                     }

    //                     total = totalIncomeAmount - totalExpenseAmount
    //                 } catch (error) {
    //                     res.send({
    //                         error
    //                     })
    //                     break
    //                 }
    //             }
    //         } else if (allMonths[i] === 'January' || allMonths[i] === 'March' || allMonths[i] === 'May' || allMonths[i] === 'July' || allMonths[i] === 'August' || allMonths[i] === 'October' || allMonths[i] === 'December') {
    //             const duration = 31

    //             for (var day = 1; day < duration + 1; day++) {
    //                 if (day.length === 1) {
    //                     day = '0' + day
    //                 }
    //                 const date = day + '-' + allMonths[i] + '-' + year

    //                 try {
    //                     const incomes = await Income.find({ date: date, owner: req.user._id })
    //                     const expenses = await Expense.find({ date: date, owner: req.user._id })

    //                     for (var i = 0; i < incomes.length; i++) {
    //                         totalIncomeAmount = totalIncomeAmount + incomes[i].incomeAmount

    //                         allIncomes.push({
    //                             date: incomes[i].date,
    //                             incomeName: incomes[i].incomeName,
    //                             incomeAmount: incomes[i].incomeAmount
    //                         })
    //                     }
    //                     for (var i = 0; i < expenses.length; i++) {
    //                         totalExpenseAmount = totalExpenseAmount + expenses[i].expenseAmount

    //                         allExpenses.push({
    //                             date: expenses[i].date,
    //                             expenseName: expenses[i].expenseName,
    //                             expenseAmount: expenses[i].expenseAmount
    //                         })
    //                     }

    //                     total = totalIncomeAmount - totalExpenseAmount
    //                 } catch (error) {
    //                     res.send({
    //                         error
    //                     })
    //                     break
    //                 }
    //             }
    //         } else if (allMonths[i] === 'February') {
    //             // it is not for leap year
    //             const duration = 28

    //             for (var day = 1; day < duration + 1; day++) {
    //                 if (day.length === 1) {
    //                     day = '0' + day
    //                 }
    //                 const date = day + '-' + allMonths[i] + '-' + year

    //                 try {
    //                     const incomes = await Income.find({ date: date, owner: req.user._id })
    //                     const expenses = await Expense.find({ date: date, owner: req.user._id })

    //                     for (var i = 0; i < incomes.length; i++) {
    //                         totalIncomeAmount = totalIncomeAmount + incomes[i].incomeAmount

    //                         allIncomes.push({
    //                             date: incomes[i].date,
    //                             incomeName: incomes[i].incomeName,
    //                             incomeAmount: incomes[i].incomeAmount
    //                         })
    //                     }
    //                     for (var i = 0; i < expenses.length; i++) {
    //                         totalExpenseAmount = totalExpenseAmount + expenses[i].expenseAmount

    //                         allExpenses.push({
    //                             date: expenses[i].date,
    //                             expenseName: expenses[i].expenseName,
    //                             expenseAmount: expenses[i].expenseAmount
    //                         })
    //                     }

    //                     total = totalIncomeAmount - totalExpenseAmount
    //                 } catch (error) {
    //                     res.send({
    //                         error
    //                     })
    //                     break
    //                 }
    //             }
    //         }
    //     }
    //     res.send({
    //         allIncomes,
    //         Total_Income: totalIncomeAmount,
    //         allExpenses,
    //         Total_Expense: totalExpenseAmount,
    //         Total: total
    //     })
    // }
})

module.exports = router