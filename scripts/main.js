document.addEventListener('DOMContentLoaded', function() {
    // Resource filtering functionality
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
}); 
