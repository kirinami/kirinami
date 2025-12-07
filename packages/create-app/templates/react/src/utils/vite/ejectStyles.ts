import type { Node } from 'estree-walker';
import type { ModuleNode, ViteDevServer } from 'vite';

function filterCssModules(
  moduleNode: ModuleNode | undefined,
  cssModules = new Set<ModuleNode>(),
  visitedModules = new Set<ModuleNode>(),
) {
  if (!moduleNode || visitedModules.has(moduleNode)) {
    return cssModules;
  }

  visitedModules.add(moduleNode);

  if (moduleNode.url.endsWith('.css') || moduleNode.url.endsWith('.scss')) {
    moduleNode.importedModules.forEach((moduleNode) => visitedModules.add(moduleNode));

    cssModules.add(moduleNode);
  }

  moduleNode.importedModules.forEach((importedModuleNode) =>
    filterCssModules(importedModuleNode, cssModules, visitedModules),
  );

  return cssModules;
}

export async function ejectStyles(vite: ViteDevServer, entryModuleUrl: string) {
  /* eslint-disable import/no-extraneous-dependencies */
  const { parse } = await import('acorn');
  const { walk } = await import('estree-walker');
  /* eslint-enable import/no-extraneous-dependencies */

  const entryModule = await vite.moduleGraph.getModuleByUrl(entryModuleUrl);

  return Array.from(filterCssModules(entryModule)).reduce(
    async (promise, cssModule) => {
      const styles = await promise;

      const transformResult = await vite.transformRequest(cssModule.url);

      if (!transformResult) {
        return styles;
      }

      const ast = parse(transformResult.code, {
        sourceType: 'module',
        ecmaVersion: 'latest',
        locations: true,
        allowHashBang: true,
      });

      let id = '';
      let css = '';

      walk(ast as Node, {
        enter(node) {
          if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier' && node.init?.type === 'Literal') {
            if (node.id.name === '__vite__id') {
              id = String(node.init.value);
            } else if (node.id.name === '__vite__css') {
              css = String(node.init.value);
            }
          }
        },
      });

      return [...styles, { id, css }];
    },
    Promise.resolve([] as { id: string; css: string }[]),
  );
}
