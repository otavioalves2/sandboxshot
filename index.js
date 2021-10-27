import html2canvas from 'html2canvas';
import interact from 'interactjs';
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faCopy, faSave, faTimesCircle);

const fillActionsDivWithButtons = (parentDiv) => {
  const ACTIONS = {
    "SAVE_LOCAL": {
      "function": takeScreenshot,
      "icon": "save"
    },
    "SAVE_CLIPBOARD": {
      "function": takeScreenshot,
      "icon": "copy"
    },
    "CLOSE": {
      "function": takeScreenshot,
      "icon": "times-circle"
    }
  }

  Object.keys(ACTIONS).forEach(action => {
    const button = document.createElement("div");
    button.classList.add(action);
    Object.assign(button.style,
      {
        width: "40px",
        height: "40px",
        border: "1px solid #f29200",
        color: "#FFF",
        background: "#f29200",
        borderRadius: "50%",
        zIndex: "9999",
        cursor: "pointer",
        margin: "0 10px 0 0",
        filter: "drop-shadow(0 0 0.2rem white)",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        fontSize: "larger"
      });
    const iconContainer = document.createElement('span');
    iconContainer.innerHTML = icon({ prefix: 'fas', iconName: `${ACTIONS[action].icon}` }).html;
    button.appendChild(iconContainer);
    button.onclick = ACTIONS[action].function
    parentDiv.appendChild(button);
  });
}

const takeScreenshot = () => {
  const sandboxshotDiv = document.getElementsByClassName('sandboxshotArea')[0];
  const rect = sandboxshotDiv.getBoundingClientRect();

  html2canvas(document.body, { x: rect.x, y: rect.y, width: rect.width, height: rect.height }).then(function (canvas) {
    document.body.appendChild(canvas);
    return canvas
  }).then(canvas => {
    const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    const a = document.createElement('a')
    a.setAttribute('download', 'my-image.png')
    a.setAttribute('href', image)
    a.click()
    canvas.remove()
  })
}
const openActions = (parentDiv) => {
  const actionsDivPrev = document.getElementsByClassName('actionsDiv')[0];
  if (actionsDivPrev) {
    actionsDivPrev.parentElement.removeChild(actionsDivPrev);
  }
  const actionsDiv = document.createElement("div");
  const parentDivMeasures = parentDiv.getBoundingClientRect();
  actionsDiv.classList.add("actionsDiv");
  const marginTop = (parentDivMeasures.height <= 0) ? "20px" : `${parentDivMeasures.height}px`
  Object.assign(actionsDiv.style,
    {
      width: `${parentDivMeasures.width}`,
      position: "absolute",
      zIndex: "9999",
      marginTop: marginTop,
      cursor: "default",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    });
  parentDiv.appendChild(actionsDiv);
  fillActionsDivWithButtons(actionsDiv);
}

const addCirclesToBorder = (parentDiv) => {
  const NO = document.createElement("div");
  const N = document.createElement("div");
  const NE = document.createElement("div");
  const L = document.createElement("div");
  const SE = document.createElement("div");
  const S = document.createElement("div");
  const SO = document.createElement("div");
  const O = document.createElement("div");

  Object.assign(NO.style,
    {
      position: "absolute",
      left: "-7px",
      top: "-7px",
      width: "10px",
      height: "10px",
      shapeOutside: "circle()",
      clipPath: "circle()",
      background: "#f29200"
    });
  Object.assign(N.style,
    {
      position: "absolute",
      left: "50%",
      top: "-7px",
      width: "10px",
      height: "10px",
      shapeOutside: "circle()",
      clipPath: "circle()",
      background: "#f29200"
    });
  Object.assign(NE.style,
    {
      position: "absolute",
      left: "99.5%",
      top: "-7px",
      width: "10px",
      height: "10px",
      shapeOutside: "circle()",
      clipPath: "circle()",
      background: "#f29200"
    });
  Object.assign(L.style,
    {
      position: "absolute",
      left: "99.5%",
      top: "50%",
      width: "10px",
      height: "10px",
      shapeOutside: "circle()",
      clipPath: "circle()",
      background: "#f29200"
    });
  Object.assign(SE.style,
    {
      position: "absolute",
      left: "99.5%",
      top: "99.5%",
      width: "10px",
      height: "10px",
      shapeOutside: "circle()",
      clipPath: "circle()",
      background: "#f29200"
    });
  Object.assign(S.style,
    {
      position: "absolute",
      left: "50%",
      top: "99.5%",
      width: "10px",
      height: "10px",
      shapeOutside: "circle()",
      clipPath: "circle()",
      background: "#f29200"
    });
  Object.assign(SO.style,
    {
      position: "absolute",
      left: "-7px",
      top: "99.5%",
      width: "10px",
      height: "10px",
      shapeOutside: "circle()",
      clipPath: "circle()",
      background: "#f29200"
    });
  Object.assign(O.style,
    {
      position: "absolute",
      left: "-7px",
      top: "50%",
      width: "10px",
      height: "10px",
      shapeOutside: "circle()",
      clipPath: "circle()",
      background: "#f29200"
    });
  
  parentDiv.appendChild(NO);
  parentDiv.appendChild(N);
  parentDiv.appendChild(NE);
  parentDiv.appendChild(L);
  parentDiv.appendChild(SE);
  parentDiv.appendChild(S);
  parentDiv.appendChild(SO);
  parentDiv.appendChild(O);
}

const openBox = () => {
  const sandboxshotDiv = document.getElementsByClassName('sandboxshot')[0];
  const sandboxshotArea = document.createElement("div");
  const screenMeasures = document.body.getBoundingClientRect();

  sandboxshotArea.classList.add("sandboxshotArea");
  Object.assign(sandboxshotArea.style,
    {
      width: "200px",
      height: "150px",
      borderStyle: "solid",
      borderColor: "#f29200",
      position: "absolute",
      zIndex: "9999",
      touchAction: "none",
      boxSizing: "border-box",
      marginLeft: `${(screenMeasures.width / 2) - 100}px`,
      marginTop: `${(screenMeasures.height / 2) - 75}px`
    });
  sandboxshotDiv.appendChild(sandboxshotArea);

  addCirclesToBorder(sandboxshotArea);

  const sandboxshotCanvas = document.createElement("canvas");

  sandboxshotDiv.appendChild(sandboxshotCanvas);
  sandboxshotCanvas.style.opacity = "0.5";
  sandboxshotCanvas.style.position = "absolute";
  sandboxshotCanvas.style.zIndex = "9998";

  let sandboxshotAreaMeasures = sandboxshotArea.getBoundingClientRect();

  const sandboxshotCtx = sandboxshotCanvas.getContext("2d");
  sandboxshotCtx.canvas.width = window.innerWidth;
  sandboxshotCtx.canvas.height = window.innerHeight;

  sandboxshotCtx.globalCompositeOperation = 'xor';

  sandboxshotCtx.fillRect(0, 0, screenMeasures.width, screenMeasures.height);
  sandboxshotCtx.fillRect(sandboxshotAreaMeasures.x, sandboxshotAreaMeasures.y, sandboxshotAreaMeasures.width, sandboxshotAreaMeasures.height);

  openActions(sandboxshotArea);

  const position = { x: 0, y: 0 }
  interact('.sandboxshotArea')
    .resizable({
      edges: { top: true, left: true, bottom: true, right: true },
      listeners: {
        move: function (event) {
          position.x = (position.x || 0) + event.deltaRect.left
          position.y = (position.y || 0) + event.deltaRect.top

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate(${position.x}px, ${position.y}px)`
          })

          sandboxshotCtx.clearRect(0, 0, sandboxshotCtx.canvas.width, sandboxshotCtx.canvas.height);

          sandboxshotAreaMeasures = sandboxshotArea.getBoundingClientRect();

          sandboxshotCtx.fillRect(0, 0, screenMeasures.width, screenMeasures.height);
          sandboxshotCtx.fillRect(sandboxshotAreaMeasures.x, sandboxshotAreaMeasures.y, sandboxshotAreaMeasures.width, sandboxshotAreaMeasures.height);
          openActions(sandboxshotArea);
        }
      }
    }).draggable({
      listeners: {
        start(event) {
          console.log(event.type, event.target)
        },
        move(event) {
          position.x += event.dx
          position.y += event.dy

          sandboxshotCtx.clearRect(0, 0, sandboxshotCtx.canvas.width, sandboxshotCtx.canvas.height);

          sandboxshotAreaMeasures = sandboxshotArea.getBoundingClientRect();

          sandboxshotCtx.fillRect(0, 0, screenMeasures.width, screenMeasures.height);
          sandboxshotCtx.fillRect(sandboxshotAreaMeasures.x, sandboxshotAreaMeasures.y, sandboxshotAreaMeasures.width, sandboxshotAreaMeasures.height);

          event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`
          openActions(sandboxshotArea);
        },
      }
    })
}

const sandboxshot = {
  openBox: openBox,
  takeScreenshot: takeScreenshot
}

export default sandboxshot