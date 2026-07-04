# Serve the prebuilt static export with nginx (parity with langprobe/website).
# Build the static site first on the host / in CI:  pnpm install && pnpm build
# which emits ./out, then this image just packages it.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY out/ /usr/share/nginx/html/
EXPOSE 80
