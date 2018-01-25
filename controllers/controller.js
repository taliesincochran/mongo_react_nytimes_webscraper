var db = require ('../client/src/models/');
var express = require('express');
var router = express.Router();
var axios = require('axios');
var cheerio = require('cheerio');
router.get("/", function(req,res) {
	res.sendFile(process.cwd() + "/public/index.html");
});
function getArticles(urlToScrape, savedArticles) {
    axios.get(urlToScrape)
	.then(function(response) {
		let savedHeadlines = [];
		savedArticles.map(article => {
			if(article.deleted || article.saved) {
				savedHeadlines.push(article.headline)
			}
		})
		return {
			response: response,
			savedHeadlines: savedHeadlines,
		};
	})
    .then(function(response) {
    	console.log("axios called");
        let $ = cheerio.load(response.response.data);
        let count = 0;
        // let resultArray=[];
        $("#latest-panel article.story.theme-summary").each((i, element) => {
            var newArticle = new db.Article({
                url: $(element).find('.story-body>.story-link').attr('href'),
	            headline: $(element).find('h2.headline').text().trim(),
	            summary : $(element).find('p.summary').text().trim(),
	            date: $(element).find('time.dateline').attr('content'),
            });
            if (newArticle.url) {
            	console.log(newArticle)
     			if (!response.savedHeadlines.includes(newArticle.headline)) {
     				console.log('if', response.savedHeadlines)
            		// resultArray.push(newArticle);
		            db.Article.create(newArticle).then(function(dbArticle) {
		                console.log('article: ',dbArticle);
		            }).catch(function(err) {
		                res.json(err);
		            });
            	}
     		}
        });
		// res.send(resultArray);
    }).catch(err=>console.log(err))
}
//Scraping route
router.get("/search", function(req,res) {
	console.log('search called');
    db.Article
    .find({})
    .then(savedArticles => {
	    getArticles("https://www.nytimes.com/section/world?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=World&WT.nav=page", savedArticles);
    	getArticles('https://www.nytimes.com/section/us?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=U.S.&WT.nav=page', savedArticles);
    	getArticles('https://www.nytimes.com/section/politics?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Politics&pgtype=sectionfront', savedArticles);
        getArticles('https://www.nytimes.com/section/technology?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Tech&pgtype=sectionfront', savedArticles);
		getArticles('https://www.nytimes.com/section/business?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Business&pgtype=sectionfront', savedArticles);
		getArticles('https://www.nytimes.com/section/science?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Science&pgtype=sectionfront', savedArticles);
		getArticles('https://www.nytimes.com/section/health?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Health&pgtype=sectionfront', savedArticles);
		getArticles('https://www.nytimes.com/section/sports?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Sports&pgtype=sectionfront', savedArticles);
    }).then(result => {
        	db.Article.find({deleted: false, saved: false})
        		.then(response=> {
        			res.send(response);
        		})
        })
        .catch(function(error) {
            console.log(error);
        }).catch(err=> console.log(err));
});

//Route to save an article
router.post('/saved/:id', function(req,res){
	db.Article.update({_id: req.params.id}, {$set: {saved: true}})
		.then(response => {
			res.send(response)
		})
		.catch(err => res.json(err))

});
//Route to delete an article.  Actually changes the article's property to deleted so the webscraper does not rescrape
router.post('/delete/:id/', function(req,res) {
	db.Article.update({_id: req.params.id}, {$set: {deleted: true}})
		.then(response => {
			console.log('article delete res', res);
			res.send(response);
		})
		.catch(err => res.json(err))
});
//route to see all saved articles that have not been deleted
router.get("/saved", function(req,res) {
	db.Article.find({saved: true, deleted: false})
		.then(response => {
			console.log('article fetch res');
			res.send(response);
		})
		.catch(err => res.json(err))
});
//===========================================================
//Routes for article notes
//===========================================================
//Route to article notes
router.get('/note/:id', function(req,res) {
	var id = req.params.id;
	console.log('note called, article: ', id)
	console.log(req)
	var resObject = {}
	db.Article.findOne({_id: id})
		.then(results => {
			resObject.article = results;
			db.Note.find({articleID: id, deleted: false})
				.then(noteResults => {
					resObject.note = noteResults;
					console.log('resObj', resObject);
					res.send(resObject);
				})
		}).catch(err => res.json(err));
})
//add to saved notes
router.post("/note/:id/save", function(req,res) {
	var body = req.body;
	console.log('req note create', req.body)
	var newNote = {
		title: body.title,
		text: body.text,
		articleID: body.articleID		
	};
	console.log(newNote);
	db.Note.create(newNote)
	.then(result => {
		console.log('NoteCreateCalled', newNote.articleID)
		console.log('note created result', result._id)
		db.Article.update({_id: newNote.articleID}, {$push: {notes: {_id: result._id}}}, {new:true})
		.then(data => {
			console.log('note created, article update')
			res.json(result)
		})
		.catch(err => res.json(err))
	})
	.catch(err=> res.json(err));
});
//route to delete a note
router.post("/note/:id/delete/:noteId", function(req,res) {
	console.log('articleID', req.params.id);
	console.log('noteID', req.params.noteId);
	db.Note.remove({_id: req.params.noteId})
		.then(result=> {
			console.log('deleted note fired');
			db.Article.findOneAndUpdate({_id: req.params.id}, {$pull: {notes: {$in: req.params.noteID}}})
				.then(result2 => {
					res.json(result)
				})
				.catch(err=> res.json(err))
		
		}).catch(err=> res.json(err))
});
module.exports = router;
