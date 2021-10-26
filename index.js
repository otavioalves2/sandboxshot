function takeScreenshot(){
  const divElement = document.getElementsByClassName('resize-drag');
  const rect = divElement[0].getBoundingClientRect();
  
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
function openBox(){
  this.showBox = true;    
  const position = { x: 0, y: 0 }
  interact('.resize-drag')
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

        event.target.style.transform =
          `translate(${position.x}px, ${position.y}px)`
      },
    }
  })
}