document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevent body scrolling when mobile menu is open
        document.body.classList.toggle('no-scroll');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            // Do not smooth scroll for CTA button within nav as it might have external action
            if (this.classList.contains('cta')) {
                // If it's an external link or a complex CTA, let it behave normally or add specific handler
                const href = this.getAttribute('href');
                if (href && !href.startsWith('#')) { // Check if it's an external link
                    window.open(href, '_blank'); // Open in new tab
                } else if (href === '#rsvp') {
                    // Smooth scroll to RSVP section if it's the CTA
                    const targetElement = document.querySelector(this.getAttribute('href'));
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80, // Adjust for fixed header height
                            behavior: 'smooth'
                        });
                    }
                }
                return; // Exit if it's the CTA
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header height
                    behavior: 'smooth'
                });
            }

            // Close mobile menu if open after click
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // RSVP Form submission (using placeholder Formspree)
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);

            try {
                // Show a loading SweetAlert
                Swal.fire({
                    title: 'Sending RSVP...',
                    text: 'Please wait a moment.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // IMPORTANT: Replace with your actual Formspree endpoint
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'RSVP Submitted!',
                        text: 'Thank you for your RSVP! We look forward to celebrating with you.',
                        confirmButtonText: 'Great!',
                        customClass: {
                            confirmButton: 'swal-button-primary'
                        }
                    });
                    form.reset();
                } else {
                    const data = await response.json();
                    let errorMessage = 'Failed to submit RSVP. Please try again.';
                    if (data.errors) {
                        errorMessage += '\nDetails: ' + data.errors.map(err => err.message).join(', ');
                    }
                    Swal.fire({
                        icon: 'error',
                        title: 'Submission Failed',
                        text: errorMessage,
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'swal-button-error'
                        }
                    });
                }
            } catch (error) {
                console.error('Error submitting RSVP:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'An unexpected error occurred. Please check your internet connection and try again.',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'swal-button-error'
                    }
                });
            }
        });
    }

    // Sticky navigation on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) { // Adjust threshold as needed
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

// --- Countdown Timer ---
// Set the date we're counting down to (August 02, 2025, 11:00 AM GMT)
const countDownDate = new Date("Aug 2, 2025 11:00:00 GMT+0000").getTime();

// Update the count down every 1 second
const x = setInterval(function() {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result
    document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;

    // If the count down is finished
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("days").innerHTML = "00";
        document.getElementById("hours").innerHTML = "00";
        document.getElementById("minutes").innerHTML = "00";
        document.getElementById("seconds").innerHTML = "00";
        const countdownTimerDiv = document.querySelector('.countdown-timer');
        if (countdownTimerDiv) {
            countdownTimerDiv.innerHTML = '<p class="married-message">We are married!</p>';
            countdownTimerDiv.style.fontSize = '2rem';
            countdownTimerDiv.style.padding = '20px';
            countdownTimerDiv.style.backgroundColor = 'rgba(139,90,43,0.8)';
        }
    }
}, 1000);

// Optional scroll effect (keep if you want it)
window.addEventListener('scroll', function() {
    const heroText = document.querySelector('.hero-text');
    const scrollY = window.scrollY;
    heroText.style.transform = `translateY(${scrollY * 0.2}px)`;
    heroText.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
});

   // --- Lightbox/Image Pop-up ---
const galleryItems = document.querySelectorAll('.gallery-item');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxContent = document.querySelector('.lightbox-content');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeBtn = document.querySelector('.close-btn');

// Lightbox functionality


    // Open lightbox when gallery item is clicked
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            lightboxContent.src = img.src;
            lightboxContent.alt = img.alt;
            lightboxCaption.textContent = img.getAttribute('data-caption') || '';
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox when close button is clicked
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        closeLightbox();
    });

    // Close lightbox when clicking outside the image
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
});

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });

