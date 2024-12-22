const container = document.getElementById('container');
const bgVideo = document.getElementById('bgVideo');
const parallaxTodoContainer = document.getElementById('todo-container');
const parallaxDayContainer = document.querySelector('.day-container');
const parallaxTimeContainer = document.querySelector('.time-container');
const parallaxMostVisitedContainer = document.getElementById('most-visited-sites');

let mouseX = 0, mouseY = 0, currentBgX = 0, currentBgY = 0, currentFgX = 0, currentFgY = 0;

const animationConfig = {
    bg: {
        maxMove: 10,
        speed: 1
    },
    fg: {
        maxMove: 10,
        speed: .8
    }
}

container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    mouseX = (e.clientX - rect.left - centerX) / centerX;
    mouseY = (e.clientY - rect.top - centerY) / centerY;

})

container.addEventListener('mouseleave', () => {
    mouseX = 0, mouseY = 0, currentBgX = 0, currentBgY = 0, currentFgX = 0, currentFgY = 0;
})

function parallaxEffect() {
    const bgX = -mouseX * animationConfig.bg.maxMove;
    const bgY = -mouseY * animationConfig.bg.maxMove;

    const fgX = mouseX * animationConfig.fg.maxMove;
    const fgY = mouseY * animationConfig.fg.maxMove;

    currentBgX += (bgX - currentBgX) * animationConfig.bg.speed;
    currentBgY += (bgY - currentBgY) * animationConfig.bg.speed;
    currentFgX += (fgX - currentFgX) * animationConfig.fg.speed;
    currentFgY += (fgY - currentFgY) * animationConfig.fg.speed;

    anime({
        targets: bgVideo,
        translateX: currentBgX,
        translateY: currentBgY,
        duration: 0,
        easing: 'linear'
    });

    anime({
        targets: [parallaxDayContainer, parallaxTimeContainer, parallaxTodoContainer],
        translateX: currentFgX,
        translateY: currentFgY,
        duration: 0,
        easing: 'linear',
        scale: .9,
    })

    anime({
        targets: parallaxDayContainer,
        translateX: ['-50%', `calc(-50% + ${currentBgX}px)`],
        translateY: ['-50%', `calc(-50% + ${currentBgY}px)`],
        duration: 0,
        easing: 'linear',
        scale: .9,
    })

    anime({
        targets: parallaxMostVisitedContainer,
        translateX: ['0%', `calc(0% + ${currentBgX}px)`],
        translateY: ['50%', `calc(-10% + ${currentBgY}px)`],
        duration: 0,
        easing: 'linear',
        scale: .9,
    })

    requestAnimationFrame(parallaxEffect);
}

parallaxEffect();