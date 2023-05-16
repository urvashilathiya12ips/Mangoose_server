
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Users = require('../../model/Users')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    const errorlist = { message: [] }
    let userobj = req.body

    //checking req has body
    if (Object.keys(userobj).length == 0) {
        return res.status(500).send({ status: 500, message: "Body is empty" })
    }
    if (!userobj.firstName) {
        errorlist.message.push("FirstName is required")
    }
    if (!userobj.lastName) {
        errorlist.message.push("LastName is required")
    }
    if (!userobj.email) {
        errorlist.message.push("Email is required")
    }
    else {
        if (!validator.isEmail(userobj.email)) {
            errorlist.message.push("Invalid Email")
        }
    }
    if (!userobj.password) {
        errorlist.message.push("Password is required")
    }
    try {
        if (errorlist.message.length != 0) {
            throw ("Error", errorlist)
        }
        //Encrypting the password
        userobj.password = await bcrypt.hash(userobj.password, 7)
        
        //checking already existing user
        let isNewUser = await Users.count({email: userobj.email})
        if(isNewUser==1){
            return res.status(400).send({ status: 400, message: "Email already exist" })
        }
        const newUser = new Users(userobj)
        newUser.save()
        return res.status(201).send({ status: 201, message: "User Added", data: newUser })
    }
    catch (error) {
        if (error.errors) {
            //To catch DB error
            return res.status(400).send({ status: 400, message: "Unable to add user" })
        } else {
            return res.status(400).send({ status: 400, message: error.message })
        }
    }
}

const signin = async (req, res) => {
    let userobj = req.body
    try {
        if(Object.keys(userobj).length == 0) {
            return res.status(500).send({ status:500 ,message: "Empty Body" })
        }
        if(!userobj.email || !userobj.password){
            return res.status(400).send({ status:400 ,message: "Email and password are required" })
        }
        let Userinfo = await Users.findOne({email: userobj.email})
        if(Userinfo) {
            const isMatch = await bcrypt.compare(userobj.password, Userinfo.password)
            if(isMatch) {
                //Generating token
                const token = jwt.sign({ _id: Userinfo._id }, process.env.SECRET_KEY,{ expiresIn: '30m'})
                res.status(200).send({ status:200, message: "login success", data:{token:token,user:Userinfo}})
            }
            else {
                //when password is not matched
                return res.status(400).send({ status:400,message:"Invalid Credential" })
            }
        }
        else {
            //When user is not found
            return res.status(400).send({ status:400,message:"User Not found" })
        }
    }
    catch (e) {
        return res.status(400).send({ status:400,message:"Something went wrong" })
    }
}

const profile = async (req, res) => {
    return res.status(200).send({ status:200 ,message: "User Authenticated", data: req.user })
}

module.exports = {
    signup,
    signin,
    profile
}



// const updateProduct = async (req, res) => {
//     let id = req.params.prodid;
//     dataToUpdate = req.body
//     if (!req.file?.filename) {
//         if (Object.keys(req.body).length == 0) {
//             return res.status(404).send({ "message": "body is required" });
//         }
//     }
//     else {
//         //if there is selectd file in request
//         dataToUpdate.image = req.file?.filename
//     }
//     let product = await Product.findByPk(id)
//     Product.update(
//         dataToUpdate,
//         {
//             where: {
//                 id
//             }
//         }
//     ).then(count => {
//         if (count > 0) {
//             if (dataToUpdate.image) {
//                 //removing the old image
//                 fs.unlinkSync(`public/assets/images/${product.image}`)
//             }
//             return res.status(201).send({
//                 "status": "201",
//                 "message": "updated"
//             })
//         }
//         else {
//             return res.status(400).send({
//                 "status": "400",
//                 "message": "fail"
//             })
//         }
//     }).catch(error => {

//         return res.status(400).send({
//             "status": "400",
//             "message": "fail"
//         })
//     })


// }