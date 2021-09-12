const clocks = document.querySelector('.clocks');
let second = document.querySelector('.second');
let minute = document.querySelector('.minute');
let hour = document.querySelector('.hour');

let correct = 0; //поправка на часовой пояс

const edge = 320; //сторона квадрата, куда вписана окружность часов + поправка на цифры
const e1 = 155;
const e2 = edge / 2 + 16;
const e3 = 110;
const fW = 6; //ширина цифр

//draw clockface
for (let i = 0; i < 12; i++) {
  let digit = document.createElement('li');
  digit.innerHTML = i + 1;
  clocks.appendChild(digit);
  digit.style.transform = `translate(${e2*Math.sin(Math.PI*(i+1)/6)+fW}px, ${-e2*Math.cos(Math.PI*(i+1)/6)}px)`;
}

const timeZone = {
  'London': -2,
  'Minsk': 0,
  'Moscow': 0,
  'New-York': -7,
  'Paris': -2,
  'Pekin': 5,
  'Roma': -1,
  'Tokio': 6,
};

//Переменные для кольцевой диаграммы//
let charts = document.querySelector('.charts');
let sW = 90,
  mW = 84,
  hW = 75; //длины угловых секторов сек, мин, час

let secondWidth = sW * Math.tan(Math.PI / 60); //шаг секунды
let minWidth = mW * Math.tan(Math.PI / 60) * 1.03; //шаг минуты
let hourWidth = hW * Math.tan(Math.PI / 60); //шаг часа
let divSec = []; //массив угловых секторов секунд
let divMin = []; //массив угловых секторов минут
let divHour = []; //массив угловых секторов часов

//Построение кольцевой диаграммы//
/*сек*/
for (let i = 0; i < 60; i++) {
  divSec[i] = document.createElement('div');
  divSec[i].classList.add('chart__second');
  divSec[i].style.borderWidth = `${sW}px ${secondWidth}px 0 ${secondWidth}px`;
  divSec[i].style.transform = `rotate(${i*6}deg)`;
  divSec[i].style.transformOrigin = `${secondWidth}px ${sW}px`;
  divSec[i].style.left = `calc(50% - ${secondWidth}px)`;
  charts.appendChild(divSec[i]);
}
/*мин*/
for (let i = 0; i < 60; i++) {
  divMin[i] = document.createElement('div');
  divMin[i].classList.add('chart__min');
  divMin[i].style.borderWidth = `${mW}px ${minWidth}px 0 ${minWidth}px`;
  divMin[i].style.transform = `rotate(${i*6}deg)`;
  divMin[i].style.transformOrigin = `${minWidth}px ${mW}px`;
  divMin[i].style.left = `calc(50% - ${minWidth}px)`;
  charts.appendChild(divMin[i]);
}
/*час*/
for (let i = 0; i < 60; i++) {
  divHour[i] = document.createElement('div');
  divHour[i].classList.add('chart__hour');
  divHour[i].style.borderWidth = `${hW}px ${hourWidth}px 0 ${hourWidth}px`;
  divHour[i].style.transform = `rotate(${i*6}deg)`;
  divHour[i].style.transformOrigin = `${hourWidth}px ${hW}px`;
  divHour[i].style.left = `calc(50% - ${hourWidth}px)`;
  charts.appendChild(divHour[i]);
}

showTime();

function showTime() {

  let now = new Date();
  let nSec = now.getSeconds();
  let nMin = now.getMinutes();
  let nHour;

  if (now.getHours() >= 12) {
    nHour = (now.getHours() - 12) * 5;
  } else {
    if (now.getHours() >= 0) {
      nHour = (now.getHours()) * 5;
    } else {
      nHour = (now.getHours() + 12) * 5;
    }
  }

  nHour += Math.floor(nMin / 12);

  //initial Time
  goSec();
  goMinHour(nMin, e1, minute);
  goMinHour(nHour + correct * 5, e3, hour);

  let minCounterOld = 0;
  let minCounterNew = 0;

  function colorChartMin(nMin, color) {
    for (let i = 0; i < nMin; i++) {
      divMin[i].style.borderColor = color;
    }
  }

  function colorChartSec(nSec, color) {
    for (let i = 0; i < nSec; i++) {
      divSec[i].style.borderColor = color;
    }
  }

  function colorChartHour(nHour, color) {
    for (let i = 0; i < 60; i++) {
      divHour[i].style.borderColor = '#bbbbbb';
    }
    if (nHour < 0) {
      nHour += 60;
    }
    if (nHour > 60) {
      nHour -= 60;
    }
    for (let i = 0; i < nHour; i++) {
      divHour[i].style.borderColor = color;
    }
  }

  colorChartMin(nMin, '#007bff');
  colorChartHour(nHour + correct * 5, '#034e9e');

  function goSec() {
    second.style.transform = `rotate(${6*nSec-90}deg)`;

    colorChartSec(nSec, 'brown');

    if (nSec === 60) {
      nSec = 0;
      minCounterOld = Math.floor(nMin / 12);
      goMinHour(++nMin, e1, minute);
      minCounterNew = Math.floor(nMin / 12);
      let hourClockFace = nHour + minCounterNew - minCounterOld + correct * 5;
      goMinHour(hourClockFace, e3, hour);

      colorChartSec(60, '#bbbbbb');
      colorChartMin(nMin, '#007bff');
      colorChartHour(hourClockFace, '#034e9e');

      if (nMin === 60) {
        nMin = 0;
        goMinHour(++nHour + correct * 5, e3, hour);
        colorChartMin(60, '#bbbbbb');

        if (nHour === 60) {
          nHour -= 60;
          colorChartHour(60, '#bbbbbb');
        }
      }
    }
    nSec++;
  }

  function goMinHour(n, e, time) {
    let x = Math.sin(n * Math.PI / 30) * e + 10;
    let y = (1 - Math.cos(n * Math.PI / 30)) * e;
    time.style.transformOrigin = `${x}px ${y}px`;
    time.style.transform = `rotate(${6*n}deg) translate(${Math.sin(n*Math.PI/30)*e}px, ${(1-Math.cos(n*Math.PI/30))*e}px)`;
  }

  let realTime = document.querySelector('.real-time');
  let weekDay = document.querySelector('.week-day');
  let monthDay = document.querySelector('.month-day');
  let rTime;
  let nowD;

  let timerWatch = setInterval(() => {
    goSec();
    nowD = new Date();
    rTime = nowD.toLocaleTimeString();
    let rt = +rTime.substring(0, 2) + correct;
    if (rt < 0) {
      rt += 24;
    }
    rt = rt + rTime.slice(2);
    realTime.textContent = rt;
  }, 1000);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const options1 = {
    weekday: 'long',
  };

  monthDay.textContent = now.toLocaleDateString('en-US', options);
  weekDay.textContent = now.toLocaleDateString('en-US', options1);

  const hello = document.querySelector('.hello');
  let dayTime;
  let nowTime = now.getHours() + correct;
  if (nowTime < 0) {
    nowTime += 24;
  }

  switch (true) {
    case (0 <= nowTime && nowTime < 6):
      dayTime = 'Night';
      break;
    case (6 <= nowTime && nowTime < 12):
      dayTime = 'Morning';
      break;
    case (12 <= nowTime && nowTime < 18):
      dayTime = 'Day';
      break;
    case (18 <= nowTime && nowTime < 24):
      dayTime = 'Evening';
  }

  hello.textContent = `Good ${dayTime}`;
}

const cityNames = document.querySelectorAll('.city_name');
const overlays = document.querySelectorAll('.overlay');
for (let i = 0; i < overlays.length; i++) {
  overlays[i].addEventListener('click', hideCities);
}

function hideCities(e) {

  for (let i = 0; i < overlays.length; i++) {
    if (overlays[i] !== e.target) {
      overlays[i].parentNode.classList.remove('city_grow');
      overlays[i].classList.remove('city_bgcolor');
      overlays[i].firstElementChild.classList.remove('h2hidden');
    }
  }
  correct = timeZone[e.target.firstElementChild.innerHTML];
  showTime();
  e.target.parentNode.classList.toggle('city_grow');
  e.target.classList.toggle('city_bgcolor');
  e.target.firstElementChild.classList.toggle('h2hidden');
}