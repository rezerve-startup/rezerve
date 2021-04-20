import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Snackbar,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { StoreState } from '../../../shared/store/types';
import { setEmployeeServices } from '../../../shared/store/actions';
import { firestore } from '../../../config/FirebaseConfig';
import CloseIcon from '@material-ui/icons/Close';

function mapStateToProps(state: StoreState) {
    let allServices = state.system.user.employeeInfo?.services;

    let employeeServices: any[] = [];

    if (allServices) {
        allServices.forEach((service) => {
            employeeServices.push(service);
        })
    }

    return {
        employeeServices: employeeServices,
        employeeId: state.system.user.employeeId
    }
}

interface Props extends WithStyles<typeof styles> {}

const appointmentLengthOptions = [
    { value: 1, label: '30 min' },
    { value: 2, label: '60 min' },
    { value: 3, label: '90 min' },
    { value: 4, label: '120 min' }
];

class EmployeeServicesCard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
        selectedService: null,
        selectedServiceIndex: -1,
        editEmployeeServiceSelected: false
    }
  }

  dispatchRemoveEmployeeService(serviceToRemove) {

  }

  dispatchSetEmployeeServices(employeeServicesToUpdate) {
      this.props.setEmployeeServices(employeeServicesToUpdate);
  }

  removeEmployeeService(serviceToRemove, indexToRemove) {
    this.dispatchRemoveEmployeeService(serviceToRemove);
  }

  openEditEmployeeService(selectedService: any, selectedIndex: number) {
      this.setState({
          selectedService: selectedService,
          editEmployeeServiceSelected: true,
          selectedServiceIndex: selectedIndex
      });
  }

  closeEditEmployeeService() {
      this.setState({
          selectedService: null,
          selectedServiceIndex: -1,
          editEmployeeServiceSelected: false,
      })
  }

  handleEditServiceSave() {
    let employeeServicesToUpdate = this.props.employeeServices;

    if (parseFloat(this.state.selectedService.price).toFixed(2) !== 'NaN') {
        employeeServicesToUpdate[this.state.selectedServiceIndex].name = this.state.selectedService.name;
        employeeServicesToUpdate[this.state.selectedServiceIndex].price = parseFloat(this.state.selectedService.price).toFixed(2);
        employeeServicesToUpdate[this.state.selectedServiceIndex].length = this.state.selectedService.length;
    
        firestore.collection('employees').doc(`${this.props.employeeId}`).update({
            services: employeeServicesToUpdate
        }).then(() => {
            this.dispatchSetEmployeeServices(employeeServicesToUpdate);
            this.closeEditEmployeeService();
        })
    }
  }

  handleUpdateSelectedServiceName = (e) => {
      this.setState({
          selectedService: {
              ...this.state.selectedService,
              name: e.target.value
          }
      })
  }

  handleUpdateSelectedServicePrice = (e) => {
    this.setState({
        selectedService: {
            ...this.state.selectedService,
            price: e.target.value
        }
    })
}

    handleUpdateSelectedServiceLength = (e) => {
        this.setState({
            selectedService: {
                ...this.state.selectedService,
                length: e.target.value
            }
        })
    }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card} elevation={0}>
        <CardContent>
          <Typography variant="h5">SERVICES</Typography>
          <Divider />
            {this.props.employeeServices.map((employeeService: any, index: number) => {
                return (
                    <div className={classes.employeeServiceContainer}>
                        <div className={classes.serviceNameContainer}>
                            <Typography>Name:</Typography>
                            <Typography>{employeeService.name}</Typography>
                        </div>
                        <div className={classes.servicePriceContainer}>
                            <Typography>Price:</Typography>
                            <Typography>${employeeService.price}</Typography>
                        </div>
                        <div className={classes.serviceLengthContainer}>
                            <Typography>Length:</Typography>
                            <Typography>{employeeService.length * 30} min</Typography>
                        </div>
                        <div className={classes.serviceInteractionContainer}>
                            <Button variant="contained" color="primary" onClick={() => this.openEditEmployeeService(employeeService, index)}>Edit</Button>
                            <Button variant="contained" color="primary" onClick={() => this.removeEmployeeService(employeeService, index)}>Remove</Button>
                        </div>
                    </div>
                );
            })}
        </CardContent>

        <Dialog open={this.state.editEmployeeServiceSelected} onClose={() => this.closeEditEmployeeService()} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit Service</DialogTitle>
            <DialogContent>
                <div className={classes.employeeServiceContainer}>
                    <div className={classes.serviceNameContainer}>
                        <Typography className={classes.itemInfo}>Name:</Typography>
                        <TextField
                            value={this.state.selectedService?.name}
                            onChange={(e) => this.handleUpdateSelectedServiceName(e)}
                        />
                    </div>
                    <div className={classes.servicePriceContainer}>
                        <Typography className={classes.itemInfo}>Price:</Typography>
                        <TextField
                            value={this.state.selectedService?.price}
                            error={parseFloat(this.state.selectedService?.price).toFixed(2) === 'NaN'}
                            onChange={(e) => this.handleUpdateSelectedServicePrice(e)}
                        />
                    </div>
                    <div className={classes.serviceLengthContainer}>
                        <Typography className={classes.itemInfo}>Length:</Typography>
                        <TextField
                            fullWidth={true}
                            select
                            value={this.state.selectedService?.length}
                            onChange={(e) => this.handleUpdateSelectedServiceLength(e)}
                        >
                            {appointmentLengthOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.handleEditServiceSave()} color="primary">Save</Button>
                <Button onClick={() => this.closeEditEmployeeService()} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
      </Card>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(1)
    },
    employeeServiceContainer: {
        border: '1px solid rgba(0, 0, 0, 0.50)',
        borderRadius: '0.5rem',
        marginBottom: '0.5rem',
        padding: '0.5rem',
        margin: '0.5rem'
    },
    serviceNameContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0.25rem'
    },
    servicePriceContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0.25rem'
    },
    serviceLengthContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0.25rem'
    },
    serviceInteractionContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0.25rem'
    },
    itemInfo: {
        marginRight: '0.5rem'
    }
  });

export default connect(mapStateToProps, { setEmployeeServices })(
  withStyles(styles, { withTheme: true })(EmployeeServicesCard)
);

