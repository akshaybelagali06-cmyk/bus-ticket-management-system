const db = require('../config/db');

const collection = db.collection('students');

const toStudent = (doc) => ({
  ...doc.data(),
  id: doc.id,
  student_id: doc.id,
});

exports.getAll = async (req, res) => {
  try {
    const { search, department, year } = req.query;
    const snapshot = await collection.get();
    let students = snapshot.docs.map(toStudent);

    if (search) {
      const value = search.toLowerCase();
      students = students.filter((student) =>
        String(student.name || '').toLowerCase().includes(value) ||
        String(student.phone || '').toLowerCase().includes(value)
      );
    }
    if (department) students = students.filter((student) => String(student.department) === String(department));
    if (year) students = students.filter((student) => String(student.year) === String(year));

    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const doc = await collection.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Student not found' });
    res.json(toStudent(doc));
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, department, year, phone } = req.body;
    if (!name || !department || !year || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const ref = await collection.add(req.body);
    const doc = await ref.get();
    res.status(201).json(toStudent(doc));
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const ref = collection.doc(req.params.id);
    const existing = await ref.get();
    if (!existing.exists) return res.status(404).json({ message: 'Student not found' });
    await ref.update(req.body);
    res.json(toStudent(await ref.get()));
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const ref = collection.doc(req.params.id);
    if (!(await ref.get()).exists) return res.status(404).json({ message: 'Student not found' });
    await ref.delete();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
