import { 
  Building,
  Server,
  Cable,
  Network,
  Zap,
  Globe,
  MapPin
} from 'lucide-react';

export const productData = {
  'secure-cabinet': {
    name: 'Secure Cabinet Express',
    category: 'Colocation',
    icon: Building,
    description: 'High-security cabinet space with 24/7 access',
    basePrice: 850,
    essentialTemplates: [
      {
        id: 'secure-cabinet-starter',
        name: 'Startup Essentials',
        tier: 'basic',
        popular: false,
        description: 'Perfect for startups and small businesses just getting started with colocation',
        pricing: '$850',
        useCase: 'Small teams, development environments, basic infrastructure',
        essentialDetails: [
          { label: 'Port Speed', value: '10Gbps' },
          { label: 'VLANs', value: '50' },
          { label: 'Cloud Providers', value: 'All major CSPs' },
          { label: 'Setup Time', value: '1 hour' }
        ],
        keyFeatures: [
          '10Gbps high-performance port',
          'Up to 50 VLAN configurations',
          'Access to all major cloud providers',
          'Advanced monitoring and analytics',
          'Priority technical support',
          'API access for automation',
          'Burst capability up to 20Gbps',
          'Multi-cloud orchestration tools'
        ],
        configuration: {
          portSpeed: '10G',
          vlanCount: '50'
        }
      },
      {
        id: 'fabric-ports-enterprise',
        name: 'Enterprise Cloud',
        tier: 'enterprise',
        popular: false,
        description: 'Maximum performance cloud connectivity for enterprise scale',
        pricing: '$1,800',
        useCase: 'Enterprise applications, high-frequency trading, big data analytics',
        essentialDetails: [
          { label: 'Port Speed', value: '100Gbps' },
          { label: 'VLANs', value: '100' },
          { label: 'Cloud Providers', value: 'Global ecosystem' },
          { label: 'Setup Time', value: '30 minutes' }
        ],
        keyFeatures: [
          '100Gbps ultra-high-speed port',
          'Maximum 100 VLAN configurations',
          'Global cloud provider ecosystem',
          'Real-time performance analytics',
          'Dedicated support engineer',
          'Advanced API and SDN capabilities',
          'Unlimited burst capability',
          'Custom integration support',
          'SLA with performance guarantees'
        ],
        configuration: {
          portSpeed: '100G',
          vlanCount: '100'
        }
      }
    ],
    templates: [
      {
        id: 'fabric-ports-basic',
        name: 'Basic Fabric Port',
        description: 'Entry-level cloud connectivity',
        pricing: '$200/month',
        features: ['1Gbps Port', '10 VLANs', 'Basic Support'],
        configuration: {
          portSpeed: '1G',
          vlanCount: '10'
        }
      },
      {
        id: 'fabric-ports-standard',
        name: 'Standard Fabric Port',
        description: 'Enhanced cloud connectivity for growing needs',
        pricing: '$450/month',
        features: ['10Gbps Port', '50 VLANs', 'Standard Support'],
        configuration: {
          portSpeed: '10G',
          vlanCount: '50'
        }
      },
      {
        id: 'fabric-ports-premium',
        name: 'Premium Fabric Port',
        description: 'Enterprise-grade cloud connectivity',
        pricing: '$1,200/month',
        features: ['100Gbps Port', '100 VLANs', 'Premium Support'],
        configuration: {
          portSpeed: '100G',
          vlanCount: '100'
        }
      }
    ],
    fields: [
      { 
        name: 'portSpeed', 
        label: 'Port Speed', 
        type: 'select', 
        options: ['1G', '10G', '100G'],
        required: true
      },
      { 
        name: 'vlanCount', 
        label: 'VLAN Count', 
        type: 'number', 
        min: 1, 
        max: 100,
        required: true
      }
    ]
  },
  'patch-panel': {
    name: 'Patch Panel',
    category: 'Colocation',
    icon: Server,
    description: 'Flexible patch panel solutions',
    basePrice: 120,
    essentialTemplates: [
      {
        id: 'patch-panel-compact',
        name: 'Compact Office',
        tier: 'basic',
        popular: false,
        description: 'Perfect for small office environments with basic connectivity needs',
        pricing: '$120',
        useCase: 'Small offices, home offices, basic network infrastructure',
        essentialDetails: [
          { label: 'Ports', value: '12 ports' },
          { label: 'Connector Type', value: 'RJ45' },
          { label: 'Category', value: 'Cat6' },
          { label: 'Installation', value: '2 hours' }
        ],
        keyFeatures: [
          '12-port RJ45 configuration',
          'Category 6 cable support',
          'Basic labeling included',
          'Standard mounting hardware',
          'Basic installation service'
        ],
        configuration: {
          ports: '12',
          type: 'RJ45'
        }
      },
      {
        id: 'patch-panel-standard',
        name: 'Business Standard',
        tier: 'business',
        popular: true,
        description: 'Ideal for growing business network infrastructure needs',
        pricing: '$220',
        useCase: 'Medium businesses, branch offices, structured cabling systems',
        essentialDetails: [
          { label: 'Ports', value: '24 ports' },
          { label: 'Connector Type', value: 'LC' },
          { label: 'Category', value: 'Fiber Ready' },
          { label: 'Installation', value: '1 hour' }
        ],
        keyFeatures: [
          '24-port LC fiber configuration',
          'Single and multi-mode support',
          'Professional labeling system',
          'Premium mounting hardware',
          'Professional installation',
          'Cable management included',
          'Testing and certification'
        ],
        configuration: {
          ports: '24',
          type: 'LC'
        }
      },
      {
        id: 'patch-panel-enterprise',
        name: 'Enterprise High-Density',
        tier: 'enterprise',
        popular: false,
        description: 'High-density solution for large-scale network deployments',
        pricing: '$420',
        useCase: 'Data centers, large enterprises, high-density applications',
        essentialDetails: [
          { label: 'Ports', value: '48 ports' },
          { label: 'Connector Type', value: 'SC' },
          { label: 'Category', value: 'High Density' },
          { label: 'Installation', value: '30 minutes' }
        ],
        keyFeatures: [
          '48-port high-density SC configuration',
          'Advanced fiber management',
          'Color-coded labeling system',
          'Enterprise mounting solutions',
          'Express installation service',
          'Advanced cable management',
          'Full testing and documentation',
          'Ongoing maintenance support',
          'Performance monitoring'
        ],
        configuration: {
          ports: '48',
          type: 'SC'
        }
      }
    ],
    templates: [
      {
        id: 'patch-panel-small',
        name: 'Small Office Template',
        description: 'Perfect for small office connectivity needs',
        pricing: '$120/month',
        features: ['12 Ports', 'RJ45 Connectors', 'Cat6 Ready'],
        configuration: {
          ports: '12',
          type: 'RJ45'
        }
      },
      {
        id: 'patch-panel-medium',
        name: 'Medium Business Template',
        description: 'Ideal for growing business infrastructure',
        pricing: '$180/month',
        features: ['24 Ports', 'LC Connectors', 'Fiber Ready'],
        configuration: {
          ports: '24',
          type: 'LC'
        }
      },
      {
        id: 'patch-panel-enterprise',
        name: 'Enterprise Template',
        description: 'High-density solution for large deployments',
        pricing: '$300/month',
        features: ['48 Ports', 'SC Connectors', 'High Density'],
        configuration: {
          ports: '48',
          type: 'SC'
        }
      }
    ],
    fields: [
      { 
        name: 'ports', 
        label: 'Number of Ports', 
        type: 'select', 
        options: ['12', '24', '48'],
        required: true
      },
      { 
        name: 'type', 
        label: 'Connector Type', 
        type: 'select', 
        options: ['RJ45', 'LC', 'SC'],
        required: true
      }
    ]
  },
  'fiber-connect': {
    name: 'Fiber Connect',
    category: 'Interconnection',
    icon: Network,
    description: 'High-speed fiber connectivity solutions',
    basePrice: 500,
    essentialTemplates: [
      {
        id: 'fiber-connect-local',
        name: 'Local Connect',
        tier: 'basic',
        popular: false,
        description: 'Standard 1 Gigabit fiber for local connectivity needs',
        pricing: '$500',
        useCase: 'Local connections, small business internet, basic fiber needs',
        essentialDetails: [
          { label: 'Speed', value: '1Gbps' },
          { label: 'Distance', value: 'Up to 10km' },
          { label: 'SLA', value: '99.9%' },
          { label: 'Installation', value: '5 days' }
        ],
        keyFeatures: [
          '1Gbps dedicated bandwidth',
          'Single-mode fiber infrastructure',
          'Standard SLA coverage',
          'Basic monitoring included',
          'Standard technical support'
        ],
        configuration: {
          speed: '1G',
          distance: '10'
        }
      },
      {
        id: 'fiber-connect-regional',
        name: 'Regional Connect',
        tier: 'business',
        popular: true,
        description: 'High-performance 10 Gigabit connection for business applications',
        pricing: '$1,400',
        useCase: 'Regional connectivity, business applications, video streaming',
        essentialDetails: [
          { label: 'Speed', value: '10Gbps' },
          { label: 'Distance', value: 'Up to 50km' },
          { label: 'SLA', value: '99.95%' },
          { label: 'Installation', value: '3 days' }
        ],
        keyFeatures: [
          '10Gbps high-speed connection',
          'Extended distance capability',
          'Enhanced SLA with faster response',
          'Advanced monitoring and alerts',
          'Priority technical support',
          'Burst capability available',
          'Performance reporting'
        ],
        configuration: {
          speed: '10G',
          distance: '50'
        }
      },
      {
        id: 'fiber-connect-nationwide',
        name: 'Nationwide Connect',
        tier: 'enterprise',
        popular: false,
        description: 'Ultra-high-speed 100 Gigabit for enterprise applications',
        pricing: '$4,200',
        useCase: 'Enterprise backbone, data center interconnect, mission-critical apps',
        essentialDetails: [
          { label: 'Speed', value: '100Gbps' },
          { label: 'Distance', value: 'Up to 100km' },
          { label: 'SLA', value: '99.99%' },
          { label: 'Installation', value: '24 hours' }
        ],
        keyFeatures: [
          '100Gbps ultra-high-speed',
          'Maximum distance coverage',
          'Premium SLA with guarantees',
          'Real-time performance monitoring',
          'Dedicated support engineer',
          'Redundancy options available',
          'Custom routing capabilities',
          'Enterprise-grade security',
          '24/7 NOC monitoring'
        ],
        configuration: {
          speed: '100G',
          distance: '100'
        }
      }
    ],
    templates: [
      {
        id: 'fiber-connect-1g',
        name: '1G Fiber Connect',
        description: 'Standard 1 Gigabit fiber connection',
        pricing: '$500/month',
        features: ['1Gbps Speed', 'Up to 10km Distance', 'Standard SLA'],
        configuration: {
          speed: '1G',
          distance: '10'
        }
      },
      {
        id: 'fiber-connect-10g',
        name: '10G Fiber Connect',
        description: 'High-performance 10 Gigabit connection',
        pricing: '$1,200/month',
        features: ['10Gbps Speed', 'Up to 50km Distance', 'Premium SLA'],
        configuration: {
          speed: '10G',
          distance: '50'
        }
      },
      {
        id: 'fiber-connect-100g',
        name: '100G Fiber Connect',
        description: 'Ultra-high-speed 100 Gigabit connection',
        pricing: '$3,500/month',
        features: ['100Gbps Speed', 'Up to 100km Distance', 'Enterprise SLA'],
        configuration: {
          speed: '100G',
          distance: '100'
        }
      }
    ],
    fields: [
      { 
        name: 'speed', 
        label: 'Speed', 
        type: 'select', 
        options: ['1G', '10G', '100G'],
        required: true
      },
      { 
        name: 'distance', 
        label: 'Distance (km)', 
        type: 'number', 
        min: 1, 
        max: 100,
        required: true
      }
    ]
  },
  'metro-connect': {
    name: 'Metro Connect',
    category: 'Interconnection',
    icon: Globe,
    description: 'Metro area network connections',
    basePrice: 750,
    essentialTemplates: [
      {
        id: 'metro-connect-basic',
        name: 'Metro Basic',
        tier: 'basic',
        popular: false,
        description: 'Standard metro area connectivity for small businesses',
        pricing: '$750',
        useCase: 'Small business branches, basic site connectivity',
        essentialDetails: [
          { label: 'Bandwidth', value: '100Mbps' },
          { label: 'Redundancy', value: 'None' },
          { label: 'Locations', value: '2-3 sites' },
          { label: 'Setup', value: '7 days' }
        ],
        keyFeatures: [
          '100Mbps dedicated bandwidth',
          'Single path connectivity',
          'Basic network monitoring',
          'Standard support hours',
          'Simple configuration'
        ],
        configuration: {
          bandwidth: '100M',
          redundancy: 'None'
        }
      },
      {
        id: 'metro-connect-business',
        name: 'Metro Business',
        tier: 'business',
        popular: true,
        description: 'Enhanced metro connectivity with backup for business continuity',
        pricing: '$1,650',
        useCase: 'Business networks, multi-site operations, backup connectivity',
        essentialDetails: [
          { label: 'Bandwidth', value: '1Gbps' },
          { label: 'Redundancy', value: 'Active/Standby' },
          { label: 'Locations', value: '5-10 sites' },
          { label: 'Setup', value: '3 days' }
        ],
        keyFeatures: [
          '1Gbps high-speed connectivity',
          'Active/Standby redundancy',
          'Advanced network monitoring',
          'Business hours priority support',
          'Automatic failover capability',
          'Network performance reporting',
          'Quality of Service (QoS) controls'
        ],
        configuration: {
          bandwidth: '1G',
          redundancy: 'Active/Standby'
        }
      },
      {
        id: 'metro-connect-enterprise',
        name: 'Metro Enterprise',
        tier: 'enterprise',
        popular: false,
        description: 'High-performance metro with load balancing for enterprise scale',
        pricing: '$3,200',
        useCase: 'Large enterprises, mission-critical applications, high availability',
        essentialDetails: [
          { label: 'Bandwidth', value: '10Gbps' },
          { label: 'Redundancy', value: 'Load Balanced' },
          { label: 'Locations', value: 'Unlimited' },
          { label: 'Setup', value: '24 hours' }
        ],
        keyFeatures: [
          '10Gbps enterprise-grade bandwidth',
          'Load-balanced redundancy',
          'Real-time network analytics',
          '24/7 enterprise support',
          'Intelligent traffic distribution',
          'Advanced security features',
          'Custom SLA agreements',
          'Dedicated account management',
          'Proactive network optimization'
        ],
        configuration: {
          bandwidth: '10G',
          redundancy: 'Load Balanced'
        }
      }
    ],
    templates: [
      {
        id: 'metro-connect-basic',
        name: 'Basic Metro Connect',
        description: 'Standard metro area connectivity',
        pricing: '$750/month',
        features: ['100Mbps Bandwidth', 'Single Path', 'Standard SLA'],
        configuration: {
          bandwidth: '100M',
          redundancy: 'None'
        }
      },
      {
        id: 'metro-connect-business',
        name: 'Business Metro Connect',
        description: 'Enhanced metro connectivity with backup',
        pricing: '$1,400/month',
        features: ['1Gbps Bandwidth', 'Active/Standby', 'Business SLA'],
        configuration: {
          bandwidth: '1G',
          redundancy: 'Active/Standby'
        }
      },
      {
        id: 'metro-connect-enterprise',
        name: 'Enterprise Metro Connect',
        description: 'High-performance metro with load balancing',
        pricing: '$2,800/month',
        features: ['10Gbps Bandwidth', 'Load Balanced', 'Enterprise SLA'],
        configuration: {
          bandwidth: '10G',
          redundancy: 'Load Balanced'
        }
      }
    ],
    fields: [
      { 
        name: 'bandwidth', 
        label: 'Bandwidth', 
        type: 'select', 
        options: ['100M', '1G', '10G'],
        required: true
      },
      { 
        name: 'redundancy', 
        label: 'Redundancy', 
        type: 'select', 
        options: ['None', 'Active/Standby', 'Load Balanced'],
        required: true
      }
    ]
  },
  'campus-connect': {
    name: 'Campus Connect',
    category: 'Interconnection',
    icon: MapPin,
    description: 'Campus-wide connectivity solutions',
    basePrice: 450,
    essentialTemplates: [
      {
        id: 'campus-connect-compact',
        name: 'Compact Campus',
        tier: 'basic',
        popular: false,
        description: 'Perfect for small campus environments and educational institutions',
        pricing: '$450',
        useCase: 'Small campuses, schools, research facilities',
        essentialDetails: [
          { label: 'Locations', value: '2-3 buildings' },
          { label: 'Protocol', value: 'Ethernet' },
          { label: 'Management', value: 'Basic' },
          { label: 'Setup', value: '5 days' }
        ],
        keyFeatures: [
          'Ethernet-based connectivity',
          '2-3 building coverage',
          'Basic network management',
          'Standard support',
          'Simple configuration'
        ],
        configuration: {
          locations: '2',
          protocol: 'Ethernet'
        }
      },
      {
        id: 'campus-connect-standard',
        name: 'Standard Campus',
        tier: 'business',
        popular: true,
        description: 'Ideal for growing campus infrastructure with advanced features',
        pricing: '$980',
        useCase: 'Medium campuses, corporate facilities, multi-building operations',
        essentialDetails: [
          { label: 'Locations', value: '5-8 buildings' },
          { label: 'Protocol', value: 'MPLS' },
          { label: 'Management', value: 'Advanced' },
          { label: 'Setup', value: '3 days' }
        ],
        keyFeatures: [
          'MPLS protocol for reliability',
          '5-8 building connectivity',
          'Advanced network management',
          'Priority technical support',
          'Traffic prioritization',
          'Network segmentation',
          'Performance monitoring'
        ],
        configuration: {
          locations: '5',
          protocol: 'MPLS'
        }
      },
      {
        id: 'campus-connect-enterprise',
        name: 'Enterprise Campus',
        tier: 'enterprise',
        popular: false,
        description: 'Enterprise campus with SD-WAN capabilities and unlimited scale',
        pricing: '$1,850',
        useCase: 'Large enterprises, university campuses, complex multi-site operations',
        essentialDetails: [
          { label: 'Locations', value: '10+ buildings' },
          { label: 'Protocol', value: 'SD-WAN' },
          { label: 'Management', value: 'Enterprise' },
          { label: 'Setup', value: '24 hours' }
        ],
        keyFeatures: [
          'SD-WAN technology',
          'Unlimited building connectivity',
          'Enterprise network management',
          '24/7 dedicated support',
          'Dynamic path selection',
          'Advanced security integration',
          'Cloud optimization',
          'Custom policy management',
          'Real-time analytics'
        ],
        configuration: {
          locations: '10',
          protocol: 'SD-WAN'
        }
      }
    ],
    templates: [
      {
        id: 'campus-connect-small',
        name: 'Small Campus Template',
        description: 'Perfect for small campus environments',
        pricing: '$450/month',
        features: ['2-3 Locations', 'Ethernet Protocol', 'Basic Management'],
        configuration: {
          locations: '2',
          protocol: 'Ethernet'
        }
      },
      {
        id: 'campus-connect-medium',
        name: 'Medium Campus Template',
        description: 'Ideal for growing campus infrastructure',
        pricing: '$850/month',
        features: ['4-6 Locations', 'MPLS Protocol', 'Advanced Management'],
        configuration: {
          locations: '5',
          protocol: 'MPLS'
        }
      },
      {
        id: 'campus-connect-large',
        name: 'Large Campus Template',
        description: 'Enterprise campus with SD-WAN capabilities',
        pricing: '$1,650/month',
        features: ['7-10 Locations', 'SD-WAN Protocol', 'Enterprise Management'],
        configuration: {
          locations: '10',
          protocol: 'SD-WAN'
        }
      }
    ],
    fields: [
      { 
        name: 'locations', 
        label: 'Number of Locations', 
        type: 'number', 
        min: 2, 
        max: 10,
        required: true
      },
      { 
        name: 'protocol', 
        label: 'Protocol', 
        type: 'select', 
        options: ['Ethernet', 'MPLS', 'SD-WAN'],
        required: true
      }
    ]
  }
};