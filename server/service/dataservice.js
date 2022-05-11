const jwt = require('jsonwebtoken')
const db = require("./db")

database = {
  1000: { acno: 1000, name: "aksah", password: 1000, balance: 4000, transaction: [] },
  1002: { acno: 1002, name: "ajith", password: 1002, balance: 6000, transaction: [] },

  1003: { acno: 1003, name: "abhi", password: 1003, balance: 5000, transaction: [] }

}
const register = (name, acno, password) => {

  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statusCode: 401,
          status: false,
          Message: "already exist please login"
        }
      }
      else {
        const newUser = new db.User({

          acno,
          name,
          password,
          balance: 0,
          transaction: []

        })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          Message: " succesfully registered"
        }


      }

    })

}

const login = (acno, pswd) => {

  return db.User.findOne({ acno, password: pswd })
    .then(user => {
      console.log(user
      );
      if (user) {
        currentUser = user.name
        currentAcno = acno
        const token = jwt.sign({
          currentAcno: acno
        }, 'secret280501')

        return {
          statusCode: 200,
          status: true,
          Message: " login successfully",
          currentAcno,
          currentUser,
          token
        }
      } else {


        return {
          statusCode: 401,
          status: false,
          Message: "invalid creditails"
        }

      }
    })

}
const deposit = (acno, pswd, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({ acno, password: pswd })
    .then(user => {
      if (user) {
        user.balance += amount
        user.transaction.push({
          type: "credit",
          amount: amount
        })
        user.save()

        return {
          statusCode: 200,
          status: true,
          Message: amount + "sucessfully deposited and balance is:" + user.balance
        }

      }
      else {


        return {
          statusCode: 401,
          status: false,
          Message: "invalid creditails"
        }

      }
    })
}
const withdraw = (req, acno, pswd, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({ acno, password: pswd })
    .then(user => {

      if (req.currentAcno != acno) {
        return {
          statusCode: 422,
          status: false,
          Message: "operation denied"
        }
      }
      if (user) {

        if (user.balance >= amount) {
          user.balance -= amount
          user.transaction.push({
            type: "debit",
            amount: amount
          })
          user.save()
          return {
            statusCode: 200,
            status: true,
            Message: amount + "sucessfully creadited and balance is:" + user.balance
          }

        }
      } else {
        return {
          statusCode: 401,
          status: false,
          Message: "invalid creditails"
        }

      }
    })

}
const transaction = (acno) => {
  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statusCode: 200,
          status: true,
          transaction: user.transaction
        }
      } else {
        return {
          statusCode: 401,
          status: false,
          Message: "user does not exist"
        }
      }
    })

}
const deleteAcc=(acno)=>{
  return db.User.deleteOne({acno})
  .then(user=>{
    if(!user){
      return {
        statusCode: 401,
        status: false,
        Message: "operation failed"
      }
    }else{
      return {
        statusCode: 200,
        status: true,
        Message: "Account number"+acno+"delete succesfully"

      }
    }
  })
}
// export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  transaction,
  deleteAcc
}