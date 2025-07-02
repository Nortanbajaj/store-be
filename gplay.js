import express from 'express';
import gplay from "google-play-scraper";
import cors from "cors";
import store from 'app-store-scraper';
const app = express();
app.use(cors());
app.use(express.json());

let app_ids = []
app.get("/playstore/search", async (req, res) => {
    const trems=req.query.keyword
    const lang = req.query.language
    const country = req.query.country
    let obj = await gplay.search({
    term: trems,
    num: 21,
    country : country,
    lang: lang,
    })
    // console.log(obj.appId)
    res.json(obj);
    
});

app.get("/appstore/search", async (req, res) => {
    const trems=req.query.keyword
    const lang = req.query.language
    const country = req.query.country
    let obj = await store.search({
    term: trems,
    num: 21,
    country : country,
    lang: lang,
    })
    // console.log(obj.appId)
    res.json(obj);
    
});

app.get("/playstore/details", async (req, res) => {
    try {
        let appId = req.query.app; 
        if (!appId) {
            return res.status(400).json({ error: "App ID is required" });
        }

        let obj = await gplay.app({ appId });
        console.log(obj);

        let dataList = [];
        dataList.push(obj);

        res.json(dataList); // Send the response as JSON
    } catch (error) {
        console.error("Error fetching app details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/playstore/category" , async(req,res) => {
    const catgre = req.query.catgre
    
    let obj =gplay.list({
        category: gplay.category.catgre,
        collection: gplay.collection.TOP_FREE,
        num: 2
  })
  .then(console.log, console.log);
  res.json(obj);

})

app.get("/playstore/suggest", async (req, res) => {
  const  term  = req.query.sugg
  const lang = req.query.language
  const country = req.query.country

  try {
    const suggestions = await gplay.suggest({term:term, country : country,  lang: lang}); // ✅ Correct key
    res.json({
      suggestion: term,
      results: suggestions,
    });
  } catch (error) {
    console.error("Suggestion API Error:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

app.get("/appstore/suggest", async (req, res) => {
  const term  = req.query.sugg
  const lang = req.query.language
  const country = req.query.country
  try {
    const suggestions = await store.suggest({term:term ,country : country, lang: lang}); // ✅ Correct key
    res.json({
      suggestion: term,
      results: suggestions,
    });
  } catch (error) {
    console.error("Suggestion API Error:", error);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
