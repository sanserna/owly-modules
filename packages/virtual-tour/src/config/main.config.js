export default {
  apis: {
    owly: {
      baseURL: process.env.OWLY_API_BASE_URL,
      endpoints: {
        getProject: {
          method: 'get',
          uri: '/project/{projectId}',
        },
      },
    },
  },
};
