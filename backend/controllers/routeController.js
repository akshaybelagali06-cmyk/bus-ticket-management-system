const db = require('../config/db');

const routes = db.collection('routes');
const drivers = db.collection('drivers');

const toRoute = async (doc) => {
  const route = { ...doc.data(), id: doc.id, route_id: doc.id };
  if (route.driver_id) {
    const driver = await drivers.doc(route.driver_id).get();
    if (driver.exists) {
      const data = driver.data();
      route.driver_name = data.name;
      route.bus_no = route.bus_no || data.bus_no;
    }
  }
  return route;
};

const getRoutes = async (snapshot) => Promise.all(snapshot.docs.map(toRoute));

exports.getAll = async (req, res) => {
  try {
    let result = await getRoutes(await routes.get());
    if (req.query.search) {
      const value = req.query.search.toLowerCase();
      result = result.filter((route) =>
        String(route.source || '').toLowerCase().includes(value) ||
        String(route.destination || '').toLowerCase().includes(value)
      );
    }
    res.json(result);
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const doc = await routes.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Route not found' });
    res.json(await toRoute(doc));
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { source, destination, fare } = req.body;
    if (!source || !destination || !fare) {
      return res.status(400).json({ message: 'Source, destination, and fare are required' });
    }
    const ref = await routes.add(req.body);
    res.status(201).json(await toRoute(await ref.get()));
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const ref = routes.doc(req.params.id);
    if (!(await ref.get()).exists) return res.status(404).json({ message: 'Route not found' });
    await ref.update(req.body);
    res.json(await toRoute(await ref.get()));
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const ref = routes.doc(req.params.id);
    if (!(await ref.get()).exists) return res.status(404).json({ message: 'Route not found' });
    await ref.delete();
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
