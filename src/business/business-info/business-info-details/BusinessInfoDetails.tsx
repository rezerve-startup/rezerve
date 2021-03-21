import React from 'react';
import {
  Card,
  createStyles,
  FormControlLabel,
  Grid,
  Theme,
  withStyles,
  RadioGroup,
  Radio,
  TextField,
  Button
} from '@material-ui/core';
import cat1 from '../../../assets/business-pictures/cat1.jpg';
import { connect } from 'react-redux';
import { StoreState } from '../../../shared/store/types';
import { setSelectedEmployee } from '../../../shared/store/actions';

function mapStateToProps(state: StoreState) {
  return {
    businessEmployees: state.customer.employeesForBusiness,
    selectedEmployee: state.customer.selectedEmployee
  };
}

class BusinessInfoDetails extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      businessEmployees: this.props.businessEmployees,
      selectedEmployee: null,
      selectedDate: ''
    };
  }
  
  componentDidMount() {
    this.setState({
      selectedDate: ''
    })
  }

  dispatchSetSelectedEmployee = (selectedEmployee) => {
    this.props.setSelectedEmployee(selectedEmployee);
  }

  handleSelectEmployee(e) {
    const selectedId = e.target.value;

    for (let employee of this.props.businessEmployees) {
      if (employee.id === selectedId) {
        console.log(employee);
        this.dispatchSetSelectedEmployee(employee);
      }
    }
  }

  handleSelectedDateChange(e) {
    this.setState({
      selectedDate: e.target.value
    })
  }

  applyDate() {
    console.log(this.state.selectedDate);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.businessInfoDetails}>
        { this.props.businessEmployees.length > 0 &&
          <div>
            <RadioGroup aria-label="employee" name="employees" onChange={(e) => this.handleSelectEmployee(e)}>
              <Grid container={true} spacing={1}>
                {this.props.businessEmployees.map((employee) => {
                  return (
                    <Grid container={true} item={true} xs={4} key={employee.id} className={classes.employeeSelection}>
                      <img
                        className={classes.businessPicture}
                        src={cat1}
                        alt=''
                      />
                      <FormControlLabel
                        value={employee.id}
                        control={
                          <Radio />
                        }
                        label={employee.firstName}
                      />
                      <div className={classes.employeePosition}><i>{employee.position}</i></div>
                    </Grid>
                  )})
                }
              </Grid>

              <div className={classes.firstAvailableSelection}>
                <FormControlLabel
                  value={'First-Available'}
                  control={<Radio />}
                  label={'FIRST AVAILABLE'}
                />
              </div>
            </RadioGroup>

            {this.props.selectedEmployee && this.props.selectedEmployee.services.map((service, index) => {
              return (
                <Card className={classes.serviceCard} variant="outlined" key={index}>
                  <div className={classes.serviceHeader}>{service.name}</div>
                  <div className={classes.serviceCost}>
                    <div>${service.price}</div>
                  </div>
                </Card>
              )
            })}

            <div className={classes.appointmentSelection}>
              <div className={classes.setAppointmentDate}>
                <TextField
                  id="date"
                  label="Select Date"
                  type="date"
                  value={this.state.selectedDate}
                  onChange={(e) => this.handleSelectedDateChange(e)}
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>

              <div className={classes.applyAppointmentDate}>
                <Button variant="contained" onClick={() => this.applyDate()}>Apply</Button>
              </div>

              {/* <div className={classes.appointmentMonth}>SEPTEMBER</div>
              <div>
                <div className={classes.dateContainer}>
                  <p className={classes.dateLabel}>MON</p>
                  <Fab size="medium" className={classes.dateCircle}>8</Fab>
                </div>
                <div className={classes.dateContainer}>
                  <p className={classes.dateLabel}>TUES</p>
                  <Fab size="medium" className={classes.dateCircle}>9</Fab>
                </div>
                <div className={classes.dateContainer}>
                  <p className={classes.dateLabel}>WED</p>
                  <Fab size="medium" className={classes.dateCircle}>10</Fab>
                </div>
                <div className={classes.dateContainer}>
                  <p className={classes.dateLabel}>THU</p>
                  <Fab size="medium" className={classes.dateCircle}>11</Fab>
                </div>
                <br></br>
                <div className={classes.dateContainer}>
                  <p className={classes.dateLabel}>FRI</p>
                  <Fab size="medium" className={classes.dateCircle}>12</Fab>
                </div>
                <div className={classes.dateContainer}>
                  <p className={classes.dateLabel}>SAT</p>
                  <Fab size="medium" className={classes.dateCircle}>13</Fab>
                </div>
                <div className={classes.dateContainer}>
                  <p className={classes.dateLabel}>SUN</p>
                  <Fab size="medium" className={classes.dateCircle}>14</Fab>
                </div>
              </div> */}
            </div>
          </div>
        }
      </div>
    )
  }
}

const styles = (theme: Theme) =>
  createStyles({
    businessInfoDetails: {
      padding: '0 2rem 2rem 2rem',
      color: 'black'
    },
    firstAvailableSelection: {
      justifyContent: 'center'
    },
    employeeSelection: {
      justifyContent: 'center',
      marginBottom: '0.5rem'
    },
    businessPicture: {
      width: 'inherit',
    },
    serviceCard: {
      margin: '0.5rem',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: 800
    },
    dateContainer: {
      display: 'inline-block',
      marginLeft: '0.5rem',
      marginRight: '0.5rem'
    },
    dateCircle: {
      color: 'red'
    },
    dateLabel: {
      color: 'red'
    },
    appointmentMonth: {
      marginTop: '1.5rem',
      fontSize: '1.5rem',
      fontWeight: 800
    },
    appointmentSelection: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    setAppointmentDate: {
      marginRight: '1rem'
    },
    applyAppointmentDate: {
      marginLeft: '1rem'
    }
  }
);

export default connect(mapStateToProps, { setSelectedEmployee })(
  withStyles(styles, { withTheme: true })(BusinessInfoDetails)
);
