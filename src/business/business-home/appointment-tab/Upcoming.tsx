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
} from '@material-ui/core';
import { ExpandMoreIcon, AccountCircle } from '@material-ui/icons/';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  });

type State = {
  incomingSchedule: IncomingSchedule[];
};

interface IncomingSchedule {
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
          name: 'Marcus',
          apptType: 'Haircut',
          start: '09:00',
          end: '17:00',
          duration: '15min',
        },
        {
          name: 'Marcus',
          apptType: 'Haircut',
          start: '09:00',
          end: '17:00',
          duration: '15min',
        },
        {
          name: 'Marcus',
          apptType: 'Haircut',
          start: '09:00',
          end: '17:00',
          duration: '15min',
        },
        {
          name: 'Marcus',
          apptType: 'Haircut',
          start: '09:00',
          end: '17:00',
          duration: '15min',
        },
        {
          name: 'Marcus',
          apptType: 'Haircut',
          start: '09:00',
          end: '17:00',
          duration: '15min',
        },
        {
          name: 'Marcus',
          apptType: 'Haircut',
          start: '09:00',
          end: '17:00',
          duration: '15min',
        },
        {
          name: 'Marcus',
          apptType: 'Haircut',
          start: '09:00',
          end: '17:00',
          duration: '15min',
        },
      ],
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.state.incomingSchedule.map((item: IncomingSchedule) => (
          <Accordion key={item.name}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}> {item.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Upcoming);
