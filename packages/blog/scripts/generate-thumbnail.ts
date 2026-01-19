import { createCanvas, Canvas, registerFont, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { program } from "commander";
import { format } from "date-fns";

registerFont(path.join(__dirname, "fonts/Outfit-Medium.ttf"), {
  family: "Outfit",
  weight: "500",
});
registerFont(path.join(__dirname, "fonts/NotoSansJP-SemiBold.ttf"), {
  family: "Noto Sans JP",
  weight: "600",
});
registerFont(path.join(__dirname, "fonts/NotoSansJP-Medium.ttf"), {
  family: "Noto Sans JP",
  weight: "500",
});
registerFont(path.join(__dirname, "fonts/NotoSansJP-Regular.ttf"), {
  family: "Noto Sans JP",
  weight: "normal",
});

// コマンドライン引数を処理
program
  .option("-t, --title <title>", "Title of the thumbnail")
  .option("-c, --textColor <textColor>", "Text color")
  .option("-o, --output <output>", "Output Path")
  .parse(process.argv);

const argv = program.opts();

// Text wrapping helper
function wrapText(ctx: any, text: string, maxWidth: number) {
  let lines = [];
  let currentLine = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

// サムネイル画像を生成する関数
async function generateThumbnail(
  title: string,
  textColor: string,
  outputFileName: string
) {
  // 1920x1080のキャンバスを作成
  const width = 1920;
  const height = 1080;
  const canvas: Canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 背景色を設定 (Gradient)
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#1b263b");
  gradient.addColorStop(1, "#262626");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Accent Line
  ctx.fillStyle = "#FF9B42"; // Nord Cyan
  ctx.fillRect(0, 0, 48, height);

  const padding = 120;

  // タイトルを描画
  ctx.fillStyle = textColor;
  ctx.font = "600 120px 'Outfit', 'Noto Sans JP',  sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const maxTitleWidth = width - (padding * 2);
  const lineHeight = 160;

  const lines = wrapText(ctx, title, maxTitleWidth);
  lines.forEach((line, index) => {
    ctx.fillText(line, padding, padding + (index * lineHeight));
  });

  // Footer (Badge Style)
  const badgeHeight = 160;
  const iconSize = 120;
  const badgePadding = 20;
  const gap = 30;
  const username = "wamo";

  // Configure Font for measurement
  ctx.font = "500 70px 'Outfit', 'Noto Sans JP', sans-serif";
  const textMetrics = ctx.measureText(username);
  const badgeWidth = badgePadding + iconSize + gap + textMetrics.width + (badgePadding * 2);

  const footerX = padding;
  const footerY = height - padding - badgeHeight;

  // Draw Badge Background (Glassmorphism-ish)
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Semi-transparent dark
  const r = badgeHeight / 2;

  ctx.beginPath();
  ctx.moveTo(footerX + r, footerY);
  ctx.lineTo(footerX + badgeWidth - r, footerY);
  ctx.quadraticCurveTo(footerX + badgeWidth, footerY, footerX + badgeWidth, footerY + r);
  ctx.lineTo(footerX + badgeWidth, footerY + badgeHeight - r);
  ctx.quadraticCurveTo(footerX + badgeWidth, footerY + badgeHeight, footerX + badgeWidth - r, footerY + badgeHeight);
  ctx.lineTo(footerX + r, footerY + badgeHeight);
  ctx.quadraticCurveTo(footerX, footerY + badgeHeight, footerX, footerY + badgeHeight - r);
  ctx.lineTo(footerX, footerY + r);
  ctx.quadraticCurveTo(footerX, footerY, footerX + r, footerY);
  ctx.closePath();
  ctx.fill();

  // Add subtle border
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.stroke();
  ctx.restore();

  // Load and Draw Icon
  const iconPath = path.join(__dirname, "../public/wamo.jpg");
  try {
    if (fs.existsSync(iconPath)) {
      const image = await loadImage(iconPath);

      const iconX = footerX + badgePadding;
      const iconY = footerY + (badgeHeight - iconSize) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(image, iconX, iconY, iconSize, iconSize);
      ctx.restore();
    }
  } catch(e) {
      console.error(e);
  }

  // Draw Username
  ctx.fillStyle = textColor;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(username, footerX + badgePadding + iconSize + gap, footerY + badgeHeight / 2 - 5);

  // Logo (Bottom Right - acto.svg)
  const logoPath = path.join(__dirname, "acto.svg");
  try {
    if (fs.existsSync(logoPath)) {
      const logo = await loadImage(logoPath);
      const logoDisplayHeight = 80; // Adjust size as needed
      const aspectRatio = logo.width / logo.height;
      const logoDisplayWidth = logoDisplayHeight * aspectRatio;

      // Align vertically with the center of the badge
      const logoY = footerY + (badgeHeight - logoDisplayHeight) / 2;
      const logoX = width - padding - logoDisplayWidth;

      ctx.drawImage(logo, logoX, logoY, logoDisplayWidth, logoDisplayHeight);
    }
  } catch (e) {
    console.error("Error loading logo:", e);
  }

  // 画像を出力
  const buffer = outputFileName.endsWith(".jpg")
    ? canvas.toBuffer("image/jpeg")
    : canvas.toBuffer("image/png");

  // @ts-ignore
  fs.writeFileSync(outputFileName, buffer);
  console.log(`Thumbnail generated: ${outputFileName}`);
}

// 引数からデータを取得し、サムネイルを生成
generateThumbnail(
  argv.title || format(new Date(), "yyyy/MM/dd"),
  argv.textColor || "#fff",
  argv.output || "thumbnail.png"
).catch(console.error);
