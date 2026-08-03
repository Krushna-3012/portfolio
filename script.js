document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // Mobile Hamburger Menu
    // ==========================================================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when navigation links are clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ==========================================================================
    // Sticky Navigation Bar & Active Link on Scroll
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Nav Link highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Trigger 150px before entering
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Force light theme and clean up local storage
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.removeItem('theme');

    // ==========================================================================
    // Portfolio Filtering System
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    // Force redraw/reflow for transition
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    // Delay hiding from display to match animation
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 400);
                }
            });
        });
    });

    // ==========================================================================
    // Custom Portfolio Lightbox Modal
    // ==========================================================================
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.querySelector('.lightbox-close');
    const viewProjectBtns = document.querySelectorAll('.btn-lightbox');

    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const imgSrc = btn.getAttribute('data-img');
            const title = btn.getAttribute('data-title');
            const desc = btn.getAttribute('data-desc');

            if (lightboxModal && lightboxImg && lightboxTitle && lightboxDesc) {
                lightboxImg.src = imgSrc;
                lightboxTitle.textContent = title;
                lightboxDesc.textContent = desc;
                
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Disable page scrolling
            }
        });
    });

    // Close Lightbox Modal
    const closeLightbox = () => {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable page scrolling
        }
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            // Close if clicking outside the content block
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    // ==========================================================================
    // Intersection Observer for Scroll Reveals & Skills Animation
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it is the skills card, trigger bar filling
                if (entry.target.classList.contains('skills-card')) {
                    entry.target.classList.add('revealed');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });



    // ==========================================================================
    // Contact Form Handler (Direct to WhatsApp) & Toast Notification
    // ==========================================================================
    const projectForm = document.getElementById('projectForm');
    const formToast = document.getElementById('formToast');

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract Form Values
            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const phone = document.getElementById('formPhone').value || 'Not provided';
            const projectSelect = document.getElementById('formProjectType');
            const projectType = projectSelect.options[projectSelect.selectedIndex].text;
            const budget = document.getElementById('formBudget').value || 'Not provided';
            const message = document.getElementById('formMessage').value;

            // Formulate WhatsApp message text
            const whatsappText = `*New Project Inquiry on Portfolio* \n\n` +
                `*Name:* ${name}\n` +
                `*Email:* ${email}\n` +
                `*Phone:* ${phone}\n` +
                `*Project Type:* ${projectType}\n` +
                `*Budget:* ${budget}\n` +
                `*Details:* ${message}`;

            // Encode message for URL
            const encodedText = encodeURIComponent(whatsappText);
            const whatsappUrl = `https://wa.me/916372582866?text=${encodedText}`;

            // Show Toast Success Notification
            if (formToast) {
                formToast.classList.add('active');
                setTimeout(() => {
                    formToast.classList.remove('active');
                }, 5000);
            }

            // Reset form fields
            projectForm.reset();

            // Open WhatsApp in a new tab
            window.open(whatsappUrl, '_blank');
        });
    }
});
