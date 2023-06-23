import { HttpMethod } from '@/types';

export async function revalidate(
  hostname: string,
  siteId: string,
  slug: string
) {
  const urlPaths = [`/_sites/${siteId}/${slug}`, `/_sites/${siteId}`];

  try {
    await Promise.all(
      urlPaths.map((urlPath) =>
        fetch(`${hostname}/api/revalidate`, {
          method: HttpMethod.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            urlPath,
          }),
        })
      )
    );
  } catch (err) {
    console.error(err);
  }
}
