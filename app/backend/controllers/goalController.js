const asyncHandler = require('express-async-handler')

const GoalModel = require('../models/goalModel')

const getGoals = asyncHandler(async (req, res) => {
    const goals = await GoalModel.find()
    res.status(200).json(goals)
})

const addGoal = asyncHandler(async (req, res) => {
    if (! req.body.text) {
        res.status(400)
        throw new Error('Please write a goal')
    }

    const goal = await GoalModel.create({ text: req.body.text })
    res.json({ message: `Goal: ${req.body.text} added` })
})

const updateGoal = asyncHandler(async (req, res) => {
    const goal = await GoalModel.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const updatedGoal = await GoalModel.findByIdAndUpdate(goal, req.body)
    res.json({ goal: `${req.body.text} updated` })
})

const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await GoalModel.findById(req.params.id)
    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const deletedGoal = await GoalModel.findByIdAndDelete(req.params.id)
    res.status(400).json(deletedGoal)
})

module.exports = {
    getGoals,
    addGoal,
    updateGoal,
    deleteGoal
}
