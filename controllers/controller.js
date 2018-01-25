var db = require ('../client/src/models/');
var express = require('express');
var router = express.Router();
var axios = require('axios');
var cheerio = require('cheerio');
router.get("/", function(req,res) {
	res.sendFile(process.cwd() + "/public/index.html");
});
function getArticles(urlToScrape, savedArticles, section) {
    axios.get(urlToScrape)
		.then(response => {
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
	}).then(response => {
    	console.log("axios called");
        let $ = cheerio.load(response.response.data);
        let count = 0;
        $("#latest-panel article.story.theme-summary").each((i, element) => {
            var newArticle = new db.Article({
                url: $(element).find('.story-body>.story-link').attr('href'),
	            headline: $(element).find('h2.headline').text().trim(),
	            summary : $(element).find('p.summary').text().trim(),
	            date: $(element).find('time.dateline').attr('content'),
	            section: section,
	            byline: $(element).find('p.summary').next().text().trim(),
	            image: $(element).find('.story-body>.story-link>.story-meta').next().children().attr('src')
            });
            if (newArticle.url) {
            	console.log(newArticle.url)
            	console.log('image', newArticle.image);
            	console.log('byline', newArticle.byline);
     			if (!response.savedHeadlines.includes(newArticle.headline)) {
		            db.Article.create(newArticle).then(function(dbArticle) {
		                console.log('article: ', dbArticle.headline);
		            }).catch(function(err) {
		                console.log(err);
		            });
            	}
     		}
        });
    }).catch(err=>console.log("get articles error"))
}
//Scraping route
router.get("/search", function(req,res) {
	console.log('search called');
	let results = [];
    db.Article
    	.find({})
    	.then(savedArticles => {
		    getArticles("https://www.nytimes.com/section/world?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=World&WT.nav=page", savedArticles, "World");
	  //   	getArticles('https://www.nytimes.com/section/politics?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Politics&pgtype=sectionfront', savedArticles, "Politics");
	  //       getArticles('https://www.nytimes.com/section/technology?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Tech&pgtype=sectionfront', savedArticles, "Technology");
			// getArticles('https://www.nytimes.com/section/business?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Business&pgtype=sectionfront', savedArticles, "Buisness");
			// getArticles('https://www.nytimes.com/section/science?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Science&pgtype=sectionfront', savedArticles, "Science");
			// getArticles('https://www.nytimes.com/section/health?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Health&pgtype=sectionfront', savedArticles, "Health");
			// getArticles('https://www.nytimes.com/section/sports?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Sports&pgtype=sectionfront', savedArticles, "Sports");
	  //   	getArticles('https://www.nytimes.com/section/us?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=U.S.&WT.nav=page', savedArticles, "U.S.");
    	}).then(result => {
        	db.Article.find({deleted: false, saved: false})
        		.then(response=> {
        			// console.log('new article found: ', result);
        			res.send(response);
        		})
        }).catch(error => {
            console.log("db error");
		});

})

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
			res.send(response);
		})
		.catch(err => res.json(err))
});
//route to see all saved articles that have not been deleted
router.get("/saved", function(req,res) {
	db.Article.find({saved: true, deleted: false})
		.then(response => {
			res.send(response);
		})
		.catch(err => res.json(err))
});
//===========================================================
//Routes for article notes
//===========================================================
//Route to article notes
router.get('/note/:id', function(req,res) {
	console.log('note called');
	var id = req.params.id;
	var resObject = {}
	db.Article.findOne({_id: id})
		.then(results => {
			resObject.article = results;
			db.Note.find({articleID: id, deleted: false})
				.then(noteResults => {
					resObject.note = noteResults;
					res.send(resObject);
				})
		}).catch(err => res.json(err));
})
//add to saved notes
router.post("/note/:id/save", function(req,res) {
	var body = req.body;
	console.log('note body', body.title);
	var newNote = {
		title: body.title,
		text: body.text,
		articleID: body.articleID		
	};
	console.log(newNote);
	db.Note.create(newNote)
	.then(result => {
		db.Article.update({_id: newNote.articleID}, {$push: {notes: {_id: result._id}}}, {new:true})
		.then(data => {
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
