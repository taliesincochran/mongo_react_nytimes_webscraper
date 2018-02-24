import React from 'react';

const Img = props => {
	return (
		<div>
			<img src={props.image || "http://1000logos.net/wp-content/uploads/2017/04/Symbol-New-York-Times.png"} alt={props.alt} className={props.className} style={props.style} />
		</div>
	)
}
export default Img;
