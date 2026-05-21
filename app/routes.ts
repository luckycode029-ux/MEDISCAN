import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

const devRoutes = import.meta.env.DEV ? prefix("dev", [route("components", "dev/components.tsx")]) : [];

export default [
  route("api/scan-medicine", "routes/api.scan-medicine.ts"),
  route("api/analyze-report", "routes/api.analyze-report.ts"),
  route("api/check-symptoms", "routes/api.check-symptoms.ts"),
  layout("components/app-shell/app-shell.tsx", [
    index("routes/home.tsx"),
    route("scan", "routes/scan.tsx"),
    route("report", "routes/report.tsx"),
    route("symptoms", "routes/symptoms.tsx"),
    route("find-care", "routes/find-care.tsx"),
    route("book/:doctorId", "routes/book.tsx"),
  ]),
  ...devRoutes,
] satisfies RouteConfig;
