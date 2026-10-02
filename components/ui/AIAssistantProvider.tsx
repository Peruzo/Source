'use client';

import { useEffect, useState } from 'react';
import { AIAssistantWidget } from './AIAssistantWidget';

export function AIAssistantProvider() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  // Lets CSS elsewhere react to the open panel (the scroll hint hides itself with
  // html[data-chat-open]). Set after mount only, never during render.
  useEffect(() => {
    const root = document.documentElement;
    if (isWidgetOpen) root.dataset.chatOpen = '';
    else root.removeAttribute('data-chat-open');
    return () => root.removeAttribute('data-chat-open');
  }, [isWidgetOpen]);

  return (
    <AIAssistantWidget
      isOpen={isWidgetOpen}
      onClose={() => setIsWidgetOpen(false)}
      onOpen={() => setIsWidgetOpen(true)}
      showFloatingButton={true}
    />
  );
}







