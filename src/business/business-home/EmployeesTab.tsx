import React, { useEffect } from 'react';
import {
  Tab,
  Tabs,
  AppBar,
  Box,
  makeStyles,
  useMediaQuery,
  useTheme,
  Card,
  CardActions,
  CardContent,
  Typography
} from '@material-ui/core';
import { CalendarToday, Description } from '@material-ui/icons';
import SwipeableViews from 'react-swipeable-views';
import { firestore } from '../../config/FirebaseConfig';
import firebase from 'firebase'
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  employeeList: {
    display: "flex",
    padding: "5px",
    width: "99%",
    
  },
  button: {
    right: '40px',
    position: 'fixed'
  },
  button2: {
    left: '200px',
    position: 'relative',
    display: 'flex',
  }
});

export default function EmployeeTab(props: any) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [employees, setEmployees]: any[] = React.useState([])
  const [employeeRequests, setEmployeeRequests]: any[] = React.useState([])
  const [employeeIds, setEmployeeIds]: any[] = React.useState([])
  const [employeeReqIds, setEmployeeReqIds]: any[] = React.useState([])
  const [employeeInfo, setEmployeeInfo]: any[] = React.useState([])
  const [employeeReqInfo, setEmployeeReqInfo]: any[] = React.useState([])
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
      getInformation();
  }, [])

  const acceptRequest = (id, businessId) => {
    const businessRef = firestore.collection("businesses").doc(businessId);
    
    businessRef.update({
      employees: firebase.firestore.FieldValue.arrayUnion(id),
      employeeRequests: firebase.firestore.FieldValue.arrayRemove(id)
    })

    getInformation();
  }

  const removeRequest = (id, businessId) => {
    const businessRef = firestore.collection("businesses").doc(businessId);
    businessRef.update({
      employeeRequests: firebase.firestore.FieldValue.arrayRemove(id)
    })
    getInformation();
  }
  
  const removeEmployee = (id, businessId) => {
    const businessRef = firestore.collection("businesses").doc(businessId);
    businessRef.update({
      employees: firebase.firestore.FieldValue.arrayRemove(id)
    })
    getInformation();
  }
  
  const getInformation = () => {
    const businessId = props.businessId
    const tmpEmployees: any = []
    const tmpEmployeeRequests: any = []
    const tmpEmployeeIds: any = []
    const tmpEmployeeReqIds: any = []
    const tmpEmployeeInfo: any = []
    const tmpEmployeeReqInfo: any = []
    
    firestore
      .collection('businesses')
      .doc(businessId)
      .get() 
      .then((docRef) => {
        const employeeIds: string[] = docRef.data()?.employees
        const employeeReqIds: string[] = docRef.data()?.employeeRequests
        setEmployeeIds(employeeIds)
        setEmployeeReqIds(employeeReqIds)
        firestore
          .collection('employees')
          .onSnapshot((snapshot) => {
            snapshot.docs.forEach((doc) => {
              var empId = doc.id
              const empData = doc.data() 
              const index = employeeIds.indexOf(doc.id)
              const index2 = employeeReqIds.indexOf(doc.id)  
              if (employeeIds.includes(empId)) {
                tmpEmployees[index] = empData
              } else if (employeeReqIds.includes(empId)) {
                tmpEmployeeRequests[index2] = empData
              }
            })
            firestore
            .collection('users')
            .onSnapshot((snapshot) => {
              snapshot.docs.forEach((doc) => {
                const usr = doc.data()
                const name = usr.firstName + " " + usr.lastName
                const index = employeeIds.indexOf(usr.employeeId)
                const index2 = employeeReqIds.indexOf(usr.employeeId)
                if (employeeIds.includes(usr.employeeId)) {
                  tmpEmployeeInfo[index] = name
                } else if (employeeReqIds.includes(usr.employeeId)) {
                  tmpEmployeeReqInfo[index2] = name
                }
              })
              setEmployeeInfo(tmpEmployeeInfo)
              setEmployeeReqInfo(tmpEmployeeReqInfo)
            })
            setEmployees(tmpEmployees);
            setEmployeeRequests(tmpEmployeeRequests);
          })
        }) 
   
    
      
      .catch((e) => {
        console.log(e)
      })
  }

  const handleChange = (_event: any, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const tabs = [
    { label: 'Employees', icon: <Description /> },
    { label: 'Employee Requests', icon: <CalendarToday /> },
  ];

  return (
    <div className={classes.root}>
      <Box m={1}>
        <AppBar position="relative" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="appointment-tabs"
            indicatorColor="primary"
            centered={isMobile ? false : true}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="on"
          >
            {tabs.map((tab, i) => (
              <Tab
                key={i}
                label={tab.label}
                icon={tab.icon}
                {...a11yProps(i)}
              />
            ))}
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={value}
          onChangeIndex={handleChangeIndex}
          enableMouseEvents={true}
        >
          
          <TabPanel value={value} index={0}>
            
            {employees.map((emp, index) => {
            const id = employeeIds[index]
            const empName = employeeInfo[index]
              return(
                <div className={classes.employeeList}>
                  <Card className={classes.employeeList}>
                    <CardContent>
                      <div>
                        <Typography variant="h6">
                              {empName}
                          </Typography>
                          
                          <Typography variant="subtitle1" color="textSecondary">
                              {emp.position}{!emp.isOwner? (""):(" (Owner)")}
                          </Typography>
                      </div>
                    </CardContent>
                    <CardActions>
                      {!emp.isOwner ? (
                        <button className={classes.button} onClick={() => {removeEmployee(id, props.businessId)}}>Remove</button>
                      ) : (<span/>)}
                    </CardActions>
                  </Card>
                  </div>
              )
            })
          }
          </TabPanel>
          <TabPanel value={value} index={1}>
          {employeeRequests.map((empR, index) => {
            const id = employeeReqIds[index]
            const empName = employeeReqInfo[index]
              return(
                <div className={classes.employeeList}>
                  <Card className={classes.employeeList}>
                    <CardContent>
                      <div>
                        <Typography variant="h6">
                              {empName}
                          </Typography>

                          <Typography variant="subtitle1" color="textSecondary">
                              {empR.position}
                          </Typography>
                      </div>
                    </CardContent>
                    <CardActions>
                      <div className={classes.button2}>
                      <button  onClick={() => {acceptRequest(id, props.businessId)}}>Add</button>
                      <button  onClick={() => {removeRequest(id, props.businessId)}}>Remove</button>
                      </div>
                    </CardActions>
                </Card>
              </div>
              )
            })
          }
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}




type TabPanelProps = {
  children: React.ReactNode;
  index: number;
  value: string | number | Error;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`appointment-tab-${index}`}
      aria-labelledby={`appt-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `appointment-tab-${index}`,
    'aria-controls': `appointment-tabpanel-${index}`,
  };
}