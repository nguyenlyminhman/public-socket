const io = require('socket.io-client');
const $ = require('jquery');
const socket = io();

$('#btnSignUp').click(() => {
    const username = $('#txtUsername').val();
    socket.emit('REGIST_USER', username);
});

socket.on('CONFIRM_USER', isSuccess => {
    if (!isSuccess) return;
    $('#div-chat').show();
    $('#div-sign-up').hide();

    socket.on('USER_LIST', arrUser => {
        arrUser.forEach(e => {
            $('#onlineUser').append(`<li id="${e}">${e}</li>`);
        });
    });

    socket.on('NEW_USER', username => {
        $('#onlineUser').append(`<li id="${username}">${username}</li>`);
    });
});

socket.on('DISCONNECT_USER', username => {
    $(`#${username}`).remove();
});
