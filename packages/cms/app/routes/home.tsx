import { Link, useLoaderData, Form, useSubmit } from "react-router";
import { getArticles } from "../utils/db.server";
import type { Route } from "./+types/home";

export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url);
	const categoryParam = url.searchParams.get("category");
	const yearParam = url.searchParams.get("year");
	const statusParam = url.searchParams.get("status");

	let articles = await getArticles();

	// Derive lists from all articles before filtering
	const categories = Array.from(
		new Set(articles.map((a) => a.category).filter(Boolean)),
	).sort();
	const years = Array.from(new Set(articles.map((a) => a.year)))
		.sort()
		.reverse();

	// Apply filters
	if (categoryParam) {
		articles = articles.filter((a) => a.category === categoryParam);
	}
	if (yearParam) {
		articles = articles.filter((a) => a.year === yearParam);
	}
	if (statusParam === "draft") {
		articles = articles.filter((a) => a.draft);
	} else if (statusParam === "published") {
		articles = articles.filter((a) => !a.draft);
	}

	return {
		articles,
		options: { categories, years },
		filters: {
			category: categoryParam || "",
			year: yearParam || "",
			status: statusParam || "",
		},
	};
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { articles, options, filters } = loaderData;
	const submit = useSubmit();

	return (
		<div className="p-8 max-w-4xl mx-auto">
			<title>記事一覧 - Acto CMS</title>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">記事一覧</h1>
				<Link
					to="/articles/new"
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					記事を追加
				</Link>
			</div>

			<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
				<Form
					method="get"
					className="flex flex-wrap gap-4 items-end"
					onChange={(e) => {
						submit(e.currentTarget, { replace: true });
					}}
				>
					<div>
						<label
							htmlFor="category"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							カテゴリ
						</label>
						<select
							name="category"
							id="category"
							defaultValue={filters.category}
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
						>
							<option value="">すべて</option>
							{options.categories.map((cat) => (
								<option key={cat} value={cat as string}>
									{cat}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="year"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							公開年
						</label>
						<select
							name="year"
							id="year"
							defaultValue={filters.year}
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
						>
							<option value="">すべて</option>
							{options.years.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="status"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							ステータス
						</label>
						<select
							name="status"
							id="status"
							defaultValue={filters.status}
							className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
						>
							<option value="">すべて</option>
							<option value="published">公開</option>
							<option value="draft">下書き</option>
						</select>
					</div>

					<div className="pb-0.5">
						<Link
							to="/"
							className="text-sm text-gray-500 hover:text-gray-700 underline"
						>
							リセット
						</Link>
					</div>
				</Form>
			</div>

			<div className="space-y-4">
				{articles.map((article) => (
					<div
						key={`${article.year}-${article.slug}`}
						className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
					>
						<Link
							to={`/articles/${article.year}/${article.slug}`}
							className="block"
						>
							<h2 className="text-xl font-semibold mb-2">{article.title}</h2>
							<div className="text-gray-500 text-sm flex gap-4">
								<span>{article.date}</span>
								<span>{article.year}</span>
								{article.category && (
									<span className="bg-gray-100 px-2 py-0.5 rounded text-xs border">
										{article.category}
									</span>
								)}
								{article.draft && (
									<span className="text-red-500 font-bold">下書き</span>
								)}
								<span className="text-gray-400">/{article.slug}</span>
							</div>
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
