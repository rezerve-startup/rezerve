import React, { useEffect } from 'react';
import clsx from 'clsx';
import {
  Toolbar,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Tooltip,
  Theme,
  createStyles,
  makeStyles,
  lighten,
  Avatar,
  Fab,
  InputBase,
  Grow,
  fade,
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  IconButton,
  Snackbar,
} from '@material-ui/core';
import { Delete, Check, Add, Search, Message } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { Client } from '../../models/BusinessHome';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';
import { connect } from 'react-redux';
import { StoreState } from '../../../shared/store/types';
import { setEmployeeClients } from '../../../shared/store/actions';
import { firestore } from '../../../config/FirebaseConfig';
import firebase from 'firebase';
import image from '../../../assets/avatar.jpg';

// const image = require('../../../assets/avatar.jpg');

const fabActions = [
  { icon: <Message />, name: 'Message' }
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: any,
  b: any,
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Client;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Client Name' },
  {
    id: 'numVisits',
    numeric: true,
    disablePadding: false,
    label: '# of Visits',
  },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Client,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: keyof Client) => (
    event: React.MouseEvent<unknown>,
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.primary.dark,
            backgroundColor: lighten(theme.palette.primary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.primary.dark, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.primary.dark, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    grow: {
      flexGrow: 1,
    },
    fab: {
      position: 'absolute',
      right: theme.spacing(2),
      top: theme.spacing(1),
    },
    speedDial: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
    },
  }),
);

interface EnhancedTableToolbarProps {
  selectedClients: string[];
  employeeId?: string;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { selectedClients, employeeId } = props;
  const [searching] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = React.useState(false);
  const [messageToClients, setMessageToClients] = React.useState('');

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const openMessageDialog = () => {
    setMessageDialogOpen(true)
  }

  const handleCloseMessageDialog = () => {
    setMessageDialogOpen(false);
    setOpen(false);
    setMessageToClients('');
  }

  const handleOnChangeClientMessage = (e) => {
    setMessageToClients(e.target.value)
  }

  const sendMessageToClients = () => {
    firestore.collection('messages').where('employeeId', '==', `${props.employeeId}`).get()
      .then((querySnapshot) => {
        for (const clientId of props.selectedClients) {
          let customerIdFound = false;

          querySnapshot.forEach((conversationDoc) => {
            const conversationData = conversationDoc.data();
            if (conversationData.customerId === clientId) {
              customerIdFound = true;
              let messagesToUpdate = conversationData.messages;

              const messageToAdd = {
                senderId: props.employeeId,
                datetime: firebase.firestore.Timestamp.fromDate(new Date(Date.now())),
                message: messageToClients
              }

              messagesToUpdate.push(messageToAdd);

              conversationDoc.ref.update({
                messages: messagesToUpdate
              });
            }
          });

          if (customerIdFound === false) {
            const currentDatetime = firebase.firestore.Timestamp.fromDate(new Date(Date.now()));

            const messagesToAdd = [{
              senderId: props.employeeId,
              datetime: currentDatetime,
              message: messageToClients
            }];

            const documentToAdd = {
              customerId: clientId,
              employeeId: props.employeeId,
              lastMessageDatetime: currentDatetime,
              messages: messagesToAdd
            }

            firestore.collection('messages').add(documentToAdd)
              .then((docRef) => {
                firestore.collection('employees').doc(`${props.employeeId}`).update({
                  messages: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                })
                .then(() => {
                  firestore.collection('customers').doc(`${clientId}`).update({
                    messages: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                  });
                })
              });
          }
        }
      })
      .then(() => {
        setMessageDialogOpen(false);
        setOpen(false);
        setMessageToClients('');
      });
  }

  return (
    <div>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: selectedClients.length > 0,
        })}
      >
        {selectedClients.length > 0 ? (
          <Typography
            className={classes.title}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selectedClients.length} selected
          </Typography>
        ) : (
          <Typography
            className={classes.title}
            color="inherit"
            variant="h6"
            component="div"
          >
            Clients
          </Typography>
        )}
        <Grow in={searching}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Grow>
        <div className={classes.grow} />
        {selectedClients.length > 0 ? (
          <SpeedDial
            ariaLabel="client-speed-dial"
            className={classes.speedDial}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction="down"
            FabProps={{ size: 'small' }}
          >
            <SpeedDialAction
              key={'Message'}
              icon={<Message />}
              tooltipTitle={'Message'}
              tooltipOpen={true}
              onClick={() => openMessageDialog()}
            />
          </SpeedDial>
        ) : (
          <></>
        )}
      </Toolbar>
      <Dialog open={messageDialogOpen} onClose={() => handleCloseMessageDialog()}>
        <DialogTitle>Message Client(s)</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the message you would like to send these clients:</DialogContentText>
          <TextField value={messageToClients} onChange={(e) => handleOnChangeClientMessage(e)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => sendMessageToClients()}>Send</Button>
          <Button onClick={() => handleCloseMessageDialog()}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 50,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
    checkedAvatar: {
      backgroundColor: theme.palette.primary.light,
    },
  }),
);

function mapStateToProps(state: StoreState) {
  const employeeClients = state.system.user.employeeInfo.clients;

  let clientsToAdd: any = [];

  if (employeeClients) {
    for (const [key, val] of Object.entries(employeeClients)) {
      let clientValue: any = val;
      
      const client = {
        customerId: key,
        firstName: clientValue.firstName,
        lastName: clientValue.lastName,
        numVisits: clientValue.numVisits
      };
  
      clientsToAdd.push(client);
    }
  }


  return ({
    employeeClients: clientsToAdd,
    employeeId: state.system.user.employeeId
  });
}

const ClientTable = (props: any) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Client>('numVisits');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(function() {
    firestore.collection('appointments').where('employeeId', '==', `${props.employeeId}`).get()
      .then((querySnapshot) => {
        let employeeClients = {};

        querySnapshot.forEach((apptDoc) => {
          const apptData = apptDoc.data();

          firestore.collection('users').where('customerId', '==', `${apptData.customerId}`).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((userDoc) => {
                const userData = userDoc.data();
                let numVisits = 0;

                if (apptData.datetime.toDate() < Date.now()) {
                  if (employeeClients[`${apptData.customerId}`]) {
                    if (apptData.status === 'accepted') {
                      let numVisits = employeeClients[`${apptData.customerId}`] + 1;

                      employeeClients[`${apptData.customerId}`].numVisits += 1;
                    }
                  } else {
                    numVisits = 1;

                    employeeClients[`${apptData.customerId}`] = {
                      firstName: userData.firstName,
                      lastName: userData.lastName,
                      numVisits: numVisits
                    }
                  }
                }

                dispatchSetEmployeeClients(employeeClients);
              });
            })
        });
      })
  }, []);

  const dispatchSetEmployeeClients = (employeeClients: any) => {
    props.setEmployeeClients(employeeClients);
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Client,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = props.employeeClients.map((client) => client.customerId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, customerId: string) => {
    const selectedIndex = selected.indexOf(customerId);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, customerId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (customerId: string) => selected.indexOf(customerId) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, props.employeeClients.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar selectedClients={selected} employeeId={props.employeeId} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={props.employeeClients.length}
            />
            <TableBody>
              {stableSort(props.employeeClients, getComparator(order, orderBy)).map(
                (client, index) => {
                  const isItemSelected = isSelected(client.customerId);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, client.customerId)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={client.customerId}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          icon={<Avatar src={image} />}
                          checkedIcon={
                            <Avatar className={classes.checkedAvatar}>
                              <Check />
                            </Avatar>
                          }
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {client.firstName}
                      </TableCell>
                      <TableCell align="right">{client.numVisits}</TableCell>
                    </TableRow>
                  );
                },
              )}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props.employeeClients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default connect(mapStateToProps, { setEmployeeClients })(
  ClientTable
);
