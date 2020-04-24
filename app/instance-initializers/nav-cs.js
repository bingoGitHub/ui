import { getProjectId, getClusterId, bulkAdd } from 'ui/utils/navigation-tree-cs';
import { get } from '@ember/object';
const rootNav = [
  // Project
  {
    scope:          'project',
    id:             'namespaces',
    localizedLabel: 'nav.project.namespaces',
    route:          'authenticated.project.ns.index',
    ctx:            [getProjectId],
    resource:       ['namespace'],
    resourceScope:  'cluster',
  },
  {
    scope:          'project',
    id:             'infra',
    localizedLabel: 'nav.infra.tab',
    ctx:            [getProjectId],
    submenu:        [
      {
        id:             'containers',
        localizedLabel: 'nav.containers.tab',
        route:          'authenticated.project.index',
        ctx:            [getProjectId],
        resource:       ['workload', 'ingress', 'service'],
        resourceScope:  'project',
        currentWhen:    [
          'containers',
          'workload',
          'ingresses',
          'authenticated.project.dns',
          'volumes',
        ],
      },
      {
        id:             'hpa',
        localizedLabel: 'nav.infra.hpa',
        route:          'authenticated.project.hpa',
        ctx:            [getProjectId],
        resource:       ['horizontalpodautoscaler'],
        resourceScope:  'project',
      },
      {
        id:             'infra-secrets',
        localizedLabel: 'nav.infra.secrets',
        route:          'authenticated.project.secrets',
        ctx:            [getProjectId],
        resource:       ['namespacedsecret', 'secret', 'dockercredential', 'certificate'],
        resourceScope:  'project',
        currentWhen:    [
          'authenticated.project.certificates',
          'authenticated.project.registries',
          'authenticated.project.secrets',
        ],
      },
      {
        id:             'infra-config-maps',
        localizedLabel: 'nav.infra.configMaps',
        route:          'authenticated.project.config-maps',
        ctx:            [getProjectId],
        resource:       ['configmap'],
        resourceScope:  'project',
      },
    ],
  },
  {
    scope:          'project',
    id:             'project-security-roles',
    localizedLabel: 'nav.infra.members',
    route:          'authenticated.project.security.members',
    resource:       ['projectroletemplatebinding'],
    resourceScope:  'global',
    ctx:            [getProjectId],
  },
  // Cluster
  {
    scope:          'cluster',
    id:             'cluster-nodes',
    localizedLabel: 'nav.cluster.nodes',
    route:          'authenticated.cluster.nodes',
    ctx:            [getClusterId],
    resource:       ['node'],
    resourceScope:  'global',
  },
  {
    scope:          'cluster',
    id:             'cluster-storage',
    localizedLabel: 'nav.cluster.storage.tab',
    ctx:            [getClusterId],
    resource:       ['clusterroletemplatebinding'],
    resourceScope:  'global',
    submenu:        [
      {
        scope:          'cluster',
        id:             'cluster-storage-volumes',
        localizedLabel: 'nav.cluster.storage.volumes',
        route:          'authenticated.cluster.storage.persistent-volumes.index',
        ctx:            [getClusterId],
        resource:       ['project'],
        resourceScope:  'global',
      },
      {
        scope:          'cluster',
        id:             'cluster-storage-classes',
        localizedLabel: 'nav.cluster.storage.classes',
        route:          'authenticated.cluster.storage.classes.index',
        ctx:            [getClusterId],
        resource:       ['project'],
        resourceScope:  'global',
      },
    ]
  },
  {
    scope:          'cluster',
    id:             'cluster-projects',
    localizedLabel: 'nav.cluster.projects',
    route:          'authenticated.cluster.projects.index',
    ctx:            [getClusterId],
    resource:       ['project'],
    resourceScope:  'global',
  },
  {
    scope:          'cluster',
    id:             'cluster-security-roles',
    localizedLabel: 'nav.cluster.members',
    route:          'authenticated.cluster.security.members.index',
    resource:       ['clusterroletemplatebinding'],
    resourceScope:  'global',
    ctx:            [getClusterId],
  },
  {
    scope:          'cluster',
    id:                       'cluster-tools-istio',
    localizedLabel:           'nav.tools.istio',
    route:                    'authenticated.cluster.istio.cluster-setting',
    resourceScope:            'global',
    resource:                 [],
    ctx:                      [getClusterId],
  },

  // Global
  {
    scope:          'global',
    id:             'global-clusters',
    localizedLabel: 'nav.admin.clusters.tab',
    route:          'global-admin.clusters',
    resource:       ['cluster'],
    resourceScope:  'global',
  },
  {
    scope:          'global',
    id:             'global-accounts',
    localizedLabel: 'nav.admin.security.accounts',
    route:          'global-admin.security.accounts.users',
    resource:       ['user'],
    resourceScope:  'global',
  },
  {
    scope:          'global',
    id:             'global-roles',
    localizedLabel: 'nav.admin.security.roles',
    route:          'global-admin.security.roles.index',
    resource:       ['roletemplate'],
    resourceScope:  'global',
  },
  {
    scope:          'global',
    id:             'global-security',
    localizedLabel: 'nav.admin.security.tab',
    submenu:        [
      {
        id:             'global-security-podSecurityPolicies',
        localizedLabel: 'nav.admin.security.podSecurityPolicies',
        route:          'global-admin.security.policies',
        resource:       ['podsecuritypolicytemplate'],
        resourceScope:  'global',
      },
    ],
  },
  {
    scope:          'global',
    id:             'global-catalogs',
    localizedLabel: 'nav.admin.catalogs',
    resource:       ['catalog'],
    resourceScope:  'global',
    submenu:        [
      {
        scope:          'global',
        id:             'global-catalogs-middleware',
        localizedLabel: 'custom.aside.admin.middlewareStore',
        route:          'global-admin.catalog',
        resource:       ['catalog'],
        resourceScope:  'global',
      },
      {
        scope:          'global',
        id:             'global-catalogs-generalComponents',
        localizedLabel: 'custom.aside.admin.generalComponentsStore',
        route:          'global-admin.catalog',
        resource:       ['catalog'],
        resourceScope:  'global',
      }
    ],
  },
  {
    scope:          'global',
    id:             'global-docker',
    localizedLabel: 'custom.nav.admin.dockerRepository',
    route:          'global-admin.catalog',
  },
  // Aside
  {
    scope:          'aside',
    id:             'aside-middleware',
    localizedLabel: 'custom.aside.admin.middlewareStore',
    route:          'global-admin',
    resourceScope:  'global',
  },
  {
    scope:          'aside',
    id:             'aside-components',
    localizedLabel: 'custom.aside.admin.generalComponentsStore',
    route:          'global-admin',
    resourceScope:  'global',
  },
  {
    scope:          'aside',
    id:             'aside-microservice',
    localizedLabel: 'custom.aside.admin.microservice',
    route:          'global-admin',
    resourceScope:  'global',
  },
  {
    scope:          'aside',
    id:             'aside-cicd',
    localizedLabel: 'custom.aside.admin.cicd',
    route:          'global-admin',
    resourceScope:  'global',
  },
  {
    scope:          'aside',
    id:             'aside-operate',
    localizedLabel: 'custom.aside.admin.operatePlatform.tab',
    resourceScope:  'global',
    submenu:        [
      {
        scope:          'aside',
        id:             'aside-operate-cluster',
        localizedLabel: 'custom.aside.admin.operatePlatform.cluster',
        resourceScope:  'global',
      },
      {
        scope:          'aside',
        id:             'aside-operate-project',
        localizedLabel: 'custom.aside.admin.operatePlatform.project',
        resourceScope:  'global',
      }
    ],
  },
]

export function initialize(/* appInstance*/) {
  bulkAdd(rootNav);
}

export default {
  name:       'nav-cs',
  initialize,
  after:      'store',
};
