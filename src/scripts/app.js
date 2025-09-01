// Main Application JavaScript

class TeachersAssistant {
    constructor() {
        this.currentTab = 'dashboard';
        this.students = [
            { id: 1, name: 'John Kamau', grade: 92, assignments: [88, 95, 90], status: 'excellent' },
            { id: 2, name: 'Mary Wanjiku', grade: 78, assignments: [75, 82, 77], status: 'needs-support' },
            { id: 3, name: 'David Kipchoge', grade: 85, assignments: [80, 88, 87], status: 'good' },
            { id: 4, name: 'Grace Achieng', grade: 91, assignments: [89, 93, 91], status: 'excellent' },
            { id: 5, name: 'Peter Mwangi', grade: 67, assignments: [65, 70, 66], status: 'at-risk' }
        ];
        
        this.lessonPlans = [];
        this.resources = [];
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupForms();
        this.loadInitialData();
        this.setupOfflineSupport();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Remove active class from all nav items and tab contents
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to current tab
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
        
        this.currentTab = tabName;
        
        // Add fade-in animation
        document.getElementById(tabName).classList.add('fade-in');
        setTimeout(() => {
            document.getElementById(tabName).classList.remove('fade-in');
        }, 300);
    }

    setupForms() {
        // Lesson Plan Form
        const lessonForm = document.getElementById('lessonForm');
        if (lessonForm) {
            lessonForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.generateLessonPlan();
            });
        }

        // Grade Entry Form
        const gradeForm = document.getElementById('gradeForm');
        if (gradeForm) {
            gradeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addGrade();
            });
        }
    }

    generateLessonPlan() {
        const formData = new FormData(document.getElementById('lessonForm'));
        const subject = document.getElementById('subject').value;
        const grade = document.getElementById('grade').value;
        const topic = document.getElementById('topic').value;
        const duration = document.getElementById('duration').value;

        if (!subject || !grade || !topic) {
            alert('Please fill in all required fields');
            return;
        }

        // Show loading overlay
        this.showLoading();

        // Simulate AI generation
        setTimeout(() => {
            const lessonPlan = this.createLessonPlan(subject, grade, topic, duration);
            this.displayLessonPlan(lessonPlan);
            this.hideLoading();
        }, 2000);
    }

    createLessonPlan(subject, grade, topic, duration) {
        // AI-generated lesson plan template
        const lessonPlan = {
            title: topic,
            subject: subject,
            grade: `Grade ${grade}`,
            duration: `${duration} minutes`,
            objectives: [
                `Students will be able to understand the key concepts of ${topic}`,
                `Students will demonstrate knowledge through practical activities`,
                `Students will apply learned concepts to real-world situations`
            ],
            materials: [
                'Locally available materials (stones, sticks, leaves)',
                'Chalkboard and chalk',
                'Exercise books and pencils',
                'Printed worksheets (if available)'
            ],
            activities: [
                {
                    name: 'Introduction (10 minutes)',
                    description: `Begin with a simple question about ${topic} using familiar examples from students' daily lives`
                },
                {
                    name: 'Main Activity (20 minutes)',
                    description: `Interactive demonstration using local materials to explain ${topic} concepts`
                },
                {
                    name: 'Practice (8 minutes)',
                    description: 'Students work in pairs to practice the learned concepts'
                },
                {
                    name: 'Conclusion (2 minutes)',
                    description: 'Quick recap and assignment of homework'
                }
            ],
            assessment: {
                formative: 'Observation during group activities and questioning',
                summative: 'Written exercise to be completed as homework'
            },
            differentiation: 'Provide extra support for struggling learners and extension activities for advanced students'
        };

        return lessonPlan;
    }

    displayLessonPlan(lessonPlan) {
        const output = document.getElementById('lessonOutput');
        
        output.innerHTML = `
            <div class="lesson-plan">
                <div class="lesson-plan-header">
                    <h2>${lessonPlan.title}</h2>
                    <div class="lesson-meta">
                        <span class="meta-item">${lessonPlan.subject}</span>
                        <span class="meta-item">${lessonPlan.grade}</span>
                        <span class="meta-item">${lessonPlan.duration}</span>
                    </div>
                </div>
                
                <div class="lesson-section">
                    <h3>Learning Objectives</h3>
                    <ul class="objective-list">
                        ${lessonPlan.objectives.map(obj => `<li>${obj}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="lesson-section">
                    <h3>Materials Needed</h3>
                    <ul class="material-list">
                        ${lessonPlan.materials.map(material => `<li>${material}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="lesson-section">
                    <h3>Lesson Activities</h3>
                    <div class="activity-timeline">
                        ${lessonPlan.activities.map(activity => `
                            <div class="activity-step">
                                <h4>${activity.name}</h4>
                                <p>${activity.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="lesson-section">
                    <h3>Assessment</h3>
                    <div class="assessment-grid">
                        <div class="assessment-item">
                            <h4>Formative Assessment</h4>
                            <p>${lessonPlan.assessment.formative}</p>
                        </div>
                        <div class="assessment-item">
                            <h4>Summative Assessment</h4>
                            <p>${lessonPlan.assessment.summative}</p>
                        </div>
                    </div>
                </div>
                
                <div class="lesson-section">
                    <h3>Differentiation</h3>
                    <p>${lessonPlan.differentiation}</p>
                </div>
                
                <div class="lesson-actions">
                    <button class="btn-primary" onclick="app.saveLessonPlan()">Save Lesson Plan</button>
                    <button class="btn-secondary" onclick="app.printLessonPlan()">Print</button>
                    <button class="btn-secondary" onclick="app.regenerateLessonPlan()">Regenerate</button>
                </div>
            </div>
        `;

        // Add CSS for lesson plan display
        this.addLessonPlanStyles();
    }

    addLessonPlanStyles() {
        if (!document.getElementById('lessonPlanStyles')) {
            const styles = document.createElement('style');
            styles.id = 'lessonPlanStyles';
            styles.textContent = `
                .lesson-plan {
                    padding: var(--space-8);
                    max-height: 500px;
                    overflow-y: auto;
                }
                
                .lesson-plan-header {
                    margin-bottom: var(--space-6);
                    padding-bottom: var(--space-4);
                    border-bottom: 2px solid var(--gray-200);
                }
                
                .lesson-plan-header h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--gray-900);
                    margin-bottom: var(--space-3);
                }
                
                .lesson-meta {
                    display: flex;
                    gap: var(--space-4);
                    flex-wrap: wrap;
                }
                
                .meta-item {
                    background: var(--primary-100);
                    color: var(--primary-700);
                    padding: var(--space-1) var(--space-3);
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                
                .lesson-section {
                    margin-bottom: var(--space-6);
                }
                
                .lesson-section h3 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: var(--gray-900);
                    margin-bottom: var(--space-3);
                }
                
                .objective-list,
                .material-list {
                    list-style: none;
                    padding-left: 0;
                }
                
                .objective-list li,
                .material-list li {
                    padding: var(--space-2) 0;
                    border-left: 3px solid var(--primary-500);
                    padding-left: var(--space-4);
                    margin-bottom: var(--space-2);
                    background: var(--gray-50);
                    border-radius: 0 var(--radius-md) var(--radius-md) 0;
                }
                
                .activity-timeline {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }
                
                .activity-step {
                    background: var(--gray-50);
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                    border-left: 4px solid var(--secondary-500);
                }
                
                .activity-step h4 {
                    font-weight: 600;
                    color: var(--gray-900);
                    margin-bottom: var(--space-2);
                }
                
                .assessment-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-4);
                }
                
                .assessment-item {
                    background: var(--gray-50);
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                }
                
                .assessment-item h4 {
                    font-weight: 600;
                    color: var(--gray-900);
                    margin-bottom: var(--space-2);
                }
                
                .lesson-actions {
                    display: flex;
                    gap: var(--space-3);
                    margin-top: var(--space-6);
                    padding-top: var(--space-4);
                    border-top: 1px solid var(--gray-200);
                }
                
                @media (max-width: 768px) {
                    .lesson-meta {
                        flex-direction: column;
                        gap: var(--space-2);
                    }
                    
                    .assessment-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .lesson-actions {
                        flex-direction: column;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    addGrade() {
        const studentName = document.getElementById('studentName').value;
        const assignment = document.getElementById('assignment').value;
        const score = parseInt(document.getElementById('score').value);
        const totalMarks = parseInt(document.getElementById('totalMarks').value);

        if (!studentName || !assignment || isNaN(score) || isNaN(totalMarks)) {
            alert('Please fill in all fields');
            return;
        }

        const percentage = Math.round((score / totalMarks) * 100);
        
        // Add to students array (in a real app, this would be saved to database)
        console.log(`Added grade: ${studentName} - ${assignment}: ${percentage}%`);
        
        // Clear form
        document.getElementById('gradeForm').reset();
        
        // Show success message
        this.showNotification('Grade added successfully!', 'success');
        
        // Update charts
        setTimeout(() => {
            this.updateCharts();
        }, 500);
    }

    saveLessonPlan() {
        // In a real app, this would save to database
        this.showNotification('Lesson plan saved successfully!', 'success');
    }

    printLessonPlan() {
        window.print();
    }

    regenerateLessonPlan() {
        this.generateLessonPlan();
    }

    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add notification styles if not already added
        this.addNotificationStyles();
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 3000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    addNotificationStyles() {
        if (!document.getElementById('notificationStyles')) {
            const styles = document.createElement('style');
            styles.id = 'notificationStyles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1001;
                    background: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-xl);
                    border-left: 4px solid var(--primary-500);
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                }
                
                .notification.success {
                    border-left-color: var(--success-500);
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification-content {
                    padding: var(--space-4);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--space-3);
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--gray-400);
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .notification-close:hover {
                    color: var(--gray-600);
                }
            `;
            document.head.appendChild(styles);
        }
    }

    updateCharts() {
        // This will be called to update the charts when new data is added
        if (window.updatePerformanceChart) {
            window.updatePerformanceChart();
        }
        if (window.updateGradeDistribution) {
            window.updateGradeDistribution();
        }
    }

    loadInitialData() {
        // Load saved data from localStorage
        const savedLessons = localStorage.getItem('teacherAssistant_lessons');
        if (savedLessons) {
            this.lessonPlans = JSON.parse(savedLessons);
        }
        
        const savedStudents = localStorage.getItem('teacherAssistant_students');
        if (savedStudents) {
            this.students = JSON.parse(savedStudents);
        }
    }

    saveData() {
        // Save data to localStorage
        localStorage.setItem('teacherAssistant_lessons', JSON.stringify(this.lessonPlans));
        localStorage.setItem('teacherAssistant_students', JSON.stringify(this.students));
    }

    setupOfflineSupport() {
        // Register service worker for offline functionality
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }

        // Update offline status
        window.addEventListener('online', () => {
            this.updateOfflineStatus(true);
        });

        window.addEventListener('offline', () => {
            this.updateOfflineStatus(false);
        });
    }

    updateOfflineStatus(isOnline) {
        const offlineIndicator = document.querySelector('.offline-indicator');
        if (offlineIndicator) {
            if (isOnline) {
                offlineIndicator.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>Connected - All resources available</span>
                `;
                offlineIndicator.style.color = 'var(--success-600)';
            } else {
                offlineIndicator.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span>Offline mode - 8 resources available</span>
                `;
                offlineIndicator.style.color = 'var(--warning-600)';
            }
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TeachersAssistant();
});

// Handle mobile navigation
document.addEventListener('DOMContentLoaded', () => {
    // Add mobile navigation toggle if needed
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Create mobile navigation menu
        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';
        mobileNav.innerHTML = `
            <div class="mobile-nav-items">
                <button class="mobile-nav-item active" data-tab="dashboard">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    <span>Dashboard</span>
                </button>
                <button class="mobile-nav-item" data-tab="lessons">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                    </svg>
                    <span>Lessons</span>
                </button>
                <button class="mobile-nav-item" data-tab="grading">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 11l3 3 8-8"/>
                    </svg>
                    <span>Grading</span>
                </button>
                <button class="mobile-nav-item" data-tab="resources">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    <span>Resources</span>
                </button>
                <button class="mobile-nav-item" data-tab="training">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                    <span>Training</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(mobileNav);
        
        // Add mobile navigation styles
        const mobileStyles = document.createElement('style');
        mobileStyles.textContent = `
            @media (max-width: 768px) {
                .mobile-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    border-top: 1px solid var(--gray-200);
                    z-index: 100;
                    box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.1);
                }
                
                .mobile-nav-items {
                    display: flex;
                    justify-content: space-around;
                    padding: var(--space-2) 0;
                }
                
                .mobile-nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-1);
                    background: none;
                    border: none;
                    padding: var(--space-2);
                    color: var(--gray-500);
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: color 0.2s ease;
                }
                
                .mobile-nav-item.active {
                    color: var(--primary-600);
                }
                
                .mobile-nav-item svg {
                    width: 20px;
                    height: 20px;
                }
                
                .main-content {
                    padding-bottom: 80px;
                }
            }
        `;
        document.head.appendChild(mobileStyles);
        
        // Setup mobile navigation events
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tabName = e.currentTarget.getAttribute('data-tab');
                window.app.switchTab(tabName);
                
                // Update mobile nav active state
                document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    }
});