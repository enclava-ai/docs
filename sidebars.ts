import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Enclava Documentation Sidebar
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Enclava Platform',
      items: [
        'enclava-platform/overview',
        'enclava-platform/api-reference',
        'enclava-platform/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Confidential Computing',
      items: [
        'confidential-computing/how-it-works',
        {
          type: 'category',
          label: 'Privatemode',
          items: [
            'confidential-computing/privatemode/overview',
            'confidential-computing/privatemode/architecture',
            'confidential-computing/privatemode/threat-profile',
          ],
        },
        {
          type: 'category',
          label: 'NVIDIA Confidential Enclaves',
          items: [
            'confidential-computing/nvidia-enclaves/overview',
            'confidential-computing/nvidia-enclaves/architecture', 
            'confidential-computing/nvidia-enclaves/threat-model',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
