import React from 'react';
import {
  Typography,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  TextField,
} from '@material-ui/core';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@material-ui/lab';

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
          start: '4:00pm',
          end: '4:15pm',
          duration: '15min',
        },
      ],
    };

    // this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.state.incomingSchedule.map((item: IncomingSchedule) => (
          <Timeline key={item.id} align="right">
            <TimelineItem>
              <TimelineOppositeContent>
                <Typography
                  color="textSecondary"
                  style={{ margin: 'auto', fontSize: '12px' }}
                >
                  {item.start}-{item.end}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                {' '}
                <Typography
                  style={{ fontSize: '20px' }}
                >
                  {item.name}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        ))}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Upcoming);
