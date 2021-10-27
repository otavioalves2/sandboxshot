import html2canvas from 'html2canvas';
import interact from 'interactjs';


const fillActionsDivWithButtons = (parentDiv) => {
  const ACTIONS = {
    "SAVE_LOCAL": takeScreenshot
  }

  Object.keys(ACTIONS).forEach(action => {
    const button = document.createElement("div");
    button.classList.add(action);
    Object.assign(button.style,
      {
          width:"50px",
          borderStyle:"solid",
          borderColor:"green",
          position: "absolute",
          zIndex: "9999",
          boxSizing: "border-box",
          padding: "20px",
          cursor: "pointer"
      });
    button.onclick = ACTIONS[action]
    parentDiv.appendChild(button);
  });
}

const takeScreenshot = () => {
  const sandboxshotDiv = document.getElementsByClassName('sandboxshotArea')[0];
  const rect = sandboxshotDiv.getBoundingClientRect();
  
  html2canvas(document.body, {x: rect.x, y: rect.y, width: rect.width, height: rect.height}).then(function(canvas) {
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
  if(actionsDivPrev){
    actionsDivPrev.parentElement.removeChild(actionsDivPrev);
  }
  const actionsDiv = document.createElement("div");
  const parentDivMeasures = parentDiv.getBoundingClientRect();
  actionsDiv.classList.add("actionsDiv");
  const marginTop = (parentDivMeasures.height <= 0) ? "20px" : `${parentDivMeasures.height - 10}px`
  Object.assign(actionsDiv.style,
  {
      width:"120px",
      borderStyle:"solid",
      borderColor:"blue",
      position: "absolute",
      zIndex: "9999",
      boxSizing: "border-box",
      padding: "20px",
      marginTop: marginTop,
      cursor: "default"
  });
  parentDiv.appendChild(actionsDiv);
  fillActionsDivWithButtons(actionsDiv);
}

const openBox = () => {  
  const sandboxshotDiv = document.getElementsByClassName('sandboxshot')[0];
  const sandboxshotArea = document.createElement("div");
  
  sandboxshotArea.classList.add("sandboxshotArea");
  Object.assign(sandboxshotArea.style,
  {
      width:"120px",
      borderStyle:"solid",
      borderColor:"red",
      position: "absolute",
      zIndex: "9999",
      touchAction: "none",
      boxSizing: "border-box",
      padding: "20px",
      margin: "1rem"
  });
  sandboxshotDiv.appendChild(sandboxshotArea);

  const screenMeasures = document.body.getBoundingClientRect();

  const sandboxshotCanvas = document.createElement("canvas");

  sandboxshotDiv.appendChild(sandboxshotCanvas);
  sandboxshotCanvas.style.opacity = "0.5";
  sandboxshotCanvas.style.position = "absolute";
  sandboxshotCanvas.style.zIndex = "9998";
  
  let sandboxshotAreaMeasures = sandboxshotArea.getBoundingClientRect();

  const sandboxshotCtx = sandboxshotCanvas.getContext("2d");
  sandboxshotCtx.canvas.width  = window.innerWidth;
  sandboxshotCtx.canvas.height = window.innerHeight;

  sandboxshotCtx.globalCompositeOperation = 'xor';

  sandboxshotCtx.fillRect(0,0,screenMeasures.width, screenMeasures.height);
  sandboxshotCtx.fillRect(sandboxshotAreaMeasures.x,sandboxshotAreaMeasures.y,sandboxshotAreaMeasures.width, sandboxshotAreaMeasures.height);

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

        sandboxshotCtx.fillRect(0,0,screenMeasures.width, screenMeasures.height);
        sandboxshotCtx.fillRect(sandboxshotAreaMeasures.x,sandboxshotAreaMeasures.y,sandboxshotAreaMeasures.width, sandboxshotAreaMeasures.height);
        openActions(sandboxshotArea);
      }
    }
  }).draggable({
    listeners: {
      start (event) {
        console.log(event.type, event.target)
      },
      move (event) {
        position.x += event.dx
        position.y += event.dy
        
        sandboxshotCtx.clearRect(0, 0, sandboxshotCtx.canvas.width, sandboxshotCtx.canvas.height);

        sandboxshotAreaMeasures = sandboxshotArea.getBoundingClientRect();

        sandboxshotCtx.fillRect(0,0,screenMeasures.width, screenMeasures.height);
        sandboxshotCtx.fillRect(sandboxshotAreaMeasures.x,sandboxshotAreaMeasures.y,sandboxshotAreaMeasures.width, sandboxshotAreaMeasures.height);

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