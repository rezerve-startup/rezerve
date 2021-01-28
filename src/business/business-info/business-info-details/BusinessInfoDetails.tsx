import React from 'react';
import {
  Card,
  Checkbox,
  createStyles,
  FormControlLabel,
  Grid,
  makeStyles,
  Theme,
} from '@material-ui/core';
import cat1 from '../../../assets/business-pictures/cat1.jpg';
import cat2 from '../../../assets/business-pictures/cat2.jpg';
import cat3 from '../../../assets/business-pictures/cat3.jpg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      color: 'black',
    },
    businessPicture: {
      width: 'inherit',
    },
    card: {
      padding: 0,
      margin: '2vw 2vh'
    },
    serviceHeader: {
      marginTop: 0,
      marginBottom: 0,
      marginLeft: '1vw',
      float: 'left',
    },
    serviceTime: {
      color: 'red',
      marginRight: '1vw',
    },
    serviceCost: {
      marginTop: '1vh',
      marginRight: '2vw',
      marginBottom: '0',
      float: 'right',
    },
  }),
);

const employees = [
  {
    name: 'Cindy',
    picture: 'assets/cat1.jpg',
    schedule: '',
    checked: false,
  },
  {
    name: 'Joel',
    picture: 'assets/cat2.jpg',
    schedule: '',
    checked: false,
  },
  {
    name: 'Mark',
    picture: 'assets/cat4.jpg',
    schedule: '',
    checked: false,
  },
];

const businessPictures = [
  { imageUrl: cat1 },
  { imageUrl: cat2 },
  { imageUrl: cat3 },
];

// const employeeList = employees.map(
//   employee => {
//     return <Form className="employee">
//       <Image width="30%" height="10%" src={employee.picture} thumbnail />
//       <Form.Group controlId="formBasicCheckbox">
//         <Form.Check type="checkbox" label={employee.name} />
//       </Form.Group>
//     </Form>;
//   }
// );

export default function BusinessInfoDetails(props: any) {
  const business = props.props;
  const classes = useStyles();
  return (
    <div className={classes.main}>
      <Grid container={true} spacing={1}>
        <Grid container={true} item={true} xs={4}>
          <img
            className={classes.businessPicture}
            src={businessPictures[0].imageUrl}
            alt=""
          />
          <FormControlLabel
            control={
              <Checkbox name={employees[0].name} value={employees[0].checked} />
            }
            label={employees[0].name}
          />
        </Grid>
        <Grid container={true} item={true} xs={4}>
          <img
            className={classes.businessPicture}
            src={businessPictures[1].imageUrl}
            alt=""
          />
          <FormControlLabel
            control={
              <Checkbox name={employees[1].name} value={employees[1].checked} />
            }
            label={employees[1].name}
          />
        </Grid>
        <Grid container={true} item={true} xs={4}>
          <img
            className={classes.businessPicture}
            src={businessPictures[2].imageUrl}
            alt=""
          />
          <FormControlLabel
            control={
              <Checkbox name={employees[2].name} value={employees[2].checked} />
            }
            label={employees[2].name}
          />
        </Grid>
      </Grid>
      <FormControlLabel
        control={<Checkbox name={'FirstAvailable'} />}
        label="FIRST AVAILABLE"
      />
      <Card className={classes.card} variant="outlined">
        <h1 className={classes.serviceHeader}>Service</h1>
        <p className={classes.serviceCost}><span className={classes.serviceTime}>25 min</span> $35</p>
      </Card>
      <Card className={classes.card} variant="outlined">
        <h1 className={classes.serviceHeader}>Service</h1>
        <p className={classes.serviceCost}><span className={classes.serviceTime}>25 min</span> $35</p>
      </Card>
      <Card className={classes.card} variant="outlined">
        <h1 className={classes.serviceHeader}>Service</h1>
        <p className={classes.serviceCost}><span className={classes.serviceTime}>25 min</span> $35</p>
      </Card>
      <Card className={classes.card} variant="outlined">
        <h1 className={classes.serviceHeader}>Service</h1>
        <p className={classes.serviceCost}><span className={classes.serviceTime}>25 min</span> $35</p>
      </Card>
    </div>
  );
}
