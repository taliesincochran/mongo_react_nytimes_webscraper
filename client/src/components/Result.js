import React, { Component } from 'react';
import axios from 'axios';
import Img from './Img';

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
    render() {
        console.log("href", this.props.href);
        return(
            <div className={this.state.div} style={{backgroundColor: 'tan'}}>
                <div className="result-div panel panel-default" style={{overflow: 'auto', backgroundColor: 'tan'}}>
                    <div className="panel-body">
                        <Img 
                            src={this.props.image}
                            alt='NY Times Article' 
                            style={{width: '33%', backgroundColor: 'tan'}} 
                            className='col-xs-4' 
                        />
                        <div className='col-xs-8'>
                            <a href={this.props.url} style={{color:'black'}}><h3><strong>{this.props.title}</strong></h3></a>
                            <p className='section' style={{color:'black'}}>{this.props.section}</p>{' '}
                            <p className='byline' style={{color:'black'}}>{this.props.byline}</p>{' '}
                            <p className="date" style={{color: 'black'}}>{this.props.date}</p>{' '}
                            <h4 className='summary' style={{color: 'black'}}>{this.props.summary}</h4>
                        </div>
                    </div>
                    {' '}
                    <div href={this.props.href} className="panel-footer" style={{backgroundColor: 'tan'}}>
                        <a href={this.props.href} style={{color: 'white', width: '50%'}}> 
                            <button href={this.props.href} className={this.props.buttonClass} style={{width: '45%', marginRight: '2%'}} onClick={() => this.handleClick(this.props.role)} >{this.props.buttonText} 
                            </button>
                        </a>
                        {' '}
                        <a style={{width: '45%'}} href={this.props.deleteHref}>
                            <button className='btn btn-danger' style={{width: '45%', marginLeft: '2%'}} onClick={() => this.handleClick('delete')}> Delete </button>
                        </a>
                    </div>
                </div>
            </div>
        )
    }
};

export default Result;
