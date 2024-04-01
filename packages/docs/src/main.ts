import { createApp } from 'vue';
import { createVlossom } from 'vlossom';
import 'vlossom/styles';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createVlossom());
app.use(router);

app.mount('#app');
