const express = require('express'); // {0} Framework express

const router = express.Router(); // {1} instacies for Router

//#region Controllers
const sessionController = require('./controllers/session'); // {3} controller for session
const userController = require('./controller/user'); // {5} constroller for user
//#endregion

//#region Sesseion
router.post('/session', sessionController.Session); // {7} Router for login

router.post('/session/oauth', sessionController.SessionOauth); // {7} Router for login
//#endregion

//#region User
router.get('/users', userController.Index); // {18} Router for Get all users

router.get('/users/:id', userController.Show); // {19} Router for Delete by id combos

router.put('/users', userController.Update); // {20} Router for Delete by id combos

router.post('/users', userController.Create); // {20} Router for Delete by id combos

router.delete('/users/:id', userController.Delete); // {21} Router for Delete by id combos

//#endregion

module.exports = router;