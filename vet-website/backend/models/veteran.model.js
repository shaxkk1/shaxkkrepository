const mongoose = require('mongoose');

const veteranSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'] 
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'] 
  },
  serviceNumber: { 
    type: String, 
    required: [true, 'Service number is required'],
    unique: true 
  },
  branch: { 
    type: String, 
    required: [true, 'Branch is required'],
    enum: ['Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard']
  },
  rank: String,
  yearsOfService: Number,
  specializations: String,
  contactInfo: {
    email: String,
    phone: String
  }
}, {
  timestamps: true
});

const Veteran = mongoose.model('Veteran', veteranSchema);
module.exports = Veteran;