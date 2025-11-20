// Simple Mars Rovers Website Controls
console.log('Mars Rovers controls loaded');

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const speakPage = document.getElementById('speakPage');
    const stopSpeaking = document.getElementById('stopSpeaking');
    
    console.log('Controls found:', {
        darkModeToggle: !!darkModeToggle,
        speakPage: !!speakPage,
        stopSpeaking: !!stopSpeaking
    });

    // Dark Mode
    if (darkModeToggle) {
        // Load saved preference
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        }

        darkModeToggle.addEventListener('click', function() {
            console.log('Dark mode clicked');
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            darkModeToggle.textContent = isDark ? '☀️' : '🌙';
        });
    }

    // Text-to-Speech
    if (speakPage && stopSpeaking) {
        let isSpeaking = false;

        speakPage.addEventListener('click', function() {
            console.log('Speak clicked');
            if (isSpeaking) {
                speechSynthesis.cancel();
                isSpeaking = false;
                speakPage.textContent = '🔊';
                stopSpeaking.disabled = true;
                return;
            }

            if ('speechSynthesis' in window) {
                const text = document.body.innerText;
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1;
                utterance.pitch = 1;
                utterance.volume = 1;

                utterance.onstart = function() {
                    isSpeaking = true;
                    speakPage.textContent = '⏸️';
                    stopSpeaking.disabled = false;
                    console.log('Started speaking');
                };

                utterance.onend = function() {
                    isSpeaking = false;
                    speakPage.textContent = '🔊';
                    stopSpeaking.disabled = true;
                    console.log('Finished speaking');
                };

                speechSynthesis.speak(utterance);
            }
        });

        stopSpeaking.addEventListener('click', function() {
            console.log('Stop clicked');
            if (isSpeaking) {
                speechSynthesis.cancel();
                isSpeaking = false;
                speakPage.textContent = '🔊';
                stopSpeaking.disabled = true;
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
            if (darkModeToggle) darkModeToggle.click();
        }
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            if (speakPage && !speakPage.disabled) speakPage.click();
            else if (stopSpeaking && !stopSpeaking.disabled) stopSpeaking.click();
        }
    });

    console.log('All controls ready');
});

// MISSION CONTROL DASHBOARD - STUNNING FEATURE
function initializeMissionControl() {
    console.log('🛰️ Mission Control Dashboard Initialized');
    
    // Get mission control elements
    const startMission = document.getElementById('startMission');
    const pauseMission = document.getElementById('pauseMission');
    const resetMission = document.getElementById('resetMission');
    const missionTime = document.getElementById('missionTime');
    const distance = document.getElementById('distance');
    const speed = document.getElementById('speed');
    const temperature = document.getElementById('temperature');
    const power = document.getElementById('power');
    const signal = document.getElementById('signal');
    const solar = document.getElementById('solar');
    const dataRate = document.getElementById('dataRate');
    const roverLat = document.getElementById('roverLat');
    const roverLon = document.getElementById('roverLon');
    const elevation = document.getElementById('elevation');
    const terrainType = document.getElementById('terrainType');
    const weather = document.getElementById('weather');
    const activityLog = document.getElementById('activityLog');
    
    // Mission state
    let missionState = {
        isRunning: false,
        isPaused: false,
        startTime: null,
        elapsedTime: 0,
        distanceTraveled: 0,
        currentSpeed: 0,
        latitude: 0.0,
        longitude: 0.0,
        currentElevation: -4500,
        currentTerrain: 'Rocky Plains',
        currentWeather: 'Clear',
        powerLevel: 98,
        signalStrength: 'Strong',
        solarActivity: 'Active',
        currentDataRate: '2.0 Mbps'
    };
    
    // Terrain types for variety
    const terrainTypes = ['Rocky Plains', 'Sandy Dunes', 'Crater Floor', 'Hillside', 'Valley Bottom', 'Plateau'];
    const weatherTypes = ['Clear', 'Dusty', 'Windy', 'Calm', 'Partly Cloudy'];
    const temperatures = [-63, -58, -67, -71, -55, -60];
    
    // Initialize mission controls
    if (startMission && pauseMission && resetMission) {
        startMission.addEventListener('click', startMissionHandler);
        pauseMission.addEventListener('click', pauseMissionHandler);
        resetMission.addEventListener('click', resetMissionHandler);
        
        // Rover selection
        const roverOptions = document.querySelectorAll('input[name="rover"]');
        roverOptions.forEach(option => {
            option.addEventListener('change', function() {
                addLogEntry(`Rover switched to ${this.value.toUpperCase()}`);
            });
        });
        
        // View controls
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                viewBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                addLogEntry(`View changed to ${this.dataset.view} mode`);
            });
        });
        
        // Start mission update loop
        setInterval(updateMission, 1000);
    }
    
    function startMissionHandler() {
        if (!missionState.isRunning) {
            missionState.isRunning = true;
            missionState.isPaused = false;
            missionState.startTime = Date.now() - missionState.elapsedTime;
            
            startMission.classList.add('active');
            pauseMission.classList.remove('active');
            
            addLogEntry('🚀 Mission started');
            addLogEntry('All systems nominal');
            addLogEntry('Rover telemetry active');
        }
    }
    
    function pauseMissionHandler() {
        if (missionState.isRunning && !missionState.isPaused) {
            missionState.isPaused = true;
            startMission.classList.remove('active');
            pauseMission.classList.add('active');
            addLogEntry('⏸️ Mission paused');
        } else if (missionState.isPaused) {
            missionState.isPaused = false;
            missionState.startTime = Date.now() - missionState.elapsedTime;
            pauseMission.classList.remove('active');
            startMission.classList.add('active');
            addLogEntry('▶️ Mission resumed');
        }
    }
    
    function resetMissionHandler() {
        missionState = {
            isRunning: false,
            isPaused: false,
            startTime: null,
            elapsedTime: 0,
            distanceTraveled: 0,
            currentSpeed: 0,
            latitude: 0.0,
            longitude: 0.0,
            currentElevation: -4500,
            currentTerrain: 'Rocky Plains',
            currentWeather: 'Clear',
            powerLevel: 98,
            signalStrength: 'Strong',
            solarActivity: 'Active',
            currentDataRate: '2.0 Mbps'
        };
        
        startMission.classList.remove('active');
        pauseMission.classList.remove('active');
        
        updateDisplay();
        addLogEntry('🔄 Mission reset');
        addLogEntry('All systems initialized');
    }
    
    function updateMission() {
        if (missionState.isRunning && !missionState.isPaused) {
            // Update elapsed time
            missionState.elapsedTime = Date.now() - missionState.startTime;
            
            // Update distance and speed
            if (Math.random() > 0.7) {
                missionState.currentSpeed = Math.random() * 0.05; // Max 5 cm/s
                missionState.distanceTraveled += missionState.currentSpeed;
            } else {
                missionState.currentSpeed = 0;
            }
            
            // Update position
            missionState.latitude += (Math.random() - 0.5) * 0.001;
            missionState.longitude += (Math.random() - 0.5) * 0.001;
            
            // Random events
            if (Math.random() > 0.95) {
                missionState.currentTerrain = terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
                addLogEntry(`Terrain changed to ${missionState.currentTerrain}`);
            }
            
            if (Math.random() > 0.97) {
                missionState.currentWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
                addLogEntry(`Weather: ${missionState.currentWeather}`);
            }
            
            // Update telemetry
            missionState.powerLevel = Math.max(85, Math.min(100, missionState.powerLevel + (Math.random() - 0.5) * 2));
            missionState.currentElevation += (Math.random() - 0.5) * 10;
            missionState.currentDataRate = (Math.random() * 3 + 1).toFixed(1) + ' Mbps';
            
            // Update objectives
            updateObjectives();
        }
        
        updateDisplay();
    }
    
    function updateDisplay() {
        // Update mission time
        const totalSeconds = Math.floor(missionState.elapsedTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        missionTime.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update stats
        distance.textContent = missionState.distanceTraveled.toFixed(1) + ' km';
        speed.textContent = (missionState.currentSpeed * 100).toFixed(1) + ' m/s';
        temperature.textContent = temperatures[Math.floor(Math.random() * temperatures.length)] + '°C';
        power.textContent = missionState.powerLevel.toFixed(0) + '%';
        signal.textContent = missionState.signalStrength;
        solar.textContent = missionState.solarActivity;
        dataRate.textContent = missionState.currentDataRate;
        
        // Update position
        roverLat.textContent = missionState.latitude.toFixed(4) + '°';
        roverLon.textContent = missionState.longitude.toFixed(4) + '°';
        elevation.textContent = missionState.currentElevation.toFixed(0) + 'm';
        terrainType.textContent = missionState.currentTerrain;
        weather.textContent = missionState.currentWeather;
    }
    
    function updateObjectives() {
        const objectives = document.querySelectorAll('.objective-item');
        if (missionState.distanceTraveled > 0.1 && objectives[0].classList.contains('active') === false) {
            objectives[0].classList.add('active');
            addLogEntry('✅ Navigate to target coordinates - COMPLETE');
        }
        if (missionState.distanceTraveled > 0.5 && objectives[1].classList.contains('active') === false) {
            objectives[1].classList.add('active');
            addLogEntry('✅ Collect rock samples - COMPLETE');
        }
        if (missionState.distanceTraveled > 1.0 && objectives[2].classList.contains('active') === false) {
            objectives[2].classList.add('active');
            addLogEntry('✅ Analyze soil composition - COMPLETE');
        }
        if (missionState.distanceTraveled > 2.0 && objectives[3].classList.contains('active') === false) {
            objectives[3].classList.add('active');
            addLogEntry('✅ Transmit data to Earth - COMPLETE');
            addLogEntry('🎉 ALL MISSION OBJECTIVES COMPLETE!');
        }
    }
    
    function addLogEntry(message) {
        if (activityLog) {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            const timestamp = new Date().toLocaleTimeString();
            entry.textContent = `[${timestamp}] ${message}`;
            activityLog.insertBefore(entry, activityLog.firstChild);
            
            // Keep only last 10 entries
            while (activityLog.children.length > 10) {
                activityLog.removeChild(activityLog.lastChild);
            }
        }
    }
    
    // Initialize display
    updateDisplay();
    addLogEntry('Mission Control initialized');
    addLogEntry('All systems ready');
}

// Initialize Mission Control when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeMissionControl();
});
