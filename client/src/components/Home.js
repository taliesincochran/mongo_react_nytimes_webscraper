import React, {Component} from "react";
import Img from './Img'
const Home = props => {
	return(
		<div>
			<Img 
				alt='New York Times 1914' 
				className="background-image" 
				src='https://upload.wikimedia.org/wikipedia/commons/1/17/Headline_of_the_New_York_Times_June-29-1914.jpg' 
				style={{width:'100%'}}
			/>
		</div> 
	)
}
export default Home;