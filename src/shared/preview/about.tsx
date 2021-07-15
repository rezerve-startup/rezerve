import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import logo from './unknown.png';
import {Helmet} from 'react-helmet';
import React from 'react';
import Typography from '@material-ui/core/Typography';
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

function BusinessPreview(){
	const classes = useStyles();
	const [dense, setDense] = React.useState(false);
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
								<div className={classes.font} key={i}>
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
			<Button className={classes.previewButton}type="submit" variant="contained"  href = {"/landing-page"}>
				Get Started Now
				</Button>
			
				</div>
		</div>
/*	<meta   property="og:title"  content="Example Title" />
				<meta   name="image"   property="og:image"   content="%PUBLIC_URL%/fish.png" />
				<meta   name="author"   content="Example Author" />
				<meta   property="og:description"   content="Example Description"/>
				<meta   property="og:url"   content="https://rezerve-startup.herokuapp.com/preview" />*/
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

function Preview() {
	
	return(
		<>
		<Helmet>
			<title>ReZerve | Enroll Your Business</title>
			<meta property="og:title" content="ReZerve | Enroll Your Business"/>
			<meta property="og:description" content="ReZerve | The First Free-To-Use Booking and business Management Software for Stylists and Beauty Profressionals"/>
			<meta property="og:image" content="https://rezerve-startup.herokuapp.com/rezerve_logo.jpg"/>
		</Helmet>

		<BusinessPreview/>
		</>
	)
 

}
export default Preview;

