import { get, set, setProperties } from '@ember/object';
import { computed, observer } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { inject as service } from '@ember/service'
import layout from './template';
import C from 'shared/utils/constants';
import { get as getTree } from 'shared/utils/navigation-tree-cs';
import { run } from '@ember/runloop';
import $ from 'jquery';

function fnOrValue(val, ctx) {
  if (typeof val === 'function') {
    return val.call(ctx);
  } else {
    return val;
  }
}

export default Component.extend({
  // Injections
  intl:             service(),
  scope:            service(),
  features:         service(),
  settings:         service(),
  access:           service(),
  prefs:            service(),
  router:           service(),

  layout,
  // Inputs
  pageScope:        null,

  // Component options
  tagName:          'aside',
  classNames:       ['page-aside'],

  stacks:           null,

  // This computed property generates the active list of choices to display
  navTree:       null,
  clusterId:        alias('scope.currentCluster.id'),
  cluster:          alias('scope.currentCluster'),
  projectId:        alias('scope.currentProject.id'),
  project:          alias('scope.currentProject'),
  accessEnabled:    alias('access.enabled'),

  init() {
    this._super(...arguments);
    get(this, 'intl.locale');

    setProperties(this, {
      stacks:      get(this, 'store').all('stack'),
      hosts:       get(this, 'store').all('host'),
      stackSchema: get(this, 'store').getById('schema', 'stack'),
    });

    let emberId = this.elementId;

    run.once(this, 'updateAside');

    run.scheduleOnce('render', () => {
      $(`#${ emberId }`).on('click', '.page-aside-submenu__title', function() {
        $(this).find('.icon').toggleClass('icon-chevron-up');
        $(this).next().toggle();
      });

      $(`#${ emberId }`).on('click', '.page-aside-menu-item', function() {
        let flag = $(this).is('.is-active');

        $(`#${ emberId } .is-active`).removeClass('is-active');

        if ( !flag ){
          $(this).addClass('is-active');
        }
      });
    });
  },
  actions: {
    clickDashboard() {
      // Regular click on the link will have Ember try to resolve /dashboard/c/<id>
      // to an Ember route and show the error page.  That's bad.
      window.location.href = get(this, 'dashboardLink');
    },
  },
  shouldUpdateAside: observer(
    'pageScope',
    'clusterId',
    'cluster.isReady',
    'projectId',
    'stacks.@each.group',
    `prefs.${ C.PREFS.ACCESS_WARNING }`,
    'access.enabled',
    'intl.locale',
    function() {
      run.scheduleOnce('afterRender', this, 'updateAside');
    }
  ),
  // beyond things listed in "Inputs"
  hasProject: computed('project', function() {
    return !!get(this, 'project');
  }),
  // Hackery: You're an owner if you can write to the 'system' field of a stack
  isOwner: computed('stackSchema.resourceFields.system.update', function() {
    return !!get(this, 'stackSchema.resourceFields.system.update');
  }),
  dashboardLink: computed('pageScope', 'clusterId', function() {
    if ( !get(this, 'features').isFeatureEnabled(C.FEATURES.DASHBOARD) ) {
      // Only if Steve/dashboard are deployed
      return;
    }

    if ( get(this, 'pageScope') === 'global' || !this.clusterId ) {
      // Only inside a cluster
      return;
    }

    const cluster = get(this, 'cluster');

    if ( !cluster || !cluster.isReady ) {
      // Only in ready/active clusters
      return;
    }

    let link;

    if ( get(this, 'app.environment') === 'development' ) {
      link = `https://localhost:8005/c/${ escape(this.clusterId) }`;
    } else {
      link = `/dashboard/c/${ escape(this.clusterId) }`;
    }

    return link;
  }),
  updateAside() {
    const currentScope = get(this, 'pageScope');

    const out = getTree().filter((item) => {
      if ( typeof get(item, 'condition') === 'function' ) {
        if ( !item.condition.call(this) ) {
          return false;
        }
      }

      if ( get(item, 'scope') && get(item, 'scope') !== currentScope ) {
        return false;
      }

      const itemRoute = fnOrValue(get(item, 'route'), this);
      const itemContext = (get(item, 'ctx') || []).map( (prop) =>  fnOrValue(prop, this));

      setProperties(item, {
        localizedLabel: fnOrValue(get(item, 'localizedLabel'), this),
        label:          fnOrValue(get(item, 'label'), this),
        route:          itemRoute,
        ctx:            itemContext,
        submenu:        fnOrValue(get(item, 'submenu'), this),
      });

      set(item, 'submenu', ( get(item, 'submenu') || [] ).filter((subitem) => {
        if ( typeof get(subitem, 'condition') === 'function' && !subitem.condition.call(this) ) {
          return false;
        }

        const subItemRoute = fnOrValue(get(subitem, 'route'), this);
        const subItemContext = ( get(subitem, 'ctx') || [] ).map( (prop) => fnOrValue(prop, this));

        setProperties(subitem, {
          localizedLabel: fnOrValue(get(subitem, 'localizedLabel'), this),
          label:          fnOrValue(get(subitem, 'label'), this),
          route:          subItemRoute,
          ctx:            subItemContext,
        });

        return true;
      }));

      return true;
    });

    const old = JSON.stringify(get(this, 'navTree'));
    const neu = JSON.stringify(out);

    if ( old !== neu ) {
      set(this, 'navTree', out);
    }
  }

});
