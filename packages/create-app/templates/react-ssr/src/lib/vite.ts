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
    moduleNode.importedModules.forEach((moduleNode) => {
      visitedModules.add(moduleNode);
    });

    cssModules.add(moduleNode);
  }

  moduleNode.importedModules.forEach((importedModuleNode) => {
    collectCssModules(importedModuleNode, cssModules, visitedModules);
  });

  return cssModules;
}

export async function extractStyles(vite: ViteDevServer, url: string) {
  /* eslint-disable import/no-extraneous-dependencies */
  const { parse } = await import('acorn');
  const { simple } = await import('acorn-walk');
  /* eslint-enable import/no-extraneous-dependencies */

  await vite.warmupRequest(url);

  const entryModule = await vite.moduleGraph.getModuleByUrl(url);

  const cssModules = collectCssModules(entryModule);

  let styles = '';

  for (const cssModule of cssModules) {
    const result = await vite.transformRequest(cssModule.url);

    if (!result) {
      continue;
    }

    const ast = parse(result.code, {
      sourceType: 'module',
      ecmaVersion: 'latest',
    });

    let id = '';
    let css = '';

    simple(ast, {
      VariableDeclarator: (node) => {
        if (node.id.type === 'Identifier' && node.init?.type === 'Literal') {
          if (node.id.name === '__vite__id') {
            id = String(node.init.value);
          } else if (node.id.name === '__vite__css') {
            css = String(node.init.value);
          }
        }
      },
    });

    styles += `<style type="text/css" data-vite-dev-id="${id}">${css}</style>`;
  }

  return styles;
}

export async function extractScripts(vite: ViteDevServer) {
  return vite.transformIndexHtml('/', '');
}
