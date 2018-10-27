var express = require('express')
var app=express()
//time
var moment = require('moment');
var http = require('http').Server(app)
var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var cors = require('cors')
var mysql = require('mysql')

// //cross-origin
app.use(cors())
//
// //bodyParse Config
var bodyParser = require('body-parser')
//
// //bodyParse Config
var bodyParser = require('body-parser')
// parse application/json
app.use(bodyParser.json())

//connect database
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : "",
    database : 'chatroom'
})

connection.connect(function(err) {
    if(err) throw error;
    console.log('connect to the database success');
});

//register
app.post('/register', function(req, res) {

    const userInfo = req.body
    var search_user_name = 'SELECT * FROM users WHERE user_name = ? OR user_email = ?'
    var search_user_nameParams = [userInfo.user_name,userInfo.user_email]
    console.log("Info.username:" + userInfo.user_name)
    //设置userId
    console.log(userInfo);
    connection.query(search_user_name,search_user_nameParams,function(err,user){
        console.log("user:" + user)
        if(err){
            console.log('find user error!')
            res.json({
                state: 0,
                data: {
                    stateText: 'user already exist!'
                }
            })
        }
        if (user != "") {
            res.json({
                state: 0,
                data: {
                    stateText: 'user already exist!'
                }
            })
        }else{
            var time = moment().format("YYYY-MM-DD HH:MI:SS")
            var newuserSql = 'INSERT INTO users(user_name,user_password,user_sex,user_email,user_reg_time,user_status) VALUES(?,?,?,?,?,?);'
            var newuserSqlParams = [userInfo.user_name,userInfo.user_password,userInfo.user_sex,userInfo.user_email,time,1]


            connection.query(newuserSql,newuserSqlParams,function (err,result) {
                if(err){
                    console.log("insert error :" + err.message)
                    res.json({
                        state: 0,
                        data: {
                            stateText: err.message
                        }
                    })
                }
                connection.query(search_user_name,search_user_nameParams,function (err, result) {
                    if(err){
                        console.log(err)
                        res.json({
                            state: 0,
                            data: {
                                stateText: err.message
                            }
                        })
                    }
                    res.json({
                        state: 1,
                        data: {
                            stateText:  'success your user id is :' + result[0].user_id
                        }
                    })
                })

            })
        }
    })
})

//login
app.post('/login',function(req,res){
    const data = req.body
    console.log(data)
    var loginSql = 'SELECT * FROM users WHERE user_id = ?'
    var loginSqlParams = [data.user_id]
    connection.query(loginSql,loginSqlParams,function (err,user) {
        if (err || user == "") {
            console.log('login err')
            res.json({
                state: 0,
                data: {
                    stateText: 'The username and password you entered did not match our records. Please double-check and try again.！',
                }
            })
        }else{
            console.log(data.user_password)
            console.log(user[0])
            if (data.user_password == user[0].user_password){
                res.json({
                    state: 1,
                    data: {
                        stateText: 'success！',
                        user_id: user[0].user_id,
                        user_name: user[0].user_name,
                        user_email: user[0].user_email
                    }
                })
            }else{
                res.json({
                    state: 0,
                    data: {
                        stateText: 'The username and password you entered did not match our records. Please double-check and try again.！',
                    }
                })
            }
        }
    })
    
})
//add contact
app.post('/AddContact',function (req,res) {
    const data = req.body
    console.log(data)
    var checkUserSql = 'SELECT * FROM users WHERE user_id = ?'
    var checkUserSqlParams = [data.user2_id]
    var checkRepeatSql = 'SELECT * FROM contacts WHERE (user1_id = ? AND user2_id = ?) OR (user2_id = ? AND user1_id = ?)'
    var checkRepeatSqlParams = [data.user1_id,data.user2_id,data.user1_id,data.user2_id]
    var addContactSql = 'INSERT INTO contacts (user1_id,user2_id,start_time,status) VALUES(?,?,?,?)'
    var addContactSqlParams = [data.user1_id,data.user2_id,moment().format("YYYY-MM-DD HH:MI:SS"),1]
    var getcontact_idSql = "SELECT * FROM contacts WHERE user1_id = ? AND user2_id = ?"
    var getcontact_idSqlParams = [data.user1_id,data.user2_id]

    //var sendFirstMsgSql = 'INSERT INTO msg (msg_time,user_id,contact_id,msg_content,is_read) VALUES (?,?,?,?,?)'
    //var sendFirstMsgSqlParams = [moment().format("YYYY-MM-DD HH:MI:SS"),data.user1_id,]
    connection.query(checkUserSql,checkUserSqlParams,function(err,result){
        if(err || result == "" || data.user1_id == data.user2_id){
            console.log(err)
                res.json({
                    state: 0,
                    data: {
                        stateText: 'user not exist!'
                    }
                })
        }else if(data.user1_id == 0){
            res.json({
                state: 0,
                data: {
                    stateText: 'session closed please login again!'
                }
            })
        }
        else{
            connection.query(checkRepeatSql,checkRepeatSqlParams,function (err,result) {
                if(err || result != ""){
                    console.log(err)
                    res.json({
                        state: 0,
                        data: {
                            stateText: 'Already your contact!'
                        }
                    })
                }else{
                    connection.query(addContactSql,addContactSqlParams,function (err,result) {
                        if(err){
                            console.log(err)
                            res.json({
                                state: 0,
                                data: {
                                    stateText: 'fail!'
                                }
                            })
                        }
                        // else{
                        //     console.log(getcontact_idSqlParams)
                        //     connection.query(getcontact_idSql,getcontact_idSqlParams,function (err,result) {
                        //         if(err){
                        //             console.log(err)
                        //             res.json({
                        //                 state: 0,
                        //                 data: {
                        //                     stateText: 'fail!'
                        //                 }
                        //             })
                        //         }else{
                        //             const contact_id = result[0].contact_id
                        //             console.log("contact_id" + contact_id)
                        //             var sendFirstMsgSql = 'INSERT INTO msg (msg_time,user_id,contact_id,msg_content,is_read) VALUES (?,?,?,?,?)'
                        //             var sendFirstMsgSqlParams = [moment().format("YYYY-MM-DD HH:MI:SS"),data.user1_id,contact_id," ",1]
                        //             var sendFirstMsgSqlParams2 = [moment().format("YYYY-MM-DD HH:MI:SS"),data.user2_id,contact_id," ",1]
                        //             connection.query(sendFirstMsgSql,sendFirstMsgSqlParams,function (err,result) {
                        //                 if(err){
                        //                     console.log(err)
                        //                     console.log("error on sendFirstMsgSql1")
                        //                     res.json({
                        //                         state: 0,
                        //                         data: {
                        //                             stateText: 'fail!'
                        //                         }
                        //                     })
                        //                 }else{
                        //                     connection.query(sendFirstMsgSql,sendFirstMsgSqlParams2,function (err,result) {
                        //                         if(err) {
                        //                             console.log(err)
                        //                             console.log("error on sendFirstMsgSql2")
                        //                             res.json({
                        //                                 state: 0,
                        //                                 data: {
                        //                                     stateText: 'fail!'
                        //                                 }
                        //                             })
                        //                         }
                                                else{
                                                    res.json({
                                                        state: 1,
                                                        data: {
                                                            stateText: 'success!'
                                                        }
                                                    })
                                                }
                            //                 })
                            //
                            //             }
                            //         })
                            //     }
                            //
                            // })

                        // }

                    })
                }
            })

            }


    })
})
//delete contact
app.post('/DeleteContact',function(req,res){
    const data = req.body
    console.log(data)
    var deleteContactSql ='DELETE FROM contacts WHERE contact_id = ?'
    var deleteContactSqlParams = [data.contact_id]
    connection.query(deleteContactSql,deleteContactSqlParams,function (err,result) {
        if(err || result == ""){
            console.log(err)
            res.json({
                state: 0,
                data: {
                    stateText: 'fail!'
                }

            })
        }else{
            res.json({
                state: 1,
                data: {
                    stateText: 'success!'
                }

            })
        }

    })
})
//get history chat messages
app.get('/getHistoryChatMsg',function(req,res){
    const data = req.query
    var getHistorySql = 'SELECT * FROM msg WHERE contact_id = ? '
    var getHistorySqlParams = [data.contact_id]
    var markReadSql = 'UPDATE msg SET is_read = 1 WHERE contact_id = ?'
    var markReadSqlParam = [data.contact_id]
    connection.query(getHistorySql,getHistorySqlParams,function (err,history) {
        if(err){
            console.log('get history msg error' + err)
        }
        console.log("history" + history)
        connection.query(markReadSql,markReadSqlParam,function (err,result) {
            if(err) {
                console.log(err)
            }
            res.json({
                state: 1,
                data: {
                    msgList: history,
                }

            })
        })


    })
})

//get contact
app.get('/getContactList',function(req,res){
    const user_id = req.query.user_id
     var contactsListSql = 'SELECT * FROM contacts WHERE user1_id = ? OR  user2_id = ?'
     var contractsListSqlParams = [user_id,user_id]
    //var contactsListSql = 'SELECT c.contact_id,c.user1_id,c.user2_id,avg(m.is_read) AS is_read FROM contacts c  JOIN msg m ON c.contact_id = m.contact_id  AND (c.user1_id = ? OR c.user2_id = ?)'
    //var contractsListSqlParams = [user_id,user_id,user_id,user_id]
    console.log(contractsListSqlParams)
    connection.query(contactsListSql,contractsListSqlParams,function(err,list){
        if(err) {
            console.log('get contact list error!' +err)
            res.json({
                state: 0,
                data: {

                }
            })
        }
        else{
            res.json({
                state: 1,
                data: {
                    contactList: list,
                }
            })
            console.log("list" + list)
        }

    })
})
// save chat messages
function saveChatMsg(msg, callback) {
    saveMsgSql = "INSERT INTO msg (msg_time,user_id,contact_id,msg_content,is_read) VALUES (?,?,?,?,?)"
    saveMsgSqlParams = [moment().format("YYYY-MM-DD HH:MI:SS"),msg.user_id,msg.contact_id,msg.msg_content,0]
    connection.query(saveMsgSql,saveMsgSqlParams,function(err,msg){
        if(err || msg.msg_content == ""){
            console.log('insert message error')
            return
        }
    })
    if(callback){
        callback()
    }
}
//chat
io.on('connection',(socket) =>{
    //enter chat
    socket.on('join-chat',(info) => {
        socket.join(info.contact_id)
        const joinInfo = {
            status: info.status,
            text: info.user_id + 'checked'
        }

    })
    socket.on('chat-msg',(msg) =>{
        saveChatMsg(msg, () =>{
            io.to(msg.contact_id).emit('chat-msg',msg)
            console.log("msg: "+ msg.msg_content)
        })
    })
    //leave
    socket.on('leave-chat',(info) =>{
        socket.leave(info.contact_id)
        const leaveInfo = {
            status: info.status,
        }
    })
})

// get Message
app.get('/getLeaveMsg', function(req, res) {
    var getLeaveMsgSql = 'SELECT * FROM msgboard'
    connection.query(getLeaveMsgSql,function (err,msgdata) {
        if (err) {
            console.log('get leave msg error!')
            res.json({
                state: 0,
                data: {
                    stateText: 'get leave msg error!'
                }
            })
        }
        res.json({
            state: 1,
            data: {
                stateText: 'get leave msg success!',
                leaveMsg: msgdata.reverse()
            }
        })
    })

})
// Save Message
app.post('/saveLeaveMsg', function(req, res) {
    const saveData = req.body
    console.log(saveData)
    var saveLeaveMsgSql = 'INSERT INTO msgboard  (post_time,user_id,text) VALUES (?,?,?)'
    var saveLeaveMsgSqlParams = [moment().format("YYYY-MM-DD HH:MI:SS"),saveData.user_id,saveData.text]
    connection.query(saveLeaveMsgSql,saveLeaveMsgSqlParams,function (err,result) {
        if(err) {
            console.log('save leave msg error : ' + err)
            res.json({
                state: 0,
                data: {
                    stateText: 'save leave msg error'
                }
            })
        }else {
            res.json({
                state: 1,
                data: {
                    stateText: 'Success！'
                }
            })
        }
    })

})

http.listen(3000)