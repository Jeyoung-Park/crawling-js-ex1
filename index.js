const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = async () => {
  try {
    return await axios.get("https://www.yna.co.kr/sports/all");
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
    const $bodyList = $('div.list-type038 ul.list').children('li');

    // console.log(bodyList.html())

    // 인자로 콜백함수를 받아 태그들의 배열을 순회하면서 콜백함수를 실행
    $bodyList.each(function(i, element){
        console.log(`${i}번쨰 element`, $(this).find('div.item-box01').find('div.news-con').find('a.tit-wrap').find('strong.tit-news').text());
      ulList[i] = {
        title: $(this).find('strong.tit-news').text(),
        // url: $(this).find("strong.news-tl a").attr("href"),
        // image_url: $(this).find("p.poto a img").attr("src"),
        // image_at: $(this).find("p.poto a img").attr("alt"),
        // summary: $(this).find("p.lead").text().slice(0, -11),
        // date: $(this).find("span.p-time").text(),
      };
    });

  

    console.log('ulList, ', ulList);

    const data = ulList.filter((n) => n.title);
    return data;
  })
  .then((result) => {
    console.log("result after getHtml, ", result);
  });
