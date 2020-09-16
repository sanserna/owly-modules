import Api, { cacheFactory } from '@sanserna/api';

import mainConfig from './config/main.config';

const api = Object.keys(mainConfig.apis).reduce((apisAcc, apiName) => {
  const apiConfig = mainConfig.apis[apiName];
  const { cache = {} } = apiConfig;

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

function normalizeData(data, idAttribute = 'id') {
  return data.reduce((acum, current) => ({
    ...acum,
    [current[idAttribute]]: { ...current },
  }), {});
}

function createVirtualTourModule(tour, params) {
  const { product, companyCode, projectId } = params;

  async function enableHotspotsByUnitStatus({ mediaName }) {
    const media = tour.getMediaByName(mediaName);
    const { status, data } = await api.owly.getProject({
      config: {
        headers: {
          product,
          'company-code': companyCode,
        },
      },
      urlParams: {
        projectId,
      },
    });

    if (status === 200) {
      const normalizedItems = normalizeData(data.items);
      const mediaOverlays = media.get('overlays') || [];

      mediaOverlays.forEach((hotSpot) => {
        const hotSpotData = hotSpot.get('data') || {};
        const itemId = hotSpotData.label;
        const item = normalizedItems[itemId] || {};

        hotSpot.set('rollOverDisplay', Boolean(item.available));
      });
    }
  }

  return {
    enableHotspotsByUnitStatus,
  };
}

export default createVirtualTourModule;
