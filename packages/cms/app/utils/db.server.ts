import fs from "fs-extra";
import path from "path";
import matter from "gray-matter";

// Relative path from packages/cms to packages/blog
const BLOG_CONTENT_DIR = path.resolve(
	process.cwd(),
	"../blog/src/content/blog",
);
const BLOG_IMAGES_DIR = path.resolve(
	process.cwd(),
	"../blog/src/assets/images",
);

export interface Article {
	slug: string;
	year: string;
	title: string;
	date: string;
	updatedDate?: string;
	category?: string;
	draft: boolean;
	content: string; // Markdown body
	heroImage?: string;
	frontmatter: Record<string, any>;
}

export async function getArticles(): Promise<Article[]> {
	const years = await fs.readdir(BLOG_CONTENT_DIR);
	const articles: Article[] = [];

	for (const year of years) {
		const yearPath = path.join(BLOG_CONTENT_DIR, year);
		const stats = await fs.stat(yearPath);
		if (!stats.isDirectory()) continue;

		const files = await fs.readdir(yearPath);
		for (const file of files) {
			if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;

			const filePath = path.join(yearPath, file);
			const fileContent = await fs.readFile(filePath, "utf-8");
			const { data, content } = matter(fileContent);
			const slug = file.replace(/\.mdx?$/, "");

			articles.push({
				slug,
				year,
				title: data.title || slug,
				date: data.pubDate || "",
				updatedDate: data.updatedDate || "",
				category: data.category,
				draft: data.draft ?? false,
				content,
				heroImage: data.heroImage,
				frontmatter: data,
			});
		}
	}

	// Sort by date desc
	return articles.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
}

export async function getArticle(
	year: string,
	slug: string,
): Promise<Article | null> {
	// Try .md first, then .mdx
	let filename = `${slug}.md`;
	let filePath = path.join(BLOG_CONTENT_DIR, year, filename);

	if (!(await fs.pathExists(filePath))) {
		filename = `${slug}.mdx`;
		filePath = path.join(BLOG_CONTENT_DIR, year, filename);
	}

	if (!(await fs.pathExists(filePath))) {
		return null;
	}

	const fileContent = await fs.readFile(filePath, "utf-8");
	const { data, content } = matter(fileContent);

	return {
		slug,
		year,
		title: data.title || slug,
		date: data.pubDate || "",
		updatedDate: data.updatedDate || "",
		category: data.category,
		draft: data.draft ?? false,
		content,
		heroImage: data.heroImage,
		frontmatter: data,
	};
}

export async function updateArticle(
	year: string,
	slug: string,
	updates: Partial<Article>,
	newContent?: string,
) {
	const current = await getArticle(year, slug);
	if (!current) throw new Error("Article not found");

	// Construct new frontmatter
	const newFrontmatter = {
		...current.frontmatter,
		...updates.frontmatter, // Merge generic frontmatter updates
	};

	// Explicit fields override
	if (updates.title) newFrontmatter.title = updates.title;
	if (updates.date) newFrontmatter.pubDate = updates.date;
	if (updates.updatedDate) newFrontmatter.updatedDate = updates.updatedDate;
	if (updates.category) newFrontmatter.category = updates.category;
	if (updates.draft !== undefined) newFrontmatter.draft = updates.draft;
	if (updates.heroImage) newFrontmatter.heroImage = updates.heroImage;

	const fileContent = matter.stringify(
		newContent !== undefined ? newContent : current.content,
		newFrontmatter,
	);

	// Determine path (keep extension)
	let filename = `${slug}.md`;
	if (await fs.pathExists(path.join(BLOG_CONTENT_DIR, year, `${slug}.mdx`))) {
		filename = `${slug}.mdx`;
	}

	const filePath = path.join(BLOG_CONTENT_DIR, year, filename);
	await fs.writeFile(filePath, fileContent);
}

export async function createArticle(
	year: string,
	slug: string,
	data: Partial<Article>,
) {
	const yearDir = path.join(BLOG_CONTENT_DIR, year);
	await fs.ensureDir(yearDir);

	const filePath = path.join(yearDir, `${slug}.md`); // Default to .md
	if (await fs.pathExists(filePath)) throw new Error("Article already exists");

	const frontmatter = {
		title: data.title || "Untitled",
		pubDate: data.date || new Date().toISOString().split("T")[0],
		category: data.category || "Tech",
		draft: data.draft ?? true,
		...data.frontmatter,
	};

	const fileContent = matter.stringify(data.content || "", frontmatter);
	await fs.writeFile(filePath, fileContent);
}

export async function saveImage(
	file: File,
	year: string,
	slug: string,
): Promise<string> {
	const buffer = await file.arrayBuffer();
	const targetDir = path.join(BLOG_IMAGES_DIR, year, slug);
	await fs.ensureDir(targetDir);

	const filePath = path.join(targetDir, file.name);
	await fs.writeFile(filePath, Buffer.from(buffer));

	// Return relative path for markdown
	// Expected: ../../../assets/images/YYYY/SLUG/filename.png
	// Or absolute path for heroImage: /src/assets/images/YYYY/SLUG/filename.png

	return `/src/assets/images/${year}/${slug}/${file.name}`;
}

export async function getArticleImages(
	year: string,
	slug: string,
): Promise<string[]> {
	const targetDir = path.join(BLOG_IMAGES_DIR, year, slug);
	if (!(await fs.pathExists(targetDir))) {
		return [];
	}

	const files = await fs.readdir(targetDir);
	// Filter for image files if needed, but for now assuming mostly images
	// Return the public/relative path used in the editor
	return files
		.filter((f) => /\.(png|jpe?g|gif|webp|svg)$/i.test(f))
		.map((file) => `/src/assets/images/${year}/${slug}/${file}`);
}
