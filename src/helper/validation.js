const validator = require("validator");
const Users = require("../../model/Users");

const verifyRequired = (req,requiredFields) => {
    const errorMsg = []
    for (const field of requiredFields) {
        if (!req.body[field]) {
            errorMsg.push(`${field} is required`);
        }
    }
    return errorMsg;
};

const isExistingUser = async (email) => {
    let Userinfo = await Users.findOne({ email });
    return Userinfo?true:false
}

const fetchUser= async(email)=>{
    let Userinfo = await Users.findOne({ email });
    return Userinfo
}

module.exports = {
    isExistingUser,
    fetchUser,
    verifyRequired
};  