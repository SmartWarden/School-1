//@ts-check
(function runGalleryJs() {
  function createGallery(props) {
    const { id, imagesData, popupId } = props;

    const gallery = document.getElementById(id);
    const popup = document.getElementById(popupId);
    const images = loadImages(imagesData);
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

  function loadImages(imagesData) {
    return imagesData.map((data) => {
      const { desc, url, fullUrl } = data;
      const img = new Image();
      img.src = url;
      img.setAttribute('data-url-full', fullUrl);
      img.setAttribute('data-desc', desc);
      return img;
    });
  }

  function popupImage(el, image) {
    const img = new Image();
    img.src = image.getAttribute('data-url-full');

    const box = el.children[0];

    box.children[0].innerHTML = '';
    box.children[1].innerHTML = '';

    box.children[0].appendChild(img);
    img.onload = () =>
      box.children[1].innerText = image.getAttribute('data-desc');
    el.classList.add('show');
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