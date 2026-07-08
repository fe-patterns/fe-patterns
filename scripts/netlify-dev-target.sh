#!/usr/bin/env sh
# `netlify dev` target command (see netlify.toml [dev]).
#
# Astro's dev server self-daemonizes under Netlify's non-TTY spawn: `astro dev`
# forks a background server on :4321 and exits 0. Netlify reads a #custom command
# exiting as the server dying and shuts down. So we start Astro, then block on
# `tail` to keep this command alive while Netlify proxies :4321 (+ functions) on
# :8888. Netlify runs the command without a shell, so we can't use `&&` inline —
# hence this wrapper. Stop Astro afterwards with:
#   pnpm --filter fe-patterns-site exec astro dev stop
pnpm --filter fe-patterns-site dev
exec tail -f /dev/null
