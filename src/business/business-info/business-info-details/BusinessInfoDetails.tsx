import React from 'react';
import {
  Card,
  Checkbox,
  createStyles,
  FormControlLabel,
  Grid,
  makeStyles,
  Theme,
  Fab,
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
      margin: '2vw 2vh',
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
    dateContainer: {
      display: 'inline-block',
      width: (100 / 7 - 1).toString() + 'vw',
      float: 'left',
    },
    dateCircle: {
      color: 'red',
      width: 'inherit',
    },
    dateLabel: {
      color: 'red',
      width: 'inherit',
    },
  }),
);

const employees = [
  {
    name: 'Cindy',
    picture: cat1,
    schedule: '',
    checked: false,
    services: [
      {
        name: 'Service',
        time: '25',
        price: '35',
      },
      {
        name: 'Service',
        time: '25',
        price: '35',
      },
      {
        name: 'Service',
        time: '25',
        price: '35',
      },
      {
        name: 'Service',
        time: '25',
        price: '35',
      },
    ],
  },
  {
    name: 'Joel',
    picture: cat2,
    schedule: '',
    checked: false,
  },
  {
    name: 'Mark',
    picture: cat3,
    schedule: '',
    checked: false,
  },
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
  let firstAvailable = 'off';

  const checkBoxCheck: any = () => {
    console.log(firstAvailable);
  }
  return (
    <div className={classes.main}>
      <Grid container={true} spacing={1}>
        {employees.map((employee) => (
          <Grid container={true} item={true} xs={4} key={employee.name}>
            <img
              className={classes.businessPicture}
              src={employee.picture}
              alt=""
            />
            <FormControlLabel
              control={
                <Checkbox name={employee.name} value={employee.checked} />
              }
              label={employee.name}
            />
          </Grid>
        ))}
      </Grid>
      <FormControlLabel
        control={<Checkbox name={'FirstAvailable'} value={firstAvailable} onChange={checkBoxCheck()} />}
        label="FIRST AVAILABLE"
      />
      {/* {firstAvailable === 'on' && (
        <Card className={classes.card} variant="outlined">
        <h1 className={classes.serviceHeader}>Service</h1>
        <p className={classes.serviceCost}>
          <span className={classes.serviceTime}>25 min</span> $35
        </p>
      </Card>
      )}
      {employees.map((employee) => (
        employee?.checked && (
          employee?.services?.map((service) => (
            // tslint:disable-next-line: jsx-key
            <Card className={classes.card} variant="outlined">
            <h1 className={classes.serviceHeader}>{service.name}</h1>
            <p className={classes.serviceCost}>
              <span className={classes.serviceTime}>{service.time} min</span>${service.price}
            </p>
      </Card>
          ))
        )
      ))} */}
      <Card className={classes.card} variant="outlined">
        <h1 className={classes.serviceHeader}>Service</h1>
        <p className={classes.serviceCost}>
          <span className={classes.serviceTime}>25 min</span> $35
        </p>
      </Card>
      <Card className={classes.card} variant="outlined">
        <h1 className={classes.serviceHeader}>Service</h1>
        <p className={classes.serviceCost}>
          <span className={classes.serviceTime}>25 min</span> $35
        </p>
      </Card>
      <Card className={classes.card} variant="outlined">
        <h1 className={classes.serviceHeader}>Service</h1>
        <p className={classes.serviceCost}>
          <span className={classes.serviceTime}>25 min</span> $35
        </p>
      </Card>
      <Card className={classes.card} variant="outlined">
        <h1 className={classes.serviceHeader}>Service</h1>
        <p className={classes.serviceCost}>
          <span className={classes.serviceTime}>25 min</span> $35
        </p>
      </Card>
      <h3>SEPTEMBER</h3>
      <div>
        <div className={classes.dateContainer}>
          <p className={classes.dateLabel}>MON</p>
          <Fab className={classes.dateCircle}>8</Fab>
        </div>
        <div className={classes.dateContainer}>
          <p className={classes.dateLabel}>TUES</p>
          <Fab className={classes.dateCircle}>9</Fab>
        </div>
        <div className={classes.dateContainer}>
          <p className={classes.dateLabel}>WED</p>
          <Fab className={classes.dateCircle}>10</Fab>
        </div>
        <div className={classes.dateContainer}>
          <p className={classes.dateLabel}>THU</p>
          <Fab className={classes.dateCircle}>11</Fab>
        </div>
        <div className={classes.dateContainer}>
          <p className={classes.dateLabel}>FRI</p>
          <Fab className={classes.dateCircle}>12</Fab>
        </div>
        <div className={classes.dateContainer}>
          <p className={classes.dateLabel}>SAT</p>
          <Fab className={classes.dateCircle}>13</Fab>
        </div>
        <div className={classes.dateContainer}>
          <p className={classes.dateLabel}>SUN</p>
          <Fab className={classes.dateCircle}>14</Fab>
        </div>
      </div>
    </div>
  );
}
