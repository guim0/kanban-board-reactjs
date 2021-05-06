import React from "react";
import { DragDropContext, DropTarget, DragSource } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";

const tasks = [
  { _id: 1, title: "First Task", status: "todo" },
  { _id: 2, title: "Second Task", status: "todo" },
  { _id: 3, title: "Third Task", status: "going" },
  { _id: 4, title: "Fourth Task", status: "going" },
  { _id: 5, title: "Fifth Task", status: "new" },
  { _id: 6, title: "Sixth Task", status: "done" },
  { _id: 7, title: "Seventh Task", status: "done" },
  { _id: 8, title: "Eighth Task", status: "done" },
  { _id: 9, title: "Ninth Task", status: "done" },
  { _id: 10, title: "Tenth Task", status: "done" },
];

const labels = ["todo", "going", "done"];
const labelsMap = {
  todo: "To do",
  going: "In Progress",
  done: "Done",
};

const classes = {
  board: {
    display: "flex",
    margin: "0 auto",
    justifyContent: "center",
    fontFamily: '"Inconsolata", monospace'
     
  },
  column: {
    minWidth: 200,
    width: "18vw",
    height: "80vh",
    margin: "0 auto",
    backgroundColor: "#945AD1",
    borderRadius:"2rem",
    marginRight:"2rem"
  },
  columnHead: {
    textAlign: "center",
    fontWeight:"600",
    padding: 10,
    fontSize: "1.2em",
    color: "white",

  },
  item: {
    padding: 10,
    margin: 10 ,
    fontSize: "1em",
    cursor: "pointer",
    backgroundColor: "white",
    borderRadius: "10px"
    
  },
 
};

class Kanban extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks,
    };
  }
  update = (id, status) => {
    const { tasks } = this.state;
    const task = tasks.find((task) => task._id === id);
    // console.log("task", task);
    task.status = status;
    const taskIndex = tasks.indexOf(task);
    const newTasks = update(tasks, {
      [taskIndex]: { $set: task },
    });
    console.log("newTask", newTasks);
    this.setState({ tasks: newTasks });
  };

  render() {
    const { tasks } = this.state;
    return (
      <main>
        <header>Kanban do projeto</header>
        <section style={classes.board}>
          {labels.map((channel) => (
            <KanbanColumn status={channel}>
              <div style={classes.column}>
                <div style={classes.columnHead}>{labelsMap[channel]}</div>
                <div>
                  {tasks
                    .filter((item) => item.status === channel)
                    .map((item) => (
                      <KanbanItem id={item._id} onDrop={this.update}>
                        <div style={classes.item}>{item.title}<p>Description</p></div>
                      </KanbanItem>
                    ))}
                </div>
              </div>
            </KanbanColumn>
          ))}
        </section>
      </main>
    );
  }
}

export default DragDropContext(HTML5Backend)(Kanban);

// Column

const boxTarget = {
  drop(props) {
    return { name: props.status };
  },
};

class KanbanColumn extends React.Component {
  render() {
    return this.props.connectDropTarget(<div>{this.props.children}</div>);
  }
}

KanbanColumn = DropTarget("kanbanItem", boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(KanbanColumn);

// Item

const boxSource = {
  beginDrag(props) {
    return {
      name: props.id,
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      props.onDrop(monitor.getItem().name, dropResult.name);
    }
  },
};

class KanbanItem extends React.Component {
  render() {
    return this.props.connectDragSource(<div>{this.props.children}</div>);
  }
}

KanbanItem = DragSource("kanbanItem", boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(KanbanItem);
