import React, { Component } from 'react';
import NoteResult from './NoteResult';
import axios from 'axios';

class NoteResults extends Component {
    state = {
        title: '',
        text: '',
        articleID: '',
        notes: [],
        url: '',
        date: '',
        headline: '',
        summary: ''
    };
    handleInputChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
        console.log(this.state)
    };
    componentDidMount = () => {
        console.log('path', this.props.location.pathname.slice(6))
        axios.get("/note/" + this.props.location.pathname.slice(6)).then(res => {
            console.log('axios get');
            this.setState({
                notes : res.data.note,
                headline: res.data.article.headline,
                image: res.data.article.image,
                date: res.data.article.date,
                summary: res.data.article.summary,
                url: res.data.article.url,
                articleID: this.props.location.pathname.slice(6)
            });
            console.log('axios get state', this.state);
            return res;
        }).then((res) => {console.log(res)})

    }
    handleFormSubmit = event => {
        // event.preventDefault();
        console.log('handleSubmit', this.state)
        // var path = "/note/" + this.props.location.pathname.slice(6) + '/save';
        axios.post(this.state.articleID + '/save', this.state).then((response) => {
            // console.log('post', response);
            console.log('state', this.state)
            this.setState({
                title: '',
                text: '',
            });
        });
    };
    componentDidUpdate () {
        this.render();
    }
    render() {
        console.log(this.state.notes)
        return(
            <div>
                <div className="result-div panel panel-default row" style={{borderWidth : 1, borderStyle : 'solid', borderColor : 'tan', backgroundColor: 'tan'}}>
                    <div className="col-xs-1 img-div" style={{backgroundColor: 'tan'}}>
                        <img alt='NY Times Article' style={{width: 50, backgroundColor: 'tan'}} src={this.state.image} />
                    </div>
                    <div className="panel-body col-xs-11">
                        <a href={this.state.url} className="black-text"><h5>{this.state.headline}</h5></a>
                        <p className='summary' style={{color: 'black'}}>{this.state.summary}</p>
                        <p className="date" >Published {this.state.date}</p>
                    </div>

                </div>
                <hr />
                <h2><strong>New Note</strong></h2>
                <form className="form">
                    <h4>Note Title: </h4>
                    <input
                        value={this.state.title}
                        name="title"
                        onChange={this.handleInputChange}
                        type="text"
                        style={{color: 'black', width: '100%', textAlign: 'center'}}
                        placeholder="Note Title"
                    />
                    <h4>Note Text: </h4>
                    <textarea
                        rows='5' 
                        width='1000'
                        value={this.state.text}
                        name="text"
                        onChange={this.handleInputChange}
                        type="text"
                        style={{color: 'black', width: '100%', textAlign: 'center'}}
                        placeholder="Note Text"
                    />
                    <br />
                    <br />
                    {"   "}
                    <button className='btn btn-primary' onClick={this.handleFormSubmit}>Submit New Note</button>
                </form>
                <h1 style={{color: 'black'}}>Notes</h1>
                <div className="result-holder" style={{backgroundColor: 'black'}}>
                    {this.state.notes.map(function(note, i) {
                        return (
                            <NoteResult key={note._id} text={note.text} title={note.title} noteID={note._id} articleID={note.articleID} />
                        );
                    })}
                </div>
            </div>
        )
    }
};
export default NoteResults;