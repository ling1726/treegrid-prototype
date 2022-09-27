import React, { SyntheticEvent } from "react";
import ReactDOM from "react-dom/client";
import { createContext, useContext, useState } from "react";
import "./index.css";
interface Props {
  children?: any;
  id?: number;
  level?: number;
  setsize?: number;
  posinset?: number;
}
function TreeGridCell(props: Props) {
  return (
    <td tabIndex={0} role="gridcell">
      {props.children}
    </td>
  );
}
let emptyContext : {
  handleKeyDown: any,
  clickHandler: any,
  expanded: any,
  hidden: any
} = {handleKeyDown: null,clickHandler:null,expanded: null,hidden:null};
const context = React.createContext(emptyContext);
function TreeGridItem(props: Props) {
  const { handleKeyDown, clickHandler, expanded, hidden } = useContext(context);
  const id = props.id;
  const isHidden = id !== undefined? (hidden[id] ? "hidden" : "") : "";
  const isExpanded = id !== undefined? (expanded[id] ? expanded[id] : false) : false;
  return (
    <tr
      tabIndex={0}
      role="row"
      aria-level={props.level}
      aria-posinset={props.posinset}
      aria-setsize={props.setsize}
      aria-expanded={isExpanded}
      className={isHidden}
      onKeyDown={(e) => handleKeyDown(e)}
      onClick={(e) => clickHandler(e)}
    >
      {props.children}
    </tr>
  );
}

interface TreeGridState {
  rows: HTMLCollectionOf<HTMLTableRowElement>;
  expanded: (Boolean | null)[];
  hidden: Boolean[];
  level: number[];
  focus: number | null;
}

function TreeGrid(props: Props) {
  const { renders } = useContext(rootContext);
  const levels = renders.map((render: any) => {
    return render.level;
  });
  const rows = document.getElementsByTagName("tr");
  const currentState: TreeGridState = {
    rows: rows,
    expanded: [],
    hidden: [],
    level: levels,
    focus: null,
  };
  const [state, setState] = useState(currentState);

  function getRowIndex() {
    const focused = getCurrentRow();
    const rows = Array.prototype.slice.call(state.rows);
    const id = rows.indexOf(focused);
    return id;
  }

  function getColumns() {
    const colList = getCurrentRow()?.getElementsByTagName("td");
    return Array.prototype.slice.call(colList);
  }

  function getCurrentCol() {
    if (document.activeElement?.localName === "td")
      return document.activeElement;

    var possibleCol = document.activeElement;
    while (possibleCol?.localName === "tr") {
      possibleCol = possibleCol.parentElement;
      if (possibleCol?.localName === "td") {
        return possibleCol;
      }
    }
  }

  function getCurrentRow() {
    if (document.activeElement?.localName === "tr")
      return document.activeElement as HTMLElement;
    return getCurrentCol()?.parentElement as HTMLElement;
  }

  function getColIndex() {
    const currentCol = getCurrentCol();
    const cols = getColumns();
    return cols.indexOf(currentCol);
  }

  function moveCol(direction: number) {
    const currentCol = getCurrentCol();

    const cols = getColumns();
    const currIndex = cols.indexOf(currentCol);

    const newIndex = currentCol ? currIndex + direction : 0;
    if (newIndex >= 0 && newIndex < cols.length) {
      cols[newIndex].focus();
    }
    if (newIndex === -1) getCurrentRow()?.focus();
  }

  function updateFocus(focus: number) {
    let currState = { ...state };
    currState.focus = focus;
    setState(currState);
  }

  function handleKeyDown(event: KeyboardEvent) {
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
        if (document.activeElement && document.activeElement.tagName === "TR") {
          if (state.expanded[id] !== true) {
            toggleHide();
          } else {
            const currLevel = state.level[id];

            while (id - 1 >= 0) {
              if (state.level[id - 1] > currLevel || state.hidden[id - 1]) {
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
        if (document.activeElement && document.activeElement.tagName === "TR") {
          if (state.expanded[id]) {
            toggleHide();
          } else {
            moveCol(1);
          }
        } else {
          moveCol(1);
        }
        break;
      case ENTER:
        if (getCurrentCol() && getColIndex() === 0) {
          toggleHide();
        }
        break;
      default:
        console.log("OTHER KEY" + event);
        return;
    }
  }
  function getParent(currentRow: number, startRow: number) {
    let i = currentRow;
    while (i >= startRow) {
      if (state.level[i] < state.level[currentRow + 1]) {
        return i;
      }
      i--;
    }
    return 0;
  }
  function toggleHide() {
    const focused = getCurrentRow();

    const rows = Array.prototype.slice.call(state.rows);
    const expanded: (Boolean | null)[] = state.expanded.slice();
    const hidden: Boolean[] = state.hidden.slice();

    let k = rows.indexOf(focused);
    const rowIndex = k;
    const currentLevel = state.level[k];
    let nextLevel = k + 1 < rows.length ? state.level[k + 1] : -1;

    expanded[k] = expanded[k] === null ? null : !expanded[k];

    while (currentLevel < nextLevel) {
      let parent = getParent(k, rowIndex);
      hidden[k + 1] = expanded[parent] || hidden[parent];
      k++;
      nextLevel = k + 1 < rows.length ? state.level[k + 1] : -1;
    }

    let currState = { ...state };
    currState.expanded = expanded;
    currState.hidden = hidden;
    setState(currState);
  }

  function clickHandler(event: MouseEvent) {
    if (event.detail === 2) {
      toggleHide();
    } else if (event.detail === 1) {
      updateFocus(getRowIndex());
      if (getCurrentRow() !== null) getCurrentRow()?.focus();
    }
  }

  return (
    <table id="treegrid">
      <tbody>
        <context.Provider
          value={{
            handleKeyDown,
            clickHandler,
            expanded: state.expanded,
            hidden: state.hidden,
          }}
        >
          {props.children}
        </context.Provider>
      </tbody>
    </table>
  );
}
interface TreeGridItemType {
  cells: string[];
  items: TreeGridItemType[];
}

interface TreeGridItemRender {
  cells: string[];
  posinset: number;
  level: number;
  setsize: number;
}
const treeGridHelper = (
  item: TreeGridItemType,
  level: number,
  posinset: number,
  setsize: number
): TreeGridItemRender[] => {
  let content: TreeGridItemRender[] = [];
  const render = {
    cells: item.cells,
    level: level,
    posinset: posinset,
    setsize: setsize,
  };
  content.push(render);
  content = content.concat(treeGridHelp(item.items, level));
  return content;
};
function treeGridHelp(
  items: TreeGridItemType[],
  level: number
): TreeGridItemRender[] {
  let content: TreeGridItemRender[] = [];
  for (let i = 0; i < items.length; i++) {
    content = content.concat(
      treeGridHelper(items[i], level + 1, i + 1, items.length)
    );
  }
  return content;
}
function treeGrid(items: TreeGridItemType[]): TreeGridItemRender[] {
  return treeGridHelp(items, 0);
}
const items = [
  {
    cells: ["Treegrids!!1", "Text here", "address@mail.com"],
    items: [
      {
        cells: ["Treegrids!!2", "Text here", "address@mail.com"],
        items: [
          {
            cells: ["Treegrids!!3", "Text here", "address@mail.com"],
            items: [],
          },
        ],
      },
      {
        cells: ["Treegrids!!4", "Text here", "address@mail.com"],
        items: [],
      },
    ],
  },
  {
    cells: ["Treegrids!!5", "Text here", "address@mail.com"],
    items: [
      { cells: ["Treegrids!!6", "Text here", "address@mail.com"], items: [] },
    ],
  },
];
function Comp(props: Props) {
  return (
    <TreeGridItem level={props.level}>
      <TreeGridCell>Hello</TreeGridCell>
      <TreeGridCell>Hello</TreeGridCell>
      <TreeGridCell>Hello</TreeGridCell>
    </TreeGridItem>
  );
}

const renders: TreeGridItemRender[] = treeGrid(items);
let val: TreeGridItemRender[] = [];
const rootContext = createContext({ renders: val });
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <rootContext.Provider value={{ renders }}>
    <TreeGrid>
      {renders.map((render, index) => {
        let cells = render.cells.map((cell) => {
          return <TreeGridCell>{cell}</TreeGridCell>;
        });
        return (
          <TreeGridItem
            level={render.level}
            posinset={render.posinset}
            setsize={render.setsize}
            id={index}
          >
            {cells}
          </TreeGridItem>
        );
      })}
      <Comp level={1} />
      <Comp level={2} />
    </TreeGrid>
  </rootContext.Provider>
);
