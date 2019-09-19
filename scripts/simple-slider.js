//@ts-check
(function runSimpleSlider() {
  //@ts-ignore
  window.createSimpleSlider = function createSimpleSlider(props) {
    const { id, imageUrls, rate, height } = props;
    // check params

    const slider = document.getElementById(id);
    const downloadedImages = [];

    if (height != null) {
      slider.style.height = `${height}px`;
    }

    imageUrls.forEach((uri) => {
      const image = new Image();

      image.src = uri;
      image.onload = (data) => downloadedImages.push(image);
    });

    setInterval(() => {
      clearElement(slider);
      if (downloadedImages.length) {
        const active = setActiveToNext(downloadedImages);
        slider.appendChild(active);
      }
    }, rate);
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