document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('.nav-links a, .logo').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offset = navbar.offsetHeight; // Get dynamic navbar height
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
            // Close mobile menu after clicking a link
            if (window.innerWidth <= 992) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Mobile Navigation (Hamburger Menu)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('no-scroll'); // Toggle body scroll
    });

    // Countdown Timer Logic
    const countdownDate = new Date('Aug 02, 2025 11:00:00').getTime(); // October 26, 2024, 4:00 PM

    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update HTML elements
        if (document.getElementById('days')) {
            document.getElementById('days').innerText = String(days).padStart(2, '0');
        }
        if (document.getElementById('hours')) {
            document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        }
        if (document.getElementById('minutes')) {
            document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        }
        if (document.getElementById('seconds')) {
            document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
        }


        if (distance < 0) {
            clearInterval(updateCountdown);
            if (document.getElementById('countdown')) {
                document.getElementById('countdown').innerHTML = "<h2>THE DAY IS HERE!</h2>";
            }
        }
    }, 1000);

    // Moments Section Carousel
   // In your script.js file, inside document.addEventListener('DOMContentLoaded', () => { ... });

    // Moments Section Carousel
    const carouselContainer = document.querySelector('.carousel-container'); // Get reference to the container
    const carouselTrack = document.querySelector('.carousel-track');
    const galleryItems = Array.from(document.querySelectorAll('.carousel-track .gallery-item'));
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;
    let itemWidth = 0; // Initialize to 0

    // Function to adjust carousel height based on the current image's aspect ratio
    const adjustCarouselHeight = (imageElement) => {
        if (!imageElement || !carouselContainer) return;

        // Ensure the image has loaded to get its natural dimensions
        // If image is already loaded, naturalWidth/Height are immediately available.
        // Otherwise, use a temporary Image object to load it without disrupting display
        if (imageElement.complete && imageElement.naturalWidth) {
            applyCalculatedHeight(imageElement);
        } else {
            const tempImg = new Image();
            tempImg.onload = () => {
                applyCalculatedHeight(tempImg);
            };
            tempImg.onerror = () => {
                console.error("Failed to load image for height calculation:", imageElement.src);
                // Fallback: set a default or minimum height if image fails to load
                if (carouselContainer) {
                    carouselContainer.style.height = '300px'; // Fallback height
                }
            };
            tempImg.src = imageElement.src;
        }
    };

    const applyCalculatedHeight = (img) => {
        if (!img.naturalWidth || !img.naturalHeight) {
            console.warn("Could not get natural dimensions for image:", img.src);
            return;
        }

        // Get the actual displayed width of one carousel item
        const currentItemDisplayedWidth = galleryItems[0].offsetWidth;

        // Calculate the required height to display the full image based on its aspect ratio
        const calculatedHeight = currentItemDisplayedWidth * (img.naturalHeight / img.naturalWidth);

        // Add padding-bottom from gallery-item to the calculated height to account for animated text
        const galleryItemPaddingBottom = parseFloat(getComputedStyle(galleryItems[0]).paddingBottom);
        const finalCarouselHeight = calculatedHeight + galleryItemPaddingBottom;


        // Apply the height to the carousel container for smooth transition
        if (carouselContainer) {
            carouselContainer.style.height = `${finalCarouselHeight}px`;
        }
    };

    const updateCarousel = () => {
        if (galleryItems.length === 0) return;

        itemWidth = galleryItems[0].offsetWidth;
        carouselTrack.style.transform = `translateX(${-currentIndex * itemWidth}px)`;

        const currentImageElement = galleryItems[currentIndex].querySelector('img');
        adjustCarouselHeight(currentImageElement); // Adjust height for the current slide
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateCarousel();
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateCarousel();
    };

    const autoSlideInterval = 5000; // 5 seconds
    let slideInterval;

    // Auto slide functionality
    const startAutoSlide = () => {
        stopAutoSlide(); // Clear any existing interval first
        slideInterval = setInterval(nextSlide, autoSlideInterval);
    };

    const stopAutoSlide = () => {
        clearInterval(slideInterval);
    };

    // Event listeners for manual navigation
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            stopAutoSlide(); // Stop auto-slide on manual interaction
            nextSlide();
            startAutoSlide(); // Restart auto-slide after interaction
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            stopAutoSlide(); // Stop auto-slide on manual interaction
            prevSlide();
            startAutoSlide(); // Restart auto-slide after interaction
        });
    }

    // Recalculate widths and adjust height on window resize
    window.addEventListener('resize', () => {
        // Temporarily disable transitions during resize for smoother adjustment
        carouselTrack.style.transition = 'none';
        if (carouselContainer) {
            carouselContainer.style.transition = 'none';
        }

        currentIndex = 0; // Reset to first slide or adjust to maintain current view if complex

        // Re-calculate all widths and heights immediately after resize
        updateCarousel();

        // Re-enable transitions after a slight delay to allow layout to settle
        setTimeout(() => {
            carouselTrack.style.transition = 'transform 0.5s ease-in-out';
            if (carouselContainer) {
                carouselContainer.style.transition = 'height 0.5s ease-in-out';
            }
        }, 50);

        stopAutoSlide();
        startAutoSlide();
    });

    // Initial carousel setup and auto-slide start
    updateCarousel(); // Call once to set initial position and height
    startAutoSlide();


    // Lightbox Functionality (no changes needed here, keeping for completeness)
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.querySelector('.close-btn');

    // Ensure lightbox is hidden on page load
    if (lightboxModal) {
        lightboxModal.style.display = 'none';
    }

    document.querySelectorAll('.gallery-item img').forEach(item => {
        item.addEventListener('click', event => {
            console.log("Image clicked! Opening lightbox."); // Debugging
            if (lightboxModal) {
                lightboxModal.classList.add('active');
                lightboxModal.style.display = 'flex'; // Ensure display is flex when active
            }
            if (lightboxImage) {
                lightboxImage.src = item.src;
                lightboxImage.alt = item.alt;
            }
            if (lightboxCaption) {
                lightboxCaption.textContent = item.nextElementSibling ? item.nextElementSibling.textContent : item.alt; // Get text from animated-text or alt
            }
            document.body.classList.add('no-scroll'); // Prevent scrolling
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            console.log("Close button clicked! Closing lightbox."); // Debugging
            if (lightboxModal) {
                lightboxModal.classList.remove('active');
                lightboxModal.style.display = 'none'; // Explicitly hide
            }
            if (lightboxImage) {
                lightboxImage.classList.remove('zoomed'); // Remove zoom if applied
            }
            document.body.classList.remove('no-scroll'); // Re-enable scrolling
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            // Debugging: Check where the click occurred
            console.log("Lightbox overlay clicked. Target:", e.target);
            // Close modal if clicked directly on the overlay, not on the image or caption
            if (e.target === lightboxModal) {
                console.log("Click was on the overlay, closing lightbox."); // Debugging
                lightboxModal.classList.remove('active');
                lightboxModal.style.display = 'none'; // Explicitly hide
                lightboxImage.classList.remove('zoomed');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    if (lightboxImage) {
        lightboxImage.addEventListener('click', () => {
            lightboxImage.classList.toggle('zoomed');
        });
    }

    // Keyboard navigation for lightbox (Escape key to close)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            console.log("Escape key pressed. Closing lightbox."); // Debugging
            lightboxModal.classList.remove('active');
            lightboxModal.style.display = 'none'; // Explicitly hide
            if (lightboxImage) {
                lightboxImage.classList.remove('zoomed');
            }
            document.body.classList.remove('no-scroll');
        }
    });

    // Song Lyrics Modal Functionality
    const songLyrics = {
        '131': {
            title: 'Song 131: What God Has Yoked Together',
            lyrics: `1.With dignity and joy,
A threefold cord is bound.
With God and men to witness,
These sacred vows resound.

(CHORUS 1)
He vowed before Jehovah
To love her from the heart.
“What God has yoked together,
Let no man put apart.”

2.They both have searched God’s Word
To learn to do his will,
And now they seek his blessing,
Their promise to fulfill.

(CHORUS 2)
She vowed before Jehovah
To love him from the heart.
“What God has yoked together,
Let no man put apart.”`
        },
        '132': {
            title: 'Song 132: Now we are one',
            lyrics: `1.This is at last bone of my bone,
Flesh of my flesh; now I’m not alone.
God has provided a partner,
Someone to call my own.
Now we are one; now there can be
Blessings to share for you and for me.
As man and woman together,
We are a family.
Ev’ry day we’ll serve our God above.
As he shows the way,
Unfailing love we’ll display.
As we have vowed, so may it be.
Seasons of joy, may we come to see.
Oh, may we honor Jehovah,
And may you always be my love.`
        }
    };

    const modal = document.getElementById('songLyricsModal');
    const songTitle = document.getElementById('songTitle');
    const songLyricsText = document.getElementById('songLyrics');
    const closeModal = document.querySelector('.close-modal');

    document.querySelectorAll('.song-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const songNum = this.getAttribute('data-song');
            if (songLyrics[songNum]) {
                songTitle.textContent = songLyrics[songNum].title;
                songLyricsText.textContent = songLyrics[songNum].lyrics;
                modal.classList.add('show'); // Use class to show modal
            }
        });
    });

    closeModal.addEventListener('click', function() {
        modal.classList.remove('show');
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.classList.remove('show');
        }
    });
});