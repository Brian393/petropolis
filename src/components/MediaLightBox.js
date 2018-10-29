import '../assets/mediabox.css'
export default class MediaLightBox {
  constructor (url) {
    this.url = url
    this.root = document.querySelector('body')
  }
  open () {
    this.render(this.url)
    this.events()
  }
  render (embedLink) {
    var lightbox = this.template(
      '<div class="mediabox-wrap" role="dialog" aria-hidden="false"><div class="mediabox-content" role="document" tabindex="0"><span id="mediabox-esc" class="mediabox-close" aria-label="close" tabindex="1"></span><iframe src="{embed}?autoplay=1" frameborder="0" allowfullscreen></iframe></div></div>', {
        embed: embedLink
      })

    this.lastFocusElement = document.activeElement
    this.root.insertAdjacentHTML('beforeend', lightbox)
    document.body.classList.add('stop-scroll')
  }
  events () {
    var wrapper = document.querySelector('.mediabox-wrap')
    var content = document.querySelector('.mediabox-content')

    wrapper.addEventListener('click', function (e) {
      if (e.target && e.target.nodeName === 'SPAN' && e.target.className === 'mediabox-close' || e.target.nodeName === 'DIV' && e.target.className === 'mediabox-wrap' || (e.target.className === 'mediabox-content' && e.target.nodeName !== 'IFRAME')) {
        this.close(wrapper)
      }
    }.bind(this), false)

    document.addEventListener('focus', function (e) {
      if (content && !content.contains(e.target)) {
        e.stopPropagation()
        content.focus()
      }
    }, true)

    content.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
        this.close(wrapper)
      }
    }.bind(this), false)
  }
  close (el) {
    if (el === null) return true
    var timer = null

    if (timer) {
      clearTimeout(timer)
    }

    el.classList.add('mediabox-hide')

    timer = setTimeout(function () {
      var el = document.querySelector('.mediabox-wrap')
      if (el !== null) {
        document.body.classList.remove('stop-scroll')
        this.root.removeChild(el)
        this.lastFocusElement.focus()
      }
    }.bind(this), 500)
  }
  template (s, d) {
    var p

    for (p in d) {
      if (d.hasOwnProperty(p)) {
        s = s.replace(new RegExp('{' + p + '}', 'g'), d[p])
      }
    }
    return s
  }
}
