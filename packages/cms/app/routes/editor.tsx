import { Form, useNavigation, useSubmit, Link } from "react-router";
import {
	getArticle,
	updateArticle,
	saveImage,
	getArticleImages,
} from "../utils/db.server";
import type { Route } from "./+types/editor";
import { useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

export async function loader({ params }: Route.LoaderArgs) {
	const { year, slug } = params;
	if (!year || !slug) throw new Error("Missing params");

	const article = await getArticle(year, slug);
	if (!article) throw new Response("Not Found", { status: 404 });

	const images = await getArticleImages(year, slug);

	return { article, images };
}

export async function action({ request, params }: Route.ActionArgs) {
	const { year, slug } = params;
	if (!year || !slug) throw new Error("Missing params");

	const formData = await request.formData();
	const intent = formData.get("intent");

	if (intent === "save") {
		const title = formData.get("title") as string;
		const date = formData.get("date") as string;
		const updatedDate = formData.get("updatedDate") as string;
		const category = formData.get("category") as string;
		const draft = formData.get("draft") === "on";
		const heroImage = formData.get("heroImage") as string;
		const content = formData.get("content") as string;

		await updateArticle(
			year,
			slug,
			{
				title,
				date,
				updatedDate,
				category,
				draft,
				heroImage,
			},
			content,
		);

		return { success: true };
	}

	if (intent === "upload") {
		const file = formData.get("image") as File;
		if (!file || file.size === 0) return { error: "No file selected" };

		const imagePath = await saveImage(file, year, slug);
		return { imagePath };
	}

	if (intent === "generate-thumbnail") {
		const title = formData.get("title") as string;
		if (!title) return { error: "Title is required for thumbnail generation" };

		const scriptPath = path.resolve(
			process.cwd(),
			"../blog/scripts/generate-thumbnail.ts",
		);
		const imageName = `thumbnail-${Date.now()}.png`; // Unique name to avoid cache issues
		const outputDir = path.resolve(
			process.cwd(),
			`../blog/src/assets/images/${year}/${slug}`,
		);
		const output = path.join(outputDir, imageName);

		try {
			// Ensure directory exists
			const fs = await import("fs-extra");
			await fs.ensureDir(outputDir);

			// Bun run the script
			// Assuming bun is in path
			const command = `bun run ${scriptPath} --title "${title}" --output "${output}"`;
			console.log("Running:", command);
			await execAsync(command);

			const imagePath = `/src/assets/images/${year}/${slug}/${imageName}`;
			return { success: true, generatedThumbnail: imagePath };
		} catch (e: any) {
			console.error("Thumbnail generation failed:", e);
			return { error: `Thumbnail generation failed: ${e.message}` };
		}
	}

	return null;
}

export default function ArticleEditor({
	loaderData,
	actionData,
}: Route.ComponentProps) {
	const { article, images: initialImages } = loaderData;
	const navigation = useNavigation();
	const submit = useSubmit();
	const [content, setContent] = useState(article.content);
	const [heroImage, setHeroImage] = useState(article.heroImage || "");
	const [category, setCategory] = useState(article.category || "Tech");
	const [images, setImages] = useState(initialImages);
	const [isDragging, setIsDragging] = useState(false);

	// Update state when loader data changes
	useEffect(() => {
		setContent(article.content);
		setHeroImage(article.heroImage || "");
		setCategory(article.category || "Tech");
		setImages(initialImages);
	}, [article, initialImages]);

	const isSaving = navigation.formData?.get("intent") === "save";
	const isGenerating =
		navigation.formData?.get("intent") === "generate-thumbnail";

	// Handle upload result
	// Handle upload result
	useEffect(() => {
		if (actionData && "imagePath" in actionData && actionData.imagePath) {
			const insert = `![](${actionData.imagePath})`;
			setContent((prev) => prev + "\n" + insert);
			// Optimistically add to images list if it's not already there
			setImages((prev) => {
				if (prev.includes(actionData.imagePath as string)) return prev;
				return [...prev, actionData.imagePath as string];
			});
			// alert(`Image uploaded! Path: ${actionData.imagePath}`); // Removed alert for smoother DnD
		}
	}, [actionData]);

	// Handle Thumbnail Generation result
	useEffect(() => {
		if (
			actionData &&
			"generatedThumbnail" in actionData &&
			actionData.generatedThumbnail
		) {
			setHeroImage(actionData.generatedThumbnail as string);
			alert("Thumbnail generated!");
		}
		if (actionData && "error" in actionData) {
			alert(actionData.error);
		}
	}, [actionData]);

	// Handle Save
	// We need to sync the content state to a hidden input because Form controls only pick up inputs

	return (
		<div className="flex h-screen bg-gray-50">
			<title>記事編集 - Acto CMS</title>
			{/* Sidebar / Meta */}
			<div className="w-80 bg-white border-r p-6 overflow-y-auto flex flex-col gap-6">
				<div>
					<div className="mb-4">
						<Link
							to="/"
							className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
						>
							← 一覧に戻る
						</Link>
					</div>
					<h2 className="text-lg font-bold mb-4">記事情報</h2>
					<Form method="post" className="space-y-4">
						<input type="hidden" name="intent" value="save" />
						<input type="hidden" name="content" value={content} />
						<input type="hidden" name="heroImage" value={heroImage} />

						<div>
							<label className="block text-sm font-medium text-gray-700">
								タイトル
							</label>
							<input
								type="text"
								name="title"
								defaultValue={article.title}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								カテゴリー
							</label>
							<select
								name="category"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
							>
								<option value="Blog">Blog</option>
								<option value="Design">Design</option>
								<option value="Hardware">Hardware</option>
								<option value="Linux">Linux</option>
								<option value="Music">Music</option>
								<option value="Payment">Payment</option>
								<option value="Server">Server</option>
								<option value="Smartphone">Smartphone</option>
								<option value="Software">Software</option>
								<option value="Web">Web</option>
								<option value="Zakki">Zakki</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								記事スラッグ
							</label>
							<input
								type="text"
								disabled
								value={article.slug}
								className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm sm:text-sm border p-2 text-gray-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								公開日
							</label>
							<input
								type="date"
								name="date"
								defaultValue={
									article.date
										? new Date(article.date).toISOString().split("T")[0]
										: ""
								}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								更新日
							</label>
							<input
								type="date"
								name="updatedDate"
								defaultValue={
									article.updatedDate
										? new Date(article.updatedDate).toISOString().split("T")[0]
										: ""
								}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
							/>
						</div>

						<div className="flex items-center">
							<input
								type="checkbox"
								name="draft"
								id="draft"
								defaultChecked={article.draft}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label
								htmlFor="draft"
								className="ml-2 block text-sm text-gray-900"
							>
								下書き
							</label>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								サムネイル画像
							</label>
							<div className="flex gap-2">
								<input
									type="text"
									name="heroImageInput"
									value={heroImage}
									onChange={(e) => setHeroImage(e.target.value)}
									disabled={category === "Zakki"}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 disabled:bg-gray-100 disabled:text-gray-400"
								/>
							</div>
							{heroImage && category !== "Zakki" && (
								<div className="mt-2 border border-gray-300 rounded p-1">
									<img
										src={`/api/image${heroImage}`}
										alt="Thumbnail Preview"
										className="w-full h-auto rounded"
										onError={(e) => {
											(e.target as HTMLImageElement).src = ""; // Clear broken image
											(e.target as HTMLImageElement).alt = "Image not found";
										}}
									/>
								</div>
							)}
							<Form method="post">
								<input type="hidden" name="intent" value="generate-thumbnail" />
								{/* Re-send title so script knows it */}
								<input type="hidden" name="title" value={article.title} />
								<button
									type="submit"
									disabled={isGenerating || category === "Zakki"}
									className="mt-2 w-full bg-orange-500 text-white font-bold py-1 px-3 rounded text-sm hover:bg-orange-600 disabled:opacity-50"
								>
									{isGenerating ? "生成中..." : "タイトルから生成"}
								</button>
							</Form>
						</div>

						<button
							type="submit"
							disabled={isSaving}
							className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
						>
							{isSaving ? "保存中..." : "変更を保存"}
						</button>
					</Form>
				</div>

				<div className="border-t pt-4">
					<h3 className="font-bold mb-2 text-sm">画像ギャラリー</h3>
					<div className="grid grid-cols-2 gap-2 mb-4 max-h-60 overflow-y-auto">
						{images.length === 0 && (
							<p className="text-xs text-gray-400 col-span-2">
								画像はありません
							</p>
						)}
						{images.map((img) => (
							<button
								key={img}
								type="button"
								onClick={() => {
									const insert = `![](${img.replace("/src/", "../../../")})`;
									setContent((prev) => prev + "\n" + insert);
								}}
								className="border rounded hover:border-blue-500 overflow-hidden relative group"
							>
								<img
									src={`/api/image${img}`}
									alt={img}
									className="w-full h-20 object-cover"
								/>
								<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
							</button>
						))}
					</div>

					<h3 className="font-bold mb-2 text-sm">画像アップロード</h3>
					<Form method="post" encType="multipart/form-data" replace>
						<input type="hidden" name="intent" value="upload" />
						<input
							type="file"
							name="image"
							accept="image/*"
							className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"
						/>
						<button
							type="submit"
							className="bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm hover:bg-gray-300 w-full"
						>
							アップロードして挿入
						</button>
					</Form>
				</div>
			</div>

			{/* Main Editor */}
			<div
				className={`flex-1 p-6 flex flex-col h-full overflow-hidden transition-colors ${
					isDragging ? "bg-blue-50" : ""
				}`}
				onDragOver={(e) => {
					e.preventDefault();
					setIsDragging(true);
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={async (e) => {
					e.preventDefault();
					setIsDragging(false);

					const files = e.dataTransfer.files;
					if (files.length === 0) return;

					const file = files[0];
					if (!file.type.startsWith("image/")) {
						alert("画像ファイルのみアップロード可能です");
						return;
					}

					const formData = new FormData();
					formData.append("intent", "upload");
					formData.append("image", file);

					// Submit programmatically using useSubmit
					// We need to pass the form data to the action
					submit(formData, {
						method: "post",
						encType: "multipart/form-data",
						replace: true, // Prevent history stack buildup
					});
				}}
			>
				<h2 className="text-xl font-bold mb-4">
					本文{" "}
					{isDragging && (
						<span className="text-blue-600">- Drop Image Here to Upload</span>
					)}
				</h2>
				<div className="flex-1 border rounded overflow-y-auto bg-white font-mono text-sm">
					<CodeEditor
						value={content}
						language="markdown"
						onChange={(e) => setContent(e.target.value)}
						padding={20}
						style={{
							fontFamily: '"Fira code", "Fira Mono", monospace',
							fontSize: 14,
							minHeight: "100%",
						}}
						onKeyDown={(evn) => {
							if (evn.nativeEvent.isComposing) {
								return false;
							}
						}}
					/>
				</div>
			</div>
		</div>
	);
}
