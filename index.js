const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://search.naver.com/search.naver?sm=tab_hty.top&where=news&query=%EC%BD%94%EB%A1%9C%EB%82%98&oquery=https%3A%2F%2Fsearch.naver.com%2Fsearch.naver%3Fwhere%3Dnews&tqi=hOkFwdprvTossDpqtW0sssssssd-168386";

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
    const $bodyList = $("div.group_news ul.list_news").children("li.bx");

    console.log('bodyList, ', $bodyList.length);

    // 인자로 콜백함수를 받아 태그들의 배열을 순회하면서 콜백함수를 실행
    $bodyList.each(function (i, element) {
      ulList[i] = {
        title: $(this).find("a.news_tit").text(),
        url: $(this).find("a.news_tit").attr("href"),
        summary: $(this).find("a.api_txt_lines").text(),
        createdAt: $(this).find("span.info").text(),
      };
    });

    console.log("ulList, ", ulList);

    const data = ulList.filter((n) => n.title);
    return data;
  })
  .then((result) => {
    console.log("result after getHtml, ", result);
  });
