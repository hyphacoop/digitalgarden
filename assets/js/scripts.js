// Header interaction

const headerEle = document.querySelector('#header')
let headerElePosStore = 0

const debounce = (fn) => {
  let frame
  return (...params) => {
    if (frame) {
      window.cancelAnimationFrame(frame)
    }
    frame = window.requestAnimationFrame(() => {
      fn(...params)
    })
  }
}

const storeScroll = (event) => {
  const bodyRect = document.body.getBoundingClientRect()
  if (bodyRect.top < headerElePosStore &&
    -headerEle.offsetHeight > bodyRect.top) {
    headerEle.classList.add('header-inactive')
  } else {
    headerEle.classList.remove('header-inactive')
  }
  headerElePosStore = bodyRect.top
}

document.addEventListener('scroll', debounce(storeScroll), { passive: true })

// Link preview

let opacityTimeout
let contentTimeout
const transitionDurationMs = 100

const tooltipWrapper = document.getElementById('tooltip-wrapper')
const tooltipContent = document.getElementById('tooltip-content')
const tooltipSource = document.getElementById('tooltip-source')

const hideTooltip = () => {
  opacityTimeout = setTimeout(() => {
    tooltipWrapper.style.opacity = 0
    contentTimeout = setTimeout(() => {
      tooltipContent.innerHTML = ''
      tooltipWrapper.style.display = 'none'
    }, transitionDurationMs + 1)
  }, transitionDurationMs)
}

const showTooltip = (event) => {
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

        const pathIndex = event.target.href.split('/')
        tooltipSource.innerHTML = `/${pathIndex[pathIndex.length - 1]}`

        tooltipWrapper.style.display = 'block'
        setTimeout(() => {
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

const setupListeners = (linkElement) => {
  linkElement.addEventListener('mouseleave', _event => {
    hideTooltip()
  })

  tooltipWrapper.addEventListener('mouseleave', _event => {
    hideTooltip()
  })

  linkElement.addEventListener('mouseenter', event => {
    clearTimeout(opacityTimeout)
    clearTimeout(contentTimeout)
    showTooltip(event)
  })

  tooltipWrapper.addEventListener('mouseenter', event => {
    clearTimeout(opacityTimeout)
    clearTimeout(contentTimeout)
  })
}

document.querySelectorAll('#notes-entry-container a').forEach(setupListeners)

// Random note index

if (typeof window.graphDataIndex !== 'undefined') {
  const indexNodes = window.graphDataIndex.nodes
  const randomNode = indexNodes[Math.floor(Math.random() * indexNodes.length)]
  let counter = 0

  setInterval(() => {
    counter += 1
    document.querySelector('.loading').innerHTML += '.'
    if (counter === 4) {
      document.querySelector('.loading').innerHTML = 'Loading a note'
      counter = 0
    }
  }, 500)

  setInterval(() => {
    const randomNodeLoader = indexNodes[Math.floor(Math.random() * indexNodes.length)]
    const randomNodeTemplate = `<p class="ma0">${randomNodeLoader.path}</p>`
    document.querySelector('.rand-notes').innerHTML += randomNodeTemplate
    if (counter === 3) {
      document.querySelector('.rand-notes').innerHTML = ''
    }
  }, 250)

  setTimeout(() => {
    window.location = randomNode.path
  }, 1500)
}

// Notes graph

const d3 = window.d3

if (typeof window.graphData !== 'undefined') {
  const MINIMAL_NODE_SIZE = 10
  const MAX_NODE_SIZE = 12
  const STROKE = 1
  const FONT_SIZE = 12
  const TICKS = 200
  const FONT_BASELINE = 35
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

  const onMouseover = (d) => {
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
      return 'active'
    })

    link.attr('stroke-width', (linkD) => {
      if (linkD.source.id === destinationID || linkD.target.id === destinationID) {
        return STROKE * 1
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

  const onMouseout = (d) => {
    node.attr('class', '')
    link.attr('class', '')
    text.attr('class', '')
    link.attr('stroke-width', STROKE)
  }

  const graphWrapper = document.getElementById('graph-wrapper')
  const element = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  element.setAttribute('width', graphWrapper.getBoundingClientRect().width)
  element.setAttribute('height', window.innerHeight)
  element.classList.add('grab', 'grabbing')
  graphWrapper.appendChild(element)

  const reportWindowSize = () => {
    element.setAttribute('width', window.innerWidth)
    element.setAttribute('height', window.innerHeight)
  }

  window.onresize = reportWindowSize

  const svg = d3.select('svg')
  const width = Number(svg.attr('width'))
  const height = Number(svg.attr('height'))

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
      if (!activeNode.empty()) {
        const newX = parseFloat(activeNode.attr('cx')) - scale.x
        const newY = parseFloat(activeNode.attr('cy')) - scale.y
        g.attr('transform', 'translate(' + (width / 2 - newX) + ',' + (height / 2 - newY) + ')')
      } else {
        g.attr('transform', scale)
      }
    }
  }

  const ticked = () => {
    node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
    text
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y - (FONT_BASELINE - nodeSize[d.id]))
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

  const zoomHandler = d3.zoom().scaleExtent([1, 1]).on('zoom', resize)

  zoomHandler(svg)
  restart()

  const activeNode = svg.select('circle[active]')

  if (!activeNode.empty()) {
    const centerNode = (xx, yy) => {
      g.attr('transform', 'translate(' + (width / 2 - xx) + ',' + (height / 2 - yy) + ')')
    }

    centerNode(activeNode.attr('cx'), activeNode.attr('cy'))
  }

  function isCurrentPath (notePath) {
    return window.location.pathname === notePath
  }

  function shorten (str, maxLen, separator = ' ') {
    if (str.length <= maxLen) return str
    return str.substr(0, str.lastIndexOf(separator, maxLen)) + '...'
  }
}

// Note expander

const noteExpander = document.querySelector('#note-expand')
const noteContainer = document.querySelector('#note-container')

if (noteExpander) {
  if (window.localStorage.getItem('noteExpanded') === 'true') {
    noteExpander.classList.add('rotate-180')
    noteContainer.classList.add('w-two-thirds')
  }
  noteExpander.addEventListener('click', (event) => {
    noteContainer.classList.toggle('w-two-thirds')
    event.target.classList.toggle('rotate-180')
    if (window.localStorage.getItem('noteExpanded') === 'true') {
      window.localStorage.setItem('noteExpanded', 'false')
    } else {
      window.localStorage.setItem('noteExpanded', 'true')
    }
  })
}
