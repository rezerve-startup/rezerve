import React from 'react';
// import * as FaIcons from 'react-icons/fa'
import {
  Avatar,
  TextField,
  Dialog,
  DialogContent,
  Divider,
  Button,
  DialogTitle,
  DialogActions,
  Typography,
  useMediaQuery,
} from '@material-ui/core/';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import classes from '*.module.css';
//import './customer-checkout.css';
import {Close} from '@material-ui/icons';


function CustomerProfilePage() {
  const theme = useTheme();
  const classes = useStyles();
  const fullscreen = useMediaQuery(theme.breakpoints.down('lg'));
  const [open, setOpen] = React.useState(true);
  
  const openOnClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  return (
    <div>
      
      <Dialog
        open={open}
        fullScreen={fullscreen}
        className={classes.dialog}
      >
        

        <DialogContent className={classes.profilePage}>
        <DialogActions className={classes.close}>
            <Close onClick={handleClose} fontSize="large"/>
        </DialogActions>

        <Avatar src="../../assets/avatar.jpg" className={classes.image} />
            <Typography variant="h5">
                John Barber   
            </Typography> 

            <Typography variant="caption" className={classes.edit}>
                EDIT
            </Typography>
        
            <Divider className={classes.divider}/>

            <Typography> 
                <span className={classes.label}>Account Details</span>

                <TextField className={classes.label}label="Email Address" 
                InputLabelProps={{className : classes.dataInput}} 
                InputProps={{ className: classes.dataInput}}/>

                <TextField className={classes.label}label="Phone Number" 
                InputLabelProps={{className : classes.dataInput}} 
                InputProps={{ className: classes.dataInput}}/>

                <TextField className={classes.label}label="Address" 
                InputLabelProps={{className : classes.dataInput}} 
                InputProps={{ className: classes.dataInput}}/>

                <Typography variant="caption" className={classes.edit}>EDIT</Typography>
            </Typography>


        </DialogContent>

       
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  close: {
    // Theme Color, or use css color in quote
    fontSize: '30pt'
  },

  image: {
    // Theme Color, or use css color in quote,
    height: '100px',
    width: '100px',
    margin: 'auto',
  },

  dialog: {
    height: '100vh',
    width: '100vw',
    color: 'black',
    textAlign: 'center',
    alignItems: 'center',
    position: 'fixed',
  },

  profilePage: {
    background: '#353535',
    color: 'white'
  },

  edit: {
    color: '#ff4a4b'
  },

  divider: {
    background: '#353535',
    height: '50px'
  },

  label: {
    textAlign: 'left',
    display: 'flex',
},
  dataInput: {
    textAlign: 'left',
    display: 'flex',
    color: 'white'
  },

  itemCard: {
    background: '#c8c8c8',
    color: 'white',
    margin: 'auto',
    width: '90%',
  },

  itemPlus: {
    display: 'flex',
    padding: '40px',
  },

  itemPlus1: {
    display: 'flex',
    paddingTop: '40px',
    paddingLeft: '40px',
    paddingBottom: '10px',
  },

  checkbox: {
    fontWeight: 'bold',
    position: 'relative',
  },

  phoneField: {
    display: 'flex',
    paddingTop: '10px',
    paddingLeft: '40px',
    paddingBottom: '20px',
    WebkitAppearance: 'none',
    margin: '0',
  },

  button: {
    background: '#ff4949',
    border: 'none',
    color: 'white',
    padding: '12px 34px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14pt',
  },

  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default CustomerProfilePage;
