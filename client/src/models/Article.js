var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
	'headline': {
		type: String,
		unique: true,
		required: true
	},
	'url': {
		type: String,
		required: true
	},
	'date': {
		type: String,
		required: true
	},
	'notes': {
		type: Array,
		ref: "Note",
		default: []
	},
	'summary': {
		type: String,
		required: true
	},
	'saved': {
		type: Boolean,
		default: false
	},
	'deleted': {
		type: Boolean,
		default: false
	},
	'section': {
		type: String
	},
	'image': {
		type: String,
		default: "http://1000logos.net/wp-content/uploads/2017/04/Symbol-New-York-Times.png"
	},
	'byline': {
		type: String
	}
});
var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;