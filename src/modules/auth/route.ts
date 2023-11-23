import {Router} from 'express'
import * as ctl from './controller'
import schemaValidator from "../../middleware/schemaValidator";

const route = Router()

route.post('/sign-up',schemaValidator("/auth/signup"),ctl.signUp)

route.post('/sign-in',schemaValidator("/auth/signin"),ctl.login)

route.post('/sign-out',ctl.logOut)

route.post('/refresh-token',ctl.refreshToken)




export default route
