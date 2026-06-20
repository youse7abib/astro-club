// Star Trails Loading Animation
function initializeStarTrails() {
  const canvas = document.getElementById('loading-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Star trails configuration
  const stars = [];
  const starCount = 150;
  const speed = 3;
  
  // Initialize stars
  function initStars() {
    stars.length = 0;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * 2,
        opacity: Math.random() * 0.7 + 0.3,
        trail: []
      });
    }
  }
  
  // Animation function
  function animate() {
    // Clear with slight fade effect
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get star color from CSS variable
    const starColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--star-color')
      .trim() || '200,220,255';
    
    // Draw and update stars
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      
      // Update position
      star.x += star.vx;
      star.y += star.vy;
      
      // Wrap around screen
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;
      
      // Add to trail
      star.trail.push({ x: star.x, y: star.y });
      if (star.trail.length > 20) star.trail.shift();
      
      // Draw trail
      for (let j = 0; j < star.trail.length; j++) {
        const trailOpacity = (j / star.trail.length) * star.opacity * 0.6;
        ctx.fillStyle = `rgba(${starColor}, ${trailOpacity})`;
        const pos = star.trail[j];
        ctx.fillRect(pos.x - star.size / 2, pos.y - star.size / 2, star.size, star.size);
      }
      
      // Draw current star
      ctx.fillStyle = `rgba(${starColor}, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
      gradient.addColorStop(0, `rgba(${starColor}, ${star.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(${starColor}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(star.x - star.size * 3, star.y - star.size * 3, star.size * 6, star.size * 6);
    }
    
    requestAnimationFrame(animate);
  }
  
  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  initStars();
  animate();
}

// Loading Screen Handler - Show on full page load/refresh, hide on internal navigation
let isInternalNavigation = false;

// Add click listeners to all internal links to prevent loading screen on internal navigation
document.addEventListener('click', function(e) {
  const link = e.target.closest('a');
  if (link && link.href && !link.target) {
    const linkUrl = new URL(link.href);
    const currentUrl = new URL(window.location.href);
    
    // Check if it's an internal link (same domain)
    if (linkUrl.hostname === currentUrl.hostname) {
      isInternalNavigation = true;
    }
  }
}, true);

// Handle loading screen visibility
document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loading-screen');
  
  // Initialize star trails animation
  initializeStarTrails();
  
  if (loadingScreen) {
    // If this is internal navigation, hide loading screen immediately
    if (isInternalNavigation) {
      loadingScreen.style.display = 'none';
      isInternalNavigation = false; // Reset flag
      return;
    }
    
    // Show loading screen for external loads/refresh
    const minDuration = 2500; // 2.5 seconds minimum display time
    const startTime = Date.now();
    
    // Wait for all resources to load
    window.addEventListener('load', function() {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDuration - elapsed);
      
      // After remaining time, fade out
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // Remove loading screen from DOM after animation completes
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 800);
      }, remainingTime);
    });
    
    // Fallback: hide after minimum duration even if page doesn't fully load
    setTimeout(() => {
      if (!loadingScreen.classList.contains('fade-out')) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 800);
      }
    }, minDuration);
  }
});
