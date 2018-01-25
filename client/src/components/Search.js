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
    componentWillMount() {
        console.log('search called');
        var that;
        that = this
        axios.get('/search').then(function(res) {
            console.log(that);
            that.setState({article : res.data});
        });
    }
    render() {
        return(
            <div className="result-holder">
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
                        />
                    );
                })}
            </div>
        )
    }
};

export default Search;