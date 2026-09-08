const db = require('../config/db');

const collection = db.collection('drivers');
const toDriver = (doc) => ({ ...doc.data(), id: doc.id, driver_id: doc.id });

exports.getAll = async (req, res) => {
  try {
    const snapshot = await collection.get();
    let drivers = snapshot.docs.map(toDriver);
    if (req.query.search) {
      const value = req.query.search.toLowerCase();
      drivers = drivers.filter((driver) =>
        ['name', 'phone', 'bus_no'].some((field) => String(driver[field] || '').toLowerCase().includes(value))
      );
    }
    res.json(drivers);
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const doc = await collection.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Driver not found' });
    res.json(toDriver(doc));
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, phone, bus_no } = req.body;
    if (!name || !phone || !bus_no) return res.status(400).json({ message: 'All fields are required' });
    const ref = await collection.add(req.body);
    res.status(201).json(toDriver(await ref.get()));
  } catch (error) {
    console.error('Create driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const ref = collection.doc(req.params.id);
    if (!(await ref.get()).exists) return res.status(404).json({ message: 'Driver not found' });
    await ref.update(req.body);
    res.json(toDriver(await ref.get()));
  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const ref = collection.doc(req.params.id);
    if (!(await ref.get()).exists) return res.status(404).json({ message: 'Driver not found' });
    await ref.delete();
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
