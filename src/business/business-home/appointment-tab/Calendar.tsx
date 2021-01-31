import React from 'react';
import {
  Typography,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core';

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

type State = {};

interface Props extends WithStyles<typeof styles> {}

class Upcoming extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes } = this.props;
    return <Typography>test</Typography>;
  }
}

export default withStyles(styles, { withTheme: true })(Upcoming);
