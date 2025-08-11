import { SCHEMA_LINK } from "@/constants";

const NAVIGATION_IDS = ['Home', 'Reminders'];

export function buildDeepLinkFromNotificationData(data?: any): string | null {
  const navigationId = data?.navigationId || 'Home';
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }

  switch (navigationId) {
    case 'Home': {
      return `${SCHEMA_LINK}://home`;
    }
    case 'Reminders': {
      const listId = data?.listId;
      if (typeof listId === 'string') {
        return `${SCHEMA_LINK}://reminders/${listId}`;
      }
      console.warn('Missing listId');
      return null;
    }
    default:
      return null;
  }
}
