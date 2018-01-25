const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NoteSchema = new Schema({
	title: String,
	text: String,
	articleID: String,
	deleted: {
		type: Boolean,
		default: false
	}
});
var Note = mongoose.model("Note", NoteSchema);
module.exports = Note;