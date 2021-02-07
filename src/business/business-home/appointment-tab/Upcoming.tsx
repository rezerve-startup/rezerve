import React from 'react';
import {
  Typography,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Avatar,
} from '@material-ui/core';
// tslint:disable-next-line: no-submodule-imports
import { AccountCircle, Description } from '@material-ui/icons/';
// tslint:disable-next-line: no-submodule-imports
import DeleteIcon from '@material-ui/icons/Delete';
// tslint:disable-next-line: no-submodule-imports
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import image from '../../../assets/avatar.jpg';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    button: {
      margin: theme.spacing(1),
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    column: {
      flexBasis: '33.33%',
    },
  });

type State = {
  incomingSchedule: IncomingSchedule[];
};

interface IncomingSchedule {
  id: number;
  name: string;
  apptType: string;
  start: string;
  end: string;
  duration: string;
}

interface Props extends WithStyles<typeof styles> {}

class Upcoming extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      incomingSchedule: [
        {
          id: 1,
          name: 'Marcus',
          apptType: 'Haircut',
          start: '9:15am',
          end: '9:30am',
          duration: '15min',
        },
        {
          id: 2,
          name: 'Marcus',
          apptType: 'Haircut',
          start: '10:15am',
          end: '11:00am',
          duration: '45min',
        },
        {
          id: 3,
          name: 'Marcus',
          apptType: 'Haircut',
          start: '12:00pm',
          end: '1:00pm',
          duration: '60min',
        },
        {
          id: 4,
          name: 'Marcus',
          apptType: 'Haircut',
          start: '1:15pm',
          end: '1:30pm',
          duration: '15min',
        },
        {
          id: 5,
          name: 'Marcus',
          apptType: 'Haircut',
          start: '2:00pm',
          end: '3:00pm',
          duration: '60min',
        },
        {
          id: 6,
          name: 'Marcus',
          apptType: 'Haircut',
          start: '3:30pm',
          end: '3:45pm',
          duration: '15min',
        },
        {
          id: 7,
          name: 'Marcus',
          apptType: 'Haircut',
          start: '4:00',
          end: '4:15',
          duration: '15min',
        },
      ],
    };

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.state.incomingSchedule.map((item: IncomingSchedule) => (
          <Accordion key={item.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={classes.column}>
                <Avatar alt="Marcus" src={image} className={classes.small} />
                <Typography className={classes.heading}>{item.name}</Typography>
              </div>
              <div className={classes.column}>
                <Typography className={classes.heading}>
                  {item.start}-{item.end}
                </Typography>
              </div>
              <div className={classes.column}>
                <Typography
                  className={classes.heading}
                  style={{ margin: 'auto' }}
                >
                  {item.duration}
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <Button
                size="small"
                color="primary"
                variant="contained"
                className={classes.button}
                startIcon={<Description />}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={() => this.handleClick(item)}
              >
                Send Message
              </Button>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                className={classes.button}
                startIcon={<DeleteIcon />}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={() => this.handleClick(item)}
              >
                Cancel Appt.
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  }

  handleClick(item: IncomingSchedule) {
    // tslint:disable-next-line: no-console
    console.log(item);
    this.updateItem(item.id);
  }

  updateItem(id: number) {
    const idx = this.state.incomingSchedule.findIndex((x) => x.id === id);
    if (idx === -1) {
      // tslint:disable-next-line: no-console
      console.log('N/A');
    } else {
      // tslint:disable-next-line: no-console
      console.log('Button pressed');
    }
  }
}

export default withStyles(styles, { withTheme: true })(Upcoming);
