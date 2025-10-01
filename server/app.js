// Express.js Backend Server for Teacher's Assistant

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// In-memory storage (replace with MySQL in production)
let lessons = [
    {
        id: 1,
        title: 'Fractions Introduction',
        subject: 'Mathematics',
        grade: 4,
        duration: 40,
        objectives: ['Understand basic fractions', 'Identify parts of a whole'],
        createdAt: new Date('2025-01-01'),
        teacherId: 'teacher1'
    },
    {
        id: 2,
        title: 'Animal Classification',
        subject: 'Science',
        grade: 3,
        duration: 45,
        objectives: ['Classify animals by characteristics', 'Identify local animals'],
        createdAt: new Date('2025-01-02'),
        teacherId: 'teacher1'
    }
];

let students = [
    {
        id: 1,
        name: 'John Kamau',
        grade: 4,
        overallGrade: 92,
        assignments: [
            { title: 'Math Quiz 1', score: 88, totalMarks: 100, date: '2025-01-15' },
            { title: 'Science Test', score: 95, totalMarks: 100, date: '2025-01-10' },
            { title: 'English Essay', score: 90, totalMarks: 100, date: '2025-01-08' }
        ],
        status: 'excellent',
        teacherId: 'teacher1'
    },
    {
        id: 2,
        name: 'Mary Wanjiku',
        grade: 4,
        overallGrade: 78,
        assignments: [
            { title: 'Math Quiz 1', score: 75, totalMarks: 100, date: '2025-01-15' },
            { title: 'Science Test', score: 82, totalMarks: 100, date: '2025-01-10' },
            { title: 'English Essay', score: 77, totalMarks: 100, date: '2025-01-08' }
        ],
        status: 'needs-support',
        teacherId: 'teacher1'
    }
];

let resources = [
    {
        id: 1,
        title: 'Primary Mathematics Grade 4',
        type: 'textbook',
        subject: 'mathematics',
        grade: 4,
        description: 'CBC-aligned digital textbook with interactive exercises',
        url: '/resources/math-grade4.pdf',
        offlineAvailable: true,
        downloadCount: 156
    },
    {
        id: 2,
        title: 'Simple Science Experiments',
        type: 'video',
        subject: 'science',
        grade: '3-5',
        description: 'Video collection of experiments using local materials',
        url: '/resources/science-experiments.mp4',
        offlineAvailable: true,
        downloadCount: 89
    }
];

// API Routes

// Lesson Plans
app.get('/api/lessons', (req, res) => {
    const { teacherId = 'teacher1' } = req.query;
    const teacherLessons = lessons.filter(lesson => lesson.teacherId === teacherId);
    res.json(teacherLessons);
});

app.post('/api/lessons', (req, res) => {
    const { title, subject, grade, duration, objectives, teacherId = 'teacher1' } = req.body;
    
    if (!title || !subject || !grade) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newLesson = {
        id: lessons.length + 1,
        title,
        subject,
        grade: parseInt(grade),
        duration: parseInt(duration) || 40,
        objectives: objectives || [],
        createdAt: new Date(),
        teacherId
    };
    
    lessons.push(newLesson);
    res.status(201).json(newLesson);
});

app.get('/api/lessons/:id', (req, res) => {
    const lesson = lessons.find(l => l.id === parseInt(req.params.id));
    if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json(lesson);
});

// AI Lesson Plan Generation
app.post('/api/lessons/generate', (req, res) => {
    const { subject, grade, topic, duration } = req.body;
    
    if (!subject || !grade || !topic) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Simulate AI processing delay
    setTimeout(() => {
        const generatedPlan = generateAILessonPlan(subject, grade, topic, duration);
        res.json(generatedPlan);
    }, 1500);
});

// Students and Grading
app.get('/api/students', (req, res) => {
    const { teacherId = 'teacher1' } = req.query;
    const teacherStudents = students.filter(student => student.teacherId === teacherId);
    res.json(teacherStudents);
});

app.post('/api/students/:id/grades', (req, res) => {
    const studentId = parseInt(req.params.id);
    const { assignment, score, totalMarks } = req.body;
    
    const student = students.find(s => s.id === studentId);
    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }
    
    const newAssignment = {
        title: assignment,
        score: parseInt(score),
        totalMarks: parseInt(totalMarks),
        date: new Date().toISOString().split('T')[0]
    };
    
    student.assignments.push(newAssignment);
    
    // Recalculate overall grade
    const totalScore = student.assignments.reduce((sum, a) => sum + a.score, 0);
    const totalPossible = student.assignments.reduce((sum, a) => sum + a.totalMarks, 0);
    student.overallGrade = Math.round((totalScore / totalPossible) * 100);
    
    // Update status
    if (student.overallGrade >= 90) student.status = 'excellent';
    else if (student.overallGrade >= 80) student.status = 'good';
    else if (student.overallGrade >= 70) student.status = 'needs-support';
    else student.status = 'at-risk';
    
    res.json(student);
});

// Analytics
app.get('/api/analytics/class-performance', (req, res) => {
    const { teacherId = 'teacher1' } = req.query;
    const teacherStudents = students.filter(student => student.teacherId === teacherId);
    
    const classAverage = teacherStudents.reduce((sum, student) => sum + student.overallGrade, 0) / teacherStudents.length;
    const passingStudents = teacherStudents.filter(student => student.overallGrade >= 70).length;
    const passingRate = (passingStudents / teacherStudents.length) * 100;
    const atRiskStudents = teacherStudents.filter(student => student.status === 'at-risk').length;
    
    const gradeDistribution = {
        'A': teacherStudents.filter(s => s.overallGrade >= 90).length,
        'B': teacherStudents.filter(s => s.overallGrade >= 80 && s.overallGrade < 90).length,
        'C': teacherStudents.filter(s => s.overallGrade >= 70 && s.overallGrade < 80).length,
        'D': teacherStudents.filter(s => s.overallGrade >= 60 && s.overallGrade < 70).length,
        'E': teacherStudents.filter(s => s.overallGrade < 60).length
    };
    
    res.json({
        classAverage: Math.round(classAverage * 10) / 10,
        passingRate: Math.round(passingRate),
        atRiskStudents,
        totalStudents: teacherStudents.length,
        gradeDistribution,
        weeklyPerformance: generateWeeklyPerformance()
    });
});

// Resources
app.get('/api/resources', (req, res) => {
    const { subject, grade, type } = req.query;
    
    let filteredResources = resources;
    
    if (subject) {
        filteredResources = filteredResources.filter(r => r.subject === subject);
    }
    
    if (grade) {
        filteredResources = filteredResources.filter(r => 
            r.grade.toString().includes(grade) || r.grade === parseInt(grade)
        );
    }
    
    if (type) {
        filteredResources = filteredResources.filter(r => r.type === type);
    }
    
    res.json(filteredResources);
});

app.post('/api/resources/:id/download', (req, res) => {
    const resourceId = parseInt(req.params.id);
    const resource = resources.find(r => r.id === resourceId);
    
    if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
    }
    
    resource.downloadCount++;
    res.json({ message: 'Download initiated', resource });
});

// Professional Development
app.get('/api/training/courses', (req, res) => {
    const courses = [
        {
            id: 1,
            title: 'Classroom Management in Large Classes',
            description: 'Learn effective strategies for managing overcrowded classrooms',
            duration: 45,
            level: 'Beginner',
            completed: false,
            progress: 30,
            modules: [
                'Understanding classroom dynamics',
                'Effective grouping strategies',
                'Maintaining attention and engagement',
                'Managing resources and materials'
            ]
        },
        {
            id: 2,
            title: 'Using Technology in Rural Classrooms',
            description: 'Maximize teaching effectiveness with minimal technology',
            duration: 60,
            level: 'Intermediate',
            completed: false,
            progress: 0,
            modules: [
                'Offline teaching tools',
                'Mobile-first approaches',
                'Digital resource management',
                'Student engagement techniques'
            ]
        },
        {
            id: 3,
            title: 'CBC Assessment Strategies',
            description: 'Master competency-based assessment methods',
            duration: 90,
            level: 'Advanced',
            completed: true,
            progress: 100,
            modules: [
                'Understanding CBC framework',
                'Designing competency assessments',
                'Rubric development',
                'Progress tracking methods'
            ]
        }
    ];
    
    res.json(courses);
});

app.get('/api/training/badges', (req, res) => {
    const badges = [
        {
            id: 1,
            name: 'Lesson Master',
            description: 'Created 20+ lesson plans',
            icon: '🏆',
            earned: true,
            earnedDate: '2024-12-15'
        },
        {
            id: 2,
            name: 'Assessment Pro',
            description: 'Graded 100+ assignments',
            icon: '📊',
            earned: true,
            earnedDate: '2024-12-20'
        },
        {
            id: 3,
            name: 'Innovation Leader',
            description: 'Complete 10 training modules',
            icon: '🎯',
            earned: false,
            progress: 80
        },
        {
            id: 4,
            name: 'CBC Expert',
            description: 'Master CBC curriculum',
            icon: '🌟',
            earned: false,
            progress: 60
        }
    ];
    
    res.json(badges);
});

// Utility Functions
function generateAILessonPlan(subject, grade, topic, duration) {
    const cbcTopics = {
        mathematics: {
            4: ['Place Value', 'Fractions', 'Decimals', 'Area and Perimeter', 'Data Handling']
        },
        science: {
            3: ['Classification', 'Forces and Motion', 'Energy', 'Environment']
        },
        english: {
            2: ['Phonics', 'Simple Sentences', 'Reading Comprehension', 'Creative Writing']
        }
    };
    
    return {
        title: topic,
        subject: subject,
        grade: parseInt(grade),
        duration: parseInt(duration),
        cbcAlignment: cbcTopics[subject]?.[parseInt(grade)] || [],
        objectives: [
            `Students will understand the basic concepts of ${topic}`,
            `Students will apply knowledge through practical activities`,
            `Students will demonstrate learning through assessment`
        ],
        materials: [
            'Locally available materials (stones, sticks, leaves)',
            'Chalkboard and chalk',
            'Exercise books and pencils'
        ],
        activities: [
            {
                phase: 'Introduction',
                duration: Math.round(duration * 0.2),
                description: `Begin with questions about ${topic} using familiar examples`
            },
            {
                phase: 'Development',
                duration: Math.round(duration * 0.6),
                description: `Interactive demonstration and hands-on exploration of ${topic}`
            },
            {
                phase: 'Conclusion',
                duration: Math.round(duration * 0.2),
                description: 'Recap key points and assign practice work'
            }
        ],
        assessment: {
            formative: 'Observation and questioning during activities',
            summative: 'Written exercise or practical demonstration'
        },
        differentiation: 'Support struggling learners with visual aids, challenge advanced students with extension activities',
        homework: `Practice ${topic} concepts using materials at home`,
        createdAt: new Date(),
        aiGenerated: true
    };
}

function generateWeeklyPerformance() {
    // Generate sample weekly performance data
    const weeks = [];
    const basePerformance = 75;
    
    for (let i = 1; i <= 6; i++) {
        weeks.push({
            week: i,
            average: basePerformance + Math.random() * 10 - 5,
            trend: Math.random() > 0.5 ? 'up' : 'down'
        });
    }
    
    return weeks;
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Catch-all handler for serving the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Teacher's Assistant server running on port ${PORT}`);
});

module.exports = app;