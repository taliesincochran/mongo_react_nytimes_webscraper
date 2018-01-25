import React, { Component } from 'react';
import Result from './Result';
var axios = require('axios');
// var articles = []
// axios.get('/search').then(function(res) {
//     articles = res.data;
// });
class Search extends Component {
    constructor(props) {
        super(props);
        this.state={
            article: []
        };
        // this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount () {
        console.log('search called');
        axios.get('/search').then(res => {
            this.setState({article : res.data});
        });
    }
    render() {
        return(
            <div className="result-holder" style={{backgroundColor: 'black'}}>
                <h3>New Articles</h3>
                {this.state.article.map(function(article, i) {
                    console.log("article", article)
                    return (
                        <Result key={article._id} 
                            articleID={article._id}
                            image={article.image} 
                            url={article.url} 
                            title={article.headline}  
                            date={article.date} 
                            summary={article.summary} 
                            saved={article.saved}  
                            buttonText={"Save"}
                            buttonClass={'btn btn-primary'}
                            role={'save'}
                            section={article.section}
                            byline={article.byline}
                        />
                    );
                })}
            </div>
        )
    }
};

export default Search;