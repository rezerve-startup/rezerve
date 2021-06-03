import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import Image from "material-ui-image";
import logo from './unknown.png';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: theme.palette.secondary.dark,
			minHeight: '100vh',
			flex: '1'
		},
		previewButton: {
			display: 'flex',
			borderRadius: '30px',
			marginRight: '5px',
			backgroundColor: theme.palette.secondary.dark,
			color: theme.palette.secondary.light,
			border: '1px solid white',
			justifyContent: 'center',
      alignItems: 'center',
			'&:hover': {
				backgroundColor: theme.palette.secondary.dark,
				color: theme.palette.secondary.light,
			},
			
		},
		title: {
      display: 'flex',
      color: theme.palette.background.paper,
      textDecoration: 'none',
      justifyContent: 'center',
      alignItems: 'center'
    },
		font:{
			display: 'flex',
      color: theme.palette.background.paper,
      textDecoration: 'none',
      justifyContent: 'center',
      alignItems: 'center',
			fontSize: 12,
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
		
	return (
		<div className={classes.root}>
			<div className= {classes.title}>
			<Typography 
			className={classes.title}
			variant="h2"
			noWrap={true}
			color="primary"
			gutterBottom>
				 <img src={logo}/>
			</Typography>
			
				</div>
		
				<div className= {classes.font}>   <h3>THE FIRST FREE TO USE BOOKING AND
			<br/> BUSINESS MANAGEMENT SOFTWARE FOR STYLIST<br/>
			AND BEAUTY PROFFESSIONALS </h3></div>	
			<div className= {classes.font}>
			<ul>
					<li>MANAGE YOUR SCHEDULE</li>
					<li>REACH NEW CUSTOMERS</li> 
					<li>CONNECT WITH CLIENTS </li> 
					<li>TRACK YOUR PERFORMANCE</li> 
						</ul> 
			 
			</div>
			<div className={classes.font}>
           MAKE BOOKING EASY. CREATE YOUR PROFILE AND 
				CHANGE YOUR BUSINESS TODAY!
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
          
		
			<Button className={classes.title} type="submit" color="primary" variant="contained"  href = {"/"}>
				Get Started Now
				</Button>
		</div>
		

 );	
 

}
export default Preview;