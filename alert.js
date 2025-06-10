document.addEventListener('DOMContentLoaded', function() {
    // This flag ensures the alert only shows once per browser session (or until localStorage is cleared)
        Swal.fire({
            title: 'Important Note',
            html: 'This invitation has been specially selected for our cherished guests. We kindly ask that you do not forward the link to anyone without our prior approval. Thank you for your understanding and cooperation.',
            icon: 'Note', // You can change this: 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: 'Okay!',
            customClass: {
                popup: 'custom-swal-popup', // Optional: add a custom class for styling the whole popup
                title: 'custom-swal-title', // Optional: for styling the title
                htmlContainer: 'custom-swal-html-container', // Optional: for styling the message container
                confirmButton: 'custom-swal-confirm-button' // Optional: for styling the button
            },
            allowOutsideClick: false, // Prevents closing by clicking outside the alert
            allowEscapeKey: false,   // Prevents closing with the Escape key
            stopKeydownPropagation: false // Prevents key presses from interacting with the background page
        }).then((result) => {
            // After the user clicks "Got It!", set a flag in localStorage
            // so the alert doesn't pop up again for this user.
           
        });
    
});