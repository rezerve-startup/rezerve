import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
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
    card: {
      padding: theme.spacing(2),
    },
    todoList: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  });

type State = {
  todoItems: TodoItem[];
};

interface Props extends WithStyles<typeof styles> {}

interface TodoItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

class TodoList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      todoItems: [
        {
          id: 1,
          title: 'Todo Item 1',
          description: 'Do this item',
          completed: false,
        },
        {
          id: 2,
          title: 'Todo Item 2',
          description: 'Do this item',
          completed: false,
        },
        {
          id: 3,
          title: 'Todo Item 3',
          description: 'Do this item',
          completed: false,
        },
        {
          id: 4,
          title: 'Todo Item 4',
          description: 'Do this item',
          completed: true,
        },
      ],
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5">ToDo List</Typography>
          <List className={classes.todoList}>
            {this.state.todoItems.map((item: TodoItem) => {
              const labelId = `checkbox-list-secondary-label-${item.id}`;
              return (
                <ListItem key={item.id}>
                  {/* <ListItemAvatar>{item.id}</ListItemAvatar> */}
                  <ListItemText id={labelId} primary={item.title} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      // tslint:disable-next-line: jsx-no-lambda
                      onChange={() => this.handleToggle(item)}
                      checked={item.completed}
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

  handleToggle(item: TodoItem) {
    // tslint:disable-next-line: no-console
    console.log(item);
    this.updateItem(item.id, { completed: !item.completed });
  }

  updateItem(id: number, itemAttr: { completed: boolean }) {
    const idx = this.state.todoItems.findIndex((x) => x.id === id);
    if (idx === -1) {
      // tslint:disable-next-line: no-console
      console.log('N/A');
    } else {
      this.setState({
        todoItems: [
          ...this.state.todoItems.slice(0, idx),
          { ...this.state.todoItems[idx], ...itemAttr },
          ...this.state.todoItems.slice(idx + 1),
        ],
      });
    }
  }
}

export default withStyles(styles, { withTheme: true })(TodoList);
