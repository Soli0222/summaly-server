import express from 'express';
import summaly from 'summaly'; // 仮にsummalyがnpmパッケージとしてインストールされているものとします

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const urlParam = req.query.url as string; // URLパラメータからURLを取得

  if (!urlParam) {
    return res.status(400).json({ error: 'URL parameter is missing' });
  }

  try {
    const summary = await summaly(urlParam); // summalyで要約情報を取得
    res.json(summary); // 要約情報をJSONで返す
  } catch (error) {
    console.error(error); // エラーをコンソールに出力
    res.status(500).json({ error: 'An error occurred while summarizing the URL' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
