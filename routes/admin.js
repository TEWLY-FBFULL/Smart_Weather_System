const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/jwtCheckRole');
const { adminHome,serverstatus,userData,logout } = require('../controllers/main_admin');

router.get('/admin/index',verifyAdmin,adminHome); // get admin dashboard
router.get('/admin/serverstatus',verifyAdmin,serverstatus); // get server status
router.get('/admin/userdata',verifyAdmin,userData); // get all user data
router.get('/admin/tables',verifyAdmin,allTable); // get all table name data
router.get('/admin/tables/:table',verifyAdmin,getTable); // get table name data
router.get('/admin/tables/:table/search',verifyAdmin,searchTable); // search table name data
router.post('/admin/logout',verifyAdmin,logout); // admin logout
router.post('/admin/tables/:table',verifyAdmin,insertTable); // insert table name data
router.put('/admin/tables/:table/:id',verifyAdmin,updateTable); // update table name data
router.delete('/admin/tables/:table/:id',verifyAdmin,deleteTable); // delete table name data


module.exports = router;
