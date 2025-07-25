const A = require("./accounting");

class R {}
R.prototype.ReturnBind = (res, data) => {
  try {
    return res.status(200).json(data);
  } catch (error) {
    throw error;
  }
};

R.prototype.SendErrorChannel = async (error, location) => {
  try {
    await SlackAPI.SendErrorChannel({
      location: location,
      error: error.toString(),
    });
  } catch (error) {
    throw error;
  }
};

R.prototype.LoginChannel = async (phone) => {
  try {
    await SlackAPI.LoginChannel(phone);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  R,
  A
};
