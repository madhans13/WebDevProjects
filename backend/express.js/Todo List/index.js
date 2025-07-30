import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const db=new pg.Client({
  user:"postgres",
  database:"permalist",
  host:"localhost",
  password:"yourpassword",
  port:5432
})
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
async function getItems(){
  const result=await db.query("SELECT * from items ORDER BY id ASC");
  return result.rows;
}
app.get("/",async (req, res) => {
  const items=await getItems();
  console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  console.log(item);
  try {
    await db.query("INSERT INTO items (name) VALUES ($1)", [item]);
    return res.redirect("/");
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const id=req.body.updatedItemId;
  const item=req.body.updatedItemTitle;
  try{
    await db.query("UPDATE items SET name=$1 WHERE id=$2 ",[item,id]);
    return res.redirect("/");
  }catch(err){
    console.log(err);
  }
  res.redirect("/");
});

app.post("/delete",async (req, res) => {
  const id=req.body.deleteItemId;
  try{
    await db.query("DELETE FROM items WHERE id=$1 ",[id]);
    
  }catch(err){
    console.log(err);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
