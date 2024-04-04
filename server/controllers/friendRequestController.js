
const User = require("../models/user");
const Mongoose = require('mongoose');


const sendFriendRequest = async (req, res) => {
  const emailRe = req.body.emailRe;
  const senderId = req.user._id;
  const convertedSenderId = new Mongoose.Types.ObjectId(senderId);
  try {
    // Lấy thông tin người gửi từ nguồn dữ liệu
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    // Tìm người nhận dựa trên email
    const receiver = await User.findOne({ email: emailRe });
    if (!receiver) {
      return res.status(404).json({ message: "Người nhận không tồn tại." });
    }
    // Kiểm tra nếu người nhận đã là bạn bè hoặc đã có lời mời kết bạn từ người gửi
    if (
      receiver.friends.includes(convertedSenderId) ||
      receiver.friendRequests.includes(convertedSenderId)
    ) {
      return res.status(500).json({ message: "Lời mời kết bạn đã tồn tại." });
    }
    receiver.friendRequests.push(convertedSenderId);
    await receiver.save();
    return res.status(200).json({ message: "Lời mời kết bạn đã được gửi." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi xử lý yêu cầu." });
  }
};
//thu hồi lời mời kết bạn từ user đăng nhập
const recallFriendRequest = async (req, res) => {
  const recallId = req.body.recallId; // userId của người dùng muốn thu hồi lời mời kết bạn
  const requesterId = req.user._id; // userId của người gửi lời mời kết bạn
  try {
    // Tìm người dùng muốn thu hồi lời mời kết bạn
    const userToRevoke = await User.findOne({email: recallId});
    if (!userToRevoke) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    // Xóa requesterId khỏi mảng friendRequests của userToRevoke
    userToRevoke.friendRequests.pull(requesterId);
    await userToRevoke.save();
    return res
      .status(200)
      .json({ message: "Lời mời kết bạn đã được thu hồi." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi thu hồi lời mời kết bạn." });
  }
};

//xóa lời mời kết bạn 
const deleteFriendRequest = async (req, res) => {
  const userId = req.user._id; // userId của người đang đăng nhập
  const deleteFR = req.body.deleteFR; // Email của người gửi lời mời kết bạn

  try {
    // Tìm người gửi lời mời kết bạn
    const userSender = await User.findOne({ email: deleteFR });
    if (!userSender) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Xóa userId khỏi mảng friendRequests của người gửi lời mời
    userSender.friendRequests.pull(userId);
    await userSender.save();
    return res.status(200).json({ message: "Lời mời kết bạn đã được xóa." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi xóa lời mời kết bạn." });
  }
};
const getAllFriendRequest = async (req, res) => {
  // Kiểm tra xem req.user tồn tại và có thuộc tính _id không
  const userId = req.user._id;
  console.log(userId);

  try {
    // Lấy thông tin người dùng từ nguồn dữ liệu
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Lấy danh sách lời mời kết bạn của người dùng
      const friendRequests = await User.find(
        { _id: { $in: user.friendRequests } },
        { username: 1, gender: 1, dateOfBirth: 1, _id: 0 }
      );

    return res.status(200).json(friendRequests);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy danh sách yêu cầu kết bạn." });
  }
}

module.exports = {
  sendFriendRequest,
  recallFriendRequest,
  getAllFriendRequest,
  deleteFriendRequest
};