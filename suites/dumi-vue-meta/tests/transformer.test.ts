import path from 'path';
import { afterAll, expect, test } from 'vitest';
import type { MetaCheckerOptions } from '../src/index';
import {
  createProject,
  dumiTransformer,
  vueTypesSchemaResolver,
} from '../src/index';

const checkerOptions: MetaCheckerOptions = {
  schema: {
    propertyResovlers: [vueTypesSchemaResolver],
    externalSymbolLinkMappings: {
      typescript: {
        Promise:
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
      },
    },
  },
};

const project = createProject({
  tsconfigPath: path.resolve(__dirname, 'fixtures/tsconfig.json'),
  checkerOptions,
});

test('dumi-assets-types transformer', () => {
  const entry = path.resolve(__dirname, 'fixtures/index.ts');
  const meta = project.service.getComponentLibraryMeta(entry, dumiTransformer);
  expect(meta).toMatchSnapshot();
});

afterAll(() => {
  project.close();
});
