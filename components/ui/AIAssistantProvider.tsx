'use client';

import { useState } from 'react';
import { AIAssistantWidget } from './AIAssistantWidget';

export function AIAssistantProvider() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  return (
    <AIAssistantWidget
      isOpen={isWidgetOpen}
      onClose={() => setIsWidgetOpen(false)}
      onOpen={() => setIsWidgetOpen(true)}
      showFloatingButton={true}
    />
  );
}







