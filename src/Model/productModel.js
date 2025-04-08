const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, required: true, enum: ['movie', 'series', 'anime'], lowercase: true },
    genre: { type: [String], required: true },
    releaseYear: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 10, default: 0 }, 
    thumbnail: { type: String, required: true },
    images: { type: [String] },
    downloadLinks: {
        type: [{
            quality: { type: String, enum: ['480p', '720p', '1080p', '4K'], required: true },
            size: String,
            url: { type: String, required: true }
        }],
        required: true
    },
    episodes: [{
        episodeNumber: Number,
        title: String,
        downloadLinks: [{ quality: String, size: String, url: String }]
    }],
    seasons: [{
        seasonNumber: Number,
        episodes: [{
            episodeNumber: Number,
            title: String,
            downloadLinks: [{ quality: String, size: String, url: String }]
        }]
    }],
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
