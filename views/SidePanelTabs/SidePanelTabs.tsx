import React from 'react';
import type { Session } from '~utils/types';

const SidePanelTabs = ({ session }: { session: Session }) => {
  return (
    <div>
      {session?.tabs.map(tab => {
        return (
          <div key={tab.id}>
            {tab.url}
          </div>
        )
      })}
    </div>
  )
}

export default SidePanelTabs;