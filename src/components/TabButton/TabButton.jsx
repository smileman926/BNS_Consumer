import React from 'react';
import './TabButton.scss';


function TabButton(props) {
	return (
		<div className={`tab-button px-2 pt-2 pb-2 text-center ${props.selected ? 'selected' : ''}`} >
			<img src={props.img} className="mx-2" alt="img"></img>
			{props.title}
		</div>
	);
}

export default TabButton;