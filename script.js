// Portfolio Website JavaScript

// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectsContainer = document.querySelector('#projects-container');
const contactForm = document.querySelector('#contactForm');
const projectModal = document.getElementById('projectModal');
const modalContent = document.querySelector('.modal-body');
const closeModal = document.querySelector('.close');
const testimonialForm = document.querySelector('#testimonialForm');
const testimonialsContainer = document.querySelector('#testimonials-container');

// GitHub Configuration
const GITHUB_USERNAME = 'popen006'; // Your GitHub username
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_cjhermida'; // Replace with actual service ID
const EMAILJS_TEMPLATE_ID = 'template_cjhermida'; // Replace with actual template ID
const EMAILJS_PUBLIC_KEY = 'user_cjhermida'; // Replace with actual public key

// Backend API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Project Categories (for filtering)
const PROJECT_CATEGORIES = {
    'web': ['Web Development', 'Frontend', 'Backend', 'Full Stack'],
    'mobile': ['Mobile App', 'iOS', 'Android', 'React Native'],
    'desktop': ['Desktop App', 'Python', 'Java', 'C#'],
    'other': ['Other', 'Miscellaneous']
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimation();
    loadProjects();
    loadTestimonials();
    initContactForm();
    initTestimonialForm();
    initModal();
    initFilterButtons();
    initDynamicProfile();
});

// Dynamic Profile Image Functionality
function initDynamicProfile() {
    const profileCircle = document.querySelector('.profile-circle');
    if (!profileCircle) return;
    
    // Add hover effects
    profileCircle.addEventListener('mouseenter', () => {
        profileCircle.classList.add('pulse');
    });
    
    profileCircle.addEventListener('mouseleave', () => {
        profileCircle.classList.remove('pulse');
    });
    
    // Add click interaction
    profileCircle.addEventListener('click', () => {
        profileCircle.style.transform = 'scale(1.1)';
        setTimeout(() => {
            profileCircle.style.transform = 'scale(1)';
        }, 200);
    });
}

// Navigation Functions
function initNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll Animation
function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe skill bars
    document.querySelectorAll('.skill-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease 0.2s';
        observer.observe(el);
    });
}

// Projects Section
async function loadProjects() {
    try {
        // First, try to load from GitHub API
        const githubProjects = await fetchGithubProjects();
        
        if (githubProjects && githubProjects.length > 0) {
            displayProjects(githubProjects);
        } else {
            // Fallback to mock projects
            displayProjects(getMockProjects());
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        displayProjects(getMockProjects());
    }
}

async function fetchGithubProjects() {
    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const repos = await response.json();
        
        // Filter out forks and filter by topics/languages
        const projects = await Promise.all(repos
            .filter(repo => !repo.fork && !repo.private)
            .map(async repo => {
                // Fetch languages for each repository
                const languages = await fetchRepoLanguages(repo.languages_url);
                
                // Use enhanced image generation and categorization
                const projectImage = getProjectImage(repo.name, repo.description);
                const category = categorizeProjectFromRepo(repo);
                
                return {
                    id: repo.id,
                    name: repo.name,
                    description: repo.description || 'No description available',
                    image: projectImage,
                    category: category,
                    technologies: languages.length > 0 ? languages : [repo.language || 'Various'],
                    github: repo.html_url,
                    live: repo.homepage || null,
                    stars: repo.stargazers_count,
                    language: repo.language
                };
            }));
        
        return projects.sort((a, b) => b.stars - a.stars);
    } catch (error) {
        console.error('Failed to fetch GitHub projects:', error);
        return null;
    }
}

async function fetchRepoLanguages(languagesUrl) {
    try {
        const response = await fetch(languagesUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const languagesData = await response.json();
        
        // Convert object to array and sort by bytes used (descending)
        const languages = Object.keys(languagesData)
            .map(lang => ({ name: lang, bytes: languagesData[lang] }))
            .sort((a, b) => b.bytes - a.bytes)
            .slice(0, 5) // Limit to top 5 languages
            .map(lang => lang.name);
        
        return languages.length > 0 ? languages : [];
    } catch (error) {
        console.error('Failed to fetch repository languages:', error);
        return [];
    }
}

function categorizeProject(repo) {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const topics = (repo.topics || []).map(t => t.toLowerCase());
    
    // Check for web development keywords
    if (name.includes('web') || name.includes('site') || name.includes('app') || 
        description.includes('web') || description.includes('website') ||
        topics.includes('web') || topics.includes('frontend') || topics.includes('backend')) {
        return 'web';
    }
    
    // Check for mobile keywords
    if (name.includes('mobile') || name.includes('app') || 
        description.includes('mobile') || description.includes('android') || description.includes('ios') ||
        topics.includes('mobile') || topics.includes('android') || topics.includes('ios')) {
        return 'mobile';
    }
    
    // Check for desktop keywords
    if (name.includes('desktop') || name.includes('windows') || name.includes('mac') ||
        description.includes('desktop') || description.includes('windows') ||
        topics.includes('desktop') || topics.includes('windows')) {
        return 'desktop';
    }
    
    return 'other';
}

function getRandomColor() {
    const colors = ['4f46e5', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '06b6d4'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Enhanced project image generation with GitHub repository data
function getProjectImage(repoName, description) {
    // Check if we have a local image for this project
    const localImage = getLocalProjectImage(repoName);
    if (localImage) {
        return localImage;
    }
    
    // Generate GitHub repository image URL
    const repoUrl = `https://github.com/popen006/${repoName}`;
    
    // Try to get repository image from GitHub
    return `https://opengraph.githubassets.com/1/popen006/${repoName}`;
}

// Check for local project images
function getLocalProjectImage(repoName) {
    const repoLower = repoName.toLowerCase();
    
    // Map repository names to local images
    const imageMap = {
        'soulmate-website': 'assets/images/projects/soulmate.jpg',
        'soulmate-backup': 'assets/images/projects/soulmate-backup-preview.jpg',
        'console-based-grading-system': 'assets/images/projects/console-based-grading-system.jpg',
        'tiffany-s-cake-and-pastries': 'assets/images/projects/tiffany.jpg',
        'portfolio': 'assets/images/projects/portfolio-preview.jpg',
        'portfolio-website': 'assets/images/projects/portfolio-preview.jpg',
        'it-portfolio': 'assets/images/projects/portfolio-preview.jpg'
    };
    
    return imageMap[repoLower] || null;
}

// Enhanced project categorization based on repository data
function categorizeProjectFromRepo(repo) {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    const language = (repo.language || '').toLowerCase();
    
    // Check for web development keywords
    if (name.includes('web') || name.includes('site') || name.includes('app') || 
        description.includes('web') || description.includes('website') ||
        language === 'javascript' || language === 'html' || language === 'css' ||
        language === 'react' || language === 'vue' || language === 'angular') {
        return 'web';
    }
    
    // Check for mobile keywords
    if (name.includes('mobile') || name.includes('app') || 
        description.includes('mobile') || description.includes('android') || description.includes('ios') ||
        language === 'java' || language === 'kotlin' || language === 'swift') {
        return 'mobile';
    }
    
    // Check for desktop keywords
    if (name.includes('desktop') || name.includes('windows') || name.includes('java') ||
        description.includes('desktop') || description.includes('windows') ||
        language === 'java' || language === 'c#' || language === 'python' || language === 'c++') {
        return 'desktop';
    }
    
    return 'other';
}

function getMockProjects() {
    return [
        {
            id: 1,
            name: 'E-Commerce Website',
            description: 'A full-stack e-commerce platform built with modern technologies.',
            image: 'https://via.placeholder.com/300x200/4f46e5/ffffff?text=E-Commerce',
            category: 'web',
            technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MongoDB'],
            github: '#',
            live: '#',
            stars: 15
        },
        {
            id: 2,
            name: 'Task Management App',
            description: 'A mobile application for managing daily tasks and productivity.',
            image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Task+Manager',
            category: 'mobile',
            technologies: ['React Native', 'JavaScript', 'Firebase'],
            github: '#',
            live: '#',
            stars: 8
        },
        {
            id: 3,
            name: 'Weather Dashboard',
            description: 'A desktop application that provides real-time weather information.',
            image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Weather+App',
            category: 'desktop',
            technologies: ['Python', 'Tkinter', 'OpenWeather API'],
            github: '#',
            live: null,
            stars: 12
        },
        {
            id: 4,
            name: 'Portfolio Website',
            description: 'A responsive portfolio website showcasing projects and skills.',
            image: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Portfolio',
            category: 'web',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            github: '#',
            live: '#',
            stars: 20
        }
    ];
}

function displayProjects(projects) {
    projectsContainer.innerHTML = '';
    
    if (projects.length === 0) {
        projectsContainer.innerHTML = `
            <div class="no-projects">
                <h3>No projects found</h3>
                <p>Check back soon for updates!</p>
            </div>
        `;
        return;
    }

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = `project-card`;
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.name}" onerror="this.parentElement.style.background='var(--primary-color)'; this.parentElement.innerHTML='<i class=\'fas fa-code\'></i>';">
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.name}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" class="project-link" target="_blank">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                    ${project.live ? `<a href="${project.live}" class="project-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>` : ''}
                    <button class="project-link view-details" onclick="openProjectModal(${project.id})">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        `;
        projectsContainer.appendChild(projectCard);
    });
}

// Filter Projects - Removed categorization functionality
function initFilterButtons() {
    // Filter buttons are hidden/disabled - no categorization
    filterButtons.forEach(button => {
        button.style.display = 'none';
    });
}

// Contact Form
function initContactForm() {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Validate form
        const errors = validateForm(formData);
        
        if (Object.keys(errors).length > 0) {
            displayErrors(errors);
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send message to server (which saves to database)
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showFormMessage('success', 'Message sent successfully! I\'ll get back to you soon.');
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showFormMessage('error', 'Sorry, there was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Clear errors on input
    ['name', 'email', 'subject', 'message'].forEach(field => {
        document.getElementById(field).addEventListener('input', () => {
            document.getElementById(`${field}-error`).textContent = '';
            document.getElementById('form-message').style.display = 'none';
        });
    });
}

function validateForm(data) {
    const errors = {};
    
    if (!data.name) {
        errors.name = 'Name is required';
    } else if (data.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }
    
    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!data.subject) {
        errors.subject = 'Subject is required';
    } else if (data.subject.length < 5) {
        errors.subject = 'Subject must be at least 5 characters';
    }
    
    if (!data.message) {
        errors.message = 'Message is required';
    } else if (data.message.length < 10) {
        errors.message = 'Message must be at least 10 characters';
    }
    
    return errors;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function displayErrors(errors) {
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
        }
    });
}

function showFormMessage(type, message) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.className = type;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Modal Functions
function initModal() {
    // Close modal when clicking X
    closeModal.addEventListener('click', closeProjectModal);
    
    // Close modal when clicking outside
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });
}

function openProjectModal(projectId) {
    // This would be implemented with actual project data
    // For now, we'll use mock data
    const mockProject = {
        id: projectId,
        name: 'Project Details',
        description: 'Detailed description of the project goes here.',
        technologies: ['Technology 1', 'Technology 2', 'Technology 3'],
        github: '#',
        live: '#',
        image: 'https://via.placeholder.com/600x400/4f46e5/ffffff?text=Project+Image'
    };
    
    modalContent.innerHTML = `
        <div class="modal-project-image">
            <img src="${mockProject.image}" alt="${mockProject.name}">
        </div>
        <h3>${mockProject.name}</h3>
        <p>${mockProject.description}</p>
        <div class="modal-tech">
            <h4>Technologies Used:</h4>
            <div class="tech-list">
                ${mockProject.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
        <div class="modal-links">
            <a href="${mockProject.github}" class="btn btn-primary" target="_blank">
                <i class="fab fa-github"></i> View Code
            </a>
            ${mockProject.live ? `<a href="${mockProject.live}" class="btn btn-secondary" target="_blank">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>` : ''}
        </div>
    `;
    
    projectModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    projectModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    modalContent.innerHTML = '';
}

// Testimonials Section
async function loadTestimonials() {
    try {
        // Try to load from backend API first
        const serverTestimonials = await fetchTestimonials();
        
        if (serverTestimonials && serverTestimonials.length > 0) {
            displayTestimonials(serverTestimonials);
        } else {
            // Show empty state when no testimonials in database
            displayTestimonials([]);
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        // Show empty state when API fails
        displayTestimonials([]);
    }
}

async function fetchTestimonials() {
    try {
        const response = await fetch(`${API_BASE_URL}/testimonials`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        return null;
    }
}

function getMockTestimonials() {
    return [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Carl is an excellent developer with great problem-solving skills. His attention to detail and ability to learn quickly makes him a valuable team member.',
            date: '2024-01-15'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            message: 'I had the pleasure of working with Carl on a web development project. His code quality and dedication to the project were outstanding.',
            date: '2024-02-20'
        },
        {
            id: 3,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            message: 'Carl demonstrates exceptional technical skills and a strong work ethic. He is always willing to go the extra mile to ensure project success.',
            date: '2024-03-10'
        }
    ];
}

function displayTestimonials(testimonials) {
    testimonialsContainer.innerHTML = '';
    
    if (testimonials.length === 0) {
        testimonialsContainer.innerHTML = `
            <div class="no-testimonials">
                <h3>No testimonials yet</h3>
                <p>Be the first to share your experience!</p>
            </div>
        `;
        return;
    }

    testimonials.forEach(testimonial => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card';
        
        // Format date properly from database timestamp
        let formattedDate = '';
        if (testimonial.date_created) {
            // Handle MySQL timestamp format (YYYY-MM-DD HH:MM:SS)
            const dateStr = testimonial.date_created;
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } else {
                // Fallback for different date formats
                formattedDate = dateStr.split(' ')[0]; // Just show YYYY-MM-DD part
            }
        }
        
        testimonialCard.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-text">
                    <i class="fas fa-quote-left"></i>
                    <p>${testimonial.message}</p>
                    <i class="fas fa-quote-right"></i>
                </div>
                <div class="testimonial-author">
                    <h4>${testimonial.name}</h4>
                    <span class="testimonial-date">${formattedDate}</span>
                </div>
            </div>
        `;
        testimonialsContainer.appendChild(testimonialCard);
    });
}

// Testimonial Form
function initTestimonialForm() {
    testimonialForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('testimonialName').value.trim(),
            email: document.getElementById('testimonialEmail').value.trim(),
            message: document.getElementById('testimonialMessage').value.trim()
        };
        
        // Validate form
        const errors = validateTestimonialForm(formData);
        
        if (Object.keys(errors).length > 0) {
            displayTestimonialErrors(errors);
            return;
        }
        
        // Show loading state
        const submitBtn = testimonialForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        try {
            // Try to submit to server first
            const result = await submitTestimonial(formData);
            
            if (result) {
                showTestimonialMessage('success', 'Thank you for your feedback! Your testimonial has been submitted.');
                testimonialForm.reset();
                // Reload testimonials
                loadTestimonials();
            } else {
                // Fallback to local storage if server is not available
                saveTestimonialLocally(formData);
                showTestimonialMessage('success', 'Thank you for your feedback! Your testimonial has been saved locally.');
                testimonialForm.reset();
                // Show the new testimonial immediately
                loadTestimonials();
            }
        } catch (error) {
            console.error('Error submitting testimonial:', error);
            // Fallback to local storage if server is not available
            saveTestimonialLocally(formData);
            showTestimonialMessage('success', 'Thank you for your feedback! Your testimonial has been saved locally.');
            testimonialForm.reset();
            // Show the new testimonial immediately
            loadTestimonials();
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function validateTestimonialForm(data) {
    const errors = {};
    
    if (!data.name) {
        errors.name = 'Name is required';
    } else if (data.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }
    
    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!data.message) {
        errors.message = 'Testimonial is required';
    } else if (data.message.length < 20) {
        errors.message = 'Testimonial must be at least 20 characters';
    }
    
    return errors;
}

function displayTestimonialErrors(errors) {
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
        }
    });
}

function showTestimonialMessage(type, message) {
    const messageDiv = document.getElementById('testimonial-message');
    messageDiv.className = type;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

async function submitTestimonial(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/testimonials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error submitting testimonial:', error);
        return false;
    }
}

// Local Storage Functions for Testimonials
function saveTestimonialLocally(data) {
    try {
        const existingTestimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
        const newTestimonial = {
            id: Date.now(),
            name: data.name,
            email: data.email,
            message: data.message,
            date_created: new Date().toISOString(),
            is_approved: true // Local testimonials are auto-approved
        };
        
        existingTestimonials.push(newTestimonial);
        localStorage.setItem('testimonials', JSON.stringify(existingTestimonials));
        console.log('Testimonial saved locally:', newTestimonial);
    } catch (error) {
        console.error('Error saving testimonial locally:', error);
    }
}

function getLocalTestimonials() {
    try {
        const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
        return testimonials;
    } catch (error) {
        console.error('Error loading local testimonials:', error);
        return [];
    }
}

// Running Time Display with External API
function initRunningTime() {
    // Update time every second using external API
    setInterval(fetchCurrentTime, 1000);
    
    // Initial display
    fetchCurrentTime();
}

async function fetchCurrentTime() {
    try {
        // Use World Time API for accurate time
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Manila');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const timeData = await response.json();
        
        // Format the time from API response
        const timeString = formatTimeFromAPI(timeData.datetime);
        const dateString = formatDateFromAPI(timeData.datetime, timeData.day_of_week);
        
        // Update header time display
        const headerTime = document.querySelector('.header-time');
        if (headerTime) {
            headerTime.innerHTML = `
                <div class="time-display">
                    <div class="current-time">${timeString}</div>
                    <div class="current-date">${dateString}</div>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error fetching time from API:', error);
        // Fallback to local time if API fails
        const fallbackTime = new Date();
        displayFallbackTime(fallbackTime);
    }
}

function formatTimeFromAPI(datetimeString) {
    // Parse the datetime string from World Time API
    // Format: "2024-01-15T14:30:45.123456+08:00"
    const date = new Date(datetimeString);
    
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit', 
        second: '2-digit',
        hour12: false // Use 24-hour format
    });
}

function formatDateFromAPI(datetimeString, dayOfWeek) {
    // Parse the datetime string from World Time API
    const date = new Date(datetimeString);
    
    // Get day names array
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[dayOfWeek - 1] || date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${dayName}, ${monthName} ${day}, ${year}`;
}

function displayFallbackTime(date) {
    const timeString = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const dateString = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const headerTime = document.querySelector('.header-time');
    if (headerTime) {
        headerTime.innerHTML = `
            <div class="time-display">
                <div class="current-time">${timeString}</div>
                <div class="current-date">${dateString}</div>
            </div>
        `;
    }
}

// Initialize running time when DOM is loaded
document.addEventListener('DOMContentLoaded', initRunningTime);

// Utility Functions
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

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize EmailJS (if available)
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

// Export functions for global access (for onclick handlers)
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;