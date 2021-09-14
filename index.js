const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://eloquence-developers.tistory.com/category";

const getHtml = async () => {
  try {
    return await axios.get(url);
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then((html) => {
    let ulList = [];
    // 인자로 html 문자열을 받아 cheerio 객체로 반환
    const $ = cheerio.load(html.data);
    // children: 인자로 html selector를 받아 cheerio 객체에서 선택된 html 문자열에서 해당하는 모든 태그들의 배열을 반환
    // li div.item-box01 div.news-con
    const $bodyList = $("div.article_skin div.list_content");

    console.log($bodyList.length);

    // 인자로 콜백함수를 받아 태그들의 배열을 순회하면서 콜백함수를 실행
    $bodyList.each(function (i, element) {
      console.log(
        `${i}번쨰 element`,
        $(this).find("a.link_post strong.tit-post")
      );
      ulList[i] = {
        title: $(this).find("strong.tit_post").text(),
        // url: $(this).find("strong.news-tl a").attr("href"),
        // image_url: $(this).find("p.poto a img").attr("src"),
        // image_at: $(this).find("p.poto a img").attr("alt"),
        // summary: $(this).find("p.l1ead").text().slice(0, -11),
        // date: $(this).find("span.p-time").text(),
      };
    });

    console.log("ulList, ", ulList);

    const data = ulList.filter((n) => n.title);
    return data;
  })
  .then((result) => {
    console.log("result after getHtml, ", result);
  });
