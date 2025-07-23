class Stopwatch {
    constructor() {
        this.time = 0;
        this.isRunning = false;
        this.lapTimes = [];
        this.interval = null;
        
        this.initializeElements();
        this.bindEvents();
        this.addInteractiveEffects();
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startStopBtn = document.getElementById('startStopBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.startStopLabel = document.getElementById('startStopLabel');
        this.lapTimesCard = document.getElementById('lapTimesCard');
        this.lapTimesList = document.getElementById('lapTimesList');
    }
    
    bindEvents() {
        this.startStopBtn.addEventListener('click', () => this.handleStartStop());
        this.lapBtn.addEventListener('click', () => this.handleLap());
        this.resetBtn.addEventListener('click', () => this.handleReset());
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    addInteractiveEffects() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.control-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e));
        });
        
        // Add hover sound effect simulation
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.disabled) {
                    button.style.transform = 'scale(1.05) translateY(-2px)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!button.disabled) {
                    button.style.transform = '';
                }
            });
        });
    }
    
    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add ripple animation keyframes if not already added
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
    
    handleKeyboard(event) {
        // Prevent default if we're handling the key
        switch(event.code) {
            case 'Space':
                event.preventDefault();
                this.handleStartStop();
                break;
            case 'KeyL':
                if (this.isRunning) {
                    event.preventDefault();
                    this.handleLap();
                }
                break;
            case 'KeyR':
                event.preventDefault();
                this.handleReset();
                break;
        }
    }
    
    formatTime(timeMs) {
        const minutes = Math.floor(timeMs / 60000);
        const seconds = Math.floor((timeMs % 60000) / 1000);
        const milliseconds = Math.floor((timeMs % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        this.timeDisplay.textContent = this.formatTime(this.time);
        
        // Add visual feedback for running state
        if (this.isRunning) {
            this.timeDisplay.classList.add('running');
        } else {
            this.timeDisplay.classList.remove('running');
        }
    }
    
    handleStartStop() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
        
        // Add button press animation
        this.startStopBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.startStopBtn.style.transform = '';
        }, 150);
    }
    
    start() {
        this.isRunning = true;
        this.interval = setInterval(() => {
            this.time += 10;
            this.updateDisplay();
        }, 10);
        
        // Update button appearance with smooth transition
        this.startStopBtn.innerHTML = '<span class="btn-icon">⏸</span>';
        this.startStopBtn.className = 'control-btn stop-btn';
        this.startStopLabel.textContent = 'Stop';
        this.lapBtn.disabled = false;
        
        // Add visual feedback
        this.timeDisplay.classList.add('running');
        
        // Animate button state change
        this.animateButtonChange(this.startStopBtn);
    }
    
    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        // Update button appearance
        this.startStopBtn.innerHTML = '<span class="btn-icon">▶</span>';
        this.startStopBtn.className = 'control-btn start-btn';
        this.startStopLabel.textContent = 'Start';
        
        // Remove visual feedback
        this.timeDisplay.classList.remove('running');
        
        // Animate button state change
        this.animateButtonChange(this.startStopBtn);
    }
    
    animateButtonChange(button) {
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    }
    
    handleReset() {
        this.stop();
        this.time = 0;
        this.lapTimes = [];
        this.updateDisplay();
        this.lapBtn.disabled = true;
        this.hideLapTimes();
        
        // Add reset animation
        this.timeDisplay.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.timeDisplay.style.transform = '';
        }, 200);
        
        // Animate reset button
        this.animateButtonChange(this.resetBtn);
    }
    
    handleLap() {
        if (this.time > 0) {
            const lapTime = {
                id: this.lapTimes.length + 1,
                time: this.time,
                displayTime: this.formatTime(this.time)
            };
            
            this.lapTimes.unshift(lapTime);
            this.updateLapDisplay();
            this.showLapTimes();
            
            // Add lap button animation
            this.animateButtonChange(this.lapBtn);
            
            // Add subtle shake animation to lap times card
            if (this.lapTimesCard) {
                this.lapTimesCard.style.animation = 'none';
                setTimeout(() => {
                    this.lapTimesCard.style.animation = 'slideInUp 0.3s ease-out';
                }, 10);
            }
        }
    }
    
    showLapTimes() {
        this.lapTimesCard.classList.remove('hidden');
        // Trigger reflow to ensure animation plays
        this.lapTimesCard.offsetHeight;
    }
    
    hideLapTimes() {
        // Add fade out animation before hiding
        this.lapTimesCard.style.opacity = '0';
        this.lapTimesCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.lapTimesCard.classList.add('hidden');
            this.lapTimesCard.style.opacity = '';
            this.lapTimesCard.style.transform = '';
            this.lapTimesList.innerHTML = '';
        }, 300);
    }
    
    getBestAndWorstLaps() {
        if (this.lapTimes.length === 0) return { bestId: null, worstId: null };
        
        const sortedLaps = [...this.lapTimes].sort((a, b) => a.time - b.time);
        return {
            bestId: sortedLaps[0]?.id,
            worstId: sortedLaps[sortedLaps.length - 1]?.id
        };
    }
    
    updateLapDisplay() {
        const { bestId, worstId } = this.getBestAndWorstLaps();
        
        this.lapTimesList.innerHTML = '';
        
        this.lapTimes.forEach((lap, index) => {
            const lapElement = document.createElement('div');
            lapElement.className = 'lap-item';
            
            // Add staggered animation delay
            lapElement.style.animationDelay = `${index * 0.1}s`;
            
            // Add best/worst styling
            if (lap.id === bestId && this.lapTimes.length > 1) {
                lapElement.classList.add('best');
            } else if (lap.id === worstId && this.lapTimes.length > 1) {
                lapElement.classList.add('worst');
            }
            
            const lapNumber = document.createElement('span');
            lapNumber.className = 'lap-number';
            lapNumber.textContent = `Lap ${lap.id}`;
            
            // Add badges for best/worst
            if (lap.id === bestId && this.lapTimes.length > 1) {
                const badge = document.createElement('span');
                badge.className = 'lap-badge best-badge';
                badge.textContent = 'BEST';
                lapNumber.appendChild(badge);
            } else if (lap.id === worstId && this.lapTimes.length > 1) {
                const badge = document.createElement('span');
                badge.className = 'lap-badge worst-badge';
                badge.textContent = 'WORST';
                lapNumber.appendChild(badge);
            }
            
            const lapTime = document.createElement('span');
            lapTime.className = 'lap-time';
            lapTime.textContent = lap.displayTime;
            
            lapElement.appendChild(lapNumber);
            lapElement.appendChild(lapTime);
            
            // Add hover effect for individual lap items
            lapElement.addEventListener('mouseenter', () => {
                lapElement.style.transform = 'translateX(8px) scale(1.02)';
            });
            
            lapElement.addEventListener('mouseleave', () => {
                lapElement.style.transform = '';
            });
            
            this.lapTimesList.appendChild(lapElement);
        });
    }
}

// Initialize the stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});