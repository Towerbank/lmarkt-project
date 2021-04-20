
  let position = 0;
  const slidesToShow = 1;
  const slidesToScroll = 1;
  const container = document.querySelector('.slider');
  const track = document.querySelector(".slider__track");
  // const item = document.querySelector(".slider__item");
  const btnLeft = document.querySelector(".btn__left");
  const btnRight = document.querySelector(".btn__right");
  const items = document.querySelectorAll(".slider__item");
  const itemsCount = items.length;
  const itemWidth = container.clientWidth / slidesToShow;
  const movePosition = slidesToScroll * itemWidth;

items.forEach((item) => {
  item.style.minWidth = `${itemWidth}px`;
});


  btnRight.addEventListener('click', () => {
    const itemsLeft = itemsCount - (Math.abs(position) + slidesToShow * itemWidth) / itemWidth;
    console.log('ponk')
    position -= itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth ;
    setPosition();
    checkBtns();
  });

  btnLeft.addEventListener('click', () => {
    const itemsLeft = Math.abs(position) / itemWidth;
    console.log('ponk')
    position += itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth ;
    setPosition();
    checkBtns();
  });


const setPosition = () => {
  track.style.transform = `translateX(${position}px)`;
  };

const checkBtns = () => {
  btnLeft.disabled = position === 0;
  btnRight.disabled = position <= -(itemsCount - slidesToShow) * itemWidth;

  };

  checkBtns();




