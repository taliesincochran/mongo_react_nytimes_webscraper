import React, { Component } from 'react';
import NoteResult from './NoteResult';
import axios from 'axios';
import Result from './Result';
class NoteResults extends Component {
    state = {
        title: '',
        text: '',
        articleID: '',
        notes: [],
        url: '',
        date: '',
        headline: '',
        summary: '',
        image: '',
        byline: ''
    }
    getNotes = () => {
        axios.get("/note/" + this.props.location.pathname.slice(6)).then(res => {
            console.log('axios get');
            this.setState({
                notes : res.data.note,
                headline: res.data.article.headline,
                date: res.data.article.date,
                summary: res.data.article.summary,
                url: res.data.article.url,
                articleID: this.props.location.pathname.slice(6),
                _id: res.data.article._id,
                byline: res.data.article.byline,
                image: res.data.article.image,
                title: '',
                text: ''
            });
            console.log('axios get state', this.state);
            return res;
        }).then((res) => {console.log(res)})
    }
    handleInputChange = event => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
        console.log(this.state)
    }
    componentDidMount = () => {
        console.log('path', this.props.location.pathname.slice(6))
        this.getNotes();

    }
    handleFormSubmit = event => {
        event.preventDefault();
        console.log('handleSubmit', this.state)
        // var path = "/note/" + this.props.location.pathname.slice(6) + '/save';
        axios.post(this.state.articleID + '/save', this.state).then((response) => {
            // console.log('post', response);
            console.log('state', this.state)
        }).then(res=>
            this.getNotes()
        );
    };
    componentDidUpdate = () => {
        this.render();
    }
    render() {
        console.log(this.state.notes)
        return(
            <div>
                <Result key={this.state.articleID} 
                    articleID={this.state.articleID}
                    image={this.state.image} 
                    url={this.state.url} 
                    title={this.state.headline} 
                    date={this.state.date} 
                    summary={this.state.summary}
                    saved={this.state.saved} 
                    buttonText={'Notes'}
                    buttonClass={'hidden'}
                    role={'note'} 
                    href={'/note/'+ this.state._id}
                    section={this.state.section}
                    byline={this.state.byline}
                    deleteHref={'/saved'}
                />
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
                    <button className='btn btn-primary' style={{width: '50%'}}onClick={this.handleFormSubmit}>Submit New Note</button>
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