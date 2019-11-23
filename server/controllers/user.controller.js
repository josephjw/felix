import FileSync from 'lowdb/adapters/FileSync'
import low from 'lowdb'
import uuidv4 from 'uuid/v4'
import crypto from 'crypto';

import config from '../config'

const usersAdapter = new FileSync(config.ROOT_FOLDER + '/users.json')
const usersDB = low(usersAdapter)

usersDB.defaults({ users: [] }).write()

const encryptionKey = 'Y@!2_b3Vh.jU{^*t'

export class UserController {

  static createDefaultUser(req, res) {

    const username = 'Admin1'
    const defaultPassword = '123456'
    const role = 'admin'

    try {

      if (usersDB.get('users').filter({ username: username }).value().length != 0) {
        return res.json({
          success: false,
          message: "User Name already exists"
        })
      }

    } catch (err) {

      return res.json({
        success: false,
        message: "Error occured while creating User"
      })

    }

    const id = uuidv4()

    const user = {
      id: id,
      username: username,
      password: crypto.createHmac('sha512', encryptionKey).update(defaultPassword).digest('hex'),
      role: role,
      status: "active"
    }

    try {

      usersDB.get('users').push(user).write()

    } catch (err) {

      return res.json({
        success: false,
        message: "Unable to create User",
        error: err
      })

    }

    return res.json({
      success: true,
      message: "User " + username + " with Password " + defaultPassword + " created successfully",
    })

  }

  static loginUser(req, res) {

    const params = req.body

    var user = {
      username: params.username,
      password: crypto.createHmac('sha512', encryptionKey).update(params.password).digest('hex')
    }

    try {

      const users = usersDB.get('users').filter(user).value()

      if (users.length == 0) {
        return res.json({
          success: false,
          message: "Invalid Username or Password"
        })
      }

      user = users[0]

    } catch (err) {

      return res.json({
        success: false,
        message: "Error occured while Authenticating"
      })

    }

    delete user.password

    return res.json({
      success: true,
      user: user
    })

  }

  static getAllUsers(req, res) {

    var users = []
    try {
      users = usersDB.get('users').value()
    } catch (err) {
      return res.json({
        success: false,
        message: "Unable to get Users",
        error: err
      });
    }

    users.map((user, index) => {

      delete user.password

    })

    return res.json({
      success: true,
      users: users
    });

  }

  static addUser(req, res) {

    const params = req.body

    try {

      if (usersDB.get('users').filter({ username: params.username }).value().length != 0) {
        return res.json({
          success: false,
          message: "User Name already exists"
        })
      }

    } catch (err) {

      return res.json({
        success: false,
        message: "Error occured while creating User"
      })

    }

    const id = uuidv4()

    const user = {
      id: id,
      username: params.username,
      password: crypto.createHmac('sha512', encryptionKey).update(params.password).digest('hex'),
      role: params.role,
      status: "active"
    }

    try {

      usersDB.get('users').push(user).write()

    } catch (err) {

      return res.json({
        success: false,
        message: "Unable to create User",
        error: err
      })

    }

    return res.json({
      success: true,
      message: "User Created Successfully",
    })

  }

  static removeUser(req, res) {

    const user = req.body

    try {

      usersDB.get('users').remove(user).write()

    } catch (err) {

      return res.json({
        success: false,
        message: "Unable to remove User",
        error: err.message
      })

    }

    return res.json({
      success: true,
      message: "User Removed Successfully",
    })

  }

  static updateUser(req, res) {

    const user = req.body

    if (user.password != undefined) {

      user.password = crypto.createHmac('sha512', encryptionKey).update(user.password).digest('hex')

    }

    try {

      usersDB.get('users').find({ username: user.username }).assign(user).write()

    } catch (err) {

      return res.json({
        success: false,
        message: "Unable to update User",
        error: err
      });

    }

    return res.json({
      success: true,
      message: "User Updated !"
    })


  }
}