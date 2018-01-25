import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import Image from './Image';
import Saved from './Saved';
import Search from './Search';
import NoteResults from './NoteResults';

const Main =()=>{
	return(
		<div style={{backgroundColor: 'black'}}>
			<Header />
	    	<Navbar />
	    	<BrowserRouter>
				<Switch>
					<Route component={Image} exact path='/' />
					<Route component={Saved} path='/saved/' />
					<Route component={Search} path='/search/' />
					<Route component={NoteResults} path='/note/' />						
				</Switch>
			</BrowserRouter>
			<Footer />
		</div>		
	)
}
export default Main;