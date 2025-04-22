document.addEventListener("DOMContentLoaded", () => {
    let timeLeft;
    let timerId = null;
    let isRunning = false;

    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const pomodoroButton = document.getElementById('pomodoro');
    const shortBreakButton = document.getElementById('shortBreak');
    const longBreakButton = document.getElementById('longBreak');
    const darkModeButton = document.getElementById('darkMode');

    const POMODORO_TIME = 25 * 60;
    const SHORT_BREAK_TIME = 5 * 60;
    const LONG_BREAK_TIME = 15 * 60;

    // Dark mode toggle
    darkModeButton.addEventListener('click', () => {
        const html = document.documentElement;
        const isLight = html.getAttribute('data-theme') === 'light';
        html.setAttribute('data-theme', isLight ? 'dark' : 'light');
        darkModeButton.textContent = isLight ? 'Light Mode' : 'Dark Mode';
    });

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - Pomodoro`;
    }

    function startTimer() {
        if (!isRunning && timeLeft > 0) {
            isRunning = true;
            timerId = setInterval(() => {
                timeLeft--;
                updateDisplay();
                if (timeLeft === 0) {
                    clearInterval(timerId);
                    isRunning = false;
                    new Audio('bell.mp3').play();
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        clearInterval(timerId);
        isRunning = false;
    }

    function resetTimer() {
        clearInterval(timerId);
        isRunning = false;
        timeLeft = POMODORO_TIME;
        updateDisplay();
        setActiveButton(pomodoroButton);
    }

    function setActiveButton(button) {
        [pomodoroButton, shortBreakButton, longBreakButton].forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    }

    // Event Listeners
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);

    pomodoroButton.addEventListener('click', () => {
        timeLeft = POMODORO_TIME;
        updateDisplay();
        setActiveButton(pomodoroButton);
        pauseTimer();
    });

    shortBreakButton.addEventListener('click', () => {
        timeLeft = SHORT_BREAK_TIME;
        updateDisplay();
        setActiveButton(shortBreakButton);
        pauseTimer();
    });

    longBreakButton.addEventListener('click', () => {
        timeLeft = LONG_BREAK_TIME;
        updateDisplay();
        setActiveButton(longBreakButton);
        pauseTimer();
    });

    // Initial setup
    timeLeft = POMODORO_TIME;
    updateDisplay();
});
