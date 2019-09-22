//@ts-check
(function runSwipeSliderJs() {
  // @ts-ignore
  window.createSwipeSlider = function createSwipeSlider(props) {
    const { id, toLeftId, toRightId } = props;
    const slider = document.getElementById(id);
    const slides = Array.from(slider.children);
    const lastSlideN = slides.length - 1;
    let currentSlideN = 0;

    const remove = onHorizontalSwipe(slider, (isToNext) => {
      currentSlideN = getNextN(currentSlideN, lastSlideN, isToNext)

      slides.forEach((slide) => {
        if (!(slide instanceof HTMLElement)) {
          return;
        }
        slide.style.transform = `translateX(-${currentSlideN}00%)`;
      });
    });

    function setButtons() {
      const toLeft = document.getElementById(toLeftId);
      const toRight = document.getElementById(toRightId);

      function toNext() {
        currentSlideN = getNextN(currentSlideN, lastSlideN, true);
        setTranform();
      }

      function toLast() {
        currentSlideN = getNextN(currentSlideN, lastSlideN, false);
        setTranform();
      }

      toLeft.addEventListener('click', toLast);
      toRight.addEventListener('click', toNext);

      return function remove() {
        toLeft.removeEventListener('click', toLast);
        toRight.removeEventListener('click', toNext);
      }
    }

    function setTranform() {
      slides.forEach((slide) => {
        if (!(slide instanceof HTMLElement)) {
          return;
        }
        slide.style.transform = `translateX(-${currentSlideN}00%)`;
      });
    }

    const removeButtons = setButtons();

    return function clearSliderFeatures() {
      remove();
      removeButtons();
      currentSlideN = 0;
      setTranform();
    }
  }

  function getNextN(cur, max, isToNext) {
    const sum = cur + (isToNext ? 1 : -1);
    if (sum > max) return 0;
    if (sum < 0) return max;
    return sum;
  }

  function onHorizontalSwipe(el, cb) {
    let touchstartX;

    function onStart(e) {
      const touch = e.changedTouches[0];
      touchstartX = touch.screenX;
    }

    function onEnd(e) {
      const touch = e.changedTouches[0];
      const touchendX = touch.screenX;
      const diff = touchendX - touchstartX;

      if (Math.abs(diff) > 100) {
        cb(diff < 0);
      }
    }

    el.addEventListener('touchstart', onStart);
    el.addEventListener('touchend', onEnd);

    function remove() {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
    }

    return remove;
  }
})();