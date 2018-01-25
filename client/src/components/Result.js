import React, { Component } from 'react';
import axios from 'axios';
import Img from './Img'

class Result extends Component{
    constructor(props) {
        super(props);
        console.log('constructor props ', props)
        this.state = {
            div: 'resultContainer'
        };
    }
    handleClick = (role) => {
        console.log("handle ", role, this.props.articleID);
        if(role === 'save') {
            this.setState({div:"hidden resultContainer"});
            axios.post("/saved/" + this.props.articleID, this.props).then(res => {
                console.log('res', res);
            })
        } else if(role === 'delete') {
            this.setState({div:"hidden resultContainer"});
            axios.post('/delete/' + this.props.articleID, this.props).then(res => {
                console.log('delete res', res);
            })
        } else if(role ==='note') {
            this.setState = {
                div: 'resultContainer'
            }
            axios.get('/note/' + this.props.articleID , this.props.articleID).then(function(res) {
                console.log(res.data)
            });
        }
    }
    // onChange = () => {
    //     this.render();
    // }
    render = () => {
        console.log('href', this.props.href);
        console.log('articleID', this.props.articleID);
        return(
        <div className={this.state.div} style={{backgroundColor: 'tan'}}>
            <div className="result-div panel panel-default">
                <div>
                    <Img alt='NY Times Article' style={{width: 50}} className='col-xs-1' src={this.props.image} />
                </div>
                <div className="panel-body col-xs-11">
                    <a href={this.props.url} style={{color:'black'}}><h5>{this.props.title}</h5></a>
                    <p className="date" style={{color: 'black'}}>Published {this.props.date}</p>
                    <p className='summary' style={{color: 'black'}}>{this.props.summary}</p>
                </div>
                <div className="panel-footer" style={{backgroundColor: 'tan'}}>
                    <button className={this.props.buttonClass} onClick={() => this.handleClick(this.props.role)} >
                        <a href={this.props.href} style={{color: 'white'}}> {this.props.buttonText} </a>
                    </button>
                    {"   "}
                    <button className='btn btn-danger' onClick={() => this.handleClick('delete')}>Delete</button>
                </div>
            </div>
        </div>

        )
    }
};

export default Result;