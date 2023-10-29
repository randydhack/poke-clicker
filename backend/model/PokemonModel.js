const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pokemonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    health: {
        type: Number,
        required: true
    },
    attack: {
        type: Number,
        required: true
    },
    speed: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
})

const Pokemon = mongoose.model("Pokemon", pokemonSchema);

module.exports = Pokemon
