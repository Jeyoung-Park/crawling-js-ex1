const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");
const path = require("path");

const getHtml = async (paramUrl) => {
  try {
    return await axios.get(paramUrl);
  } catch (error) {
    console.error(error);
  }
};

const scrapSinglePageData = async (currentIndex) => {
  const url = `https://search.naver.com/search.naver?where=news&sm=tab_pge&query=%EC%BD%94%EB%A1%9C%EB%82%98&sort=0&photo=0&field=0&pd=0&ds=&de=&cluster_rank=28&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so:r,p:all,a:all&start=${currentIndex}`;

  return getHtml(url)
    .then((html) => {
      let ulList = [];
      // 인자로 html 문자열을 받아 cheerio 객체로 반환
      const $ = cheerio.load(html.data);
      // children: 인자로 html selector를 받아 cheerio 객체에서 선택된 html 문자열에서 해당하는 모든 태그들의 배열을 반환
      // li div.item-box01 div.news-con
      const $bodyList = $("div.group_news ul.list_news").children("li.bx");

      // console.log("bodyList, ", $bodyList.length);

      // 인자로 콜백함수를 받아 태그들의 배열을 순회하면서 콜백함수를 실행
      $bodyList.each(function (i, element) {
        ulList[i] = {
          title: $(this).find("a.news_tit").text(),
          url: $(this).find("a.news_tit").attr("href"),
          summary: $(this).find("a.api_txt_lines").text(),
          createdAt: $(this).find("span.info").text(),
        };
      });

      const data = ulList.filter((n) => n.title);
      return data;
    })
    .then((result) => {
      console.log("result after getHtml, ", result.length);
      return result;
    });
};

const scrapTotalData = async (pageNumber) => {
  let resultData = [];
  for (let i = 0; i < pageNumber; i++) {
    setTimeout(async () => {
      const singlePageData = await scrapSinglePageData(1 + i * 10);
      resultData = [...resultData, ...singlePageData];
      if (resultData?.length === 30) {
        convertToXlsx(resultData);
      }
    }, 3000);
  }
  return resultData;
};

const convertToXlsx = async (newsArray) => {
  console.log("newsArray, ", newsArray?.length);
  const newsSheet = xlsx.utils.json_to_sheet(newsArray);
  const newsBook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newsBook, newsSheet, "News");
  xlsx.writeFile(newsBook, path.join(__dirname, "crawling_covid_news.xlsx"));
};

scrapTotalData(3);
