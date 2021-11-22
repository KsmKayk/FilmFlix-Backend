const puppeteer = require("puppeteer");

module.exports = {
  async searchFilm(req, res) {
    const { name } = req.body;
    const baseUrl = "https://topflix.one/list/filmes/";

    let searchTerm = name;
    let searchTermToSearchUrl = searchTerm.split(" ").join("%20");
    let searchUrl = baseUrl + searchTermToSearchUrl + "/";

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(searchUrl, {
      waitUntil: "networkidle2",
    });

    let filmsObject = await page.evaluate(() => {
      let films = {};
      let filmsA = Array.from(
        document.querySelectorAll(
          "div.page-single div.container div.row div.col-md-12 div.flex-wrap-movielist div.movie-item-style-2 div.mv-item-infor h6 a"
        )
      );

      let filmsI = Array.from(
        document.querySelectorAll(
          "div.page-single div.container div.row div.col-md-12 div.flex-wrap-movielist div.movie-item-style-2 div.mv-img3 a img"
        )
      );
      let filmsATitleName = [];
      let filmsATitleCover = [];
      let filmsATitleLink = [];

      films.titleName = getTitleName(filmsA);

      function getTitleName(filmsA) {
        filmsA.map((title) => {
          let titleName = title.innerText.trim();
          filmsATitleName.push(titleName);
        });
        return filmsATitleName;
      }
      films.titleCover = getTitleCover(filmsI);
      function getTitleCover(filmsI) {
        filmsI.map((title) => {
          let titleCover = title.getAttribute("src");
          filmsATitleCover.push(titleCover);
        });
        return filmsATitleCover;
      }
      films.titleLink = getTitleLink(filmsA);
      function getTitleLink(filmsA) {
        filmsA.map((title) => {
          let titleLink = title.href.trim();
          filmsATitleLink.push(titleLink);
        });
        return filmsATitleLink;
      }

      return films;
    });
    await browser.close();
    return res.json(filmsObject);
  },
  async selectFilm(req, res) {
    const { link } = req.body;

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(link, {
      waitUntil: "networkidle2",
    });

    await page.click(
      "div.page-single div.container div.row div.col-md-8 div.movie-single-ct div.movie-tabs div.tabs div.tab-content div.tab div.row div.col-md-8 div.mvsingle-item div.vd-it div.shakeImg2 a.hvr-grow"
    );
    await page.waitForSelector(
      "div.modal div.modal-dialog div.modal-content div.embed-responsive iframe.embed-responsive-item"
    );

    let filmLink = await page.evaluate(() => {
      let link = document
        .querySelector(
          "div.modal div.modal-dialog div.modal-content div.embed-responsive iframe.embed-responsive-item"
        )
        .getAttribute("src");
      console.log(link);
      return link;
    });

    await browser.close();

    return res.json({ filmVideoLink: filmLink });
  },
};
