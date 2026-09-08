const db = require('../config/db');

const passes = db.collection('passes');
const students = db.collection('students');
const routes = db.collection('routes');

const toPass = async (doc, includeDetails = true) => {
  const pass = { ...doc.data(), id: doc.id, pass_id: doc.id };
  if (!includeDetails) return pass;

  const [studentDoc, routeDoc] = await Promise.all([
    pass.student_id ? students.doc(pass.student_id).get() : null,
    pass.route_id ? routes.doc(pass.route_id).get() : null,
  ]);
  if (studentDoc && studentDoc.exists) {
    const student = studentDoc.data();
    pass.student_name = student.name;
    pass.department = student.department;
    pass.year = student.year;
    pass.phone = student.phone;
  }
  if (routeDoc && routeDoc.exists) {
    const route = routeDoc.data();
    pass.source = route.source;
    pass.destination = route.destination;
    pass.fare = route.fare;
  }
  return pass;
};

exports.getAll = async (req, res) => {
  try {
    let result = await Promise.all((await passes.get()).docs.map((doc) => toPass(doc)));
    if (req.query.search) {
      const value = req.query.search.toLowerCase();
      result = result.filter((pass) =>
        String(pass.student_name || '').toLowerCase().includes(value) ||
        String(pass.pass_id).toLowerCase().includes(value)
      );
    }
    if (req.query.status) result = result.filter((pass) => pass.status === req.query.status);
    if (req.query.pass_type) result = result.filter((pass) => pass.pass_type === req.query.pass_type);
    result.sort((a, b) => String(b.pass_id).localeCompare(String(a.pass_id)));
    res.json(result);
  } catch (error) {
    console.error('Get passes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const doc = await passes.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Bus pass not found' });
    res.json(await toPass(doc));
  } catch (error) {
    console.error('Get pass error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { pass_type, student_id, route_id, issue_date, expiry_date } = req.body;
    if (!pass_type || !student_id || !route_id || !issue_date || !expiry_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const ref = await passes.add({ ...req.body, status: 'Active' });
    res.status(201).json(await toPass(await ref.get()));
  } catch (error) {
    console.error('Create pass error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const ref = passes.doc(req.params.id);
    if (!(await ref.get()).exists) return res.status(404).json({ message: 'Bus pass not found' });
    await ref.update(req.body);
    res.json(await toPass(await ref.get()));
  } catch (error) {
    console.error('Update pass error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const ref = passes.doc(req.params.id);
    if (!(await ref.get()).exists) return res.status(404).json({ message: 'Bus pass not found' });
    await ref.delete();
    res.json({ message: 'Bus pass deleted successfully' });
  } catch (error) {
    console.error('Delete pass error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
