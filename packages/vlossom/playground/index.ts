import { createApp } from 'vue';
import { createVlossom } from '../src';
import Playground from './Playground.vue';
import router from './router';

const app = createApp(Playground);

app.use(createVlossom());
app.use(router);

app.mount('#app');
