const svgPathContainer = document.getElementById("chartContainer")
const formElement = document.getElementById("form")
const input = document.getElementById("real")
const downloadAsSvg = document.querySelector(".btn-download-chart-as-svg")
// const downloadAsPng = document.querySelector(".btn-download-chart-as-png")

const SVG_NAMESPACE_URI = "http://www.w3.org/2000/svg"

// default values
let values = [50, 30, 40, 30, 20, 100]

function formatInput(input) {
  let formattedValues = []
  input = input.replace(/,/g, " ")
  let values = input.split(" ")
  values.forEach((value) => {
    if (value !== "") {
      formattedValues.push(parseInt(value))
    }
  })
  return formattedValues
}

function findMax(values) {
  let max = values[0]
  values.forEach((value) => {
    if (value > max) {
      max = value
    }
  })
  return max
}

function generateLineChart(values, spacing, lineCount) {
  const newSVGElement = document.createElementNS(SVG_NAMESPACE_URI, "svg")
  const newSVGPathElement = document.createElementNS(SVG_NAMESPACE_URI, "path")
  const X_LINE = document.createElementNS(SVG_NAMESPACE_URI, "line")
  const Y_LINE = document.createElementNS(SVG_NAMESPACE_URI, "line")

  const Y_AXIS = values.length
  const highest = findMax(values)
  const WIDTH = Y_AXIS * spacing + 50 < 200 ? 200 : Y_AXIS * spacing + 50
  const HEIGHT = highest + 50 < 200 ? 200 : highest + 50
  const graphLine = highest / (lineCount - 1)

  newSVGElement.setAttribute("width", WIDTH)
  newSVGElement.setAttribute("height", HEIGHT)

  // g tags for grouping other tags
  const gElCircle = document.createElementNS(SVG_NAMESPACE_URI, "g")
  gElCircle.classList.add("graph-point")
  const gElLine = document.createElementNS(SVG_NAMESPACE_URI, "g")
  gElLine.classList.add("graph-line")
  const gElText = document.createElementNS(SVG_NAMESPACE_URI, "g")
  gElText.classList.add("graph-text")

  // X-Axis and Y-Axis for the chart
  X_LINE.setAttribute("x1", "10")
  X_LINE.setAttribute("y1", "10")
  X_LINE.setAttribute("x2", "10")
  X_LINE.setAttribute("y2", `${HEIGHT}`)

  Y_LINE.setAttribute("x1", `${WIDTH}`)
  Y_LINE.setAttribute("y1", `${HEIGHT}`)
  Y_LINE.setAttribute("x2", "10")
  Y_LINE.setAttribute("y2", `${HEIGHT}`)

  X_LINE.setAttribute("stroke", "black")
  X_LINE.setAttribute("stroke-width", "3")
  Y_LINE.setAttribute("stroke", "black")
  Y_LINE.setAttribute("stroke-width", "3")

  newSVGElement.appendChild(X_LINE)
  newSVGElement.appendChild(Y_LINE)

  let d = `M10 ${HEIGHT - values[0]}`

  values.forEach((value, idx, values) => {
    if (idx > 0) {
      let x = idx * spacing
      let y = HEIGHT - values[idx]
      let dd = ` L${x} ${y}`
      d += dd
    }
  })

  for (let l = 0; l < lineCount; l++) {
    let lineEl = document.createElementNS(SVG_NAMESPACE_URI, "line")
    let textEl = document.createElementNS(SVG_NAMESPACE_URI, "text")
    let yPosition = HEIGHT - l * graphLine

    lineEl.setAttribute("x1", "10")
    lineEl.setAttribute("y1", yPosition)
    lineEl.setAttribute("x2", WIDTH)
    lineEl.setAttribute("y2", yPosition)
    gElLine.appendChild(lineEl)

    let txt = l * graphLine
    textEl.setAttribute("dx", "-20")
    textEl.setAttribute("dy", "-2")
    textEl.setAttribute("x", `${WIDTH}`)
    textEl.setAttribute("y", yPosition)
    textEl.textContent = txt

    gElText.appendChild(textEl)
  }

  newSVGElement.appendChild(gElCircle)
  newSVGElement.appendChild(gElLine)
  newSVGElement.appendChild(gElText)

  newSVGPathElement.setAttribute("d", d)
  newSVGPathElement.setAttribute("stroke", "red")
  newSVGPathElement.setAttribute("stroke-width", "1")
  newSVGPathElement.setAttribute("fill", "none")

  newSVGElement.appendChild(newSVGPathElement)
  svgPathContainer.appendChild(newSVGElement)
}

function downloadSVGAsText() {
  const svg = document.querySelector("svg")
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  const base64doc = btoa(decodeURIComponent(encodeURIComponent(svg.outerHTML)))
  const a = document.createElement("a")
  const e = new MouseEvent("click")
  a.download = "line_chart.svg"
  a.href = "data:image/svg+xml;base64," + base64doc
  a.dispatchEvent(e)
}

function downloadSVGAsPNG(e) {
  const canvas = document.createElement("canvas")
  const svg = document.querySelector("svg")
  const base64doc = btoa(decodeURIComponent(encodeURIComponent(svg.outerHTML)))
  const w = parseInt(svg.getAttribute("width"))
  const h = parseInt(svg.getAttribute("height"))
  const img_to_download = document.createElement("img")
  img_to_download.src = "data:image/svg+xml;base64," + base64doc
  console.log(w, h)
  img_to_download.onload = function () {
    canvas.setAttribute("width", w)
    canvas.setAttribute("height", h)
    const context = canvas.getContext("2d")
    //context.clearRect(0, 0, w, h);
    context.drawImage(img_to_download, 0, 0, w, h)
    const dataURL = canvas.toDataURL("image/png")
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(canvas.msToBlob(), "line_chart.png")
      e.preventDefault()
    } else {
      const a = document.createElement("a")
      const my_evt = new MouseEvent("click")
      a.download = "line_chart.png"
      a.href = dataURL
      a.dispatchEvent(my_evt)
    }
    //canvas.parentNode.removeChild(canvas);
  }
}

formElement.addEventListener("submit", (e) => {
  e.preventDefault()
  if (input.value == "") {
    return
  }
  values = formatInput(input.value.trim())
  if (values.length < 2) {
    return
  }
  if (svgPathContainer.childElementCount >= 1) {
    svgPathContainer.removeChild(svgPathContainer.firstChild)
    generateLineChart(values, 50, 5)
  }
})

// Download Chart
downloadAsSvg.addEventListener("click", (e) => {
  downloadSVGAsText()
})

// downloadAsPng.addEventListener("click", (e) => {
//   downloadSVGAsPNG()
// })

generateLineChart(values, 50, 5)
