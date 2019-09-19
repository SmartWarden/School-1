//@ts-check
(function runHamburgerJs() {
  //@ts-ignore
  window.createHamburger = function createHamburger(props) {
    const { burgerId, navId, classBurgerActive, classNavActive } = props;
    const burger = document.getElementById(burgerId);
    const nav = document.getElementById(navId);

    burger.addEventListener('click', () => {
      burger.classList.toggle(classBurgerActive || 'active');
      nav.classList.toggle(classNavActive || 'active');
    });
  }
})();
