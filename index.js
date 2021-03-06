import html2canvas from 'html2canvas';
import interact from 'interactjs';
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faCopy, faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faCopy, faSave, faTimesCircle);

const addZero = (number) => {
  return number <= 9 ? "0" + number : number 
}

const today = new Date();
const date = addZero(today.getDate().toString()) + '/' + addZero((today.getMonth()+1).toString()) + '/' + today.getFullYear();

const copiedToClipboardEvent = new Event('copiedToClipboard');
const saveLocallyEvent = new Event('saveLocally');

var isVarejoGlobal;

var isOpenedVar = false;

const isOpened = () => {
  return isOpenedVar
}

const turnEverythingToSand = () => {
  const sandboxshot = document.getElementsByClassName("sandboxshot")[0];
  while (sandboxshot.firstChild) {
    sandboxshot.removeChild(sandboxshot.lastChild);
  }
  isOpenedVar = false;
}

const fillActionsDivWithButtons = (parentDiv) => {
  const ACTIONS = {
    "SAVE_LOCAL": {
      "function": takeScreenshotLocal,
      "tooltip": "Fazer download",
      "icon": "save"
    },
    "SAVE_CLIPBOARD": {
      "function": takeScreenshotClipboard,
      "tooltip": "Copiar seleção",
      "icon": "copy"
    },
    "CLOSE": {
      "function": turnEverythingToSand,
      "tooltip": "Sair (esc)",
      "icon": "times-circle"
    }
  }

  Object.keys(ACTIONS).forEach(action => {
    const button = document.createElement("div");
    button.setAttribute("title", ACTIONS[action].tooltip);
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
        margin: "0 10px 10px 0",
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

const takeScreenshotLocal = () => {
  const today = new Date();
  const date = addZero(today.getDate().toString()) + '/' + addZero((today.getMonth()+1).toString()) + '/' + today.getFullYear();
  const dateFilename = addZero(today.getDate().toString()) + '-' + addZero((today.getMonth()+1).toString()) + '-' + today.getFullYear();
  const timeFilename = addZero(today.getHours().toString()) + '-' + addZero(today.getMinutes().toString()) + '-' + addZero(today.getSeconds().toString())

  const sandboxshotDiv = document.getElementsByClassName('sandboxshotArea')[0];
  const rect = sandboxshotDiv.getBoundingClientRect();
  closeActions()

  html2canvas(document.body, { x: rect.x + 8, y: rect.y + 8, width: rect.width - 10, height: rect.height - 10}).then(function (canvas) {
    document.body.appendChild(canvas);
    return canvas
  }).then(canvas => {
    let filename = "sandboxshot.png"
    const nomePagina = document.getElementsByClassName('mat-tooltip-trigger page-title ng-star-inserted')[0].textContent
    const nomeRelatorio = document.getElementsByClassName('report-title')[0].textContent
    if(nomePagina){
      filename = `${nomeRelatorio} - ${nomePagina} - ${dateFilename}_${timeFilename}.png`
    }
    if(isVarejoGlobal){
      const ctx = canvas.getContext("2d");  
      ctx.fillStyle = "white";
      ctx.fillRect(rect.x + rect.width - 215, `${rect.y + rect.height - 30}`, 400, 150);
      ctx.textBaseline = "hanging";             
      ctx.font = "bold 16px sans-serif";           
      ctx.fillStyle = "black";           
      ctx.fillText(`Varejo 360 em ${date}`, `${rect.x + rect.width - 200}`, `${rect.y + rect.height - 20}`);
    }
    const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    const a = document.createElement('a')
    a.setAttribute('download', filename)
    a.setAttribute('href', image)
    a.click()
    canvas.remove()
    turnEverythingToSand()
    document.dispatchEvent(saveLocallyEvent)
  })
}

const takeScreenshotClipboard = () => {
  const today = new Date();
  const date = addZero(today.getDate().toString()) + '/' + addZero((today.getMonth()+1).toString()) + '/' + today.getFullYear();
  
  const sandboxshotDiv = document.getElementsByClassName('sandboxshotArea')[0];
  const rect = sandboxshotDiv.getBoundingClientRect();
  closeActions()

  html2canvas(document.body, { x: rect.x, y: rect.y, width: rect.width, height: rect.height }).then(function (canvas) {
    document.body.appendChild(canvas);
    return canvas
  }).then(canvas => {
    if(isVarejoGlobal){
      const ctx = canvas.getContext("2d");  
      ctx.fillStyle = "white";
      ctx.fillRect(rect.x + rect.width - 215, `${rect.y + rect.height - 30}`, 400, 150);
      ctx.textBaseline = "hanging";             
      ctx.font = "bold 16px sans-serif";           
      ctx.fillStyle = "black";           
      ctx.fillText(`Varejo 360 em ${date}`, `${rect.x + rect.width - 200}`, `${rect.y + rect.height - 20}`);
    }
    html2canvas(
      canvas.toBlob(blob => 
          navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
        )).then(
          turnEverythingToSand()
        ).then(
          document.dispatchEvent(copiedToClipboardEvent)
        );
  })
}
const closeActions = () => {
  const actionsDivPrev = document.getElementsByClassName('actionsDiv')[0];
  if (actionsDivPrev) {
    actionsDivPrev.parentElement.removeChild(actionsDivPrev);
  }
}
const openActions = (parentDiv, revert = false, hasVerticalSpace = true, fullScreen = false) => {
  const actionsDivPrev = document.getElementsByClassName('actionsDiv')[0];
  if (actionsDivPrev) {
    actionsDivPrev.parentElement.removeChild(actionsDivPrev);
  }
  const actionsDiv = document.createElement("div");
  const parentDivMeasures = parentDiv.getBoundingClientRect();
  actionsDiv.classList.add("actionsDiv");
  let marginTop = "";
  let marginLeft = "";
  if(fullScreen){
    Object.assign(actionsDiv.style,
      {
        width: `${parentDivMeasures.width}`,
        position: "absolute",
        zIndex: "9999",
        marginTop: "25px",
        marginLeft: `${parentDivMeasures.width - 170}px`,
        cursor: "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      });
  }else{
    if(hasVerticalSpace){
      if(!revert){
        marginTop = (parentDivMeasures.height <= 0) ? "25px" : `${parentDivMeasures.height + 5}px`;
      }else{
        marginTop = "-55px";
      }
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
    }else{
      if(revert){
        marginLeft = (parentDivMeasures.width <= 0) ? "25px" : `${parentDivMeasures.width + 5}px`;
      }else{
        marginLeft = "-55px";
      }
      Object.assign(actionsDiv.style,
        {
          width: `${parentDivMeasures.width}`,
          position: "absolute",
          zIndex: "9999",
          marginLeft: marginLeft,
          cursor: "default",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        });
    }
  }
  
  
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
      left: "100%",
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
      left: "100%",
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
      left: "100%",
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
      top: "100%",
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

const openBox = (isVarejo = false) => {
  isVarejoGlobal = isVarejo;
  const sandboxshotDiv = document.getElementsByClassName('sandboxshot')[0];
  const sandboxshotArea = document.createElement("div");
  const screenMeasures = document.body.getBoundingClientRect();

  sandboxshotArea.classList.add("sandboxshotArea");
  Object.assign(sandboxshotArea.style,
    {
      width:  `${screenMeasures.width - (screenMeasures.width * 0.15)}px`,
      height: `${screenMeasures.height - (screenMeasures.height * 0.15)}px`,
      outline: "solid #f29200",
      position: "absolute",
      zIndex: "9999",
      touchAction: "none",
      boxSizing: "border-box",
      left: `${(screenMeasures.width * 0.15)/2}px`,
      top: `${(screenMeasures.height * 0.15)/2}px`
    });
  sandboxshotDiv.appendChild(sandboxshotArea);

  addCirclesToBorder(sandboxshotArea);

  const sandboxshotCanvas = document.createElement("canvas");
  const watermarkCanvas = document.createElement("canvas");

  sandboxshotDiv.appendChild(sandboxshotCanvas);
  sandboxshotCanvas.style.opacity = "0.7";
  sandboxshotCanvas.style.position = "absolute";
  sandboxshotCanvas.style.zIndex = "9998";
  
  sandboxshotDiv.appendChild(watermarkCanvas);
  watermarkCanvas.style.opacity = "1";
  watermarkCanvas.style.position = "absolute";
  watermarkCanvas.style.zIndex = "9998";

  let sandboxshotAreaMeasures = sandboxshotArea.getBoundingClientRect();

  const sandboxshotCtx = sandboxshotCanvas.getContext("2d");
  sandboxshotCtx.canvas.width = window.innerWidth;
  sandboxshotCtx.canvas.height = window.innerHeight;

  const watermarkCtx = watermarkCanvas.getContext("2d");
  watermarkCtx.canvas.width = window.innerWidth;
  watermarkCtx.canvas.height = window.innerHeight;

  sandboxshotCtx.globalCompositeOperation = 'xor';

  sandboxshotCtx.fillRect(0, 0, screenMeasures.width, screenMeasures.height);
  sandboxshotCtx.fillRect(sandboxshotAreaMeasures.x, sandboxshotAreaMeasures.y, sandboxshotAreaMeasures.width, sandboxshotAreaMeasures.height);

  openActions(sandboxshotArea);

  isOpenedVar = true;

  if(isVarejo){
    watermarkCtx.fillStyle = "white";
    watermarkCtx.fillRect((sandboxshotAreaMeasures.x + sandboxshotAreaMeasures.width - 215), (sandboxshotAreaMeasures.y + sandboxshotAreaMeasures.height - 30), 215, 30);
    watermarkCtx.fillStyle = "black";    
    watermarkCtx.textBaseline = "hanging";             
    watermarkCtx.font = "bold 16px sans-serif";           
    watermarkCtx.fillText(`Varejo 360 em ${date}`, `${sandboxshotAreaMeasures.x + sandboxshotAreaMeasures.width - 200}`, `${sandboxshotAreaMeasures.y + sandboxshotAreaMeasures.height - 20}`);
  }

  document.body.addEventListener("keydown", function (e) {
    if (e.code === "Escape") {  
      e.preventDefault();
  	  e.stopImmediatePropagation();
      turnEverythingToSand();
    }
  });    

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
          watermarkCtx.clearRect(0, 0, watermarkCtx.canvas.width, watermarkCtx.canvas.height);

          sandboxshotAreaMeasures = sandboxshotArea.getBoundingClientRect();

          const screenMeasures = document.body.getBoundingClientRect();
         
          const isActionDivTouchingBottom = sandboxshotAreaMeasures.bottom >= (screenMeasures.bottom - 50);
          const isActionDivTouchingTop = sandboxshotAreaMeasures.top <= 50;
          const isActionDivTouchingLeft = sandboxshotAreaMeasures.left <= 50;
          const isActionDivTouchingRight = sandboxshotAreaMeasures.right >= (screenMeasures.right - 50);

          sandboxshotCtx.fillRect(0, 0, screenMeasures.width, screenMeasures.height);
          sandboxshotCtx.fillRect(sandboxshotAreaMeasures.x, sandboxshotAreaMeasures.y, sandboxshotAreaMeasures.width, sandboxshotAreaMeasures.height);
          
          if(isVarejo){
            watermarkCtx.fillStyle = "white";
            watermarkCtx.fillRect((sandboxshotAreaMeasures.x + sandboxshotAreaMeasures.width - 215), (sandboxshotAreaMeasures.y + sandboxshotAreaMeasures.height - 30), 215, 30);
            watermarkCtx.fillStyle = "black";    
            watermarkCtx.textBaseline = "hanging";             
            watermarkCtx.font = "bold 16px sans-serif";           
            watermarkCtx.fillText(`Varejo 360 em ${date}`, `${sandboxshotAreaMeasures.x + sandboxshotAreaMeasures.width - 200}`, `${sandboxshotAreaMeasures.y + sandboxshotAreaMeasures.height - 20}`);
          }
          if(isActionDivTouchingBottom){
            if(isActionDivTouchingTop){
              if(isActionDivTouchingLeft){
                if(isActionDivTouchingRight){
                  openActions(sandboxshotArea, true, true, true);
                }else{
                  openActions(sandboxshotArea, true, false);
                }
              }else{
                openActions(sandboxshotArea, false, false);
              }
            }else{
              openActions(sandboxshotArea, true, true);
            }
          }else{
            openActions(sandboxshotArea, false, true);
          }
        }
      }
    }).draggable({
      listeners: {
        move(event) {
          const isActionDivTouchingBottom = sandboxshotAreaMeasures.bottom >= (screenMeasures.bottom - 50);
          const isActionDivTouchingTop = sandboxshotAreaMeasures.top <= 50;
          const isActionDivTouchingLeft = sandboxshotAreaMeasures.left <= 50;
          const isActionDivTouchingRight = sandboxshotAreaMeasures.right >= (screenMeasures.right - 50);
          
          const isSandboxshotAreaTouchingTop = (sandboxshotAreaMeasures.top <= 0);
          const isSandboxshotAreaTouchingBottom = (sandboxshotAreaMeasures.bottom >= screenMeasures.height);
          const isSandboxshotAreaTouchingLeft = (sandboxshotAreaMeasures.left <= 0);
          const isSandboxshotAreaTouchingRight = (sandboxshotAreaMeasures.right >= screenMeasures.width);

          if((isSandboxshotAreaTouchingLeft && (event.dx > 0)) || (isSandboxshotAreaTouchingRight && (event.dx <= 0)) || (!isSandboxshotAreaTouchingLeft && !isSandboxshotAreaTouchingRight)){
            position.x += event.dx
          }
          if((isSandboxshotAreaTouchingTop && (event.dy > 0)) || (isSandboxshotAreaTouchingBottom && (event.dy <= 0)) || (!isSandboxshotAreaTouchingTop && !isSandboxshotAreaTouchingBottom)){
            position.y += event.dy
          }

          sandboxshotCtx.clearRect(0, 0, sandboxshotCtx.canvas.width, sandboxshotCtx.canvas.height);
          watermarkCtx.clearRect(0, 0, watermarkCtx.canvas.width, watermarkCtx.canvas.height);

          sandboxshotAreaMeasures = sandboxshotArea.getBoundingClientRect();

          sandboxshotCtx.fillRect(0, 0, screenMeasures.width, screenMeasures.height);
          sandboxshotCtx.fillRect(sandboxshotAreaMeasures.x, sandboxshotAreaMeasures.y, sandboxshotAreaMeasures.width, sandboxshotAreaMeasures.height);

          if(isVarejo){
            watermarkCtx.fillStyle = "white";
            watermarkCtx.fillRect((sandboxshotAreaMeasures.x + sandboxshotAreaMeasures.width - 215), (sandboxshotAreaMeasures.y + sandboxshotAreaMeasures.height - 30), 215, 30);
            watermarkCtx.fillStyle = "black";    
            watermarkCtx.textBaseline = "hanging";             
            watermarkCtx.font = "bold 16px sans-serif";           
            watermarkCtx.fillText(`Varejo 360 em ${date}`, `${sandboxshotAreaMeasures.x + sandboxshotAreaMeasures.width - 200}`, `${sandboxshotAreaMeasures.y + sandboxshotAreaMeasures.height - 20}`);
          }

          event.target.style.transform =
            `translate(${position.x}px, ${position.y}px)`
          
          if(isActionDivTouchingBottom){
            if(isActionDivTouchingTop){
              if(isActionDivTouchingLeft){
                if(isActionDivTouchingRight){
                  openActions(sandboxshotArea, true, true, true);
                }else{
                  openActions(sandboxshotArea, true, false);
                }
              }else{
                openActions(sandboxshotArea, false, false);
              }
            }else{
              openActions(sandboxshotArea, true, true);
            }
          }else{
            openActions(sandboxshotArea, false, true);
          }
        }
      }
    })
}

const sandboxshot = {
  openBox: openBox,
  isOpened: isOpened
}

export default sandboxshot