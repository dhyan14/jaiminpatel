document.addEventListener('DOMContentLoaded', function() {
    // resource filtering functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    const resourceItems = document.querySelectorAll('.resource-item');
    
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const category = button.getAttribute('data-category');
                
                // Show/hide resources based on category
                resourceItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Animate equations in the background
    const equations = document.querySelectorAll('.equation');
    
    if (equations.length > 0) {
        equations.forEach(equation => {
            // Random starting position
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            
            equation.style.left = `${startX}%`;
            equation.style.top = `${startY}%`;
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Course modal functionality
    const courseModal = document.getElementById('course-modal');
    const courseTitle = document.getElementById('course-title');
    const courseButtons = document.querySelectorAll('.course-btn');
    const courseContents = document.querySelectorAll('.course-content');
    const closeModalButton = document.querySelector('.close-modal');

    // Course button click handlers
    if (courseButtons.length > 0) {
        courseButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const course = this.getAttribute('data-course');
                
                // Set the modal title based on the course
                switch(course) {
                    case 'btech':
                        courseTitle.textContent = 'B.Tech Course Materials';
                        break;
                    case 'mca':
                        courseTitle.textContent = 'MCA Course Materials';
                        break;
                    case 'imca':
                        courseTitle.textContent = 'iMCA Course Materials';
                        break;
                    case 'bca':
                        courseTitle.textContent = 'BCA Course Materials';
                        break;
                    default:
                        courseTitle.textContent = 'Course Materials';
                }
                
                // Hide all course contents first
                courseContents.forEach(content => {
                    content.style.display = 'none';
                });
                
                // Show the selected course content
                const selectedContent = document.getElementById(`${course}-content`);
                if (selectedContent) {
                    selectedContent.style.display = 'block';
                }
                
                // Show the modal
                courseModal.style.display = 'block';
            });
        });
    }

    // Close modal when clicking the close button
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            courseModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === courseModal) {
            courseModal.style.display = 'none';
        }
    });

    // Initialize course data in session storage if not exists
    if (!sessionStorage.getItem('courseData')) {
        const initialCourses = {
            'btech': { title: 'B.Tech', maxSemesters: 4, unitLabel: 'Unit' },
            'mca': { title: 'MCA', maxSemesters: 1, unitLabel: 'Module' },
            'imca': { title: 'iMCA', maxSemesters: 4, unitLabel: 'Unit' },
            'bca': { title: 'BCA', maxSemesters: 3, unitLabel: 'Unit' }
        };
        sessionStorage.setItem('courseData', JSON.stringify(initialCourses));
    }

    // Initialize resource data in session storage if not exists
    if (!sessionStorage.getItem('resourceData')) {
        const initialResources = {
            "btech": {
                "1": {
                    "1": "https://drive.google.com/file/d/11iSgkma5b018OCZbPDuHO3k9DvwDAzb-/preview",
                    "2": "https://drive.google.com/file/d/126B6oKXRK0srsK0Qdk6dqOdX39S82WIL/preview",
                    "3": "https://drive.google.com/file/d/10-0644Wju4tSzKAvK7l_pZtgmmnlux0q/preview",
                    "4": "https://drive.google.com/file/d/11lMrU26YRm-Zq3NJbFLZ2xIBHP3C9trS/preview"
                },
                "2": {
                    "1": "https://drive.google.com/file/d/11FtHXLNLPbeqNM8U2gAihuSA1MuK2PVJ/preview",
                    "2": "https://drive.google.com/file/d/1tKdIYTDpLX3S-S8V2z68RhyhOEYS4Yfv/preview",
                    "3": "https://drive.google.com/file/d/15NGabszjq3397ArlhAiDaSpyXCFjNFxv/preview"
                }
            },
            "mca": {
                "1": {
                    "1": "https://drive.google.com/file/d/1YWZpDdD3NjZosWSvnBumaiWPhde870T2/preview",
                    "2": "https://drive.google.com/file/d/1VZCrle_06AG_XUcRFoMSFZ23bTY5fJxr/preview",
                    "3": "https://drive.google.com/file/d/1X1eZ06AzkL_NdtVZUy8TB5C09DUeAxyp/preview",
                    "4": "https://drive.google.com/file/d/1W_VJwZozU3MkEeADeEGIhb9lfylYT7zm/preview",
                    "5": "https://drive.google.com/file/d/1ZeNfV9_-1-p0YfWS18nmXcpIPKzfeKkg/preview"
                }
            }
        };
        sessionStorage.setItem('resourceData', JSON.stringify(initialResources));
    }
}); 
