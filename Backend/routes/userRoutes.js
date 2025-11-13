import express from 'express';
import getUsers from '../controllers/getUser.js';
import logOutUser from '../controllers/logoutUser.js';
import tokenVerification from '../middlewares/tokenVerifications.js';


const router = express.Router();

router.get('/users', tokenVerification, getUsers)
router.get('/logout', tokenVerification, logOutUser)

export default router;