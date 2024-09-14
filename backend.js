// Function to update the progress bar
function updateProgressBar(progressBar, value) {
    value = Math.round(value);
    progressBar.querySelector(".progress__fill").style.width = `${value}%`;
    progressBar.querySelector(".progress__text").textContent = `${value}%`;
}

// Function to animate the progress bar from 0 to 100
function animateProgressBar(progressBar, duration){
    let value = 0
    const internalDuration = duration / 100; // Time to increment each percentage

    // Disable the start button initially
    const startButton = document.getElementById('startButton');
    startButton.disabled = true;

    const interval = setInterval(() => {
        if (value >= 100) {
            clearInterval(interval)
            
            // Enable the start button when progress is 100%
            startButton.disabled = false;
        } else {
            value++;
            updateProgressBar(progressBar, value);
        }
    }, internalDuration);
}

// Select the progress bar element
const pgBar = document.querySelector(".progress");

// Start the animation for 5 seconds (5000 milliseconds)
animateProgressBar(pgBar, 5000);
