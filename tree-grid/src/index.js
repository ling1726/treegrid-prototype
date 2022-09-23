import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
class Cell extends React.Component {
  render() {
    return (
      <td tabIndex="0" role="gridcell">
        {this.props.value}{" "}
      </td>
    );
  }
}
class TreeGridItem extends React.Component {
  render() {
    const props = this.props;
    const hidden = this.props.hide ? "hidden" : "";

    return (
      <tr
        tabIndex="0"
        role="row"
        aria-level={this.props.level}
        aria-posinset="1"
        aria-setsize="1"
        aria-expanded={this.props.expanded}
        class={hidden}
        onClick={(e) => this.props.onClick(e)}
        onKeyDown={(e) => this.props.onKeyDown(e, props)}
        id={this.props.id}
      >
        <Cell value={this.props.title} />
        <Cell value={this.props.text} />
        <Cell value={this.props.email} />
      </tr>
    );
  }
}
class TreeGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          title: "!!!TreeGrids!!!",
          text: "This is text! :D",
          email: "johnDoe@mail.com",
          level: 1,
          hidden: false,
          expanded: false,
        },
        {
          title: "!!!TreeGrids!!!",
          text: "This is text! :D",
          email: "johnDoe@mail.com",
          level: 2,
          hidden: false,
          expanded: false,
        },
        {
          title: "!!!TreeGrids!!!",
          text: "This is text! :D",
          email: "johnDoe@mail.com",
          level: 3,
          hidden: false,
          expanded: null,
        },
        {
          title: "!!!TreeGrids!!!",
          text: "This is text! :D",
          email: "johnDoe@mail.com",
          level: 2,
          hidden: false,
          expanded: null,
        },
        {
          title: "!!!TreeGrids!!!",
          text: "This is text! :D",
          email: "johnDoe@mail.com",
          level: 1,
          hidden: false,
          expanded: null,
        },
        {
          title: "!!!TreeGrids!!!",
          text: "This is text! :D",
          email: "johnDoe@mail.com",
          level: 1,
          hidden: false,
          expanded: false,
        },
        {
          title: "!!!TreeGrids!!!",
          text: "This is text! :D",
          email: "johnDoe@mail.com",
          level: 2,
          hidden: false,
          expanded: false,
        },
        {
          title: "!!!TreeGrids!!!",
          text: "This is text! :D",
          email: "johnDoe@mail.com",
          level: 3,
          hidden: false,
          expanded: null,
        },
        {
          title: "!!!TreeGrids!!!",
          text: "This is text! :D",
          email: "johnDoe@mail.com",
          level: 2,
          hidden: false,
          expanded: false,
        },
        {
          title: "!!!TreeGrids!!!",
          text: "This is text! :D",
          email: "johnDoe@mail.com",
          level: 3,
          hidden: false,
          expanded: false,
        },
        {
          title: "!!!TreeGrids!!!",
          text: "This is text! :D",
          email: "johnDoe@mail.com",
          level: 4,
          hidden: false,
          expanded: null,
        },
      ],
      focus: null,
    };
    this.toggleHide = this.toggleHide.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getColWithFocus = this.getColWithFocus.bind(this);
  }

  getColumns(rowId) {
    let id = rowId ? rowId : this.state.focus;
    console.log("ID" + id);
    const colList = document.getElementById(id).getElementsByTagName("td");
    return Array.prototype.slice.call(colList);
  }

  getColWithFocus(currentRow) {
    if (document.activeElement.localName === "td")
      return document.activeElement;
    if (currentRow) {
      var possibleCol = document.activeElement;

      if (currentRow.contains(possibleCol)) {
        while (possibleCol !== currentRow) {
          if (possibleCol.localName === "td") {
            return possibleCol;
          }
          possibleCol = possibleCol.parentElement;
        }
      }
    }
  }

  getCurrentRow() {
    if (this.state.focus >= 0) {
      return document.getElementById(this.state.focus);
    }
  }

  getCurrentCol() {
    return this.getColWithFocus(this.getCurrentRow());
  }

  getColIndex() {
    const currentCol = this.getCurrentCol();
    const cols = this.getColumns(this.getRowId(currentCol));
    return cols.indexOf(currentCol);
  }

  moveCol(direction) {
    const currentCol = this.getCurrentCol();

    const cols = this.getColumns(this.getRowId(currentCol));
    const currIndex = cols.indexOf(currentCol);

    const newIndex = currentCol ? currIndex + direction : 0;
    if (newIndex >= 0 && newIndex < cols.length) {
      cols[newIndex].focus();
    }
    if (newIndex === -1) this.getCurrentRow().focus();
  }

  getRowId(col) {
    if (col) return col.parentElement.id;
  }

  handleKeyDown(event, props) {
    var ENTER = 13;
    var UP = 38;
    var DOWN = 40;
    var LEFT = 37;
    var RIGHT = 39;

    var key = event.keyCode;
    let id = props.id;
    switch (key) {
      case DOWN:
        console.log("DOWN");
        while (id + 1 < this.state.data.length) {
          if (this.state.data[id + 1].hidden) {
            id++;
          } else {
            document.getElementById(id + 1).focus();
            this.setState({ focus: id + 1 });
            break;
          }
        }

        break;
      case UP:
        console.log("UP");
        while (id - 1 >= 0) {
          if (this.state.data[id - 1].hidden) {
            id--;
          } else {
            document.getElementById(id - 1).focus();
            this.setState({ focus: id - 1 });
            break;
          }
        }
        break;
      case LEFT:
        console.log("LEFT");
        if (document.activeElement.tagName === "TR") {
          const row = this.getCurrentRow();
          let index = row.id;
          console.log(this.state.data[index].expanded);
          if (this.state.data[index].expanded === false) this.toggleHide(index);
          else {
            const currLevel = this.state.data[index].level;
            while (index - 1 >= 0) {
              if (
                this.state.data[index - 1].level > currLevel ||
                this.state.data[index - 1].hidden
              ) {
                index--;
              } else {
                document.getElementById(index - 1).focus();
                this.setState({ focus: index - 1 });
                break;
              }
            }
          }
        } else this.moveCol(-1);
        break;
      case RIGHT:
        console.log("RIGHT");
        if (document.activeElement.tagName === "TR") {
          const row = this.getCurrentRow();
          const index = row.id;
          console.log(this.state.data[index].expanded);
          if (this.state.data[index].expanded) this.toggleHide(index);
          else this.moveCol(1);
        } else this.moveCol(1);
        break;
      case ENTER:
        console.log("ENTER");
        if (this.getCurrentCol() && this.getColIndex() === 0) {
          const rowId = this.state.focus;
          console.log(rowId);
          this.toggleHide(rowId);
        }
        break;
      default:
        console.log("OTHER KEY" + event);
        return;
    }
  }
  toggleHide(rowIndex) {
    let k = Number(rowIndex);
    const currentLevel = this.state.data[rowIndex].level;
    let nextLevel =
      k + 1 < this.state.data.length ? this.state.data[k + 1].level : -1;
    const data = this.state.data.slice();
    data[k].expanded = data[k].expanded === null ? null : !data[k].expanded;
    while (currentLevel < nextLevel) {
      let i = k;
      let parent;
      while (i >= Number(rowIndex)) {
        if (data[i].level < data[k + 1].level) {
          parent = i;
          break;
        }
        i--;
      }
      data[k + 1].hidden = data[parent].expanded || data[parent].hidden;
      k++;
      nextLevel =
        k + 1 < this.state.data.length ? this.state.data[k + 1].level : -1;
    }
    this.setState({ data });
  }

  clickHandler(index, event) {
    if (event.detail === 2) {
      this.toggleHide(index);
    } else if (event.detail === 1) {
      this.setState({ focus: this.getRowId(this.getCurrentCol()) });
      this.getCurrentCol().parentElement.focus();
    }
  }

  render() {
    let rows = this.state.data.map((info, index) => {
      return (
        <TreeGridItem
          title={info.title}
          text={info.text}
          email={info.email}
          level={info.level}
          onClick={(e) => this.clickHandler(index, e)}
          hide={info.hidden}
          expanded={info.expanded}
          id={index}
          onKeyDown={(props, e) => this.handleKeyDown(props, e)}
        />
      );
    });
    return (
      <table id="treegrid">
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<TreeGrid />);
