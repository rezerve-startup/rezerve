import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Checkbox,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  Divider,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { StoreState } from '../../../shared/store/types';
import { setToDos } from '../../../shared/store/actions';
import { firestore } from '../../../config/FirebaseConfig';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    card: {
      padding: theme.spacing(1),
    },
    todoList: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    listAvatar: {
      backgroundColor: theme.palette.primary.main,
    },
  });

function mapStateToProps(state: StoreState) {
  let employeeTodos = state.system.user.employeeInfo.todos;

  let todosToAdd: any[] = [];

  if (employeeTodos) {
    for (const todo of employeeTodos) {
      todosToAdd.push(todo);
    }
  }

  return {
    employeeId: state.system.user.employeeId,
    employeeTodos: todosToAdd
  }
}

interface Props extends WithStyles<typeof styles> {}

interface TodoItem {
  title: string;
  description: string;
  completed: boolean;
}

class TodoList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
  }

  dispatchSetToDos(todos: any[]) {
    this.props.setToDos(todos);
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card} elevation={0}>
        <CardContent>
          <Typography variant="h5">TO-DO</Typography>
          <Divider />
          <List className={classes.todoList}>
            {this.props.employeeTodos.map((item: TodoItem, index: number) => {
              const labelId = `checkbox-list-secondary-label-${index}`;
              return (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar className={classes.listAvatar}>{index + 1}</Avatar>
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={item.title} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      // tslint:disable-next-line: jsx-no-lambda
                      onChange={() => this.handleToggle(index, item)}
                      value={item.completed}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    );
  }

  handleToggle(id: number, item: TodoItem) {
    // tslint:disable-next-line: no-console
    this.updateItem(id, { completed: !item.completed });
  }

  updateItem(index: number, itemAttr: { completed: boolean }) {
    let todosUpdate = this.props.employeeTodos;
    todosUpdate[index].completed =itemAttr.completed;

    // Need to update ToDo completion in Firebase
    this.dispatchSetToDos(todosUpdate);

    firestore.collection('employees').doc(`${this.props.employeeId}`).update({
      todos: todosUpdate
    });
  }
}

export default connect(mapStateToProps, { setToDos })(
  withStyles(styles, { withTheme: true })(TodoList)
);

