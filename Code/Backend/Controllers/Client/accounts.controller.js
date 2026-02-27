const Account = require("../../Models/accounts");
const Follow = require("../../Models/follow");
const Recipe = require("../../Models/recipes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../Helper/SendMail");
module.exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone, avatar, address } = req.body;
    const existUser = await Account.findOne({ email });
    if (existUser) {
      res.status(400).json({ message: "Email đã được đăng ký" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Account({
      fullName,
      email,
      password: hashedPassword,
      phone,
      avatar,
      address,
    });
    await newUser.save();
    // Tạo JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SUPERSECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      message: "Đăng ký thành công",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.loginByGoogle = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.decode(token);
    const { email, name, picture } = decoded;
    const existUser = await Account.findOne({ email, provider: "google" });
    if (!existUser) {
      const newUser = new Account({
        email,
        fullName: name,
        avatar: picture,
        provider: "google",
      });
      await newUser.save();
      const tokenJwt = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SUPERSECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        message: "Đăng nhập thành công",
        token: tokenJwt,
        user: {
          id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          avatar: newUser.avatar,
        },
      });
    } else {
      const tokenJwt = jwt.sign(
        { id: existUser._id, role: existUser.role },
        process.env.JWT_SUPERSECRET,
        { expiresIn: "1d" }
      );
      console.log(existUser)
      res.status(200).json({
        message: "Đăng nhập thành công",
        token: tokenJwt,
        user: {
          id: existUser._id,
          email: existUser.email,
          fullName: existUser.fullName,
          role: existUser.role,
          avatar: existUser.avatar,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.loginByFacebook = async (req, res) => {
  try {
    const { token } = req.body;
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
    );
    const data = await response.json();
    const email = data.email;
    const name = data.name;
    const picture = data.picture.data.url;

    const existUser = await Account.findOne({ email, provider: "facebook" });
    if (!existUser) {
      const newUser = new Account({
        email,
        fullName: name,
        avatar: picture,
        provider: "facebook",
      });
      await newUser.save();
      const tokenJwt = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SUPERSECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        message: "Đăng nhập thành công",
        token: tokenJwt,
        user: {
          id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          avatar: newUser.avatar,
        },
      });
    } else {
      const tokenJwt = jwt.sign(
        { id: existUser._id, role: existUser.role },
        process.env.JWT_SUPERSECRET,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        message: "Đăng nhập thành công",
        token: tokenJwt,
        user: {
          id: existUser._id,
          email: existUser.email,
          fullName: existUser.fullName,
          role: existUser.role,
          avatar: existUser.avatar,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Account.findOne({ email, deleted: false });
    if (!user) {
      res.status(400).json({ message: "Email không tồn tại" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Sai mật khẩu" });
      return;
    }
    user.lastLogin = new Date();
    user.loginCount = user.loginCount + 1;
    await user.save();
    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SUPERSECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.changePassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Account.findOne({ email, deleted: false });
    if (!user) {
      res.status(400).json({ message: "Email không tồn tại" });
      return;
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SUPERSECRET,
      { expiresIn: "1d" }
    );
    const html = `
    <div style="width: 100%; text-align: center">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Cookpad_logo.svg/640px-Cookpad_logo.svg.png" style="width: 200px; height: 61px; object-fit: contain; padding-top: 60px; padding-bottom: 40px; margin: auto"/>
    </div>
    <p style="font-size: 15px; color: #4a4a4a; margin-top: 22px; margin-bottom: 22px">Chào bạn ${user.fullName}</p>
    <div style="margin-top: 18px; margin-bottom: 18px"> 
    <p style="font-size:12px; padding:0">Bạn nhận được email này vì chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản Cookpad của bạn. Nếu bạn đã yêu cầu đặt lại, hãy nhấp vào nút “Đặt lại mật khẩu” bên dưới để bắt đầu đặt lại mật khẩu của bạn:</p>
    <a href="http://localhost:5173/password?id=${user._id}&token=${token}" style="color: #f93;background-color: #f93;border-radius: 8px;display: block;font-size: 16px;max-width: 40%;text-align: center;text-decoration: none;margin: 24px auto;padding: 15px; color: #ffff">Đặt lại mật khẩu</a>
    hoặc sao chép và dán liên kết sau vào trình duyệt của bạn: <a style=" color: #f93;text-decoration: none;">http://localhost:5173/password?id=${user._id}&token=${token} </a>
    </div>
    <p style="font-size:15px; margin-top:22px">Nếu bạn không thực hiện yêu cầu này hoặc không còn cần nữa, chỉ cần bỏ qua thông báo này và mật khẩu của bạn sẽ không thay đổi.</p>
    `;
    let mailOptions = {
      from: process.env.EMAIL_SEND_MAIL,
      to: email,
      subject: "Đặt lại mật khẩu Cookpad",
      html: html,
    };
    res.status(200).json({ message: `Đã gửi tới địa chỉ ${email}` });
    await sendEmail(mailOptions);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.updatePassword = async (req, res) => {
  try {
    const { token, id, password } = req.body;
    const isInvalid = jwt.verify(token, process.env.JWT_SUPERSECRET);
    if (isInvalid) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await Account.findByIdAndUpdate(id, {
        password: hashedPassword,
      });

      const html = `
    <div style="width: 100%; text-align: center">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Cookpad_logo.svg/640px-Cookpad_logo.svg.png" style="width: 200px; height: 61px; object-fit: contain; padding-top: 60px; padding-bottom: 40px; margin: auto"/>
    </div>
    <p style="font-size: 15px; color: #4a4a4a; margin-top: 22px; margin-bottom: 22px">Xin chào ${user.fullName}</p>
    <div style="margin-top: 18px; margin-bottom: 18px"> 
    <p style="font-size:15px; padding:0">Bạn nhận được email này vì bạn đã thay đổi thành công mật khẩu cho tài khoản Cookpad của mình.</p>
    </div>    
    `;
      let mailOptions = {
        from: process.env.EMAIL_SEND_MAIL,
        to: user.email,
        subject: "Đặt lại mật khẩu thành công",
        html: html,
      };

      res.status(200).json({
        message: "Cập nhật mật khẩu thành công",
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          phone: user.phone,
          avatar: user.avatar,
          address: user.address,
        },
      });
      await sendEmail(mailOptions);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server", error: "Token không hợp lệ" });
  }
};
module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Account.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ message: "Không tìm thấy user" });
      return;
    }
    res.status(200).json({ message: "Lấy thông tin user thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.getUserByEmail = async (req, res) => {
  try {
    const { email, provider } = req.query;
    console.log(email);
    const user = await Account.findOne({ email, provider }).select("-password");
    if (!user) {
      res.status(200).json({ message: "Không tìm thấy user" });
      return;
    }
    if (user.provider === "google") {
      return res
        .status(200)
        .json({ message: "Lấy thông tin user thành công", user, google: true });
    }
    res.status(200).json({ message: "Lấy thông tin user thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "admin" && req.user.id !== id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa user này" });
    }

    let updateData = {
      fullName: req.body.fullName,
      phone: req.body.phone,
      avatar: req.body.avatar,
      address: req.body.address,
    };
    if (req.user.role === "admin") {
      if (req.body.role) updateData.role = req.body.role;
      if (req.body.status) updateData.status = req.body.status;
      if (req.body.deleted !== undefined) {
        updateData.deleted = req.body.deleted;
        updateData.deletedAt = req.body.deleted ? new Date() : null;
      }
    }
    const updateUser = await Account.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password");

    if (!updateUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    res.status(200).json({ message: "Cập nhật thành công", user: updateUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "admin") {
      return res.status(400).json({ message: "Bạn không có quyền xóa" });
    }

    const deleteUser = await Account.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: new Date() },
      { new: true }
    ).select("-password");

    if (!deleteUser) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    return res
      .status(200)
      .json({ message: "Xóa thành công", user: deleteUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.getAllUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(400)
        .json({ message: "Bạn không có quyền xem tất cả user" });
    }

    const users = await Account.find({}).select("-password");
    return res.status(200).json({
      message: "Lấy danh sách user thành công",
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.following = async (req, res) => {
  try {
    const myId = req.user.id;
    const { targetId } = req.body;

    const newFollow = new Follow({
      follower_id: myId,
      following_id: targetId,
    });

    await newFollow.save();
    return res.status(200).json({ message: "Follow thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.unFollowing = async (req, res) => {
  try {
    const myId = req.user.id;
    const { targetId } = req.params;
    const unFollow = await Follow.findOneAndDelete({
      follower_id: myId,
      following_id: targetId,
    });

    if (!unFollow) {
      return res.status(404).json({ message: "Bạn chưa follow người này" });
    }
    return res.status(200).json({ message: "Hủy follow thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId = null } = req.query;
    // Lấy thông tin cơ bản người dùng
    const user = await Account.findById(id)
      .select("fullName avatar description address createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Tính số người theo dõi và đang theo dõi
    const followersCount = await Follow.countDocuments({ following_id: id });
    const followingCount = await Follow.countDocuments({ follower_id: id });

    // Lấy công thức đã đăng
    const recipes = await Recipe.find({
      createdBy: id,
      deleted: false,
      recipeState: "published",
    })
      .sort({ createdAt: -1 })
      .lean();
    const follow = await Follow.findOne({
      follower_id: userId,
      following_id: id,
    });
    res.status(200).json({
      message: "Lấy hồ sơ thành công",
      user,
      stats: {
        followersCount,
        followingCount,
        totalRecipes: recipes.length,
      },
      recipes,
      isFollowing: !!follow,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.getMutualFriends = async (req, res) => {
  try {
    const { id } = req.params;

    // Danh sách mình theo dõi
    const following = await Follow.find({ follower_id: id }).select(
      "following_id"
    );
    const followingIds = following.map((f) => f.following_id.toString());

    // Danh sách theo dõi mình
    const followers = await Follow.find({ following_id: id }).select(
      "follower_id"
    );
    const followerIds = followers.map((f) => f.follower_id.toString());

    // Giao nhau
    const mutualIds = followingIds.filter((uid) => followerIds.includes(uid));

    const friends = await Account.find({ _id: { $in: mutualIds } }).select(
      "fullName avatar description"
    );

    res.status(200).json({
      message: "Lấy danh sách bạn bếp thành công",
      total: friends.length,
      friends,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.searchUserRecipes = async (req, res) => {
  try {
    const { id } = req.params;
    const { search } = req.query;

    const keyword = search ? new RegExp(search.trim(), "i") : /.*/;

    const recipes = await Recipe.find({
      createdBy: id,
      deleted: false,
      recipeState: "published",
      name: keyword,
    })
      .select("name image views likes cookingNumber createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách công thức thành công",
      total: recipes.length,
      recipes,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
module.exports.updateHealthPreferences = async (req, res) => {
  const userId = req.user.id || req.body.userId;
  try {
    const { healthCondition, targetDiet, excludeIngredients } = req.body;
    console.log(userId);
    if (!userId) {
      return res.status(400).json({ message: "Thiếu thông tin người dùng" });
    }

    // Cập nhật thông tin trong user
    const updatedUser = await Account.findByIdAndUpdate(
      userId,
      {
        $set: {
          "healthPreferences.healthCondition": healthCondition || "none",
          "healthPreferences.targetDiet": targetDiet || "none",
          "healthPreferences.excludeIngredients": excludeIngredients || [],
          "healthPreferences.surveyCompleted": true,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      message: "✅ Cập nhật hồ sơ sức khỏe thành công",
      healthPreferences: updatedUser.healthPreferences,
    });
  } catch (error) {
    console.error("Lỗi cập nhật hồ sơ sức khỏe:", error);
    res.status(500).json({
      message: "❌ Lỗi khi cập nhật hồ sơ sức khỏe",
      error: error.message,
    });
  }
};
