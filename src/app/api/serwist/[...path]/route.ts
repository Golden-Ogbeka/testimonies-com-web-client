import { spawnSync } from 'node:child_process';
import { createSerwistRoute } from '@serwist/turbopack';

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf-8',
  }).stdout.trim() || crypto.randomUUID();

const route = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
  useNativeEsbuild: true,
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
});

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;

export const generateStaticParams = async () => {
  const params = await route.generateStaticParams();
  return params.map((p) => ({ path: Array.isArray(p.path) ? p.path : [p.path] }));
};

export const GET = async (request: Request, context: { params: Promise<{ path: string[] }> }) => {
  const { path } = await context.params;
  return (route.GET as unknown as (request: Request, context: { params: Promise<{ path: string }> }) => Promise<Response>)(request, {
    params: Promise.resolve({ path: path.join('/') }),
  });
};
