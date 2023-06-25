var cssProps = {
  pause: [
    '-webkit-animation: none !important;',
    '-moz-animation: none !important;',
    '-ms-animation: none !important;',
    '-o-animation: none !important;',
    'animation: none !important;',
    '-webkit-transition: none !important;',
    '-moz-transition: none !important;',
    '-ms-transition: none !important;',
    '-o-transition: none !important;',
    'transition: none !important;',
    '-webkit-transform: none !important;',
    '-moz-transform: none !important;',
    '-ms-transform: none !important;',
    '-o-transform: none !important;',
    'transform: none !important;',
  ].join(''),
  notification: [
    'background-color: #89ce00 ;',
    'border-radius: 100px;',
    'border: solid #5ba300 2px;',
    'box-shadow: 0 4px 8px rgba(0,0,0,0.5);',
    'color: black;',
    'font-size: 12px;',
    'font-weight: 700;',
    'left: 81.5%;',
    'margin-left: -50%;',
    'padding: 5px 10px;',
    'position: fixed;',
    'text-align: center;',
    'top: 10px;',
    'z-index: 99999;',
    'opacity: 0;',
  ].join(''),
  selectors: ['* + *,', ':before,', ':after,', 'body :not(g)'].join(''),
  svg: ['fill: #222;', 'position: relative;', 'top: 3px;'].join(''),
};

var data = {
  backgroundImage: 'data-background-image',
  image: 'data-image',
  svg: 'data-dur',
  video: 'data-playing',
  brochure: {
    videoSrc: 'data-video-src',
  },
};

var selectors = {
  iframeElem: 'iframe',
  imageElem: [
    'img[src*=".gif"],',
    'img[src*=".webp"],',
    'img[srcset*=".gif"],',
    'img[srcset*=".webp"]',
  ].join(''),
  notificationId: 'toggle-animation-notification',
  spec: {
    cssBackgroundImage: '.animated-background-image',
    originalBackgroundImage: 'img[src$="cat.gif"]',
    originalImage: 'img[src$="cat.gif"]',
    placeholderCanvas: 'img[src$="cat.gif"] ~ div > canvas',
    placeholderDiv: 'img[src$="cat.gif"] ~ div',
    togglerBtn: 'toggler',
    togglerLink: 'toggler-bookmarklet',
    video: '.video-example video',
  },
  styleElem: 'pause-animation',
  svgAnimateElem: ['animate,', 'animateMotion'].join(''),
  svgDurationAttr: 'dur',
  videoElem: 'video',
  brochure: {
    htmlBody: 'html, body',
    navLink: '.header__nav-link',
    demos: '#demos',
    toggler: '#toggler',
    togglerBookmarklet: '#toggler-bookmarklet',
    togglerFixed: '#toggler-fixed',
    togglerContainer: '#toggler-container',
    videoPlayer: '#video-player',
    sourceElem: 'source',
    section: '.section',
    btns: '[role="button"]',
  },
};

var strings = {
  clickIconRequest: 'iconClick',
  gifExtension: '.gif',
  localStorageItem: 'allowAnimation',
  notice: {
    resume: 'NOISA PAUSED',
    pause: 'NOISA ACTIVATED',
  },
  setIconRequest: 'setIcon',
};

var getSelector = (cssRule) => {
  return cssRule.cssText.substr(0, cssRule.cssText.indexOf('{')).trim();
};

var hasAnimatedImage = (cssRule) => {
  return cssRule.cssText.indexOf(strings.gifExtension) > -1 ||
    cssRule.cssText.indexOf(strings.weebpExtension) > -1
    ? true
    : false;
};

var removeBackGroundImage = (selector, document, window) => {
  try {
    var backgroundImageElements = document.querySelectorAll(selector);

    for (var element of Array.from(backgroundImageElements)) {
      if (!element.hasAttribute(data.backgroundImage)) {
        element.setAttribute(
          data.backgroundImage,
          window.getComputedStyle(element).backgroundImage
        );
        element.style.backgroundImage = 'none';
      }
    }
  } catch (e) {}
};

var backgroundImage = {
  resume(document) {
    var backgroundImageElements = document.querySelectorAll(
      `[${data.backgroundImage}]`
    );

    for (var backgroundImage of Array.from(backgroundImageElements)) {
      backgroundImage.style.backgroundImage = backgroundImage.getAttribute(
        data.backgroundImage
      );
      backgroundImage.removeAttribute(data.backgroundImage);
    }
  },
  pause(document, window) {
    var styleSheets = document.styleSheets;
    let cssRules = null;

    for (var styleSheet of Array.from(styleSheets)) {
      try {
        if (styleSheet.cssRules) {
          cssRules = styleSheet.cssRules;

          for (var cssRule of Array.from(cssRules)) {
            if (hasAnimatedImage(cssRule)) {
              if (cssRule.type === 1) {
                removeBackGroundImage(getSelector(cssRule), document, window);
              } else if (cssRule.type === 4) {
                for (var cssRule of Array.from(cssRule.cssRules)) {
                  removeBackGroundImage(getSelector(cssRule), document, window);
                }
              }
            }
          }
        }
      } catch (e) {}
    }
  },
};

var css = {
  resume(document) {
    if (document.getElementById(selectors.styleElem) != null) {
      document.body.removeChild(document.getElementById(selectors.styleElem));
    }
  },
  pause(document) {
    if (document.getElementById(selectors.styleElem) != null) {
      return;
    }

    var styleElem = document.createElement('style');

    styleElem.id = selectors.styleElem;
    styleElem.textContent = `${cssProps.selectors}{${cssProps.pause}}`;

    document.body.appendChild(styleElem);
  },
};

var image = {
  resume(document) {
    var images = document.querySelectorAll(selectors.imageElem);
    let i = 0;

    for (var thisImage of Array.from(images)) {
      if (document.querySelector(`[${data.image}="${i}"]`) != null) {
        document.querySelector(`[${data.image}="${i}"]`).remove();
        thisImage.style.display = 'block';
        thisImage.setAttribute('aria-hidden', false);
        i++;
      }
    }
  },
  pause(document, window) {
    var images = document.querySelectorAll(selectors.imageElem);

    let imageCanvas = null,
      imagePlaceholder = null,
      imageWidth = 0,
      imageHeight = 0,
      i = 0;

    for (var thisImage of Array.from(images)) {
      if (document.querySelector(`[${data.image}="${i}"]`) != null) {
        continue;
      }

      imageCanvas = document.createElement('canvas');
      imagePlaceholder = document.createElement('div');
      imageWidth = thisImage.width || window.getComputedStyle(thisImage).width;
      imageHeight =
        thisImage.height || window.getComputedStyle(thisImage).height;

      if (thisImage.id) {
        imagePlaceholder.id = thisImage.id;
      }

      if (thisImage.getAttribute('class') != null) {
        imagePlaceholder.setAttribute('class', thisImage.getAttribute('class'));
      }

      if (thisImage.getAttribute('alt') != null) {
        imagePlaceholder.setAttribute('alt', thisImage.getAttribute('alt'));
      }

      imagePlaceholder.setAttribute(data.image, i);
      imagePlaceholder.setAttribute('role', 'img');

      imageCanvas.width = imageWidth;
      imageCanvas.height = imageHeight;
      imageCanvas
        .getContext('2d')
        .drawImage(thisImage, 0, 0, imageWidth, imageHeight);

      thisImage.parentNode.insertBefore(
        imagePlaceholder,
        thisImage.nextSibling
      );
      imagePlaceholder.appendChild(imageCanvas);

      thisImage.style.display = 'none';
      thisImage.setAttribute('aria-hidden', true);

      i++;
    }
  },
};

var svg = {
  resume(document) {
    var svgElements = document.querySelectorAll(selectors.svgAnimateElem);

    for (var svg of Array.from(svgElements)) {
      if (svg.getAttribute(data.svg)) {
        svg.setAttribute(selectors.svgDurationAttr, svg.getAttribute(data.svg));
        svg.removeAttribute(data.svg);
      }
    }
  },
  pause(document) {
    var svgElements = document.querySelectorAll(selectors.svgAnimateElem);

    for (var svg of Array.from(svgElements)) {
      svg.setAttribute(data.svg, svg.getAttribute(selectors.svgDurationAttr));
      svg.removeAttribute(selectors.svgDurationAttr);
    }
  },
};

var playing = (e) => {
  e.target.setAttribute(data.video, true);
};

var video = {
  resume(document) {
    var videoElements = document.getElementsByTagName(selectors.videoElem);

    for (var video of Array.from(videoElements)) {
      if (video.hasAttribute(data.video) || video.hasAttribute('autoplay')) {
        video.play();
      }
    }
  },
  pause(document) {
    var videoElements = document.getElementsByTagName(selectors.videoElem);

    for (var video of Array.from(videoElements)) {
      video.pause();
    }
  },
  init() {
    var videoElements = document.getElementsByTagName(selectors.videoElem);

    for (var video of Array.from(videoElements)) {
      video.addEventListener('playing', playing);
    }
  },
};

video.init();

var showNotification = (notice) => {
  var notificationElem = document.createElement('div'),
    currentNotification = document.getElementById(selectors.notificationId);

  if (currentNotification != null) {
    currentNotification.remove();
  }

  notificationElem.id = selectors.notificationId;
  notificationElem.setAttribute('style', cssProps.notification);
  notificationElem.setAttribute('aria-live', 'polite');
  notificationElem.setAttribute('aria-atomic', true);
  notificationElem.setAttribute('role', 'status');

  document.body.appendChild(notificationElem);

  window.setTimeout(() => {
    notificationElem.innerHTML = `${notice}`;
    notificationElem.style.marginLeft = `-${
      notificationElem.offsetWidth / 2
    }px`;
    notificationElem.style.opacity = 1;
  }, 200);

  window.setTimeout(() => {
    notificationElem.remove();
  }, 3000);
};

var updateFrames = (fn, type) => {
  var frames = document.getElementsByTagName(selectors.iframeElem);

  for (var el of Array.from(frames)) {
    try {
      fn(type === 'document' ? el.contentDocument : el.contentWindow);
    } catch (e) {}
  }
};

((window, document) => {
  let allowAnimation = null;

  var init = () => {
    if (localStorage.getItem(strings.localStorageItem) != null) {
      chrome.runtime.sendMessage({
        [strings.setIconRequest]: localStorage.getItem(
          strings.localStorageItem
        ),
      });
      allowAnimation =
        localStorage.getItem(strings.localStorageItem) === 'true'
          ? true
          : false;
      toggleAnimation();
    }

    if (!chrome.runtime.onMessage.hasListener(clickListener)) {
      chrome.runtime.onMessage.addListener(clickListener);
    }
  };

  var clickListener = (request) => {
    if (request[strings.clickIconRequest]) {
      if (allowAnimation == null || allowAnimation) {
        showNotification(strings.notice.pause);
      } else {
        showNotification(strings.notice.resume);
      }
    }

    chrome.runtime.onMessage.removeListener(clickListener);
  };

  var toggleAnimation = () => {
    if (allowAnimation) {
      backgroundImage.resume(document);
      updateFrames(backgroundImage.resume, 'document');

      css.resume(document);
      updateFrames(css.resume, 'document');

      image.resume(document);
      updateFrames(image.resume, 'document');

      svg.resume(document);
      updateFrames(svg.resume, 'document');

      video.resume(document);
      updateFrames(video.resume, 'document');
    } else {
      backgroundImage.pause(document, window);
      updateFrames(backgroundImage.pause, 'document');

      css.pause(document);
      updateFrames(css.pause, 'document');

      image.pause(document, window);
      updateFrames(image.pause, 'document');

      svg.pause(document);
      updateFrames(svg.pause, 'document');

      video.pause(document);
      updateFrames(video.pause, 'document');
    }
  };

  init();
})(window, document);
