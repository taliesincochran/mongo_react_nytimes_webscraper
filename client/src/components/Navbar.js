import React, {Component} from "react";
class Navbar extends Component {

	render() {
		return(
			<nav style={{backgroundColor: 'tan', borderColor: 'tan'}} className="navbar navbar-default">
			    <div className="container-fluid">
			        <div className="navbar-header">
			        <a style={{color: 'black'}} className="navbar-brand" href="/">Home</a>
			    	</div>
				    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				        <ul className="nav navbar-nav">{"       "}
				        	<li><a href="/search" style={{color: 'black'}}>Get New Articles</a></li>
				        	{"       "}
				        	<li><a href="/saved" style={{color: 'black'}}>Get Saved Articles</a></li>
				        </ul>
				    </div>
				</div>
			</nav>
		)	
	}
};
export default Navbar;