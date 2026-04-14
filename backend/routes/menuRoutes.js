const express = require('express')
const router = express.Router()
const MenuItem = require('../models/MenuItem')

// GET all menu items
router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.find()
        res.status(200).json(items)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// POST add a new menu item
router.post('/', async (req, res) => {
    try {
        const { name, price, category, image } = req.body
        const newItem = new MenuItem({ name, price, category, image })
        const savedItem = await newItem.save()
        res.status(201).json(savedItem)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// DELETE a menu item by id
router.delete('/:id', async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Item deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// PATCH toggle availability
router.patch('/:id/toggle', async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id)
        item.isAvailable = !item.isAvailable
        const updatedItem = await item.save()
        res.status(200).json(updatedItem)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
