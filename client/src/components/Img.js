import React from 'react';

const Img = props => {	
	console.log(props.image);
	return (
		<div>
			<img src={props.image} alt={props.alt} className={props.className} style={props.style} />
		</div>
	)
}
export default Img;
