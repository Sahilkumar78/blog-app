
import { app } from "./app.js";



app.get("/", (req, res) => {
        res.send("server is running")
        
})

app.listen(8080, () => {
       console.log("server is ready");
       
})




