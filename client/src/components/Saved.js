import React, { Component } from 'react';
import Result from './Result';
import axios from 'axios';


class Saved extends Component{
    constructor(props) {
        super(props);
        this.state={
            article: [],
            message: ""
        };
    }
    componentDidMount = () => {
        console.log('save called');
        axios.get('/saved').then(res => {
            if(res.data.length>0) {
                this.setState({
                    article : res.data,
                    message : "Saved Articles"
                });
            } else {
                this.setState({
                    article: res.data,
                    message: "No Saved Articles"
                })

            }
                console.log('component did mount', res.data)
        });
    }
    render() {
        return(
                <div className="result-holder" style={{backgroundColor: 'black'}}>
                    <h3>{this.state.message}</h3>
                    {this.state.article.map(function(article) {
                        return (
                            <Result key={article._id} 
                                articleID={article._id}
                                image={article.image} 
                                url={article.url} 
                                title={article.headline} 
                                date={article.date} 
                                summary={article.summary}
                                saved={article.saved} 
                                buttonText={'Notes'}
                                buttonClass={'btn btn-primary'}
                                role={'note'} 
                                href={'/note/'+ article._id}
                                section={article.section}
                                byline={article.byline}
                            />
                        );
                    })}
                </div>
        )
    }
};

export default Saved;