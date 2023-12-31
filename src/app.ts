import express from 'express';
import summaly from 'summaly'; // 仮にsummalyがnpmパッケージとしてインストールされているものとします
import * as https from 'https';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  let urlParam = req.query.url as string; // URLパラメータからURLを取得

  if (!urlParam) {
    return res.status(400).json({ error: 'URL parameter is missing' });
  }

  if (urlParam.startsWith('https://spotify.link')) {
    function followRedirects(url: string, callback: (finalUrl: string) => void) {
      const request = https.get(url, (response) => {
        if (!response.statusCode) {
          console.error('ステータスコードがありません。');
          return;
        }

        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // リダイレクトの場合、新しいURLに再帰的にリクエストを送信
          const newUrl = response.headers.location;
          urlParam = newUrl; // 変数を更新
          followRedirects(newUrl, callback);
        } else {
          callback(urlParam); // 最終的なリダイレクト先のURLをコールバックで返します
        }
      });

      request.on('error', (error) => {
        console.error(`エラー: ${error.message}`);
      });
    }

    followRedirects(urlParam, (finalUrl) => {
      console.log(finalUrl)
      urlParam = finalUrl; // 変数を更新
      continueWithSummary();
    });
  } else {
    continueWithSummary();
  }

  async function continueWithSummary() {
    try {
      const summary = await summaly(urlParam); // summalyで要約情報を取得
      res.json(summary); // 要約情報をJSONで返す
    } catch (error) {
      console.error(error); // エラーをコンソールに出力
      res.status(500).json({ error: 'An error occurred while summarizing the URL' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
