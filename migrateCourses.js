const sqlite3 = require('sqlite3').verbose();
const mockCourses = require('./mockCourses.json');

const db = new sqlite3.Database('./backend/users.db');

db.serialize(() => {
  // Create courses table
  db.run(`CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    duration TEXT,
    progress INTEGER DEFAULT 0,
    level TEXT,
    tags TEXT,
    image TEXT,
    rating REAL,
    learners INTEGER,
    recommended INTEGER DEFAULT 0
  )`);

  // Create lessons table
  db.run(`CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT,
    title TEXT NOT NULL,
    type TEXT,
    duration TEXT,
    content TEXT,
    order_num INTEGER,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id)
  )`);

  mockCourses.forEach((course) => {
    db.run(
      `INSERT OR REPLACE INTO courses (id, title, description, category, duration, progress, level, tags, image, rating, learners, recommended)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course.id,
        course.title,
        course.description,
        course.category,
        course.duration,
        course.progress,
        course.level,
        JSON.stringify(course.tags),
        course.image,
        course.rating,
        course.learners,
        course.recommended ? 1 : 0,
      ]
    );

    course.lessons.forEach((lesson, idx) => {
      // Ensure lesson ID is unique by prefixing with course ID
      const uniqueLessonId = `${course.id}-${lesson.id}`;
      db.run(
        `INSERT OR REPLACE INTO lessons (id, course_id, title, type, duration, content, order_num, completed)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uniqueLessonId,
          course.id,
          lesson.title,
          lesson.type,
          lesson.duration,
          JSON.stringify(lesson.content),
          idx,
          lesson.completed ? 1 : 0,
        ]
      );
      console.log(`Inserted lesson: ${lesson.title} for course: ${course.id}`);
    });
  });
});

db.close();
console.log('Migration complete!');