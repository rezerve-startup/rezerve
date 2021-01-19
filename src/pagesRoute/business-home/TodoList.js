import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.classes = makeStyles((theme) => ({
      root: {
        flexGrow: 1
      },
      card: {
        padding: theme.spacing(2)
      },
      todoList: {
        width: '100%',
        backgroundColor: theme.palette.background.paper
      }
    }))

    this.state = {
      todoItems: [
        { id: 1, title: "Todo Item 1", description: "Do this item", completed: false },
        { id: 2, title: "Todo Item 2", description: "Do this item", completed: false },
        { id: 3, title: "Todo Item 3", description: "Do this item", completed: false },
        { id: 4, title: "Todo Item 4", description: "Do this item", completed: true }
      ]
    }

    this.handleToggle = this.handleToggle.bind(this);
  }

  render() {
    return (
      <Card className={this.classes.card}>
        <CardContent>
          <Typography variant="h5">ToDo List</Typography>
          <List className={this.classes.todoList}>
            { this.state.todoItems.map((item) => {
                const labelId = `checkbox-list-secondary-label-${item.id}`;
                return (
                  <ListItem key={item.id}>
                    {/* <ListItemAvatar>{item.id}</ListItemAvatar> */}
                    <ListItemText id={labelId} primary={item.title}></ListItemText>
                    <ListItemSecondaryAction>
                      <Checkbox 
                        edge="end"
                        onChange={() => this.handleToggle(item)}
                        checked={item.completed}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })
            }
          </List>
        </CardContent>
      </Card>
    )
  }

  handleToggle(item) {
    console.log(item)
    this.updateItem(item.id, { completed: !item.completed })
  }

  updateItem(id, itemAttr) {
    var idx = this.state.todoItems.findIndex(x => x.id === id);
    if (idx === -1) {
      console.log("N/A")
    } else {
      this.setState({
        todoItems: [
          ...this.state.todoItems.slice(0, idx),
          Object.assign({}, this.state.todoItems[idx], itemAttr),
          ...this.state.todoItems.slice(idx+1)
        ]
      });
    }
  }
}

export default TodoList;