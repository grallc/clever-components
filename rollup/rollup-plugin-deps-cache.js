import { DepGraph } from 'dependency-graph';
import { promises as pfs } from 'fs';
import path from 'path';

export function depsCachePlugin () {
  return {
    generateBundle (options, outputBundle) {
      const graph = new DepGraph();
      for (const [id, bundle] of Object.entries(outputBundle)) {
        graph.addNode(id);
        for (const imp of bundle.imports || []) {
          graph.addNode(imp);
          graph.addDependency(id, imp);
        }
        for (const rf of bundle.referencedFiles || []) {
          graph.addNode(rf);
          graph.addDependency(id, rf);
        }
        // console.log({ id, imports: bundle.imports, files: bundle.referencedFiles });
      }
      const depCache = {};
      pfs.mkdir(path.join(process.cwd(), options.dir), { recursive: true }).then(() => {
        for (const [id] of Object.entries(outputBundle)) {
          if (id.endsWith('.svg')) {
            continue;
          }
          depCache[id] = graph.dependenciesOf(id);
        }
        pfs.writeFile(path.join(process.cwd(), options.dir, 'depcache.js'), 'export const depCache = ' + JSON.stringify(depCache) + ';').catch(console.error);
      });
    },
  };
}
