var Admin = require("../model/admin");
const SubContractor = require("../model/subContractor")
const TeamMember = require("../model/teamMembers")
const Client = require("../model/client")
var jwt = require('jsonwebtoken');
var expressJWT = require("express-jwt");
const { LocalConvenienceStoreOutlined } = require("@material-ui/icons");
require('dotenv').config()


exports.signup = async (req, res) => {
    var adminExist = await Admin.findOne({ email: req.body.email })
    if (adminExist) return res.status(403).json({
        error: "Email is already taken!"
    })

    var admin = await new Admin(req.body)
    await admin.save();
    res.status(200).json({
        message: "Signup succesfully! Please Login"
    })
}

exports.signin = (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    console.log(req.body);
    Admin.findOne({ email }, (err, admin) => {
        //if error or no user
        if (err || !admin) {
            return res.status(401).json({
                error:
                    "Admin with this email does not exists.Please sign in with registered email.",
            });
        }
        // if user is found authenticate email and password
        if (!admin.authenticate(password)) {
            console.log(password);
            return res.status(401).json({
                error: "Email and Password doesn't match",
            });
        }
        //generate a token with user id and secret

        const token = jwt.sign({ _id: admin.id }, process.env.JWT_SECRET);
        console.log(token)

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999, httpOnly: true });

        //return response with user and token to frontend client
        const { _id, name, email } = admin;
        admin.hashed_password = undefined;
        admin.salt = undefined;
        return res.json({
            token,
            admin: admin,
        });
    });
}

exports.signout = (req, res) => {
    res.clearCookie("t")
    return res.json({
        message: "Signout Succesfully"
    })
}

exports.requireSignin = expressJWT({
        secret: process.env.JWT_SECRET,
        userProperty: "auth",
        algorithms: ["HS256"]
    })
    

//admin middleware
exports.checkAuth = async (req, res, next) => {
    try {

        const token = req.headers.authorization.slice(7)
        console.log(token)
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        console.log("user", decode)
        const user = await Admin.findOne({ _id: decode._id }).exec()
        if (user.isAdmin == "true") {
            console.log("Hello Sir.....!")
            next()
        } else {
            res.status(404).message({
                message: "Token ly k aoo pehly "
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}


//client middleware
exports.checkClientAuth = async (req, res, next) => {
    try {

        const token = req.headers.authorization.slice(7)
        console.log(token)
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        console.log("user", decode)
        const user = await Client.findOne({ _id: decode._id }).exec()
        if (user.isAdmin == "true") {
            console.log("Hello Sir.....!")
            next()
        } else {
            res.status(404).message({
                message: "Token ly k aoo pehly "
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}
// General Contractor

exports.subContractorSignup = async (req, res) => {
    console.log(req.body);
    console.log(req.auth);
    const subContractorExists = await SubContractor.findOne({ email: req.body.email });

    if (subContractorExists) {
        return res.status(403).json({
            error: "Sub Contractor is already registered",
        });
    }
    const subContractor = await new SubContractor(req.body);
    const teamMember = await new TeamMember(req.body);
    subContractor.createdBy = req.auth._id;
    teamMember.createdBy = req.auth._id;
    await subContractor.save();
    await teamMember.save();
    res.status(200).json({
        message: "Sub Contractor Registered succesfully",
    });
};


exports.subContractorSignin = (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    console.log(req.body);
    SubContractor.findOne({ email }, (err, subContractor) => {
        //if error or no user
        if (err || !subContractor) {
            return res.status(401).json({
                error:
                    "Sub Contractor with this email does not exists.Please sign in with registered email.",
            });
        }
        // if user is found authenticate email and password
        if (!subContractor.authenticate(password)) {
            console.log(password);
            return res.status(401).json({
                error: "Email and Password doesn't match",
            });
        }

        else if (subContractor.isDeleted === "true") {
            console.log("else If ======>", subContractor.isDeleted)
            return res.status(401).json({
                error: "Your account has been disabled please contact your contractor"
            })
        }

        //generate a token with user id and secret

        const token = jwt.sign({ _id: subContractor.id }, process.env.JWT_SECRET);
        console.log(token)

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999, httpOnly: true });

        //return response with user and token to frontend client
        const { _id, name, email } = subContractor;
        subContractor.hashed_password = undefined;
        subContractor.salt = undefined;
        return res.json({
            token,
            subContractor: subContractor,
        });
    });
}


exports.subContractorSignout = (req, res) => {
    res.clearCookie("t")
    return res.json({
        message: "Signout Succesfully"
    })
}

exports.subContractorRequireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ["HS256"]
})


//Client 

exports.clientSignup = async (req, res) => {

    try {
        console.log("hello")
        console.log(req.body);
        console.log(req.auth);
        const clientExists = await Client.findOne({ email: req.body.email });

        if (clientExists) {
            return res.status(403).json({
                error: "Client is already registered",
            });
        }
        const client = await new Client(req.body);
        client.createdBy = req.auth._id;
        await client.save();
        res.status(200).json({
            message: "Client Registered succesfully",
        });
    }
    catch (err) {
        console.log(err)
        res.status(400).json({
            message: err
        })
    }

};


exports.clientSignin = (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    console.log(req.body);
    Client.findOne({ email }, (err, client) => {

        //if error or no user
        if (err || !client) {
            return res.status(401).json({
                error:
                    "Client with this email does not exists.Please sign in with registered email.",
            });
        }
        // if user is found authenticate email and password
        if (!client.authenticate(password)) {
            console.log(password);
            return res.status(401).json({
                error: "Email and Password doesn't match",
            });
        } else if (client.isDeleted === "true") {
            console.log("else If ======>", client.isDeleted)
            return res.status(401).json({
                error: "Your account has been disabled please contact admin"
            })
        }


        //generate a token with user id and secret

        const token = jwt.sign({ _id: client.id }, process.env.JWT_SECRET);
        console.log(token)

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999, httpOnly: true });

        //return response with user and token to frontend client
        console.log("client ===>", client)
        const { _id, name, email } = client;
        client.hashed_password = undefined;
        client.salt = undefined;
        return res.json({
            token,
            client: client,
        });
    });
}


exports.clientSignout = (req, res) => {
    res.clearCookie("t")
    return res.json({
        message: "Signout Succesfully"
    })
}

exports.clientRequireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ["HS256"]
})
