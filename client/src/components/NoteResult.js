import React, { Component } from 'react';
import axios from 'axios';

class NoteResult extends Component {
    state = {
        title: '',
        text: '',
        id: '',
        style: '',
    }
    componentDidMount = () => {
        this.setState({
            title: this.props.title,
            text: this.props.text,
            id: this.props.noteID
        });
    }
    handleClick = () => {
        axios.post(this.props.articleID + '/delete/' + this.props.noteID, 
            {
                articleID: this.props.articleID,
                noteID: this.props.noteID
            }
        ).then(res => {
            this.setState({ 
                style: 'hidden'
            });
            console.log('handle click res ', res);
            console.log(this.state)
        })

    }
    render () {
        return(
            <div className={this.state.style}>
                <div className="result-div panel panel-default" id={this.props.noteID}>
                    <div className="panel-body">
                        <h5 style={{color: 'black'}}>{this.props.title}</h5>
                        <p className="date" style={{color: 'black'}}>{this.props.text}</p>
                    </div>
                    <br />
                    <div className="panel-footer">
                        <button className='btn btn-danger' style={{color: 'black'}} onClick={this.handleClick}>Delete Note <span className='glyphicon glyphicon-remove'/> </button>
                    </div>
                </div>
            </div>
        )
    }
};

export default NoteResult;