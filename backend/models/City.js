const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  tags: [String],
  season: String,
  atmosphere: String,
  days: String,
  routes: [String],
  foods: [{
    name: String,
    desc: String,
    price: String,
    mustTry: Boolean
  }],
  accommodations: [{
    area: String,
    pros: String,
    cons: String
  }],
  transport: [{
    type: String,
    info: String
  }],
  budget: {
    low: String,
    medium: String,
    high: String
  },
  tips: {
    prepare: [String],
    avoid: [String]
  },
  links: {
    official: String,
    attractions: [{
      name: String,
      url: String,
      mustVisit: Boolean
    }],
    booking: [{
      name: String,
      url: String
    }],
    food: [{
      name: String,
      url: String
    }]
  },
  poster: {
    title: String,
    subtitle: String,
    elements: [String],
    layout: String,
    colors: [String]
  },
  itineraries: {
    '1天': {
      routes: [{
        time: String,
        morning: String,
        afternoon: String,
        afternoon2: String,
        evening: String,
        morning2: String
      }],
      tips: [String],
      budget: String
    },
    '2天1晚': {
      routes: [{
        time: String,
        morning: String,
        afternoon: String,
        afternoon2: String,
        evening: String,
        morning2: String
      }],
      tips: [String],
      budget: String
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('City', CitySchema);