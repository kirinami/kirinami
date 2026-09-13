import type { ModuleNode, ViteDevServer } from 'vite';

function collectCssModules(
  moduleNode: ModuleNode | undefined,
  cssModules = new Set<ModuleNode>(),
  visitedModules = new Set<ModuleNode>(),
) {
  if (!moduleNode || visitedModules.has(moduleNode)) {
    return cssModules;
  }

  visitedModules.add(moduleNode);

  if (moduleNode.url.endsWith('.css') || moduleNode.url.endsWith('.scss')) {
    // What a stylesheet imports is Vite runtime plumbing, not more stylesheets
    moduleNode.importedModules.forEach((importedModuleNode) => {
      visitedModules.add(importedModuleNode);
    });

    cssModules.add(moduleNode);
  }

  moduleNode.importedModules.forEach((importedModuleNode) => {
    collectCssModules(importedModuleNode, cssModules, visitedModules);
  });

  return cssModules;
}

export async function extractStyles(vite: ViteDevServer, url: string) {
  await vite.warmupRequest(url);

  const entryModule = await vite.moduleGraph.getModuleByUrl(url);

  const cssModules = collectCssModules(entryModule);

  let styles = '';

  for (const cssModule of cssModules) {
    // `?direct` yields the raw stylesheet instead of the JS module that injects it
    const separator = cssModule.url.includes('?') ? '&' : '?';

    const result = await vite.transformRequest(`${cssModule.url}${separator}direct`);

    if (!result) {
      continue;
    }

    styles += `<style type="text/css" data-vite-dev-id="${cssModule.id ?? cssModule.url}">${result.code}</style>`;
  }

  return styles;
}

export async function extractScripts(vite: ViteDevServer) {
  return vite.transformIndexHtml('/', '');
}
