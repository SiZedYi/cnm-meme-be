const express = require("express");
const authenticateJWT = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  findUser,
  getUser,
} = require("../controllers/userController");


const {
  sendFriendRequest,
  recallFriendRequest,
  getAllFriendRequest,
  deleteFriendRequest
} = require("../controllers/friendRequestController");
const router = express.Router();

const {
  addFriend,
  getAllFriend,
  deleteFriend,
  findFriend
} = require("../controllers/friendController");

router.get("/getAllFriend",authenticateJWT, getAllFriend);
router.get("/getAllFriendRequest", authenticateJWT,getAllFriendRequest);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUser);
router.post("/sendFriendRequest",authenticateJWT, sendFriendRequest);
//router.get("/getFriendRequestById/:userId", getFriendRequestById);
router.post("/addFriend",authenticateJWT, addFriend);
router.post("/recallFriendRequest", authenticateJWT,recallFriendRequest);
router.post("/deleteFriendRequest",authenticateJWT,deleteFriendRequest)
router.post("/deleteFriend", authenticateJWT, deleteFriend);
router.post("/findFriend", authenticateJWT, findFriend);

module.exports = router;
