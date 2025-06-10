require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { db } = require('./fire');

const {
  collection,
  orderBy,
  getDocs,
  limit,
  addDoc,
  query
} = require('firebase/firestore');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`
    <h1>API Express & Firebase MonitoreO2</h1>
    <ul>
      <li><p><b>GET /ver</b></p></li>
      <li><p><b>GET /valor</b></p></li>
      <li><p><b>GET /estado</b></p></li>
      <li><p><b>POST /insertar</b>  => {temp, hum, gas, ruido, nombre, fecha}</p></li>
      <li><p><b>POST /encender</b></p></li>
      <li><p><b>POST /apagar</b></p></li>
    </ul>
  `);
});

app.get('/ver', async (req, res) => {
  try {
    const q = query(collection(db, 'Valores'), orderBy('fecha', 'asc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => doc.data());
    console.log(data);
    res.send(data);
  } catch (error) {
    console.error('Error!', error);
    res.status(500).send(error);
  }
});

app.get('/estados', async (req, res) => {
  try {
    const q = query(collection(db, 'Rele'), orderBy('fecha', 'asc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => doc.data());
    console.log(data);
    res.send(data);
  } catch (error) {
    console.error('Error!', error);
    res.status(500).send(error);
  }
});

app.get('/estado', async (req, res) => {
  try {
    const q = query(collection(db, 'Rele'), orderBy('fecha', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => doc.data());
    console.log(data);
    res.send(data);
  } catch (error) {
    console.error('Error!', error);
    res.status(500).send(error);
  }
});

app.get('/valor', async (req, res) => {
  try {
    const q = query(collection(db, 'Valores'), orderBy('fecha', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => doc.data());
    console.log(data);
    res.send(data);
  } catch (error) {
    console.error('Error!', error);
    res.status(500).send(error);
  }
});

app.get('/grafica', async (req, res) => {
  try {
    const q = query(collection(db, 'Valores'), orderBy('fecha', 'desc'), limit(10));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => doc.data());
    console.log(data);
    res.send(data);
  } catch (error) {
    console.error('Error!', error);
    res.status(500).send(error);
  }
});

app.post('/insertar', async (req, res) => {
  try {
    const doc = {
      mq135: req.body.gas,
      co2: req.body.gas,
      tvoc: req.body.gas,
      fecha: new Date().toISOString()
    };
    await addDoc(collection(db, 'Valores'), doc);
    res.send({
      ...doc,
      status: 'Valores insertados!'
    });
  } catch (error) {
    console.error('Error al insertar!', error);
    res.status(500).send(error);
  }
});

app.post('/encender', async (req, res) => {
  try {
    const doc = {
      r1: true,
      nombre: req.body.nombre,
      fecha: new Date()
    };
    await addDoc(collection(db, 'Rele'), doc);
    res.send({
      ...doc,
      status: 'Rele encendido'
    });
  } catch (error) {
    console.error('Error al encender!', error);
    res.status(500).send(error);
  }
});

app.post('/apagar', async (req, res) => {
  try {
    const doc = {
      r1: false,
      nombre: req.body.nombre,
      fecha: new Date()
    };
    await addDoc(collection(db, 'Rele'), doc);
    res.send({
      ...doc,
      status: 'Rele apagado'
    });
  } catch (error) {
    console.error('Error al apagar!', error);
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Escuchando en puerto ${PORT}`);
});
