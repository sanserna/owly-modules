import Api, { cacheFactory } from '@sanserna/api';

import mainConfig from './config/main.config.json';

const api = Object.keys(mainConfig.apis).reduce((apisAcc, apiName) => {
  const apiConfig = mainConfig.apis[apiName];
  const { cache } = apiConfig;

  // eslint-disable-next-line no-param-reassign
  apisAcc[apiName] = new Api({
    ...apiConfig,
    adapter: cacheFactory({
      maxAge: cache.invalidAfter,
      enabledByDefault: cache.enabled,
    }),
  });

  return apisAcc;
}, {});

function createVirtualTourModule(tour, params) {
  const { product, companyCode, projectId } = params;

  async function enableHotspotsByUnitStatus({ mediaName }) {
    const media = tour.getMediaByName(mediaName);
    const { status, data } = await api.smartHome.getProject({
      config: {
        headers: {
          product,
          'company-code': companyCode,
        },
      },
      urlParams: {
        companyCode,
        projectId,
      },
    });

    if (status === 200) {
      const { items } = data;

      items.forEach((item) => {
        const hotSpot = tour.getPanoramaOverlayByName(media, item.id);

        if (hotSpot) {
          hotSpot.set('enabled', item.available);
        }
      });
    }
  }

  return {
    enableHotspotsByUnitStatus,
  };
}

export default createVirtualTourModule;

// window.owlyVirtualTourFacade = window['owly-virtual-tour-facade'](this, {
//   product: 'smart_home',
//   companyCode: '70c1da67',
//   projectId: '45db46f2',
//   panoramaName: 'panorama1',
// });
