// Database Configuration and Models
// This file provides the structure for MySQL integration

const mysql = require('mysql2/promise');

class DatabaseManager {
    constructor() {
        this.connection = null;
        this.config = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'teachers_assistant',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        };
    }

    async connect() {
        try {
            this.connection = await mysql.createConnection(this.config);
            console.log('Connected to MySQL database');
            await this.initializeTables();
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    async initializeTables() {
        const tables = [
            // Teachers table
            `CREATE TABLE IF NOT EXISTS teachers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                school VARCHAR(255),
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`,

            // Students table
            `CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                grade INT NOT NULL,
                class VARCHAR(50),
                teacher_id INT,
                overall_grade DECIMAL(5,2) DEFAULT 0.00,
                status ENUM('excellent', 'good', 'needs-support', 'at-risk') DEFAULT 'good',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
            )`,

            // Lesson Plans table
            `CREATE TABLE IF NOT EXISTS lesson_plans (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                subject VARCHAR(100) NOT NULL,
                grade INT NOT NULL,
                duration INT DEFAULT 40,
                objectives TEXT,
                materials TEXT,
                activities TEXT,
                assessment TEXT,
                teacher_id INT,
                ai_generated BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
            )`,

            // Assignments table
            `CREATE TABLE IF NOT EXISTS assignments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT,
                title VARCHAR(255) NOT NULL,
                score INT NOT NULL,
                total_marks INT NOT NULL,
                percentage DECIMAL(5,2) GENERATED ALWAYS AS ((score / total_marks) * 100) STORED,
                subject VARCHAR(100),
                assignment_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )`,

            // Resources table
            `CREATE TABLE IF NOT EXISTS resources (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                type ENUM('textbook', 'video', 'worksheet', 'interactive') NOT NULL,
                subject VARCHAR(100),
                grade VARCHAR(20),
                description TEXT,
                file_path VARCHAR(500),
                file_size INT,
                offline_available BOOLEAN DEFAULT FALSE,
                download_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`,

            // Training Courses table
            `CREATE TABLE IF NOT EXISTS training_courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                duration INT NOT NULL,
                level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
                modules TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,

            // User Progress table
            `CREATE TABLE IF NOT EXISTS user_progress (
                id INT AUTO_INCREMENT PRIMARY KEY,
                teacher_id INT,
                course_id INT,
                progress_percentage INT DEFAULT 0,
                completed BOOLEAN DEFAULT FALSE,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP NULL,
                FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
                FOREIGN KEY (course_id) REFERENCES training_courses(id) ON DELETE CASCADE
            )`,

            // Teacher Badges table
            `CREATE TABLE IF NOT EXISTS teacher_badges (
                id INT AUTO_INCREMENT PRIMARY KEY,
                teacher_id INT,
                badge_name VARCHAR(255) NOT NULL,
                badge_description TEXT,
                badge_icon VARCHAR(10),
                earned BOOLEAN DEFAULT FALSE,
                earned_date TIMESTAMP NULL,
                progress_percentage INT DEFAULT 0,
                FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
            )`
        ];

        for (const tableSQL of tables) {
            try {
                await this.connection.execute(tableSQL);
            } catch (error) {
                console.error('Error creating table:', error);
            }
        }

        console.log('Database tables initialized');
        await this.seedInitialData();
    }

    async seedInitialData() {
        try {
            // Check if data already exists
            const [teacherRows] = await this.connection.execute('SELECT COUNT(*) as count FROM teachers');
            if (teacherRows[0].count > 0) {
                return; // Data already seeded
            }

            // Insert sample teacher
            const [teacherResult] = await this.connection.execute(
                'INSERT INTO teachers (name, email, school, phone) VALUES (?, ?, ?, ?)',
                ['Jane Doe', 'jane.doe@school.edu', 'Sunshine Primary School', '+254700123456']
            );
            const teacherId = teacherResult.insertId;

            // Insert sample students
            const sampleStudents = [
                ['John Kamau', 4, 'Class A', teacherId, 92.0, 'excellent'],
                ['Mary Wanjiku', 4, 'Class A', teacherId, 78.0, 'needs-support'],
                ['David Kipchoge', 4, 'Class A', teacherId, 85.0, 'good'],
                ['Grace Achieng', 4, 'Class A', teacherId, 91.0, 'excellent'],
                ['Peter Mwangi', 4, 'Class A', teacherId, 67.0, 'at-risk']
            ];

            for (const student of sampleStudents) {
                await this.connection.execute(
                    'INSERT INTO students (name, grade, class, teacher_id, overall_grade, status) VALUES (?, ?, ?, ?, ?, ?)',
                    student
                );
            }

            // Insert sample lesson plans
            const sampleLessons = [
                [
                    'Fractions Introduction', 'Mathematics', 4, 40,
                    JSON.stringify(['Understand basic fractions', 'Identify parts of a whole']),
                    JSON.stringify(['Local materials', 'Chalkboard', 'Exercise books']),
                    JSON.stringify([{phase: 'Introduction', duration: 10}, {phase: 'Development', duration: 25}, {phase: 'Conclusion', duration: 5}]),
                    JSON.stringify({formative: 'Observation', summative: 'Written exercise'}),
                    teacherId, true
                ],
                [
                    'Animal Classification', 'Science', 3, 45,
                    JSON.stringify(['Classify animals by characteristics', 'Identify local animals']),
                    JSON.stringify(['Pictures of animals', 'Local animal examples', 'Chart paper']),
                    JSON.stringify([{phase: 'Introduction', duration: 10}, {phase: 'Investigation', duration: 30}, {phase: 'Summary', duration: 5}]),
                    JSON.stringify({formative: 'Group discussion', summative: 'Animal sorting activity'}),
                    teacherId, true
                ]
            ];

            for (const lesson of sampleLessons) {
                await this.connection.execute(
                    'INSERT INTO lesson_plans (title, subject, grade, duration, objectives, materials, activities, assessment, teacher_id, ai_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    lesson
                );
            }

            // Insert sample resources
            const sampleResources = [
                [
                    'Primary Mathematics Grade 4', 'textbook', 'mathematics', '4',
                    'CBC-aligned digital textbook with interactive exercises',
                    '/resources/math-grade4.pdf', 2048576, true, 156
                ],
                [
                    'Simple Science Experiments', 'video', 'science', '3-5',
                    'Video collection of experiments using local materials',
                    '/resources/science-experiments.mp4', 524288000, true, 89
                ],
                [
                    'English Comprehension Worksheets', 'worksheet', 'english', '2',
                    'Printable worksheets for reading comprehension practice',
                    '/resources/english-worksheets.pdf', 1048576, true, 203
                ]
            ];

            for (const resource of sampleResources) {
                await this.connection.execute(
                    'INSERT INTO resources (title, type, subject, grade, description, file_path, file_size, offline_available, download_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    resource
                );
            }

            // Insert training courses
            const sampleCourses = [
                [
                    'Classroom Management in Large Classes',
                    'Learn effective strategies for managing overcrowded classrooms and maintaining student engagement.',
                    45, 'beginner',
                    JSON.stringify(['Understanding classroom dynamics', 'Effective grouping strategies', 'Maintaining attention and engagement'])
                ],
                [
                    'Using Technology in Rural Classrooms',
                    'Maximize teaching effectiveness with minimal technology resources and offline tools.',
                    60, 'intermediate',
                    JSON.stringify(['Offline teaching tools', 'Mobile-first approaches', 'Digital resource management'])
                ],
                [
                    'CBC Assessment Strategies',
                    'Master competency-based assessment methods and align with new curriculum standards.',
                    90, 'advanced',
                    JSON.stringify(['Understanding CBC framework', 'Designing assessments', 'Progress tracking'])
                ]
            ];

            for (const course of sampleCourses) {
                await this.connection.execute(
                    'INSERT INTO training_courses (title, description, duration, level, modules) VALUES (?, ?, ?, ?, ?)',
                    course
                );
            }

            console.log('Sample data seeded successfully');
        } catch (error) {
            console.error('Error seeding data:', error);
        }
    }

    // Database query methods
    async getLessonPlans(teacherId) {
        const [rows] = await this.connection.execute(
            'SELECT * FROM lesson_plans WHERE teacher_id = ? ORDER BY created_at DESC',
            [teacherId]
        );
        return rows;
    }

    async createLessonPlan(lessonData) {
        const { title, subject, grade, duration, objectives, materials, activities, assessment, teacherId, aiGenerated } = lessonData;
        
        const [result] = await this.connection.execute(
            'INSERT INTO lesson_plans (title, subject, grade, duration, objectives, materials, activities, assessment, teacher_id, ai_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, subject, grade, duration, JSON.stringify(objectives), JSON.stringify(materials), JSON.stringify(activities), JSON.stringify(assessment), teacherId, aiGenerated]
        );
        
        return result.insertId;
    }

    async getStudents(teacherId) {
        const [rows] = await this.connection.execute(
            'SELECT * FROM students WHERE teacher_id = ? ORDER BY name',
            [teacherId]
        );
        return rows;
    }

    async addAssignment(studentId, assignmentData) {
        const { title, score, totalMarks, subject, assignmentDate } = assignmentData;
        
        const [result] = await this.connection.execute(
            'INSERT INTO assignments (student_id, title, score, total_marks, subject, assignment_date) VALUES (?, ?, ?, ?, ?, ?)',
            [studentId, title, score, totalMarks, subject, assignmentDate]
        );
        
        // Update student's overall grade
        await this.updateStudentOverallGrade(studentId);
        
        return result.insertId;
    }

    async updateStudentOverallGrade(studentId) {
        const [assignments] = await this.connection.execute(
            'SELECT score, total_marks FROM assignments WHERE student_id = ?',
            [studentId]
        );
        
        if (assignments.length === 0) return;
        
        const totalScore = assignments.reduce((sum, a) => sum + a.score, 0);
        const totalPossible = assignments.reduce((sum, a) => sum + a.total_marks, 0);
        const overallGrade = (totalScore / totalPossible) * 100;
        
        let status = 'at-risk';
        if (overallGrade >= 90) status = 'excellent';
        else if (overallGrade >= 80) status = 'good';
        else if (overallGrade >= 70) status = 'needs-support';
        
        await this.connection.execute(
            'UPDATE students SET overall_grade = ?, status = ? WHERE id = ?',
            [overallGrade, status, studentId]
        );
    }

    async getClassAnalytics(teacherId) {
        const [students] = await this.connection.execute(
            'SELECT overall_grade, status FROM students WHERE teacher_id = ?',
            [teacherId]
        );
        
        const classAverage = students.reduce((sum, s) => sum + s.overall_grade, 0) / students.length;
        const passingStudents = students.filter(s => s.overall_grade >= 70).length;
        const passingRate = (passingStudents / students.length) * 100;
        const atRiskStudents = students.filter(s => s.status === 'at-risk').length;
        
        return {
            classAverage: Math.round(classAverage * 10) / 10,
            passingRate: Math.round(passingRate),
            atRiskStudents,
            totalStudents: students.length
        };
    }

    async getResources(filters = {}) {
        let query = 'SELECT * FROM resources WHERE 1=1';
        const params = [];
        
        if (filters.subject) {
            query += ' AND subject = ?';
            params.push(filters.subject);
        }
        
        if (filters.grade) {
            query += ' AND grade LIKE ?';
            params.push(`%${filters.grade}%`);
        }
        
        if (filters.type) {
            query += ' AND type = ?';
            params.push(filters.type);
        }
        
        query += ' ORDER BY download_count DESC';
        
        const [rows] = await this.connection.execute(query, params);
        return rows;
    }

    async updateResourceDownloadCount(resourceId) {
        await this.connection.execute(
            'UPDATE resources SET download_count = download_count + 1 WHERE id = ?',
            [resourceId]
        );
    }

    async getTrainingCourses() {
        const [rows] = await this.connection.execute(
            'SELECT * FROM training_courses ORDER BY level, title'
        );
        return rows;
    }

    async getUserProgress(teacherId) {
        const [rows] = await this.connection.execute(
            `SELECT up.*, tc.title, tc.description, tc.duration, tc.level 
             FROM user_progress up 
             JOIN training_courses tc ON up.course_id = tc.id 
             WHERE up.teacher_id = ?`,
            [teacherId]
        );
        return rows;
    }

    async updateCourseProgress(teacherId, courseId, progressPercentage) {
        const completed = progressPercentage >= 100;
        const completedAt = completed ? new Date() : null;
        
        await this.connection.execute(
            `INSERT INTO user_progress (teacher_id, course_id, progress_percentage, completed, completed_at) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             progress_percentage = VALUES(progress_percentage), 
             completed = VALUES(completed), 
             completed_at = VALUES(completed_at)`,
            [teacherId, courseId, progressPercentage, completed, completedAt]
        );
    }

    async getTeacherBadges(teacherId) {
        const [rows] = await this.connection.execute(
            'SELECT * FROM teacher_badges WHERE teacher_id = ? ORDER BY earned DESC, badge_name',
            [teacherId]
        );
        return rows;
    }

    async updateBadgeProgress(teacherId, badgeName, progressPercentage) {
        const earned = progressPercentage >= 100;
        const earnedDate = earned ? new Date() : null;
        
        await this.connection.execute(
            `INSERT INTO teacher_badges (teacher_id, badge_name, progress_percentage, earned, earned_date) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
             progress_percentage = VALUES(progress_percentage), 
             earned = VALUES(earned), 
             earned_date = VALUES(earned_date)`,
            [teacherId, badgeName, progressPercentage, earned, earnedDate]
        );
    }

    async close() {
        if (this.connection) {
            await this.connection.end();
            console.log('Database connection closed');
        }
    }
}

// Database queries and operations
class TeacherQueries {
    constructor(db) {
        this.db = db;
    }

    async getTeacherDashboardData(teacherId) {
        const [lessonCount] = await this.db.connection.execute(
            'SELECT COUNT(*) as count FROM lesson_plans WHERE teacher_id = ?',
            [teacherId]
        );
        
        const [assignmentCount] = await this.db.connection.execute(
            'SELECT COUNT(*) as count FROM assignments WHERE student_id IN (SELECT id FROM students WHERE teacher_id = ?)',
            [teacherId]
        );
        
        const [studentCount] = await this.db.connection.execute(
            'SELECT COUNT(*) as count FROM students WHERE teacher_id = ?',
            [teacherId]
        );
        
        const [courseCount] = await this.db.connection.execute(
            'SELECT COUNT(*) as count FROM user_progress WHERE teacher_id = ? AND completed = TRUE',
            [teacherId]
        );

        return {
            lessonPlans: lessonCount[0].count,
            assignmentsGraded: assignmentCount[0].count,
            totalStudents: studentCount[0].count,
            completedCourses: courseCount[0].count
        };
    }

    async getRecentActivities(teacherId, limit = 5) {
        const [activities] = await this.db.connection.execute(
            `(SELECT 'lesson' as type, title as description, created_at FROM lesson_plans WHERE teacher_id = ?)
             UNION ALL
             (SELECT 'assignment' as type, CONCAT('Graded: ', title) as description, created_at 
              FROM assignments WHERE student_id IN (SELECT id FROM students WHERE teacher_id = ?))
             ORDER BY created_at DESC LIMIT ?`,
            [teacherId, teacherId, limit]
        );
        
        return activities;
    }

    async getStudentPerformanceTrends(teacherId) {
        const [trends] = await this.db.connection.execute(
            `SELECT 
                WEEK(assignment_date) as week_number,
                AVG(percentage) as average_score,
                COUNT(*) as assignment_count
             FROM assignments a
             JOIN students s ON a.student_id = s.id
             WHERE s.teacher_id = ?
             AND assignment_date >= DATE_SUB(NOW(), INTERVAL 6 WEEK)
             GROUP BY WEEK(assignment_date)
             ORDER BY week_number`,
            [teacherId]
        );
        
        return trends;
    }
}

module.exports = { DatabaseManager, TeacherQueries };