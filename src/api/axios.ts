import axios from 'axios'
import * as config from '../config'

const ax = axios.create({
  baseURL: config.API_ROOT
})

export default ax
