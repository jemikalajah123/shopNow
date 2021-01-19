'use strict'
const User = use('App/Models/User')
const Twilio = use('Twilio');
const { validate } = use('Validator')

class AuthController {

  // Set the Authorization = Bearer <token> header to authenticate the request.
  async sendSms(to, info) {
    await Twilio.messages.create({
        body: info,
        from: '+12086064443',
        to: to
    })
    .then(message => console.log(message.sid));
};

  async register({request, auth, response}) {
    const rules = {
      name: 'required|min:3|max:255',
      email: 'required|email|unique:users,email',
      password: 'required',
      store_name: 'unique:users,store_name',
      phone_no: 'required',
      address: 'min:3|max:255',
      can_sell: 'min:3|max:6'
    }
    const validation = await validate(request.all(), rules)
    if (validation.fails()) {
      return response.json(validation.messages())
    }

    let user = await User.create(request.all())
   
    //generate token  and refresh token for user;
    const token = await auth.withRefreshToken().attempt(request.input('email'), request.input('password'))
    Object.assign(user, token)

    this.sendSms(user.phone_no, 'Welcome to ShopNow')
    return response.json(user)
  }

  async login({request, auth, response}) {
    const rules = {
      email: 'required',
      password: 'required'
    }

    const validation = await validate(request.all(), rules)
    if (validation.fails()) {
      return response.json(validation.messages())
    }

    // let { refresh_token, email, password} = request.all();

    try {
      const {email, password } = request.all()
      const token = await auth.withRefreshToken().attempt(email,password)
      let user = await User.findBy('email',email)
      Object.assign(user,token)
      return response.json({'user':user})
    }
    catch (e) {
      console.log(e)
      return response.json({message: 'You are not registered!'})
    }
  }


  async getProducts({request, response}) {
    let products = await Products.query().with('user').fetch()

    return response.json(products)
  }
}

module.exports = AuthController
