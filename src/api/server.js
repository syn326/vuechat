import Axios from './axios.js'
//your ip:port
const BaseUrl = ''
const Server = {
    // register
    register: data => Axios.post(BaseUrl + '/register', data),
    // login
    login: data => Axios.post(BaseUrl + '/login', data),
    //get contact list
    getcontactlist: data => Axios.get(BaseUrl + '/getContactList?user_id=' + data.user_id),

    //get history chat msg
    gethistorychatmsg: data => Axios.get(BaseUrl + '/getHistoryChatMsg?contact_id=' + data.contact_id),
    // add contact
    addcontact: data => Axios.post(BaseUrl + '/AddContact',data),
    //delete contact
    deletecontact: data => Axios.post(BaseUrl + '/DeleteContact',data),
    //  save msg
    saveleavemsg: data => Axios.post(BaseUrl + '/saveLeaveMsg', data),
    // get msg board
    getleavemsg: () => Axios.get(BaseUrl + '/getLeaveMsg'),
}
export default Server
