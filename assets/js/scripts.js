// Link preview

let opacityTimeout
let contentTimeout
const transitionDurationMs = 100

const tooltipWrapper = document.getElementById('tooltip-wrapper')
const tooltipContent = document.getElementById('tooltip-content')

function hideTooltip () {
  opacityTimeout = setTimeout(function () {
    tooltipWrapper.style.opacity = 0
    contentTimeout = setTimeout(function () {
      tooltipContent.innerHTML = ''
      tooltipWrapper.style.display = 'none'
    }, transitionDurationMs + 1)
  }, transitionDurationMs)
}

function showTooltip (event) {
  const elem = event.target
  const elemProps = elem.getClientRects()[elem.getClientRects().length - 1]
  const top = window.pageYOffset || document.documentElement.scrollTop

  if (event.target.host === window.location.host) {
    window.fetch(event.target.href)
      .then(response => response.text())
      .then(data => {
        const parser = new window.DOMParser()
        const doc = parser.parseFromString(data, 'text/html')
        let tooltipContentHtml = ''
        tooltipContentHtml += '<div class="b">' + doc.querySelector('h1').innerHTML + '</div>'
        tooltipContentHtml += doc.querySelector('.note-contents').innerHTML

        tooltipContent.innerHTML = tooltipContentHtml

        tooltipWrapper.style.display = 'block'
        setTimeout(function () {
          tooltipWrapper.style.opacity = 1
        }, 1)
      })

    tooltipWrapper.style.left = elemProps.left - (tooltipWrapper.offsetWidth / 2) + (elemProps.width / 2) + 'px'
    if ((window.innerHeight - elemProps.top) < (tooltipWrapper.offsetHeight)) {
      tooltipWrapper.style.top = elemProps.top + top - tooltipWrapper.offsetHeight - 10 + 'px'
    } else if ((window.innerHeight - elemProps.top) > (tooltipWrapper.offsetHeight)) {
      tooltipWrapper.style.top = elemProps.top + top + 35 + 'px'
    }

    if ((elemProps.left + (elemProps.width / 2)) < (tooltipWrapper.offsetWidth / 2)) {
      tooltipWrapper.style.left = '10px'
    } else if ((document.body.clientWidth - elemProps.left - (elemProps.width / 2)) < (tooltipWrapper.offsetWidth / 2)) {
      tooltipWrapper.style.left = document.body.clientWidth - tooltipWrapper.offsetWidth - 20 + 'px'
    }
  }
}

function setupListeners (linkElement) {
  linkElement.addEventListener('mouseleave', function (_event) {
    hideTooltip()
  })

  tooltipWrapper.addEventListener('mouseleave', function (_event) {
    hideTooltip()
  })

  linkElement.addEventListener('mouseenter', function (event) {
    clearTimeout(opacityTimeout)
    clearTimeout(contentTimeout)
    showTooltip(event)
  })

  tooltipWrapper.addEventListener('mouseenter', function (event) {
    clearTimeout(opacityTimeout)
    clearTimeout(contentTimeout)
  })
}

document.querySelectorAll('#notes-entry-container a').forEach(setupListeners)

// Notes graph

const d3 = window.d3

if (typeof window.graphData !== 'undefined') {
  const MINIMAL_NODE_SIZE = 10
  const MAX_NODE_SIZE = 12
  const ACTIVE_RADIUS_FACTOR = 1.5
  const STROKE = 1
  const FONT_SIZE = 12
  const TICKS = 200
  const FONT_BASELINE = 40
  const MAX_LABEL_LENGTH = 50

  const nodesData = window.graphData.nodes
  const linksData = window.graphData.edges

  const nodeSize = {}

  const updateNodeSize = () => {
    nodesData.forEach((el) => {
      let weight =
          3 *
          Math.sqrt(
            linksData.filter((l) => l.source === el.id || l.target === el.id)
              .length + 1
          )
      if (weight < MINIMAL_NODE_SIZE) {
        weight = MINIMAL_NODE_SIZE
      } else if (weight > MAX_NODE_SIZE) {
        weight = MAX_NODE_SIZE
      }
      nodeSize[el.id] = weight
    })
  }

  const onClick = (d) => {
    window.location = d3.select(d.target).data()[0].path
  }

  const onMouseover = function (d) {
    const relatedNodesSet = new Set()
    const destinationID = d3.select(d.target).data()[0].id
    linksData
      .filter((n) => n.target.id === destinationID || n.source.id === destinationID)
      .forEach((n) => {
        relatedNodesSet.add(n.target.id)
        relatedNodesSet.add(n.source.id)
      })
    node.attr('class', (nodeD) => {
      if (nodeD.id !== destinationID && !relatedNodesSet.has(nodeD.id)) {
        return 'inactive'
      }
      return ''
    })

    link.attr('class', (linkD) => {
      if (linkD.source.id !== destinationID && linkD.target.id !== destinationID) {
        return 'inactive'
      }
      return ''
    })

    link.attr('stroke-width', (linkD) => {
      if (linkD.source.id === destinationID || linkD.target.id === destinationID) {
        return STROKE * 2
      }
      return STROKE
    })
    text.attr('class', (textD) => {
      if (textD.id !== destinationID && !relatedNodesSet.has(textD.id)) {
        return 'inactive'
      }
      return ''
    })
  }

  const onMouseout = function (d) {
    node.attr('class', '')
    link.attr('class', '')
    text.attr('class', '')
    link.attr('stroke-width', STROKE)
  }

  const graphWrapper = document.getElementById('graph-wrapper')
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  element.setAttribute('width', graphWrapper.getBoundingClientRect().width)
  element.setAttribute('height', window.innerHeight * 0.8)
  element.classList.add('absolute', 'vh-100')
  graphWrapper.appendChild(element)

  const reportWindowSize = () => {
    element.setAttribute('width', window.innerWidth)
    element.setAttribute('height', window.innerHeight)
  }

  window.onresize = reportWindowSize

  const svg = d3.select('svg')
  const width = Number(svg.attr('width'))
  const height = Number(svg.attr('height'))
  let zoomLevel = 1

  const simulation = d3
    .forceSimulation(nodesData)
    .force('forceX', d3.forceX().x(width / 2))
    .force('forceY', d3.forceY().y(height / 2))
    .force('charge', d3.forceManyBody())
    .force(
      'link',
      d3
        .forceLink(linksData)
        .id((d) => d.id)
        .distance(100)
    )
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(80))
    .stop()

  const g = svg.append('g')
  let link = g.append('g').attr('class', 'links').selectAll('.link')
  let node = g.append('g').attr('class', 'nodes').selectAll('.node')
  let text = g.append('g').attr('class', 'text').selectAll('.text')

  const resize = (event) => {
    if (event) {
      const scale = event.transform
      zoomLevel = scale.k
      g.attr('transform', scale)
    }

    const zoomOrKeep = (value) => (zoomLevel >= 1 ? value / zoomLevel : value)

    const font = Math.max(Math.round(zoomOrKeep(FONT_SIZE)), 1)

    text.attr('font-size', (d) => font)
    link.attr('stroke-width', zoomOrKeep(STROKE))
    node.attr('r', (d) => {
      return zoomOrKeep(nodeSize[d.id])
    })
    svg
      .selectAll('circle')
      .filter((_d, i, nodes) => d3.select(nodes[i]).attr('active'))
      .attr('r', (d) => zoomOrKeep(ACTIVE_RADIUS_FACTOR * nodeSize[d.id]))

    document.getElementById('zoom').innerHTML = zoomLevel.toFixed(2)
  }

  const ticked = () => {
    node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
    text
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y - (FONT_BASELINE - nodeSize[d.id]) / zoomLevel)
    link
      .attr('d', (d) => {
        const dx = d.target.x - d.source.x
        const dy = d.target.y - d.source.y
        const dr = Math.sqrt(dx * dx + dy * dy)
        return 'M' +
            d.source.x + ',' +
            d.source.y + 'A' +
            dr + ',' + dr + ' 0 0,1 ' +
            d.target.x + ',' +
            d.target.y
      })
  }

  const restart = () => {
    updateNodeSize()
    node = node.data(nodesData, (d) => d.id)
    node.exit().remove()
    node = node
      .enter()
      .append('circle')
      .attr('r', (d) => {
        return nodeSize[d.id]
      })
      .on('click', onClick)
      .on('mouseover', onMouseover)
      .on('mouseout', onMouseout)
      .merge(node)

    link = link.data(linksData, (d) => `${d.source.id}-${d.target.id}`)
    link.exit().remove()
    link = link.enter().append('path').attr('stroke-width', STROKE).merge(link)

    text = text.data(nodesData, (d) => d.label)
    text.exit().remove()
    text = text
      .enter()
      .append('text')
      .text((d) => shorten(d.label.replace(/_*/g, ''), MAX_LABEL_LENGTH))
      .attr('font-size', `${FONT_SIZE}px`)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'central')
      .on('click', onClick)
      .on('mouseover', onMouseover)
      .on('mouseout', onMouseout)
      .merge(text)

    node.attr('active', (d) => isCurrentPath(d.path) ? true : null)
    text.attr('active', (d) => isCurrentPath(d.path) ? true : null)

    simulation.nodes(nodesData)
    simulation.force('link').links(linksData)
    simulation.alpha(1).restart()
    simulation.stop()

    for (let i = 0; i < TICKS; i++) {
      simulation.tick()
    }

    ticked()
  }

  const zoomHandler = d3.zoom().scaleExtent([0.2, 3]).on('zoom', resize)

  zoomHandler(svg)
  restart()

  function isCurrentPath (notePath) {
    return window.location.pathname.includes(notePath)
  }

  function shorten (str, maxLen, separator = ' ') {
    if (str.length <= maxLen) return str
    return str.substr(0, str.lastIndexOf(separator, maxLen)) + '...'
  }
}
