// Link preview

let opacityTimeout
let contentTimeout
const transitionDurationMs = 100

const iframe = document.getElementById('link-preview-iframe')
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
    iframe.src = event.target.href
    iframe.onload = function () {
      let tooltipContentHtml = ''
      tooltipContentHtml += '<div class="b">' + iframe.contentWindow.document.querySelector('h1').innerHTML + '</div>'
      tooltipContentHtml += iframe.contentWindow.document.querySelector('.note-contents').innerHTML

      tooltipContent.innerHTML = tooltipContentHtml

      tooltipWrapper.style.display = 'block'
      setTimeout(function () {
        tooltipWrapper.style.opacity = 1
      }, 1)
    }

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

document.querySelectorAll('.note-contents a').forEach(setupListeners)
