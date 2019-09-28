//@ts-check
(function runSimpleSliderJs() {
  //@ts-ignore
  window.createSimpleSlider = function createSimpleSlider(props) {
    const { id, imageUrls, rate, cssHeight } = props;
    // check params

    const slider = document.getElementById(id);
    const downloadedImages = [];

    let isLoadedFirst;
    const promiseLoadFirst = new Promise((res) => isLoadedFirst = res);

    if (cssHeight != null) {
      slider.style.height = cssHeight;
    }

    imageUrls.forEach((uri) => {
      const image = new Image();

      image.src = uri;
      image.onload = (data) => {
        if (isLoadedFirst) {
          isLoadedFirst();
          isLoadedFirst = null;
        }
        downloadedImages.push(image)
      };
    });

    function updateSlide() {
      clearElement(slider);
      if (downloadedImages.length) {
        const active = setActiveToNext(downloadedImages);
        slider.appendChild(active);
      }
    }

    promiseLoadFirst.then(() => {
      updateSlide();
      setInterval(updateSlide, rate);
    });
  }

  function clearElement(el) {
    const children = Array.from(el.children);
    children.forEach((child) => el.removeChild(child));
  }

  function setActiveToNext(els) {
    for (let i = els.length - 1; i >= 0; i--) {
      const child = els[i]
      const classes = child.classList.value + ' ';
      if (classes.indexOf('active ') !== -1) {
        child.classList.remove('active');
        const nextI = i === els.length - 1 ? 0 : i + 1;
        const newActive = els[nextI];
        newActive.classList.add('active');
        return newActive;
      }
    }

    const first = els[0];
    first.classList.add('active');
    return first;
  }
})();