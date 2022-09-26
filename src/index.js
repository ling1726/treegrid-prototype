import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
function TreeGridCell(props) {
  return (
    <td tabIndex="0" role="gridcell">
      {props.children}
    </td>
  );
}
function TreeGridItem(props) {
  const hidden = props.hidden ? "hidden" : "";
  return (
    <tr
      tabIndex="0"
      role="row"
      aria-level={props.level}
      aria-posinset="1"
      aria-setsize="1"
      aria-expanded={props.expanded ? props.expanded : false}
      class={hidden}
      onKeyDown={(e) => props.handleKeyDown(e, props)}
      onClick={(e) => props.clickHandler(e)}
    >
      {props.children}
    </tr>
  );
}

function TreeGrid(props) {
  const children = props.children;
  const rows = document.getElementsByTagName("tr");
  const [state, setState] = useState({
    rows: rows,
    expanded: [],
    hidden: [],
    level: [],
    focus: null,
  });

  function getRowIndex() {
    const focused = getCurrentRow();
    const rows = Array.prototype.slice.call(state.rows);
    const id = rows.indexOf(focused);
    return id;
  }
  
  function getColumns() {
    const colList = getCurrentRow().getElementsByTagName("td");
    return Array.prototype.slice.call(colList);
  }

  function getCurrentCol() {
    if (document.activeElement.localName === "td")
      return document.activeElement;

      var possibleCol = document.activeElement;
        while (possibleCol.localName === "tr") {
          if (possibleCol.localName === "td") {
            return possibleCol;
          }
          possibleCol = possibleCol.parentElement;
        }
  }

  function getCurrentRow() {
    if(document.activeElement.localName === "tr")
        return document.activeElement;
    return getCurrentCol().parentElement;
  }

  function getColIndex() {
    const currentCol = getCurrentCol();
    const cols = getColumns();
    return cols.indexOf(currentCol);
  }

  function moveCol(direction) {
    const currentCol = getCurrentCol();

    const cols = getColumns();
    const currIndex = cols.indexOf(currentCol);

    const newIndex = currentCol ? currIndex + direction : 0;
    if (newIndex >= 0 && newIndex < cols.length) {
      cols[newIndex].focus();
    }
    if (newIndex === -1) getCurrentRow().focus();
  }

  function updateFocus(focus) {
    let currState = { ...state };
    currState.focus = focus;
    setState(currState);
  }

  function handleKeyDown(event, props) {
    var ENTER = 13;
    var UP = 38;
    var DOWN = 40;
    var LEFT = 37;
    var RIGHT = 39;

    var key = event.keyCode;
    let id = getRowIndex();

    switch (key) {
      case DOWN:
        while (id + 1 < state.rows.length) {
          if (state.hidden[id + 1]) {
            id++;
          } else {
            state.rows[id + 1].focus();
            updateFocus(id + 1);
            break;
          }
        }
        break;
      case UP:
        while (id - 1 >= 0) {
          if (state.hidden[id - 1]) {
            id--;
          } else {
            state.rows[id - 1].focus();
            updateFocus(id - 1);
            break;
          }
        }
        break;
      case LEFT:
        if (document.activeElement.tagName === "TR") {
          if (state.expanded[id] !== true) {
            toggleHide(id);
          } else {
            const currLevel = children[id].props.level;

            while (id - 1 >= 0) {
              if (
                children[id - 1].props.level > currLevel ||
                state.hidden[id - 1]
              ) {
                id--;
              } else {
                state.rows[id - 1].focus();
                updateFocus(id - 1);
                break;
              }
            }
          }
        } else {
          moveCol(-1);
        }
        break;
      case RIGHT:
        if (document.activeElement.tagName === "TR") {
          if (state.expanded[id]) {toggleHide(id);}
          else {
            moveCol(1);
          }
        } else {
          moveCol(1);
        }
        break;
      case ENTER:
        if (getCurrentCol() && getColIndex() === 0) {
          const rowId = state.focus;
          toggleHide(rowId);
        }
        break;
      default:
        console.log("OTHER KEY" + event);
        return;
    }
  }
  function getParent(currentRow, startRow) {
    let i = currentRow;
    while (i >= startRow) {
      if (children[i].props.level < children[currentRow + 1].props.level) {
        return i;
      }
      i--;
    }
  }
  function toggleHide() {
    const focused = getCurrentRow();

    const rows = Array.prototype.slice.call(state.rows);
    const expanded = state.expanded.slice();
    const hidden = state.hidden.slice();

    let k = rows.indexOf(focused);
    const rowIndex = k;
    const currentLevel = children[k].props.level;
    let nextLevel = k + 1 < rows.length ? children[k + 1].props.level : -1;

    expanded[k] = expanded[k] === null ? null : !expanded[k];

    while (currentLevel < nextLevel) {
      let parent = getParent(k, rowIndex);
      hidden[k + 1] = expanded[parent] || hidden[parent];
      k++;
      nextLevel = k + 1 < rows.length ? children[k + 1].props.level : -1;
    }

    let currState = { ...state };
    currState.expanded = expanded;
    currState.hidden = hidden;
    setState(currState);
  }

  function clickHandler(event) {
    const focused = getCurrentRow();
    const rows = Array.prototype.slice.call(state.rows);
    const id = rows.indexOf(focused);
    if (event.detail === 2) {
      toggleHide(id);
    } else if (event.detail === 1) {
      updateFocus(getRowIndex());
      getCurrentRow().focus();
    }
  }

  const childrenWithProps = React.Children.map(children, (child, i) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        clickHandler,
        handleKeyDown,
        expanded: state.expanded[i],
        hidden: state.hidden[i],
      });
    }
  });

  return (
    <table id="treegrid">
      <tbody>{childrenWithProps}</tbody>
    </table>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <TreeGrid>
    <TreeGridItem level={1}>
      <TreeGridCell>TreeGRids!!!</TreeGridCell>
      <TreeGridCell>Text here</TreeGridCell>
      <TreeGridCell>mymail@mail.com</TreeGridCell>
    </TreeGridItem>
    <TreeGridItem level={2}>
      <TreeGridCell>TreeGRids!!!</TreeGridCell>
      <TreeGridCell>Text here</TreeGridCell>
      <TreeGridCell>mymail@mail.com</TreeGridCell>
    </TreeGridItem>
    <TreeGridItem level={3}>
      <TreeGridCell>TreeGRids!!!</TreeGridCell>
      <TreeGridCell>Text here</TreeGridCell>
      <TreeGridCell>mymail@mail.com</TreeGridCell>
    </TreeGridItem>
    <TreeGridItem level={2}>
      <TreeGridCell>TreeGRids!!!</TreeGridCell>
      <TreeGridCell>Text here</TreeGridCell>
      <TreeGridCell>mymail@mail.com</TreeGridCell>
    </TreeGridItem>
    <TreeGridItem level={1}>
      <TreeGridCell>TreeGRids!!!</TreeGridCell>
      <TreeGridCell>Text here</TreeGridCell>
      <TreeGridCell>mymail@mail.com</TreeGridCell>
    </TreeGridItem>
    <TreeGridItem level={2}>
      <TreeGridCell>TreeGRids!!!</TreeGridCell>
      <TreeGridCell>Text here</TreeGridCell>
      <TreeGridCell>mymail@mail.com</TreeGridCell>
    </TreeGridItem>
  </TreeGrid>
);
