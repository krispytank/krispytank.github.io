// AI Lesson Plan Generator

class LessonPlanGenerator {
    constructor() {
        this.cbcCurriculum = {
            mathematics: {
                1: ['Numbers 1-10', 'Basic Addition', 'Basic Subtraction', 'Shapes and Patterns'],
                2: ['Numbers 1-100', 'Addition and Subtraction', 'Multiplication Introduction', 'Time and Money'],
                3: ['Place Value', 'Multiplication Tables', 'Division', 'Fractions Introduction'],
                4: ['Large Numbers', 'Fractions', 'Decimals', 'Area and Perimeter'],
                5: ['Advanced Fractions', 'Percentages', 'Data Handling', 'Geometry'],
                6: ['Ratios and Proportions', 'Algebra Introduction', 'Statistics', 'Advanced Geometry']
            },
            english: {
                1: ['Letter Recognition', 'Simple Words', 'Basic Reading', 'Listening Skills'],
                2: ['Phonics', 'Simple Sentences', 'Reading Comprehension', 'Creative Writing'],
                3: ['Grammar Basics', 'Storytelling', 'Poetry Introduction', 'Oral Communication'],
                4: ['Advanced Grammar', 'Essay Writing', 'Literature', 'Public Speaking'],
                5: ['Critical Thinking', 'Research Skills', 'Drama and Performance', 'Media Literacy'],
                6: ['Advanced Writing', 'Literary Analysis', 'Debate Skills', 'Creative Expression']
            },
            science: {
                1: ['My Body', 'Plants and Animals', 'Water and Air', 'Safety'],
                2: ['Living and Non-living', 'Weather', 'Simple Machines', 'Health and Hygiene'],
                3: ['Classification', 'Forces and Motion', 'Energy', 'Environment'],
                4: ['Life Cycles', 'Matter and Materials', 'Light and Sound', 'Ecosystems'],
                5: ['Human Body Systems', 'Chemical Changes', 'Earth and Space', 'Technology'],
                6: ['Advanced Biology', 'Chemistry Basics', 'Physics Principles', 'Environmental Science']
            }
        };
        
        this.localMaterials = [
            'Stones and pebbles',
            'Sticks and twigs',
            'Leaves and flowers',
            'Clay or mud',
            'Bottles and containers',
            'Cardboard and paper',
            'Seeds and fruits',
            'Sand and soil',
            'String and rope',
            'Plastic caps and lids'
        ];
        
        this.teachingStrategies = [
            'Group work and collaboration',
            'Hands-on activities',
            'Storytelling and narratives',
            'Songs and rhymes',
            'Role-playing and drama',
            'Visual aids and demonstrations',
            'Question and answer sessions',
            'Peer teaching',
            'Real-world connections',
            'Problem-solving activities'
        ];
    }

    generateAdvancedLessonPlan(subject, grade, topic, duration) {
        const gradeNum = parseInt(grade);
        const subjectTopics = this.cbcCurriculum[subject]?.[gradeNum] || [];
        
        // Find related topics for cross-curricular connections
        const relatedTopics = subjectTopics.filter(t => 
            t.toLowerCase().includes(topic.toLowerCase().split(' ')[0])
        );

        const lessonPlan = {
            metadata: {
                title: topic,
                subject: this.capitalizeFirst(subject),
                grade: `Grade ${grade}`,
                duration: `${duration} minutes`,
                curriculum: 'CBC (Competency-Based Curriculum)',
                dateCreated: new Date().toLocaleDateString()
            },
            
            competencies: this.generateCompetencies(subject, gradeNum, topic),
            
            objectives: {
                knowledge: `Students will understand the fundamental concepts of ${topic}`,
                skills: `Students will demonstrate practical application of ${topic} through hands-on activities`,
                attitudes: `Students will develop appreciation and curiosity about ${topic}`
            },
            
            prerequisites: this.generatePrerequisites(subject, gradeNum, topic),
            
            materials: {
                local: this.selectLocalMaterials(subject, topic),
                classroom: ['Chalkboard and chalk', 'Exercise books', 'Pencils/pens'],
                optional: ['Charts or posters', 'Simple calculator (if available)']
            },
            
            lessonStructure: this.generateLessonStructure(duration, subject, topic),
            
            activities: this.generateActivities(subject, gradeNum, topic),
            
            assessment: {
                formative: this.generateFormativeAssessment(subject, topic),
                summative: this.generateSummativeAssessment(subject, topic),
                rubric: this.generateRubric()
            },
            
            differentiation: this.generateDifferentiation(gradeNum),
            
            homework: this.generateHomework(subject, gradeNum, topic),
            
            reflection: 'What went well? What could be improved? How did students respond?',
            
            crossCurricular: this.generateCrossCurricular(subject, topic),
            
            safetyConsiderations: this.generateSafetyNotes(subject, topic)
        };

        return lessonPlan;
    }

    generateCompetencies(subject, grade, topic) {
        const competencies = {
            mathematics: [
                'Mathematical thinking and reasoning',
                'Problem-solving and application',
                'Mathematical communication',
                'Mathematical connections'
            ],
            english: [
                'Listening and speaking',
                'Reading and comprehension',
                'Writing and composition',
                'Language use and vocabulary'
            ],
            science: [
                'Scientific inquiry and investigation',
                'Scientific knowledge and understanding',
                'Scientific skills and processes',
                'Science and society connections'
            ]
        };
        
        return competencies[subject] || ['Critical thinking', 'Problem solving', 'Communication', 'Collaboration'];
    }

    generatePrerequisites(subject, grade, topic) {
        if (grade <= 1) return ['Basic counting and recognition skills'];
        if (grade <= 3) return [`Previous knowledge from Grade ${grade - 1}`, 'Basic literacy and numeracy'];
        return [`Concepts from Grade ${grade - 1}`, 'Fundamental subject knowledge', 'Basic study skills'];
    }

    selectLocalMaterials(subject, topic) {
        // Intelligently select materials based on subject and topic
        const subjectMaterials = {
            mathematics: ['Stones and pebbles', 'Sticks and twigs', 'Seeds and fruits', 'Bottles and containers'],
            science: ['Leaves and flowers', 'Sand and soil', 'Water and containers', 'Clay or mud'],
            english: ['Pictures and images', 'Cardboard and paper', 'Local story materials']
        };
        
        return subjectMaterials[subject] || this.localMaterials.slice(0, 4);
    }

    generateLessonStructure(duration, subject, topic) {
        const durationNum = parseInt(duration);
        
        if (durationNum <= 40) {
            return {
                introduction: Math.round(durationNum * 0.2),
                development: Math.round(durationNum * 0.6),
                conclusion: Math.round(durationNum * 0.2)
            };
        } else {
            return {
                introduction: Math.round(durationNum * 0.15),
                development: Math.round(durationNum * 0.65),
                practice: Math.round(durationNum * 0.15),
                conclusion: Math.round(durationNum * 0.05)
            };
        }
    }

    generateActivities(subject, grade, topic) {
        const activities = [];
        
        // Subject-specific activities
        switch(subject) {
            case 'mathematics':
                activities.push(
                    {
                        name: 'Concrete Exploration',
                        description: `Use local materials like stones or seeds to explore ${topic} concepts hands-on`,
                        duration: '15 minutes',
                        grouping: 'Pairs'
                    },
                    {
                        name: 'Problem Solving',
                        description: `Present real-world problems related to ${topic} that students can solve using local context`,
                        duration: '10 minutes',
                        grouping: 'Individual'
                    }
                );
                break;
                
            case 'science':
                activities.push(
                    {
                        name: 'Investigation Activity',
                        description: `Students observe and investigate ${topic} using materials from their environment`,
                        duration: '20 minutes',
                        grouping: 'Small groups'
                    },
                    {
                        name: 'Recording Observations',
                        description: 'Students draw and write about what they discovered',
                        duration: '10 minutes',
                        grouping: 'Individual'
                    }
                );
                break;
                
            case 'english':
                activities.push(
                    {
                        name: 'Interactive Discussion',
                        description: `Engage students in conversation about ${topic} using familiar examples`,
                        duration: '15 minutes',
                        grouping: 'Whole class'
                    },
                    {
                        name: 'Creative Expression',
                        description: 'Students create stories, poems, or drawings related to the topic',
                        duration: '15 minutes',
                        grouping: 'Individual'
                    }
                );
                break;
                
            default:
                activities.push(
                    {
                        name: 'Exploration Activity',
                        description: `Students explore ${topic} through guided discovery`,
                        duration: '20 minutes',
                        grouping: 'Small groups'
                    }
                );
        }
        
        return activities;
    }

    generateFormativeAssessment(subject, topic) {
        return [
            'Observation during group activities',
            'Quick oral questions throughout the lesson',
            'Thumb up/down for understanding checks',
            'Exit ticket with one thing learned'
        ];
    }

    generateSummativeAssessment(subject, topic) {
        const assessments = {
            mathematics: 'Short written exercise with 5-7 problems to solve',
            science: 'Draw and label diagram with brief explanations',
            english: 'Short paragraph writing or reading comprehension task'
        };
        
        return assessments[subject] || 'Brief written or practical assessment task';
    }

    generateRubric() {
        return {
            'Exceeds Expectations': 'Student demonstrates complete understanding and can teach others',
            'Meets Expectations': 'Student understands the concept and can apply it correctly',
            'Approaching Expectations': 'Student shows partial understanding with minor gaps',
            'Below Expectations': 'Student needs additional support to understand the concept'
        };
    }

    generateDifferentiation(grade) {
        return {
            'For struggling learners': 'Provide additional visual aids, peer support, and simplified tasks',
            'For advanced learners': 'Offer extension activities and leadership opportunities',
            'For different learning styles': 'Include visual, auditory, and kinesthetic learning opportunities',
            'Language support': grade <= 2 ? 'Use simple language and local language when necessary' : 'Provide vocabulary support and clear explanations'
        };
    }

    generateHomework(subject, grade, topic) {
        const homework = {
            mathematics: `Practice ${topic} using objects at home (counting items, sorting, basic calculations)`,
            science: `Observe and record examples of ${topic} in your environment`,
            english: `Write 3-5 sentences about ${topic} or discuss with family members`
        };
        
        return homework[subject] || `Research or practice ${topic} using available resources at home`;
    }

    generateCrossCurricular(subject, topic) {
        const connections = {
            mathematics: ['Science (measurement, data collection)', 'Art (patterns, symmetry)', 'Social Studies (maps, population)'],
            science: ['Mathematics (measurements, calculations)', 'English (vocabulary, writing observations)', 'Art (scientific drawing)'],
            english: ['Social Studies (cultural stories)', 'Science (reading scientific texts)', 'Art (creative writing, illustration)']
        };
        
        return connections[subject] || ['Mathematics (data and measurement)', 'English (vocabulary and communication)'];
    }

    generateSafetyNotes(subject, topic) {
        if (subject === 'science') {
            return [
                'Ensure all materials are safe and non-toxic',
                'Supervise students during hands-on activities',
                'Teach proper handling of materials',
                'Have first aid available'
            ];
        }
        
        return ['Ensure classroom safety during activities', 'Monitor student behavior during group work'];
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize lesson plan generator
window.lessonGenerator = new LessonPlanGenerator();

// Enhanced lesson plan display function
window.displayEnhancedLessonPlan = function(lessonPlan) {
    const output = document.getElementById('lessonOutput');
    
    output.innerHTML = `
        <div class="enhanced-lesson-plan">
            <div class="lesson-header-enhanced">
                <h2>${lessonPlan.metadata.title}</h2>
                <div class="lesson-meta-grid">
                    <div class="meta-item">
                        <strong>Subject:</strong> ${lessonPlan.metadata.subject}
                    </div>
                    <div class="meta-item">
                        <strong>Grade:</strong> ${lessonPlan.metadata.grade}
                    </div>
                    <div class="meta-item">
                        <strong>Duration:</strong> ${lessonPlan.metadata.duration}
                    </div>
                    <div class="meta-item">
                        <strong>Curriculum:</strong> ${lessonPlan.metadata.curriculum}
                    </div>
                </div>
            </div>
            
            <div class="lesson-sections">
                <div class="lesson-section-enhanced">
                    <h3>📋 Learning Competencies</h3>
                    <ul class="competency-list">
                        ${lessonPlan.competencies.map(comp => `<li>${comp}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="lesson-section-enhanced">
                    <h3>🎯 Learning Objectives</h3>
                    <div class="objectives-grid">
                        <div class="objective-item">
                            <h4>Knowledge</h4>
                            <p>${lessonPlan.objectives.knowledge}</p>
                        </div>
                        <div class="objective-item">
                            <h4>Skills</h4>
                            <p>${lessonPlan.objectives.skills}</p>
                        </div>
                        <div class="objective-item">
                            <h4>Attitudes</h4>
                            <p>${lessonPlan.objectives.attitudes}</p>
                        </div>
                    </div>
                </div>
                
                <div class="lesson-section-enhanced">
                    <h3>📚 Prerequisites</h3>
                    <ul class="prerequisite-list">
                        ${lessonPlan.prerequisites.map(prereq => `<li>${prereq}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="lesson-section-enhanced">
                    <h3>🧰 Materials & Resources</h3>
                    <div class="materials-grid">
                        <div class="material-category">
                            <h4>Local Materials</h4>
                            <ul>
                                ${lessonPlan.materials.local.map(material => `<li>${material}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="material-category">
                            <h4>Classroom Materials</h4>
                            <ul>
                                ${lessonPlan.materials.classroom.map(material => `<li>${material}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="lesson-section-enhanced">
                    <h3>⏰ Lesson Structure</h3>
                    <div class="structure-timeline">
                        ${Object.entries(lessonPlan.lessonStructure).map(([phase, time]) => `
                            <div class="timeline-item">
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <h4>${this.capitalizeFirst(phase)}</h4>
                                    <span class="time-allocation">${time} minutes</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="lesson-section-enhanced">
                    <h3>🎭 Learning Activities</h3>
                    <div class="activities-list">
                        ${lessonPlan.activities.map(activity => `
                            <div class="activity-card">
                                <div class="activity-header">
                                    <h4>${activity.name}</h4>
                                    <div class="activity-meta">
                                        <span class="duration">${activity.duration}</span>
                                        <span class="grouping">${activity.grouping}</span>
                                    </div>
                                </div>
                                <p>${activity.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="lesson-section-enhanced">
                    <h3>📊 Assessment Methods</h3>
                    <div class="assessment-methods">
                        <div class="assessment-type">
                            <h4>Formative Assessment</h4>
                            <ul>
                                ${lessonPlan.assessment.formative.map(method => `<li>${method}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="assessment-type">
                            <h4>Summative Assessment</h4>
                            <p>${lessonPlan.assessment.summative}</p>
                        </div>
                    </div>
                    
                    <div class="rubric-section">
                        <h4>Assessment Rubric</h4>
                        <div class="rubric-grid">
                            ${Object.entries(lessonPlan.assessment.rubric).map(([level, description]) => `
                                <div class="rubric-item">
                                    <h5>${level}</h5>
                                    <p>${description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="lesson-section-enhanced">
                    <h3>🎨 Differentiation Strategies</h3>
                    <div class="differentiation-grid">
                        ${Object.entries(lessonPlan.differentiation).map(([category, strategy]) => `
                            <div class="diff-item">
                                <h4>${category}</h4>
                                <p>${strategy}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="lesson-section-enhanced">
                    <h3>🏠 Homework Assignment</h3>
                    <p class="homework-text">${lessonPlan.homework}</p>
                </div>
                
                <div class="lesson-section-enhanced">
                    <h3>🔗 Cross-Curricular Connections</h3>
                    <ul class="cross-curricular-list">
                        ${lessonPlan.crossCurricular.map(connection => `<li>${connection}</li>`).join('')}
                    </ul>
                </div>
                
                ${lessonPlan.safetyConsiderations.length > 0 ? `
                    <div class="lesson-section-enhanced safety">
                        <h3>⚠️ Safety Considerations</h3>
                        <ul class="safety-list">
                            ${lessonPlan.safetyConsiderations.map(safety => `<li>${safety}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="lesson-section-enhanced">
                    <h3>📝 Teacher Reflection</h3>
                    <div class="reflection-box">
                        <p>${lessonPlan.reflection}</p>
                        <textarea placeholder="Add your post-lesson reflections here..." rows="3"></textarea>
                    </div>
                </div>
            </div>
            
            <div class="lesson-actions-enhanced">
                <button class="btn-primary" onclick="app.saveLessonPlan()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17,21 17,13 7,13 7,21"/>
                        <polyline points="7,3 7,8 15,8"/>
                    </svg>
                    Save Lesson Plan
                </button>
                <button class="btn-secondary" onclick="app.printLessonPlan()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6,9 6,2 18,2 18,9"/>
                        <path d="M6,18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2H20a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H18"/>
                        <polyline points="6,14 6,22 18,22 18,14"/>
                    </svg>
                    Print
                </button>
                <button class="btn-secondary" onclick="app.regenerateLessonPlan()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="23,4 23,10 17,10"/>
                        <polyline points="1,20 1,14 7,14"/>
                        <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4L18.36,18.36A9,9,0,0,1,3.51,15"/>
                    </svg>
                    Regenerate
                </button>
                <button class="btn-secondary" onclick="app.shareLessonPlan()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"/>
                        <circle cx="6" cy="12" r="3"/>
                        <circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    Share
                </button>
            </div>
        </div>
    `;

    // Add enhanced lesson plan styles
    this.addEnhancedLessonPlanStyles();
}

window.displayEnhancedLessonPlan.addEnhancedLessonPlanStyles = function() {
    if (!document.getElementById('enhancedLessonPlanStyles')) {
        const styles = document.createElement('style');
        styles.id = 'enhancedLessonPlanStyles';
        styles.textContent = `
            .enhanced-lesson-plan {
                padding: var(--space-6);
                max-height: 600px;
                overflow-y: auto;
            }
            
            .lesson-header-enhanced {
                margin-bottom: var(--space-8);
                padding-bottom: var(--space-6);
                border-bottom: 2px solid var(--primary-200);
            }
            
            .lesson-header-enhanced h2 {
                font-size: 1.875rem;
                font-weight: 700;
                color: var(--gray-900);
                margin-bottom: var(--space-4);
            }
            
            .lesson-meta-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--space-3);
            }
            
            .lesson-meta-grid .meta-item {
                background: var(--gray-50);
                padding: var(--space-3);
                border-radius: var(--radius-lg);
                font-size: 0.875rem;
            }
            
            .lesson-section-enhanced {
                margin-bottom: var(--space-8);
            }
            
            .lesson-section-enhanced h3 {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--gray-900);
                margin-bottom: var(--space-4);
                display: flex;
                align-items: center;
                gap: var(--space-2);
            }
            
            .objectives-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: var(--space-4);
            }
            
            .objective-item {
                background: var(--primary-50);
                padding: var(--space-4);
                border-radius: var(--radius-lg);
                border-left: 4px solid var(--primary-500);
            }
            
            .objective-item h4 {
                font-weight: 600;
                color: var(--primary-700);
                margin-bottom: var(--space-2);
            }
            
            .materials-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: var(--space-4);
            }
            
            .material-category {
                background: var(--gray-50);
                padding: var(--space-4);
                border-radius: var(--radius-lg);
            }
            
            .material-category h4 {
                font-weight: 600;
                color: var(--gray-800);
                margin-bottom: var(--space-3);
            }
            
            .structure-timeline {
                position: relative;
                padding-left: var(--space-6);
            }
            
            .timeline-item {
                position: relative;
                padding-bottom: var(--space-4);
                display: flex;
                align-items: center;
                gap: var(--space-4);
            }
            
            .timeline-marker {
                position: absolute;
                left: -28px;
                width: 12px;
                height: 12px;
                background: var(--primary-500);
                border-radius: 50%;
            }
            
            .timeline-item::before {
                content: '';
                position: absolute;
                left: -23px;
                top: 12px;
                bottom: -16px;
                width: 2px;
                background: var(--primary-200);
            }
            
            .timeline-item:last-child::before {
                display: none;
            }
            
            .timeline-content {
                display: flex;
                align-items: center;
                gap: var(--space-3);
            }
            
            .time-allocation {
                background: var(--secondary-100);
                color: var(--secondary-700);
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .activities-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-4);
            }
            
            .activity-card {
                background: var(--secondary-50);
                border: 1px solid var(--secondary-200);
                padding: var(--space-4);
                border-radius: var(--radius-lg);
            }
            
            .activity-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-3);
            }
            
            .activity-header h4 {
                font-weight: 600;
                color: var(--gray-900);
            }
            
            .activity-meta {
                display: flex;
                gap: var(--space-2);
            }
            
            .activity-meta span {
                background: var(--secondary-200);
                color: var(--secondary-800);
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .assessment-methods {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--space-6);
                margin-bottom: var(--space-6);
            }
            
            .assessment-type {
                background: var(--accent-50);
                padding: var(--space-4);
                border-radius: var(--radius-lg);
                border-left: 4px solid var(--accent-500);
            }
            
            .assessment-type h4 {
                font-weight: 600;
                color: var(--accent-700);
                margin-bottom: var(--space-3);
            }
            
            .rubric-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: var(--space-3);
                margin-top: var(--space-4);
            }
            
            .rubric-item {
                background: var(--gray-50);
                padding: var(--space-3);
                border-radius: var(--radius-md);
                border-top: 3px solid var(--primary-500);
            }
            
            .rubric-item h5 {
                font-weight: 600;
                color: var(--gray-800);
                margin-bottom: var(--space-2);
                font-size: 0.875rem;
            }
            
            .rubric-item p {
                font-size: 0.75rem;
                color: var(--gray-600);
            }
            
            .differentiation-grid {
                display: grid;
                gap: var(--space-4);
            }
            
            .diff-item {
                background: var(--gray-50);
                padding: var(--space-4);
                border-radius: var(--radius-lg);
                border-left: 4px solid var(--warning-500);
            }
            
            .diff-item h4 {
                font-weight: 600;
                color: var(--warning-700);
                margin-bottom: var(--space-2);
            }
            
            .homework-text {
                background: var(--gray-50);
                padding: var(--space-4);
                border-radius: var(--radius-lg);
                border-left: 4px solid var(--secondary-500);
                color: var(--gray-700);
            }
            
            .reflection-box {
                background: var(--gray-50);
                padding: var(--space-4);
                border-radius: var(--radius-lg);
            }
            
            .reflection-box textarea {
                width: 100%;
                margin-top: var(--space-3);
                padding: var(--space-3);
                border: 1px solid var(--gray-300);
                border-radius: var(--radius-md);
                resize: vertical;
            }
            
            .lesson-section-enhanced.safety {
                background: var(--error-50);
                padding: var(--space-4);
                border-radius: var(--radius-lg);
                border: 1px solid var(--error-200);
            }
            
            .safety-list {
                list-style: none;
                padding: 0;
            }
            
            .safety-list li {
                padding: var(--space-2) 0;
                color: var(--error-700);
                font-weight: 500;
            }
            
            .lesson-actions-enhanced {
                display: flex;
                gap: var(--space-3);
                margin-top: var(--space-8);
                padding-top: var(--space-6);
                border-top: 2px solid var(--gray-200);
                flex-wrap: wrap;
            }
            
            .lesson-actions-enhanced button {
                display: flex;
                align-items: center;
                gap: var(--space-2);
            }
            
            .lesson-actions-enhanced svg {
                width: 16px;
                height: 16px;
            }
            
            @media (max-width: 768px) {
                .lesson-meta-grid {
                    grid-template-columns: 1fr;
                }
                
                .objectives-grid {
                    grid-template-columns: 1fr;
                }
                
                .materials-grid {
                    grid-template-columns: 1fr;
                }
                
                .assessment-methods {
                    grid-template-columns: 1fr;
                }
                
                .rubric-grid {
                    grid-template-columns: 1fr;
                }
                
                .lesson-actions-enhanced {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(styles);
    }
};

// Enhance the existing generateLessonPlan method
if (window.app) {
    const originalGenerateLessonPlan = window.app.generateLessonPlan;
    window.app.generateLessonPlan = function() {
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

        // Generate enhanced lesson plan
        setTimeout(() => {
            const lessonPlan = window.lessonGenerator.generateAdvancedLessonPlan(subject, grade, topic, duration);
            window.displayEnhancedLessonPlan(lessonPlan);
            this.hideLoading();
        }, 2000);
    };
    
    // Add share lesson plan method
    window.app.shareLessonPlan = function() {
        if (navigator.share) {
            navigator.share({
                title: 'Lesson Plan',
                text: 'Check out this lesson plan generated with Teacher\'s Assistant',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const lessonContent = document.querySelector('.enhanced-lesson-plan').innerText;
            navigator.clipboard.writeText(lessonContent).then(() => {
                this.showNotification('Lesson plan copied to clipboard!', 'success');
            });
        }
    };
}

window.displayEnhancedLessonPlan.capitalizeFirst = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};