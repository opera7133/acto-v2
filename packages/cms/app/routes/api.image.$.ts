import type { Route } from "./+types/api.image.$";
import fs from "fs-extra";
import path from "path";
import mime from "mime";

export async function loader({ params, request }: Route.LoaderArgs) {
	const imagePath = params["*"];
	if (!imagePath) return new Response("Not Found", { status: 404 });

	// Resolve path relative to packages/blog
	// Expected input: src/assets/images/2024/01/image.png
	// Actual filesystem: packages/blog/src/assets/images/2024/01/image.png

	const BLOG_ROOT = path.resolve(process.cwd(), "../blog");
	const filePath = path.join(BLOG_ROOT, imagePath);

	// Security check: ensure filePath is within BLOG_ROOT
	if (!filePath.startsWith(BLOG_ROOT)) {
		return new Response("Forbidden", { status: 403 });
	}

	if (!(await fs.pathExists(filePath))) {
		return new Response("Not Found", { status: 404 });
	}

	const file = await fs.readFile(filePath);
	const type = mime.getType(filePath) || "application/octet-stream";

	return new Response(file, {
		headers: {
			"Content-Type": type,
			"Cache-Control": "public, max-age=31536000",
		},
	});
}
