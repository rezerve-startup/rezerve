import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import logo from './unknown.png';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: theme.palette.secondary.dark,
			minHeight: '100vh',
			flex: '1'
		},
		previewButton: {
			display: 'flex',
			backgroundColor: '#f00604',
			padding: '15px 32px',
			color: theme.palette.secondary.light,
			justifyContent: 'center',
      		alignItems: 'center',
			alignText: 'center',	
		},
		buttonDiv: {
			display: 'flex',
			justifyContent: 'center',
      		alignItems: 'center',
			alignText: 'center',
			padding: '50px'
		},
	title: {
      display: 'flex',
      color: theme.palette.background.paper,
      textDecoration: 'none',
      justifyContent: 'center',
      alignItems: 'center',
    },
	font:{
	  display: 'flex',
      color: 'white',
      textDecoration: 'none',
      justifyContent: 'center',
      alignItems: 'center',
	  alignText: 'center',
	  fontSize: 24,
	  padding: '10px',
	  fontFamily: [
		  'Teko',
		  'sans-serif'
	  ].join(',')
		},
	lightFont:{
		color: '#e2e2e2',
		fontFamily: [
			'Raleway',
			'sans-serif'
		].join(','),
		fontSize: 14,
	},
	logo:{
		height: '200px',
		width: '200px'
	},
	list:{
		alignText: 'center',
		color: 'white',
		alignContent: 'center',
		padding: '25px'
	}
	}),
);

function generate(element) {
  return [0].map((value) =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

function Preview() {
	const classes = useStyles();
	const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const list = [
	  {item: 'MANAGE YOUR SCHEDULE', buffer: '.....'},
	  {item: 'REACH NEW CUSTOMERS' ,buffer: '......'},
	  {item: 'CONNECT WITH CLIENTS', buffer: '.......'},
	  {item: 'TRACK YOUR PERFORMANCE', buffer: ''}
  ];
		
	return (
		<div className={classes.root}>
			<div className= {classes.title}>
			<Typography 
			className={classes.title}
			variant="h2"
			noWrap={true}
			color="primary"
			gutterBottom>
				 <img className={classes.logo}src={logo}/>
			</Typography>
			
				</div>
				<div className= {classes.title}>
					<Typography variant="body1" align='center'>
						<div className={classes.lightFont}>
					THE FIRST FREE TO USE BOOKING AND <br/>BUSINESS MANAGEMENT SOFTWARE FOR <br/>STYLISTS AND BEAUTY PROFESSIONALS	
						</div>
					</Typography>	
				</div>	
			<div className={classes.list}>
				
					
				{list.map((li, i) =>{
						return(
							<Typography align= 'center' variant="body2">
								<div className={classes.font}>
									<FiberManualRecordRoundedIcon style={{color: '#f00604', fontSize: 32}}/>
									<span>{li.item}</span>
									<span style={{color: '#232323'}}>{li.buffer}</span>
								</div>
							</Typography>
						)
					})
				}	 
			</div>

			<div className={classes.font}>
				<Typography align= 'center' variant="body2">
				<div className={classes.font}>
						MAKE BOOKING EASY. CREATE YOUR PROFILE AND CHANGE YOUR BUSINESS TODAY!
					</div>
				</Typography>
			</div>
			
          
			<div className={classes.buttonDiv}>
			<Button className={classes.previewButton}type="submit" variant="contained"  href = {"/LandingPage"}>
				Get Started Now
				</Button>
				</div>
		</div>
		/*<List dense={dense}>
              
                <ListItem>
                  <ListItemText
                    primary="MANAGE YOUR SCHEDULE "
                   
                  />
									<ListItemText
                    primary="REACH NEW CUSTOMERS"
                   
                  />
                </ListItem>
            </List>*/

 );	
 

}
export default Preview;