import React, {Component} from "react";

class Header extends Component {

	render () {
		return(
			<div  className="page-header" role="navigation">
				<div className="container">
					<div className="row">
						<h1 style={{fontSize: '6em', textAlign: 'center'}}>New York Times Webscraper</h1>
					</div>
				</div>
			</div>
		)
	}
};
export default Header;