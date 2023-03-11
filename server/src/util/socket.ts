
const socket = (io) => {
    io.on("connection", (socket) => {
        console.log("socket connection success!");

        socket.on("disconnect", (reason) => {
            console.log(`disconnect: ${reason}`);
        });

        const roomName = "room1";
        
        //방 입장
        socket.on("JOIN_ROOM", requestData => {
            socket.join(roomName);
            const responseData = {
                ...requestData,
                type: "JOIN_ROOM",
                time: new Date(),
            };

            io.to(roomName).emit("RECEIVE_MESSAGE", responseData);
            console.log(`JOIN_ROOM is fired with data:${JSON.stringify(responseData)}`)
        });

        //메시지 전송
        socket.on("SEND_MESSAGE", requestData => {
            const responseData = {
                ...requestData,
                type: "SEND_MESSAGE",
                time: new Date(),
            };

            io.to(roomName).emit("RECEIVE_MESSAGE", responseData);
            console.log(`SEND_MESSAGE is fired with data:${JSON.stringify(responseData)}`)
        });
    })
};

export default socket;