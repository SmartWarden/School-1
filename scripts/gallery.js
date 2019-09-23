//@ts-check
(function runGalleryJs() {
  class ImageLoader {
    constructor(buffersize, maxAttempts) {
      this.queue = [];
      this.buffersize = buffersize;
      this.maxAttempts = maxAttempts;
    }

    addToQueue(url, importance=0, img, attempts=0) {
      if (img == null) img = new Image;
      const queueEl = { img, url, importance };
      const { queue, maxAttempts } = this;

      const remove = this._removeFromQueue.bind(null, img);
      img.addEventListener('load', remove);
      img.addEventListener('error', () => {
        if (attempts > maxAttempts) {
          console.error(`Image ${url} couldn't be loaded.`);
          remove();
        } else {
          this.addToQueue(url, importance, img, attempts + 1);
        }
      });

      for (let i = 0, len = queue.length; i < len; i++) {
        const current = queue[i];
        if (current.importance < importance || i === len - 1) {
          queue.splice(i, 0, queueEl);
          break;
        }
      }
    }

    _removeFromQueue(img) {
      const { queue } = this;
      const i = queue.findIndex(img);
      queue.splice(i, 1);
    }

    _load() {
      
    }
  }

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
      const img = new Image();
      img.src = url;
      img.setAttribute('data-url-full', fullUrl);
      img.setAttribute('data-desc', desc);
      return img;
    });
  }

  function popupImage(el, image, attempts=0) {
    const img = new Image();
    img.src = image.getAttribute('data-url-full');

    const box = el.children[0];

    box.innerHTML = '';

    const imgBox = document.createElement('div');
    const imgDesc = document.createElement('div');

    imgBox.classList.add('popup-img-box');
    imgDesc.classList.add('popup-desc');

    box.appendChild(imgBox);
    box.appendChild(imgDesc);

    imgBox.appendChild(img);

    img.addEventListener('error', () => {
      if (attempts >= 3) {
        box.children[1].innerText = '';
      } else {
        popupImage(el, image, attempts + 1);
      }
    });

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

  function detectScrollWidth() {
    const div = document.createElement('div');
    div.style.opacity = '0';
    div.style.position = 'fixed';
    div.style.zIndex = '-999';
    div.style.overflow = 'scroll';
    div.style.width = '100px';

    document.body.appendChild(div);
    return 100 - div.clientWidth;
  }

  //@ts-ignore
  window.createGallery = createGallery;
})();