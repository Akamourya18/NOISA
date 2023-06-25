/* Props and Attributes */

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
}; // CSS properties to be injected into the page

var data = {
  backgroundImage: 'data-background-image',
  image: 'data-image',
  svg: 'data-dur',
  video: 'data-playing',
  brochure: {
    videoSrc: 'data-video-src',
  },
}; // Data attributes

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
}; // Selectors used in the script

var strings = {
  clickIconRequest: 'iconClick',
  gifExtension: '.gif',
  localStorageItem: 'allowAnimation',
  notice: {
    resume: 'NOISA PAUSED',
    pause: 'NOISA ACTIVATED',
  },
  setIconRequest: 'setIcon',
}; // Strings used in the script

var getSelector = (cssRule) => {
  return cssRule.cssText.substr(0, cssRule.cssText.indexOf('{')).trim();
}; // Get the selector from a CSS rule object (e.g. CSSStyleRule)

var hasAnimatedImage = (cssRule) => {
  return cssRule.cssText.indexOf(strings.gifExtension) > -1 ||
    cssRule.cssText.indexOf(strings.weebpExtension) > -1
    ? true
    : false;
}; // Check if a CSS rule object has an animated image

/* main functions */
var removeBackGroundImage = (selector, document, window) => {
  try {
    var backgroundImageElements = document.querySelectorAll(selector); 

    for (var element of Array.from(backgroundImageElements)) {
      if (!element.hasAttribute(data.backgroundImage)) {
        element.setAttribute( 
          data.backgroundImage,
          window.getComputedStyle(element).backgroundImage // Store the background image in a data attribute
        );
        element.style.backgroundImage = 'none';
      }
    }
  } catch (e) {}
};

var backgroundImage = {
  resume(document) {
    var backgroundImageElements = document.querySelectorAll(
      `[${data.backgroundImage}]` // Get all elements with the data attribute
    );

    for (var backgroundImage of Array.from(backgroundImageElements)) {
      backgroundImage.style.backgroundImage = backgroundImage.getAttribute(
        data.backgroundImage // Restore the background image by getting the attribute value
      );
      backgroundImage.removeAttribute(data.backgroundImage);
    }
  }, // Resume the animation by restoring the background image
  pause(document, window) {
    var styleSheets = document.styleSheets;
    let cssRules = null;

    for (var styleSheet of Array.from(styleSheets)) {
      try {
        if (styleSheet.cssRules) {
          cssRules = styleSheet.cssRules; // Get the CSS rules from the stylesheet

          for (var cssRule of Array.from(cssRules)) {
            if (hasAnimatedImage(cssRule)) { // Check if the CSS rule has an animated image
              if (cssRule.type === 1) {
                removeBackGroundImage(getSelector(cssRule), document, window); // Remove the background image from the selector
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
  }, // Pause the animation by removing the background image
};

var css = {
  resume(document) {
    if (document.getElementById(selectors.styleElem) != null) {
      document.body.removeChild(document.getElementById(selectors.styleElem)); // Remove the CSS properties from the page
    }
  },
  pause(document) {
    if (document.getElementById(selectors.styleElem) != null) {
      return;
    }

    var styleElem = document.createElement('style');

    styleElem.id = selectors.styleElem;
    styleElem.textContent = `${cssProps.selectors}{${cssProps.pause}}`; // Inject the CSS properties into the page

    document.body.appendChild(styleElem);
  },
}; // CSS animation functions to resume and pause

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
        continue; // Skip if the image is already paused
      }

      imageCanvas = document.createElement('canvas'); // Create a canvas element to draw the image on
      imagePlaceholder = document.createElement('div'); // Create a placeholder element to replace the image with
      imageWidth = thisImage.width || window.getComputedStyle(thisImage).width; // Get the image width
      imageHeight =
        thisImage.height || window.getComputedStyle(thisImage).height;

      if (thisImage.id) {
        imagePlaceholder.id = thisImage.id; // Set the id of the placeholder to the id of the image
      }

      if (thisImage.getAttribute('class') != null) {
        imagePlaceholder.setAttribute('class', thisImage.getAttribute('class')); // Set the class of the placeholder to the class of the image
      }

      if (thisImage.getAttribute('alt') != null) {
        imagePlaceholder.setAttribute('alt', thisImage.getAttribute('alt')); // Set the alt of the placeholder to the alt of the image
      }

      imagePlaceholder.setAttribute(data.image, i); // Set the data attribute of the placeholder to the index of the image
      imagePlaceholder.setAttribute('role', 'img'); // Set the role of the placeholder to img

      imageCanvas.width = imageWidth; // Set the width and height of the canvas to the width and height of the image
      imageCanvas.height = imageHeight; // This is required to prevent the image from being stretched
      imageCanvas
        .getContext('2d') 
        .drawImage(thisImage, 0, 0, imageWidth, imageHeight); // Draw the image on the canvas to prevent it from being animated 

      thisImage.parentNode.insertBefore( // Insert the placeholder before the image
        imagePlaceholder, // The placeholder
        thisImage.nextSibling // The image  
      ); 
      imagePlaceholder.appendChild(imageCanvas); // Append the canvas to the placeholder

      thisImage.style.display = 'none';  // Hide the image
      thisImage.setAttribute('aria-hidden', true);  // Hide the image from screen readers

      i++;
    }
  },
}; // Image attributes and functions to inject upon

var svg = {
  resume(document) {
    var svgElements = document.querySelectorAll(selectors.svgAnimateElem); // Get all the SVG elements

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
      svg.setAttribute(data.svg, svg.getAttribute(selectors.svgDurationAttr)); // Set the duration attribute to the data attribute
      svg.removeAttribute(selectors.svgDurationAttr); 
    }
  },
}; // SVG animation functions to resume and pause

var playing = (e) => {
  e.target.setAttribute(data.video, true);
}; // Set the video to playing when it starts

var video = {
  resume(document) {
    var videoElements = document.getElementsByTagName(selectors.videoElem);

    for (var video of Array.from(videoElements)) {
      if (video.hasAttribute(data.video) || video.hasAttribute('autoplay')) {
        video.play(); // Play the video if it is playing or has autoplay enabled
      }
    }
  },
  pause(document) {
    var videoElements = document.getElementsByTagName(selectors.videoElem);

    for (var video of Array.from(videoElements)) {
      video.pause(); // Pause the video if it is playing or has autoplay enabled
    }
  },
  init() {
    var videoElements = document.getElementsByTagName(selectors.videoElem); // Add the playing event listener to all video elements

    for (var video of Array.from(videoElements)) {
      video.addEventListener('playing', playing); /// Set the video to playing when it starts
    }
  },
}; // Video attributes and functions to inject upon

video.init(); // Initialize the video event listeners

var showNotification = (notice) => {
  var notificationElem = document.createElement('div'),
    currentNotification = document.getElementById(selectors.notificationId); // Remove the current notification if it exists

  if (currentNotification != null) {
    currentNotification.remove();
  }

  // Create the notification element and append it to the body
  notificationElem.id = selectors.notificationId;
  notificationElem.setAttribute('style', cssProps.notification);
  notificationElem.setAttribute('aria-live', 'polite');
  notificationElem.setAttribute('aria-atomic', true);
  notificationElem.setAttribute('role', 'status');

  document.body.appendChild(notificationElem);

  // Set the notification text and position it
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
}; // Show a notification to the user when the animation is toggled

var updateFrames = (fn, type) => {
  var frames = document.getElementsByTagName(selectors.iframeElem);

  for (var el of Array.from(frames)) {
    try {
      fn(type === 'document' ? el.contentDocument : el.contentWindow);
    } catch (e) {}
  }
}; // Update the animation for all iframes

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
      toggleAnimation(); // Toggle the animation based on the localStorage value
    }

    if (!chrome.runtime.onMessage.hasListener(clickListener)) {
      chrome.runtime.onMessage.addListener(clickListener);
    } // Add the click listener if it doesn't exist
  }; 

  var clickListener = (request) => {
    if (request[strings.clickIconRequest]) {
      if (allowAnimation == null || allowAnimation) {
        showNotification(strings.notice.pause);
      } else {
        showNotification(strings.notice.resume);
      }
    }

    chrome.runtime.onMessage.removeListener(clickListener); // Remove the click listener
  };

  var toggleAnimation = () => {
    if (allowAnimation) {

      backgroundImage.resume(document); 
      updateFrames(backgroundImage.resume, 'document'); // Update the animation for all iframes

      css.resume(document); 
      updateFrames(css.resume, 'document'); /// Update the animation for all css elements

      image.resume(document)
      updateFrames(image.resume, 'document'); // Update the animation for all image elements
 
      svg.resume(document);
      updateFrames(svg.resume, 'document'); // Update the animation for all svg elements

      video.resume(document);
      updateFrames(video.resume, 'document'); // Update the animation for all video elements
    } else {
      backgroundImage.pause(document, window);
      updateFrames(backgroundImage.pause, 'document'); // Pause the animation for all iframes

      css.pause(document);
      updateFrames(css.pause, 'document'); // Pause the animation for all css elements

      image.pause(document, window);
      updateFrames(image.pause, 'document'); // Pause the animation for all image elements

      svg.pause(document);
      updateFrames(svg.pause, 'document'); // Pause the animation for all svg elements

      video.pause(document);
      updateFrames(video.pause, 'document'); // Pause the animation for all video elements
    }
  };

  init();
})(window, document); // Initialize the extension
