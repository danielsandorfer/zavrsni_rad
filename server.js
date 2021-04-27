const express = require("express");
const path = require("path");
var cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/login", require("./routes/api/login"));
app.use("/api/map_locations", require("./routes/api/map_locations"));
app.use("/api/control_panel", require("./routes/api/control_panel"));
app.use("/api/event_list", require("./routes/api/event_list"));
app.use("/api/event", require("./routes/api/event"));
app.use("/api/event_search", require("./routes/api/event_search"));
app.use("/api/users", require("./routes/api/users"));

app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) =>{
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));