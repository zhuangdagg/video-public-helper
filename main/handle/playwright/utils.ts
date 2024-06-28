import { Page } from 'playwright';

/**
 * 判断是否是目标页面
 * @param page
 */
export const isTargePage = async (page: Page, targetUrl: string) => {
  const url = await page.url();
  console.log({ url, targetUrl });
  return url === targetUrl;
};
