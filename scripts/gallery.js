//@ts-check
(function runGalleryJs() {
  class ImageLoader {
    constructor(buffersize, maxAttempts) {
      this.queue = [];
      this.buffersize = buffersize || 5;
      this.maxAttempts = maxAttempts || 3;
    }

    addToQueue(url, importance=0, img, attempts=0) {
      const queueEl = { img, url, importance };
      const { queue, maxAttempts } = this;
      const that = this;

      img.addEventListener('error', function onerror(err) {
        img.removeEventListener('error', onerror);
        that._removeFromQueue(img);

        if (attempts >= maxAttempts - 1) {
          console.log(`Image ${url} couldn't be loaded.`);
        } else {
          img.src = undefined;
          that.addToQueue(url, importance, img, attempts + 1);
        }
      });

      if (attempts === 0) {
        img.addEventListener('load', function onload() {
          img.removeEventListener('load', onload);
          that._removeFromQueue(img);
          that._load();
        });
      }

      const i = queue.findIndex((el) => el.importance < importance);
      if (i === -1) queue.push(queueEl);
      else queue.splice(i, 0, queueEl);

      this._load();
    }

    _removeFromQueue(img) {
      const { queue } = this;
      const i = queue.findIndex((el) => el.img === img);
      queue.splice(i, 1);
    }

    _load() {
      const { queue, buffersize, _load } = this;

      queue
        .slice(0, buffersize)
        .forEach((el, i) => {
          const { img, url } = el;
          if (img.src) return;
          img.src = url;
        });
    }
  }

  const imageLoader = new ImageLoader(5, 3);

  function createGallery(props) {
    const { id, imagesData, popupId } = props;

    const gallery = document.getElementById(id);
    const popup = document.getElementById(popupId);
    const images = buildImages(imagesData);
    const cards = buildCards(images, popup);

    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.classList.remove('show');
      }
    });

    cards.forEach((card) => gallery.appendChild(card));
  }

  function buildCards(images, popup) {
    return images.map((image, i) => {
      const photocard = document.createElement('div');

      photocard.classList.add('photo');
      image.classList.add('photo-img');

      photocard.appendChild(image);

      photocard.addEventListener('click', () => {
        popupImage(popup, image);
      });

      return photocard;
    });
  }

  function buildImages(imagesData) {
    return imagesData.map((data) => {
      const { desc, url, fullUrl } = data;
      const img = new Image()
      imageLoader.addToQueue(url, 0, img);
      img.setAttribute('data-url-full', fullUrl);
      img.setAttribute('data-desc', desc);
      return img;
    });
  }

  function popupImage(el, image) {
    const img = new Image();
    const url = image.getAttribute('data-url-full');
    imageLoader.addToQueue(url, 5, img);

    const box = el.children[0];

    box.innerHTML = '';

    const imgBox = document.createElement('div');
    const imgDesc = document.createElement('div');

    imgBox.classList.add('popup-img-box');
    imgDesc.classList.add('popup-desc');

    box.appendChild(imgBox);
    box.appendChild(imgDesc);

    imgBox.appendChild(img);

    onsizeload(img, () => {
      imgDesc.innerText = image.getAttribute('data-desc');
    });

    el.classList.add('show');
  }

  function onsizeload(image, cb) {
    const poll = setInterval(() => {
      if (image.naturalWidth) {
        clearInterval(poll);
        cb();
      }
    }, 10);
  }

  //@ts-ignore
  window.createGallery = createGallery;
})();