const User = require("../models/user.js");
const Mongoose = require("mongoose");

const addFriend = async (req, res) => {
  const userId = req.user._id;
  const emailAdd = req.body.emailAdd;

  try {
    const user = await User.findById(userId);
    const friend = await User.findOne({ email: emailAdd });
    if (!friend) {
      return res.status(400).json({ message: "Người dùng không tồn tại." });
    }
    if (friend.friends.includes(userId)) {
      return res.status(400).json({ message: "Người này đã là bạn." });
    } else if (!friend.friends.includes(userId) &&friend.friendRequests.includes(userId)) {
      friend.friendRequests.pull(userId);
      user.friends.push(friend._id);
      friend.friends.push(userId);

      await user.save();
      await friend.save();
      return res.status(200).json({ message: "Kết bạn thành công." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi kết bạn." });
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const deleteFriend = async(req,res)=>{
 const userId = req.user._id;
 const emailDelete = req.body.emailDelete;
 const convertedUserId = new Mongoose.Types.ObjectId(userId);
 try {
  const user = await User.findById(userId);
  const deleteFriend = await User.findOne({email : emailDelete});
  if(!deleteFriend.friends.includes(userId) && !user.friends.includes(deleteFriendId)){
       return res.status(400).json({ message: "Người này chưa là bạn" });
  }
        user.friends.pull(deleteFriend._id);
        deleteFriend.friends.pull(user);
        await user.save();
        await deleteFriend.save();
        return res.status(200).json({ message: "Bạn đã xóa thành công" });
  
 } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi xoa bạn" });
 }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getAllFriend = async (req, res) => {
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
     const friends = await User.find(
       { _id: { $in: user.friends } },
       { username: 1, gender: 1, dateOfBirth: 1, _id:0 }
     );


    return res.status(200).json(friends);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy danh sách yêu cầu kết bạn." });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const findFriend = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate("username");
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }
    // Kiểm tra xem friendName có trong danh sách bạn bè của user không
     const friends = await User.find(
       { _id: { $in: user.friends } },
       { username: 1, gender: 1, dateOfBirth: 1, _id: 0 }
     );

    if (friends.length > 0) {
      return res.status(200).json({ friends});
    } else {
      return res.status(400).json({ message: "Không tìm thấy bạn bè" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi tìm kiếm bạn bè" });
  }
};

module.exports = {
    addFriend, 
    getAllFriend,
    deleteFriend,
    findFriend
};