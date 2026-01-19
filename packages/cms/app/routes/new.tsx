import { Form, redirect, useNavigation, Link } from "react-router";
import { createArticle } from "../utils/db.server";
import type { Route } from "./+types/new";

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	const title = formData.get("title") as string;
	const slug = formData.get("slug") as string;
	const year = formData.get("year") as string;

	if (!title || !slug || !year) {
		return { error: "All fields are required" };
	}

	await createArticle(year, slug, { title });
	return redirect(`/articles/${year}/${slug}`);
}

export default function NewArticle({ actionData }: Route.ComponentProps) {
	const navigation = useNavigation();
	const isCreating = navigation.state === "submitting";

	const currentYear = new Date().getFullYear().toString();

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
			<title>記事を追加 - Acto CMS</title>
			{/* @ts-ignore - actionData might have error */}
			{actionData?.error && (
				<div className="bg-red-100 text-red-700 p-2 rounded mb-4">
					{/* @ts-ignore */}
					{actionData.error}
				</div>
			)}

			<div className="mb-4">
				<Link
					to="/"
					className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
				>
					← 一覧に戻る
				</Link>
			</div>

			<h1 className="text-2xl font-bold mb-6">記事を追加</h1>
			<Form method="post" className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						タイトル
					</label>
					<input
						type="text"
						name="title"
						required
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						公開年
					</label>
					<input
						type="number"
						name="year"
						defaultValue={currentYear}
						required
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						スラッグ
					</label>
					<input
						type="text"
						name="slug"
						required
						pattern="[a-z0-9-]+"
						title="Lowercase letters, numbers, and hyphens only"
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
					/>
					<p className="text-xs text-gray-500 mt-1">例: my-new-post</p>
				</div>

				<button
					type="submit"
					disabled={isCreating}
					className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
				>
					{isCreating ? "追加中..." : "記事を追加"}
				</button>
			</Form>
		</div>
	);
}
