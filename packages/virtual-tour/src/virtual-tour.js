import Api from '@sanserna/api-module';

import mainConfig from './config/main.config.json';

const api = Object.keys(mainConfig.apis).reduce((apisAcc, apiName) => {
  // eslint-disable-next-line no-param-reassign
  apisAcc[apiName] = new Api(mainConfig.apis[apiName]);

  return apisAcc;
}, {});

function createVirtualTourFacadeModule(tour, params) {
  const {
    product,
    companyCode,
    projectId,
    panoramaName,
  } = params;
  const panorama = tour.getMediaByName(panoramaName);

  async function enableHotspotsByUnitStatus() {
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
        const hotSpot = tour.getPanoramaOverlayByName(panorama, item.id);

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

export default createVirtualTourFacadeModule;

// window.owlyVirtualTourFacade = window['owly-virtual-tour-facade'](this, {
//   product: 'smart_home',
//   companyCode: '70c1da67',
//   projectId: '45db46f2',
//   panoramaName: 'panorama1',
// });
