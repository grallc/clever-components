import '../../src/addon/cc-addon-credentials.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const credentials = [
  { type: 'host', value: 'my-host.services.clever-cloud.com', secret: false },
  { type: 'user', value: 'my-super-user', secret: false },
  { type: 'password', value: 'my-super-password', secret: true },
];

const credentialsSkeleton = credentials.map((p) => ({ ...p, value: null }));

export default {
  title: '🛠 Addon/<cc-addon-credentials>',
  component: 'cc-addon-credentials',
};

const conf = {
  component: 'cc-addon-credentials',
  css: `
    cc-addon-credentials {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [{
    type: 'elasticsearch',
    name: 'Elasticsearch',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elastic.svg',
    credentials,
  }],
});

export const skeleton = makeStory(conf, {
  items: [{
    type: 'elasticsearch',
    name: 'Elasticsearch',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elastic.svg',
    credentials: credentialsSkeleton,
  }],
});

export const error = makeStory(conf, {
  items: [{
    type: 'elasticsearch',
    name: 'Elasticsearch',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elastic.svg',
    error: true,
  }],
});

export const dataLoadedWithKibana = makeStory(conf, {
  items: [{
    type: 'kibana',
    name: 'Kibana',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-kibana.svg',
    toggleState: 'close',
    credentials: [
      { type: 'host', value: 'my-host.services.clever-cloud.com', secret: false },
      { type: 'user', value: 'my-super-user', secret: false },
      { type: 'password', value: 'my-super-password', secret: true },
    ],
  }],
});

export const dataLoadedWithApm = makeStory(conf, {
  items: [{
    type: 'apm',
    name: 'APM',
    toggleState: 'close',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-apm.svg',
    credentials: [
      { type: 'user', value: 'my-super-user', secret: false },
      { type: 'password', value: 'my-super-password', secret: true },
      { type: 'auth-token', value: 'my-awesome-token', secret: true },
    ],
  }],
});

export const dataLoadedWithPulsar = makeStory(conf, {
  items: [{
    type: 'pulsar',
    name: 'Pulsar',
    toggleState: 'open',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/pulsar.svg',
    credentials: [
      { type: 'url', value: 'pulsar+ssl://url:port', secret: false },
      { type: 'auth-token', value: 'my-awesome-token', secret: true },
    ],
  }],
});

export const dataLoadedWithJenkins = makeStory(conf, {
  items: [{
    type: 'jenkins',
    name: 'Jenkins',
    toggleState: 'open',
    icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/jenkins.svg',
    credentials: [
      { type: 'url', value: 'https://url', secret: false },
    ],
  }],
});

export const simulations = makeStory(conf, {
  items: [
    {
      type: 'elasticsearch',
      name: 'Elasticsearch',
      icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elastic.svg',
      credentials: credentialsSkeleton,
    },
    {
      type: 'apm',
      name: 'APM',
      icon: 'https://static-assets.cellar.services.clever-cloud.com/logos/elasticsearch-apm.svg',
      credentials: [
        { type: 'user', secret: false },
        { type: 'password', secret: true },
        { type: 'auth-token', secret: true },
      ],
    },
  ],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.credentials = credentials;
      componentError.error = true;
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  error,
  dataLoadedWithKibana,
  dataLoadedWithApm,
  dataLoadedWithPulsar,
  dataLoadedWithJenkins,
  simulations,
});
