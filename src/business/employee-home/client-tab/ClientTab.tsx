import React from 'react';
import { connect } from 'react-redux';
import { Theme, WithStyles, withStyles, createStyles } from '@material-ui/core';
import ClientTable from './ClientTable';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
    },
  });

interface StyleProps extends WithStyles<typeof styles> {}
interface PassedProps {
  employeeName?: string;
}

type Props = StyleProps & PassedProps;
type State = {
  employeeName: string;
};

class ClientTab extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      employeeName: props.employeeName,
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <ClientTable />
      </div>
    );
  }
}

export default connect(
  null,
  null,
)(withStyles(styles, { withTheme: true })(ClientTab));
