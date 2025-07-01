// Project data
const projects = {
    '3d-portfolio': {
        title: "3D_PORTFOLIO",
        date: "June 2023",
        category: "Web Development",
        description: "An interactive 3D portfolio built with Three.js that showcases my projects in an immersive environment. The portfolio features a central wireframe sphere with orbiting project spheres that users can interact with. Each project sphere reveals details about the work when clicked, creating an engaging user experience that demonstrates both technical and creative skills.",
        features: [
            "Interactive 3D scene with Three.js",
            "Custom wireframe shaders for visual appeal",
            "Dynamic project loading system",
            "Responsive design for all devices",
            "Smooth animations and transitions",
            "Starfield background effect",
            "Mobile-friendly interactions"
        ],
        technologies: ["Three.js", "WebGL", "JavaScript", "HTML5", "CSS3", "GLSL"],
        githubLink: "https://github.com/yourusername/3d-portfolio",
        images: [
            "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop"
        ]
    },
    // Add other projects with the same structure
};

// Function to get URL parameters
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to load project details
function loadProjectDetails() {
    const projectId = getQueryParam('project');
    const project = projects[projectId];

    if (project) {
        // Update page title
        document.title = `${project.title} | Daranish's Portfolio`;

        // Update header
        document.getElementById('detail-title').textContent = project.title;
        document.getElementById('detail-date').textContent = project.date;
        document.getElementById('detail-category').textContent = project.category;

        // Update hero image
        const heroImg = document.getElementById('detail-hero-image');
        heroImg.src = project.images[0];
        heroImg.alt = `${project.title} Screenshot`;

        // Update description
        document.getElementById('detail-description').textContent = project.description;

        // Update features
        const featuresList = document.getElementById('detail-features');
        featuresList.innerHTML = project.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');

        // Update gallery
        const gallery = document.getElementById('detail-gallery');
        gallery.innerHTML = project.images.map((img, index) => 
            `<div class="gallery-item">
                <img src="${img}" alt="${project.title} Screenshot ${index + 1}">
            </div>`
        ).join('');

        // Update technologies
        const techBadges = document.getElementById('detail-technologies');
        techBadges.innerHTML = project.technologies.map(tech => 
            `<span class="badge">${tech}</span>`
        ).join('');

        // Update GitHub link
        const githubLink = document.getElementById('detail-code-link');
        githubLink.href = project.githubLink;
    } else {
        // Project not found - redirect to home
        window.location.href = 'index.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadProjectDetails);