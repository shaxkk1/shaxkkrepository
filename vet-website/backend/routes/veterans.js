const router = require('express').Router();
const Veteran = require('../models/veteran.model');

// Get all veterans
router.get('/', async (req, res) => {
  try {
    const veterans = await Veteran.find();
    res.json(veterans);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Add new veteran
router.post('/', async (req, res) => {
  try {
    // Log the incoming request body
    console.log('Received veteran data:', req.body);

    // Create new veteran instance
    const newVeteran = new Veteran({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      serviceNumber: req.body.serviceNumber,
      branch: req.body.branch,
      rank: req.body.rank,
      yearsOfService: req.body.yearsOfService,
      specializations: req.body.specializations,
      contactInfo: {
        email: req.body.contactInfo?.email,
        phone: req.body.contactInfo?.phone
      }
    });

    // Validate the document before saving
    const validationError = newVeteran.validateSync();
    if (validationError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: validationError.errors
      });
    }

    // Save the veteran
    const savedVeteran = await newVeteran.save();
    res.status(201).json({
      message: 'Veteran added successfully',
      veteran: savedVeteran
    });

  } catch (err) {
    console.error('Error saving veteran:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Service number already exists'
      });
    }
    res.status(500).json({
      message: 'Error adding veteran',
      error: err.message
    });
  }
});

// Get veteran by ID
router.get('/:id', async (req, res) => {
  try {
    const veteran = await Veteran.findById(req.params.id);
    res.json(veteran);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Update veteran
router.put('/:id', async (req, res) => {
  try {
    const updatedVeteran = await Veteran.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedVeteran);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// Delete veteran
router.delete('/:id', async (req, res) => {
  try {
    await Veteran.findByIdAndDelete(req.params.id);
    res.json('Veteran deleted successfully');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;