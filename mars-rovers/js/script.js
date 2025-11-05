// NASA Mars Rovers Website - Interactive JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Initialize all features
    initializeDarkMode();
    initializeFAQ();
    initializeCategoryFilter();
    initializeScrollEffects();
    initializeKeyboardNavigation();
    initializeAriaLive();
    initializeAdditionalFeatures();

    console.log('NASA Mars Rovers website initialized successfully');
});

// Dark Mode Toggle
function initializeDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply dark mode if previously enabled or system prefers it
    if (savedDarkMode === 'true' || (!savedDarkMode && systemDarkMode)) {
        body.classList.add('dark-mode');
        updateDarkModeToggle(true);
    }

    // Toggle dark mode on button click
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const isDarkMode = body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            updateDarkModeToggle(isDarkMode);
            announceToScreenReader(`Dark mode ${isDarkMode ? 'enabled' : 'disabled'}`);
        });
    }

    // Listen for system color scheme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('darkMode')) {
            body.classList.toggle('dark-mode', e.matches);
            updateDarkModeToggle(e.matches);
        }
    });
}

function updateDarkModeToggle(isDarkMode) {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.setAttribute('aria-label', `${isDarkMode ? 'Disable' : 'Enable'} dark mode`);
        darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    }
}

// FAQ Functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Close all other FAQ items (optional accordion behavior)
            const allFaqItems = document.querySelectorAll('.faq-item');
            allFaqItems.forEach(item => {
                if (item !== faqItem) {
                    const otherQuestion = item.querySelector('.faq-question');
                    const otherAnswer = item.querySelector('.faq-answer');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.classList.remove('show');
                }
            });

            // Toggle current FAQ item
            this.setAttribute('aria-expanded', !isExpanded);
            faqAnswer.classList.toggle('show');

            // Announce to screen readers
            const action = isExpanded ? 'collapsed' : 'expanded';
            announceToScreenReader(`FAQ item ${action}`);
        });

        // Keyboard navigation
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Category Filter for FAQ
function initializeCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');

    if (categoryButtons.length === 0 || faqItems.length === 0) return;

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategory = this.getAttribute('data-category');

            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter FAQ items
            faqItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = selectedCategory === 'all' || itemCategory === selectedCategory;

                item.style.display = shouldShow ? 'block' : 'none';

                // Animate items that are being shown
                if (shouldShow) {
                    item.style.animation = 'fadeInUp 0.3s ease-out';
                }
            });

            // Announce to screen readers
            const visibleCount = document.querySelectorAll('.faq-item[style="display: block;"]').length;
            announceToScreenReader(`Showing ${visibleCount} questions in ${selectedCategory === 'all' ? 'all categories' : selectedCategory}`);
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const header = document.querySelector('.main-header');
    let lastScrollY = window.scrollY;

    // Hide/show header on scroll
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;

        if (header) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show header
                header.style.transform = 'translateY(0)';
            }
        }

        lastScrollY = currentScrollY;
    });

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Focus target element for accessibility
                targetElement.focus();
            }
        });
    });
}

// Keyboard Navigation
function initializeKeyboardNavigation() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management for modal-like elements
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt + D: Toggle dark mode
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
            const darkModeToggle = document.querySelector('.dark-mode-toggle');
            if (darkModeToggle) darkModeToggle.click();
        }

        // Alt + H: Go to home
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            window.location.href = 'index.html';
        }

        // Escape: Close any open FAQ items
        if (e.key === 'Escape') {
            const expandedQuestions = document.querySelectorAll('.faq-question[aria-expanded="true"]');
            expandedQuestions.forEach(question => {
                question.click();
            });
        }
    });
}

// ARIA Live Announcements
function initializeAriaLive() {
    // Create ARIA live region for screen reader announcements
    const ariaLive = document.createElement('div');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.className = 'sr-only';
    ariaLive.id = 'aria-live-region';
    document.body.appendChild(ariaLive);
}

function announceToScreenReader(message) {
    const ariaLive = document.getElementById('aria-live-region');
    if (ariaLive) {
        ariaLive.textContent = message;
        // Clear after announcement
        setTimeout(() => {
            ariaLive.textContent = '';
        }, 1000);
    }
}

// Enhanced Image Loading
function initializeImageLoading() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        // Add loading="lazy" for performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }

        // Add error handling
        img.addEventListener('error', function() {
            this.setAttribute('alt', this.alt + ' (Image failed to load)');
            this.style.opacity = '0.5';
        });

        // Add load animation
        img.addEventListener('load', function() {
            this.style.animation = 'fadeIn 0.5s ease-out';
        });
    });
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Log performance metrics
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);

            // Announce slow loading to users
            if (loadTime > 3000) {
                announceToScreenReader('Page loading completed, but took longer than expected');
            }
        }
    });
}

// Responsive Navigation for Mobile
function initializeMobileNavigation() {
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');

    if (window.innerWidth <= 768 && navContainer && navMenu) {
        // Create mobile menu toggle
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-nav-toggle';
        mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
        mobileToggle.innerHTML = '☰';

        navContainer.insertBefore(mobileToggle, navMenu);

        // Toggle mobile menu
        mobileToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.style.display = isExpanded ? 'none' : 'flex';
            this.innerHTML = isExpanded ? '☰' : '✕';
            announceToScreenReader(`Navigation menu ${isExpanded ? 'closed' : 'opened'}`);
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.style.display = 'flex';
                if (mobileToggle.parentNode) {
                    mobileToggle.parentNode.removeChild(mobileToggle);
                }
            }
        });
    }
}


  
// Text-to-Speech Functionality
function initializeTextToSpeech() {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        console.log('Text-to-speech not supported in this browser');
        return;
    }

    // Create speech controls container
    const speechControls = document.createElement('div');
    speechControls.className = 'speech-controls';
    speechControls.setAttribute('role', 'region');
    speechControls.setAttribute('aria-label', 'Text-to-speech controls');

    // Create floating speech toggle button
    const speechToggle = document.createElement('button');
    speechToggle.className = 'speech-toggle';
    speechToggle.setAttribute('aria-label', 'Open text-to-speech controls');
    speechToggle.innerHTML = '🎙️';
    speechToggle.title = 'Open text-to-speech controls';

    // Create modern speech panel
    const speechPanel = document.createElement('div');
    speechPanel.className = 'speech-panel';

    // Panel header
    const panelHeader = document.createElement('div');
    panelHeader.className = 'speech-panel-header';

    const panelTitle = document.createElement('div');
    panelTitle.className = 'speech-panel-title';
    panelTitle.textContent = 'Text to Speech';

    const closeButton = document.createElement('button');
    closeButton.className = 'speech-close';
    closeButton.setAttribute('aria-label', 'Close speech controls');
    closeButton.innerHTML = '✕';

    panelHeader.appendChild(panelTitle);
    panelHeader.appendChild(closeButton);

    // Status display
    const statusDisplay = document.createElement('div');
    statusDisplay.className = 'speech-status';
    statusDisplay.textContent = 'Ready to read';

    // Progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'speech-progress';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';

    progressBar.appendChild(progressFill);
    progressContainer.appendChild(progressBar);

    // Control buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'speech-buttons';

    const playButton = document.createElement('button');
    playButton.className = 'speech-btn play';
    playButton.setAttribute('aria-label', 'Read page content aloud');
    playButton.innerHTML = '<span>▶️</span><span>Play</span>';

    const stopButton = document.createElement('button');
    stopButton.className = 'speech-btn stop';
    stopButton.setAttribute('aria-label', 'Stop reading');
    stopButton.innerHTML = '<span>⏹️</span><span>Stop</span>';
    stopButton.disabled = true;

    buttonContainer.appendChild(playButton);
    buttonContainer.appendChild(stopButton);

    // Voice control
    const voiceControl = document.createElement('div');
    voiceControl.className = 'voice-control';

    const voiceLabel = document.createElement('label');
    voiceLabel.className = 'voice-label';
    voiceLabel.textContent = 'Voice:';

    const voiceSelect = document.createElement('select');
    voiceSelect.className = 'voice-select';
    voiceSelect.setAttribute('aria-label', 'Select voice for text-to-speech');

    voiceControl.appendChild(voiceLabel);
    voiceControl.appendChild(voiceSelect);

    // Rate control
    const rateControl = document.createElement('div');
    rateControl.className = 'rate-control';

    const rateLabel = document.createElement('div');
    rateLabel.className = 'rate-label';
    rateLabel.innerHTML = '<span>Speed:</span>';

    const rateValue = document.createElement('span');
    rateValue.className = 'rate-value';
    rateValue.textContent = '1.0x';
    rateLabel.appendChild(rateValue);

    const rateSlider = document.createElement('input');
    rateSlider.type = 'range';
    rateSlider.className = 'speech-rate';
    rateSlider.min = '0.5';
    rateSlider.max = '2';
    rateSlider.step = '0.1';
    rateSlider.value = '1';
    rateSlider.setAttribute('aria-label', 'Speech rate control');

    rateControl.appendChild(rateLabel);
    rateControl.appendChild(rateSlider);

    // Assemble panel
    speechPanel.appendChild(panelHeader);
    speechPanel.appendChild(statusDisplay);
    speechPanel.appendChild(progressContainer);
    speechPanel.appendChild(buttonContainer);
    speechPanel.appendChild(voiceControl);
    speechPanel.appendChild(rateControl);

    // Add to container
    speechControls.appendChild(speechToggle);
    speechControls.appendChild(speechPanel);

    // Insert controls at the bottom right of the page
    document.body.appendChild(speechControls);

    // Panel state
    let isPanelOpen = false;

    // Panel toggle functionality
    speechToggle.addEventListener('click', function() {
        isPanelOpen = !isPanelOpen;
        if (isPanelOpen) {
            speechPanel.classList.add('show');
            speechToggle.classList.add('active');
            speechToggle.setAttribute('aria-label', 'Close text-to-speech controls');
            announceToScreenReader('Text-to-speech controls opened');
        } else {
            speechPanel.classList.remove('show');
            speechToggle.classList.remove('active');
            speechToggle.setAttribute('aria-label', 'Open text-to-speech controls');
            announceToScreenReader('Text-to-speech controls closed');
        }
    });

    // Close panel functionality
    closeButton.addEventListener('click', function() {
        isPanelOpen = false;
        speechPanel.classList.remove('show');
        speechToggle.classList.remove('active');
        speechToggle.setAttribute('aria-label', 'Open text-to-speech controls');
        announceToScreenReader('Text-to-speech controls closed');
    });

    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
        if (isPanelOpen && !speechControls.contains(e.target)) {
            isPanelOpen = false;
            speechPanel.classList.remove('show');
            speechToggle.classList.remove('active');
            speechToggle.setAttribute('aria-label', 'Open text-to-speech controls');
        }
    });

    // Populate voice options
    function populateVoices() {
        const voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';

        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            if (voice.default) {
                option.textContent += ' (Default)';
            }
            voiceSelect.appendChild(option);
        });
    }

    // Initial voice population and update when voices change
    populateVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoices;
    }

    // Update rate display
    rateSlider.addEventListener('input', function() {
        rateValue.textContent = `${this.value}x`;
        if (isReading && speechUtterance) {
            speechUtterance.rate = parseFloat(this.value);
        }
    });

    // Get readable text content
    function getReadableText() {
        const selectors = [
            'main h1', 'main h2', 'main h3', 'main p',
            'main li', '.rover-card h3', '.rover-card p',
            '.achievement-card h3', '.achievement-card p'
        ];

        const elements = document.querySelectorAll(selectors.join(', '));
        const text = Array.from(elements)
            .map(el => {
                // Skip hidden elements
                if (el.offsetParent === null) return '';
                return el.textContent.trim();
            })
            .filter(text => text.length > 0)
            .join('\n\n');

        return text;
    }

    // Update status display
    function updateStatus(message, type = '') {
        statusDisplay.textContent = message;
        statusDisplay.className = `speech-status ${type} show`;

        if (type) {
            setTimeout(() => {
                statusDisplay.classList.remove('show');
            }, 3000);
        }
    }

    // Speech synthesis state
    let speechUtterance = null;
    let isReading = false;
    let speechStartTime = null;
    let speechDuration = null;

    // Play button click handler
    playButton.addEventListener('click', function() {
        if (!isReading) {
            const text = getReadableText();
            if (text.trim()) {
                updateStatus('Loading...', 'loading');
                playButton.disabled = true;
                stopButton.disabled = false;

                // Cancel any existing speech
                speechSynthesis.cancel();

                // Create new utterance
                speechUtterance = new SpeechSynthesisUtterance(text);

                // Configure voice
                const voices = speechSynthesis.getVoices();
                if (voices[voiceSelect.value]) {
                    speechUtterance.voice = voices[voiceSelect.value];
                }

                // Set rate
                speechUtterance.rate = parseFloat(rateSlider.value);

                // Event handlers
                speechUtterance.onstart = function() {
                    isReading = true;
                    speechStartTime = Date.now();
                    speechToggle.classList.add('playing');
                    updateStatus('Reading content...', 'playing');
                    progressBar.classList.add('show');
                    announceToScreenReader('Started reading page content');
                };

                speechUtterance.onend = function() {
                    isReading = false;
                    speechToggle.classList.remove('playing');
                    updateStatus('Finished reading', 'stopped');
                    playButton.disabled = false;
                    stopButton.disabled = true;
                    progressBar.classList.remove('show');
                    progressFill.style.width = '0%';
                    announceToScreenReader('Finished reading page content');
                };

                speechUtterance.onerror = function(event) {
                    console.error('Speech synthesis error:', event);
                    isReading = false;
                    speechToggle.classList.remove('playing');
                    updateStatus('Error occurred', 'stopped');
                    playButton.disabled = false;
                    stopButton.disabled = true;
                    progressBar.classList.remove('show');
                    announceToScreenReader('Error occurred while reading content');
                };

                speechUtterance.onboundary = function(event) {
                    if (speechStartTime && speechUtterance.text) {
                        const elapsed = Date.now() - speechStartTime;
                        const progress = (event.charIndex / speechUtterance.text.length) * 100;
                        progressFill.style.width = `${progress}%`;
                    }
                };

                // Start speaking
                speechSynthesis.speak(speechUtterance);
            } else {
                updateStatus('No content to read', 'stopped');
                announceToScreenReader('No readable content found on this page');
            }
        }
    });

    // Stop button click handler
    stopButton.addEventListener('click', function() {
        speechSynthesis.cancel();
        isReading = false;
        speechToggle.classList.remove('playing');
        updateStatus('Stopped', 'stopped');
        playButton.disabled = false;
        stopButton.disabled = true;
        progressBar.classList.remove('show');
        progressFill.style.width = '0%';
        announceToScreenReader('Stopped reading content');
    });

    // Voice change handler
    voiceSelect.addEventListener('change', function() {
        if (isReading && speechUtterance) {
            // Restart speech with new voice
            const wasReading = isReading;
            speechSynthesis.cancel();
            isReading = false;

            if (wasReading) {
                setTimeout(() => playButton.click(), 100);
            }
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt + R: Start/stop reading
        if (e.altKey && e.key === 'r') {
            e.preventDefault();
            if (!isPanelOpen) {
                speechToggle.click();
                setTimeout(() => {
                    if (!isReading) {
                        playButton.click();
                    } else {
                        stopButton.click();
                    }
                }, 300);
            } else {
                if (!isReading) {
                    playButton.click();
                } else {
                    stopButton.click();
                }
            }
        }

        // Escape: Close panel
        if (e.key === 'Escape' && isPanelOpen) {
            closeButton.click();
        }
    });
}

// Search functionality (for future enhancement)
function initializeSearch() {
    // This is a placeholder for future search functionality
    // Could be implemented to search through FAQ items or content
}

// Form validation (for future contact forms)
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.setAttribute('aria-invalid', 'true');

                    // Create or update error message
                    let errorElement = field.parentNode.querySelector('.error-message');
                    if (!errorElement) {
                        errorElement = document.createElement('div');
                        errorElement.className = 'error-message';
                        errorElement.setAttribute('role', 'alert');
                        field.parentNode.appendChild(errorElement);
                    }
                    errorElement.textContent = `${field.getAttribute('aria-label') || field.name || 'This field'} is required`;
                } else {
                    field.setAttribute('aria-invalid', 'false');
                    const errorElement = field.parentNode.querySelector('.error-message');
                    if (errorElement) {
                        errorElement.remove();
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();
                announceToScreenReader('Please correct the errors in the form');
            }
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize additional features (called from main DOMContentLoaded event)
function initializeAdditionalFeatures() {
    initializeImageLoading();
    initializePerformanceMonitoring();
    initializeMobileNavigation();
    initializeTextToSpeech();

    // Add smooth reveal animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.rover-card, .achievement-card, .tech-card, .timeline-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    announceToScreenReader('An error occurred on the page');
});

// Export functions for potential use by other scripts
window.MarsRovers = {
    announceToScreenReader,
    toggleDarkMode: () => document.querySelector('.dark-mode-toggle')?.click(),
    scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' })
};
