import Stopwatch from './stopwatch.js';
// TODO: 이 곳에 정답 코드를 작성해주세요.
const stopwatch = new Stopwatch();

let isRunning = false;
let interval;
// 1. 시작 기능
const $timer = document.getElementById('timer');
const $lapResetBtn = document.getElementById('lap-reset-btn');
const $lapResetBtnLabel = document.getElementById('lap-reset-btn-label');
const $startStopBtn = document.getElementById('start-stop-btn');
const $startStopBtnLabel = document.getElementById('start-stop-btn-label');
const $laps = document.getElementById('laps');
let $minLap, $maxLap;

const formatString = (num) => (num < 10 ? '0' + num : num);

const formatTime = (centisecond) => {
    // centisecond -> 분:초:1/00초
    let formattedString = '';
    const min = parseInt(centisecond / 6000);
    const sec = parseInt((centisecond - 6000 * min) / 100);
    const centisec = centisecond % 100;
    formattedString = `${formatString(min)}:${formatString(sec)}.${formatString(
        centisec
    )}`;
    return formattedString;
};

const updateTime = (time) => {
    $timer.innerText = formatTime(time);
};
const toggleBtnStyle = () => {
    $startStopBtn.classList.toggle('bg-green-600'); // remove
    $startStopBtn.classList.toggle('bg-red-600'); // add
};
const onClickLapResetBtn = () => {
    if (isRunning) {
        onClickLapBtn();
    } else {
        onClickResetBtn();
    }
};

const onClickStartBtn = () => {
    stopwatch.start();
    interval = setInterval(() => {
        updateTime(stopwatch.centisecond);
    }, 10);
    $lapResetBtnLabel.innerText = '랩';
    $startStopBtnLabel.innerText = '중단';
    // 초록색 -> 붉은색 버튼
};

const onClickStopBtn = () => {
    stopwatch.pause();
    clearInterval(interval);
    $lapResetBtnLabel.innerText = '리셋';
    $startStopBtnLabel.innerText = '시작';
};
const onclickStartStopBtn = () => {
    if (isRunning) {
        onClickStopBtn();
    } else {
        onClickStartBtn();
    }
    toggleBtnStyle();
    isRunning = !isRunning;
};

const colorMinMax = () => {
    $minLap.classList.add('text-green-600');
    $maxLap.classList.add('text-red-600');
};
const onClickLapBtn = () => {
    const [lapCount, lapTime] = stopwatch.createLap();
    // data attribute
    const $lap = document.createElement('li');

    $lap.setAttribute('data-time', lapTime);
    $lap.classList.add('flex', 'justify-between', 'py-2', 'px-3', 'border-b-2');
    $lap.innerHTML += `
    <span>랩${lapCount}</span>
    <span>${formatTime(lapTime)}</span>
  `;
    $laps.prepend($lap);

    if ($minLap === undefined) {
        // 첫 rep
        $minLap = $lap;
        return;
    }

    //두번째 Lap을 눌렀을 때. 첫번째 Lap과 비교해서 (minLap) 최소, 최대값을 결정한다.
    if ($maxLap === undefined) {
        if (lapTime < $minLap.dataset.time) {
            // 최소값 갱신
            $maxLap = $minLap;
            $minLap = $lap;
        } else {
            $maxLap = $lap;
        }
        colorMinMax();
        return;
    }
    // Lap이 3개 이상(min, max 모둦 존재)
    if (lapTime < $minLap.dataset.time) {
        $minLap.classList.remove('text-green-600');
        $minLap = $lap;
    } else if (lapTime > $maxLap.dataset.time) {
        $maxLap.classList.remove('text-red-600');
        $maxLap = $lap;
    }
    colorMinMax();
};
const onClickResetBtn = () => {
    stopwatch.reset();
    updateTime(0);
    $laps.innerHTML = '';
    $minLap = undefined;
    $maxLap = undefined;
};

const onKeyDown = (e) => {
    switch (e.code) {
        case 'KeyL':
            onClickLapResetBtn();
            break;
        case 'KeyS':
            onclickStartStopBtn();
            break;
    }
};
$startStopBtn.addEventListener('click', onclickStartStopBtn);
$lapResetBtn.addEventListener('click', onClickLapResetBtn);

document.addEventListener('keydown', onKeyDown);

// 1. Lap추가할 때마다 모든 Lap을 돌면서, 최장 최단기록 판별
// 2. Lap추가할 때마다 저장된 min,max 값과 lap을 비교해서 min, max값을 업데이트
