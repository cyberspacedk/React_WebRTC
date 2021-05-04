const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

// Socket 
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {
    // send connection ID to client
    socket.emit("me", socket.id);

    socket.on("disconnect", () =>{
        // notify ALL connections about disconnect
        socket.broadcast.emit("callended")
    });

    // listen client event
    socket.on("calluser", (data) => {
        const {userToCall, signalData, from, name} = data;
        io.to(userToCall).emit("calluser", {signal: signalData, from, name})
    });

    socket.on("answercall", (data)=> {
        io.to(data.to).emit("callaccepted", data.signal)
    })

})

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Routes
app.get("/", (req, res) =>{
    res.send("Server is running")
});

// Start server
server.listen(PORT, ()=> {
    console.log(`Server starts at port ${PORT}`)
})