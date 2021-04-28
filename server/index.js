const app = require("express")();
const cors = require("cors");

// Socket 
const io = require("socket.io")({
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () =>{
        socket.broadcast.emit("callended")
    });

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
app.listen(PORT, ()=> {
    console.log(`Server starts at port ${PORT}`)
})