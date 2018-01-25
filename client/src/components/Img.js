import React from 'react';

const Img = props => {
	return (
		<div>
			<img src={props.src} alt={props.alt} className={props.className} style={props.style} />
		</div>
	)
}
export default Img;