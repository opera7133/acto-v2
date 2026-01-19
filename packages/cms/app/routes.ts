import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("articles/new", "routes/new.tsx"),
    route("articles/:year/:slug", "routes/editor.tsx"),
    route("api/image/*", "routes/api.image.$.ts")
] satisfies RouteConfig;
