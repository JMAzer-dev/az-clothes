import { getSession } from 'next-auth/react';
import User from '../../../models/User';
import db from '../../../utils/db';
import * as bcrypt from 'bcrypt';

const handler = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported.` });
  }
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'Signin required' });
  }
  const { user } = session;
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    res.status(422).json({ message: 'Validation error' });
    return;
  }
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  await db.connect();
  const toUpdate = await User.findById(user._id);
  toUpdate.name = name;
  toUpdate.email = email;
  if (password) {
    toUpdate.password = bcrypt.hashSync(password, salt);
  }
  await toUpdate.save();

  await db.disconnect();

  res.send({ message: 'User updated successfully!' });
};

export default handler;
