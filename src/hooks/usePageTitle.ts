import { useEffect } from 'react';

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | Thriftees` : 'Thriftees | Pre-loved clothing, one of a kind';
  }, [title]);
}
