import { createCanvas, Canvas, registerFont } from "canvas";
import fs from "fs";
import path from "path";
import { program } from "commander";
import { format } from "date-fns";

registerFont(path.join(__dirname, "fonts/Outfit-Medium.ttf"), {
  family: "Outfit",
  weight: "500",
});

// コマンドライン引数を処理
program
  .option("-t, --title <title>", "Title of the thumbnail")
  .option("-b, --backgroundColor <backgroundColor>", "Background color")
  .option("-c, --textColor <textColor>", "Text color")
  .option("-o, --output <output>", "Output file name")
  .parse(process.argv);

const argv = program.opts();

// サムネイル画像を生成する関数
function generateThumbnail(
  title: string,
  backgroundColor: string,
  textColor: string,
  outputFileName: string
) {
  // 1920x1080のキャンバスを作成
  const width = 1920;
  const height = 1080;
  const canvas: Canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 背景色を設定
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // タイトルを描画
  ctx.fillStyle = textColor;
  ctx.font = "bold 160px Outfit";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(title, width / 2, height / 2);

  // 画像を出力
  const buffer = outputFileName.endsWith(".jpg")
    ? canvas.toBuffer("image/jpeg")
    : canvas.toBuffer("image/png");

  // @ts-ignore
  fs.writeFileSync(path.join(__dirname, outputFileName), buffer);
  console.log(`Thumbnail generated: ${outputFileName}`);
}

// 引数からデータを取得し、サムネイルを生成
generateThumbnail(
  argv.title || format(new Date(), "yyyy/MM/dd"),
  argv.backgroundColor || "#000",
  argv.textColor || "#fff",
  argv.output || "thumbnail.png"
);
