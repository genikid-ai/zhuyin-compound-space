/* ==========================================================================
   結合韻大冒險・題庫圖片資料（共 60 組：ㄧ 27 組、ㄨ 23 組、ㄩ 10 組）
   每筆資料含：
     - id       : 題目編號
     - group    : 介音分組 ("yi" | "wu" | "yu")
     - base     : 結合韻韻母組別（用於避免同韻干擾項）
     - rhymeImg : 結合韻卡片圖片網址（先出現讓幼兒唸讀）
     - wordImg  : 語詞圖片網址（內含圖案與語詞文字，供認識或選擇）
     - alt      : 無障礙替代說明（不顯示於畫面文字）
     - exclude  : 跨組音近或語詞重疊之排除干擾清單
   ========================================================================== */

window.COMPOUND_RHYME_DATA = (function () {
  "use strict";

  const BASE_URL = "https://genikid-ai.github.io/imagecard/images/game-folder-kwa4i8/";

  const ITEMS = [
    /* ==================== 注音「ㄧ」結合韻（27 組） ==================== */
    {
      id: "E01-1", group: "yi", base: "E01", alt: "小鴨子",
      rhymeImg: BASE_URL + "e01-1-117b9843.jpg",
      wordImg:  BASE_URL + "e01-1-20fe8830.jpg"
    },
    {
      id: "E01-2", group: "yi", base: "E01", alt: "刷牙",
      rhymeImg: BASE_URL + "e01-2-59ac08d6.jpg",
      wordImg:  BASE_URL + "e01-2-66a1b5a0.jpg"
    },
    {
      id: "E01-4", group: "yi", base: "E01", alt: "驚訝",
      rhymeImg: BASE_URL + "e01-4-d3234c18.jpg",
      wordImg:  BASE_URL + "e01-4-6a1bc83c.jpg"
    },
    {
      id: "E02-2", group: "yi", base: "E02", alt: "爺爺",
      rhymeImg: BASE_URL + "e02-2-d9d3d462.jpg",
      wordImg:  BASE_URL + "e02-2-3f50e290.jpg"
    },
    {
      id: "E02-3", group: "yi", base: "E02", alt: "野餐",
      rhymeImg: BASE_URL + "e02-3-f8da79c1.jpg",
      wordImg:  BASE_URL + "e02-3-7634c443.jpg"
    },
    {
      id: "E02-4", group: "yi", base: "E02", alt: "葉子",
      rhymeImg: BASE_URL + "e02-4-64f1bf0e.jpg",
      wordImg:  BASE_URL + "e02-4-d8b586e9.jpg"
    },
    {
      id: "E03-2", group: "yi", base: "E03", alt: "搖搖馬",
      rhymeImg: BASE_URL + "e03-2-398264aa.jpg",
      wordImg:  BASE_URL + "e03-2-5d4d6546.jpg",
      exclude:  ["U02-3"]
    },
    {
      id: "E03-4", group: "yi", base: "E03", alt: "鑰匙",
      rhymeImg: BASE_URL + "e03-4-d58f6540.jpg",
      wordImg:  BASE_URL + "e03-4-3e256be1.jpg"
    },
    {
      id: "E04-1", group: "yi", base: "E04", alt: "優勝",
      rhymeImg: BASE_URL + "e04-1-6d256408.jpg",
      wordImg:  BASE_URL + "e04-1-c184f132.jpg"
    },
    {
      id: "E04-2", group: "yi", base: "E04", alt: "游泳",
      rhymeImg: BASE_URL + "e04-2-5539a8cd.jpg",
      wordImg:  BASE_URL + "e04-2-02c8dc59.jpg",
      exclude:  ["U04-3"]
    },
    {
      id: "E04-3", group: "yi", base: "E04", alt: "朋友",
      rhymeImg: BASE_URL + "e04-3-b0ffab20.jpg",
      wordImg:  BASE_URL + "e04-3-626cb7f2.jpg"
    },
    {
      id: "E04-4", group: "yi", base: "E04", alt: "柚子",
      rhymeImg: BASE_URL + "e04-4-f09b80ff.jpg",
      wordImg:  BASE_URL + "e04-4-d8c70670.jpg"
    },
    {
      id: "E05-1", group: "yi", base: "E05", alt: "煙火",
      rhymeImg: BASE_URL + "e05-1-396b1c7b.jpg",
      wordImg:  BASE_URL + "e05-1-4d7ce291.jpg"
    },
    {
      id: "E05-2", group: "yi", base: "E05", alt: "顏色",
      rhymeImg: BASE_URL + "e05-2-9150f4fe.jpg",
      wordImg:  BASE_URL + "e05-2-26e566eb.jpg"
    },
    {
      id: "E05-3", group: "yi", base: "E05", alt: "眼鏡",
      rhymeImg: BASE_URL + "e05-3-df3ab9b1.jpg",
      wordImg:  BASE_URL + "e05-3-44ec955f.jpg"
    },
    {
      id: "E05-4", group: "yi", base: "E05", alt: "燕子",
      rhymeImg: BASE_URL + "e05-4-94319aa8.jpg",
      wordImg:  BASE_URL + "e05-4-1bf60652.jpg"
    },
    {
      id: "E06-1", group: "yi", base: "E06", alt: "音樂",
      rhymeImg: BASE_URL + "e06-1-98016731.jpg",
      wordImg:  BASE_URL + "e06-1-bc6fe2e2.jpg",
      exclude:  ["U01-4"]
    },
    {
      id: "E06-2", group: "yi", base: "E06", alt: "銀牌",
      rhymeImg: BASE_URL + "e06-2-d2f8c5f8.jpg",
      wordImg:  BASE_URL + "e06-2-a7522b3f.jpg"
    },
    {
      id: "E06-3", group: "yi", base: "E06", alt: "飲料",
      rhymeImg: BASE_URL + "e06-3-97bfe73a.jpg",
      wordImg:  BASE_URL + "e06-3-2efb54dc.jpg"
    },
    {
      id: "E06-4", group: "yi", base: "E06", alt: "印章",
      rhymeImg: BASE_URL + "e06-4-f9b5b563.jpg",
      wordImg:  BASE_URL + "e06-4-d4862699.jpg"
    },
    {
      id: "E07-2", group: "yi", base: "E07", alt: "太陽",
      rhymeImg: BASE_URL + "e07-2-e8381fc8.jpg",
      wordImg:  BASE_URL + "e07-2-e5504f5f.jpg"
    },
    {
      id: "E07-3", group: "yi", base: "E07", alt: "養魚",
      rhymeImg: BASE_URL + "e07-3-1da8ff70.jpg",
      wordImg:  BASE_URL + "e07-3-5fd11738.jpg"
    },
    {
      id: "E07-4", group: "yi", base: "E07", alt: "可愛模樣",
      rhymeImg: BASE_URL + "e07-4-e83a2be2.jpg",
      wordImg:  BASE_URL + "e07-4-280e80d5.jpg"
    },
    {
      id: "E08-1", group: "yi", base: "E08", alt: "櫻桃",
      rhymeImg: BASE_URL + "e08-1-45f0170a.jpg",
      wordImg:  BASE_URL + "e08-1-74ae8d71.jpg"
    },
    {
      id: "E08-2", group: "yi", base: "E08", alt: "螢火蟲",
      rhymeImg: BASE_URL + "e08-2-0b773313.jpg",
      wordImg:  BASE_URL + "e08-2-4a3ca893.jpg"
    },
    {
      id: "E08-3", group: "yi", base: "E08", alt: "影子",
      rhymeImg: BASE_URL + "e08-3-b06cde14.jpg",
      wordImg:  BASE_URL + "e08-3-3196ec3e.jpg"
    },
    {
      id: "E08-4", group: "yi", base: "E08", alt: "硬幣",
      rhymeImg: BASE_URL + "e08-4-7c8e08c5.jpg",
      wordImg:  BASE_URL + "e08-4-10872aac.jpg"
    },

    /* ==================== 注音「ㄨ」結合韻（23 組） ==================== */
    {
      id: "X01-1", group: "wu", base: "X01", alt: "挖土機",
      rhymeImg: BASE_URL + "x01-1-d6eb187f.jpg",
      wordImg:  BASE_URL + "x01-1-7870b129.jpg"
    },
    {
      id: "X01-2", group: "wu", base: "X01", alt: "娃娃",
      rhymeImg: BASE_URL + "x01-2-47ac02e2.jpg",
      wordImg:  BASE_URL + "x01-2-b0e7cb99.jpg"
    },
    {
      id: "X01-3", group: "wu", base: "X01", alt: "瓦斯爐",
      rhymeImg: BASE_URL + "x01-3-54be8b1e.jpg",
      wordImg:  BASE_URL + "x01-3-fd38377f.jpg"
    },
    {
      id: "X01-4", group: "wu", base: "X01", alt: "襪子",
      rhymeImg: BASE_URL + "x01-4-60d70e08.jpg",
      wordImg:  BASE_URL + "x01-4-e9e4b1b9.jpg"
    },
    {
      id: "X02-1", group: "wu", base: "X02", alt: "鳥窩",
      rhymeImg: BASE_URL + "x02-1-1ab857ba.jpg",
      wordImg:  BASE_URL + "x02-1-c8de7682.jpg"
    },
    {
      id: "X02-3", group: "wu", base: "X02", alt: "我",
      rhymeImg: BASE_URL + "x02-3-906f7197.jpg",
      wordImg:  BASE_URL + "x02-3-d7aa6a73.jpg"
    },
    {
      id: "X02-4", group: "wu", base: "X02", alt: "握手",
      rhymeImg: BASE_URL + "x02-4-246257fd.jpg",
      wordImg:  BASE_URL + "x02-4-b6917d15.jpg"
    },
    {
      id: "X03-1", group: "wu", base: "X03", alt: "歪斜",
      rhymeImg: BASE_URL + "x03-1-1f01ce55.jpg",
      wordImg:  BASE_URL + "x03-1-53a5b376.jpg"
    },
    {
      id: "X03-4", group: "wu", base: "X03", alt: "外套",
      rhymeImg: BASE_URL + "x03-4-91b28ee4.jpg",
      wordImg:  BASE_URL + "x03-4-f21d5288.jpg"
    },
    {
      id: "X04-2", group: "wu", base: "X04", alt: "圍巾",
      rhymeImg: BASE_URL + "x04-2-0a9eb403.jpg",
      wordImg:  BASE_URL + "x04-2-e90fb50a.jpg"
    },
    {
      id: "X04-3", group: "wu", base: "X04", alt: "尾巴",
      rhymeImg: BASE_URL + "x04-3-c42f3264.jpg",
      wordImg:  BASE_URL + "x04-3-e619b380.jpg"
    },
    {
      id: "X04-4", group: "wu", base: "X04", alt: "餵食",
      rhymeImg: BASE_URL + "x04-4-6a2167c1.jpg",
      wordImg:  BASE_URL + "x04-4-439171b5.jpg"
    },
    {
      id: "X05-1", group: "wu", base: "X05", alt: "臺灣",
      rhymeImg: BASE_URL + "x05-1-9557c31e.jpg",
      wordImg:  BASE_URL + "x05-1-9eff757e.jpg"
    },
    {
      id: "X05-2", group: "wu", base: "X05", alt: "玩具",
      rhymeImg: BASE_URL + "x05-2-0aeaad38.jpg",
      wordImg:  BASE_URL + "x05-2-2f1c17f2.jpg"
    },
    {
      id: "X05-3", group: "wu", base: "X05", alt: "碗",
      rhymeImg: BASE_URL + "x05-3-fb94aa79.jpg",
      wordImg:  BASE_URL + "x05-3-626ac786.jpg"
    },
    {
      id: "X05-4", group: "wu", base: "X05", alt: "萬花筒",
      rhymeImg: BASE_URL + "x05-4-08e9388b.jpg",
      wordImg:  BASE_URL + "x05-4-29e36789.jpg"
    },
    {
      id: "X06-1", group: "wu", base: "X06", alt: "溫度計",
      rhymeImg: BASE_URL + "x06-1-731f3d76.jpg",
      wordImg:  BASE_URL + "x06-1-c88ae639.jpg"
    },
    {
      id: "X06-2", group: "wu", base: "X06", alt: "蚊子",
      rhymeImg: BASE_URL + "x06-2-b5089f9e.jpg",
      wordImg:  BASE_URL + "x06-2-2c51d8be.jpg"
    },
    {
      id: "X06-4", group: "wu", base: "X06", alt: "問號",
      rhymeImg: BASE_URL + "x06-4-233de453.jpg",
      wordImg:  BASE_URL + "x06-4-de573db3.jpg"
    },
    {
      id: "X07-2", group: "wu", base: "X07", alt: "國王",
      rhymeImg: BASE_URL + "x07-2-9948f3a0.jpg",
      wordImg:  BASE_URL + "x07-2-997e1dbd.jpg"
    },
    {
      id: "X07-3", group: "wu", base: "X07", alt: "網球",
      rhymeImg: BASE_URL + "x07-3-e492bef9.jpg",
      wordImg:  BASE_URL + "x07-3-b810f9ee.jpg"
    },
    {
      id: "X07-4", group: "wu", base: "X07", alt: "望遠鏡",
      rhymeImg: BASE_URL + "x07-4-375ac54b.jpg",
      wordImg:  BASE_URL + "x07-4-37066098.jpg",
      exclude:  ["U02-3"]
    },
    {
      id: "X08-1", group: "wu", base: "X08", alt: "小蜜蜂嗡嗡嗡",
      rhymeImg: BASE_URL + "x08-1-b58f93f4.jpg",
      wordImg:  BASE_URL + "x08-1-c4277a34.jpg"
    },

    /* ==================== 注音「ㄩ」結合韻（10 組） ==================== */
    {
      id: "U01-1", group: "yu", base: "U01", alt: "約定",
      rhymeImg: BASE_URL + "u01-1-6541f6f5.jpg",
      wordImg:  BASE_URL + "u01-1-c7891f2d.jpg"
    },
    {
      id: "U01-4", group: "yu", base: "U01", alt: "月亮",
      rhymeImg: BASE_URL + "u01-4-d62f38f4.jpg",
      wordImg:  BASE_URL + "u01-4-58aa45ac.jpg",
      exclude:  ["E06-1"]
    },
    {
      id: "U02-2", group: "yu", base: "U02", alt: "圓形",
      rhymeImg: BASE_URL + "u02-2-fc112f0b.jpg",
      wordImg:  BASE_URL + "u02-2-cb9680c7.jpg"
    },
    {
      id: "U02-3", group: "yu", base: "U02", alt: "遙遠",
      rhymeImg: BASE_URL + "u02-3-bcf7ad28.jpg",
      wordImg:  BASE_URL + "u02-3-ea008631.jpg",
      exclude:  ["E03-2", "X07-4"]
    },
    {
      id: "U02-4", group: "yu", base: "U02", alt: "醫院",
      rhymeImg: BASE_URL + "u02-4-6e071038.jpg",
      wordImg:  BASE_URL + "u02-4-8b7c74ac.jpg"
    },
    {
      id: "U03-1", group: "yu", base: "U03", alt: "頭暈",
      rhymeImg: BASE_URL + "u03-1-04bf350f.jpg",
      wordImg:  BASE_URL + "u03-1-7042689e.jpg"
    },
    {
      id: "U03-2", group: "yu", base: "U03", alt: "白雲",
      rhymeImg: BASE_URL + "u03-2-e11c310e.jpg",
      wordImg:  BASE_URL + "u03-2-a625714a.jpg"
    },
    {
      id: "U03-4", group: "yu", base: "U03", alt: "運動",
      rhymeImg: BASE_URL + "u03-4-0099e0ec.jpg",
      wordImg:  BASE_URL + "u03-4-55f81927.jpg"
    },
    {
      id: "U04-3", group: "yu", base: "U04", alt: "游泳圈",
      rhymeImg: BASE_URL + "u04-3-42b95347.jpg",
      wordImg:  BASE_URL + "u04-3-f58b7151.jpg",
      exclude:  ["E04-2"]
    },
    {
      id: "U04-4", group: "yu", base: "U04", alt: "用力",
      rhymeImg: BASE_URL + "u04-4-07651f66.jpg",
      wordImg:  BASE_URL + "u04-4-5593aa68.jpg"
    }
  ];

  const GROUPS = {
    yi:  { key: "yi",  label: "ㄧ 結合韻", shortLabel: "ㄧ 組", items: ITEMS.filter((i) => i.group === "yi") },
    wu:  { key: "wu",  label: "ㄨ 結合韻", shortLabel: "ㄨ 組", items: ITEMS.filter((i) => i.group === "wu") },
    yu:  { key: "yu",  label: "ㄩ 結合韻", shortLabel: "ㄩ 組", items: ITEMS.filter((i) => i.group === "yu") },
    all: { key: "all", label: "全部結合韻", shortLabel: "全部",  items: ITEMS }
  };

  return { ITEMS, GROUPS };
})();
